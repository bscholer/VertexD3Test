/*
NOTE TO THE GRADER:
Due to some part of the instructions for this assignment being unclear, I wrote this site on the following assumptions:
1) When creating a new node/line, the initial attributes for it (color, stroke, name, etc.) are based off of the 'parent' node/line type.
2) Due to healthy 'mistrust' of users to create unique names, I use a node/line ID as the unique value instead of the name.
3) There is no other mention to bi-directionality for lines in the instructions, so it's a simple boolean value that doesn't really do anything. It can be changed per line though.
4) After changing the settings for node/line types, existing nodes/lines are NOT updated. Doing it this way would make it easy to accidentally 'delete' any customizations made to existing nodes/lines.
 */

$(document).ready(function () {
    $("#line-edit-weight-input").mask('00');
    $("#line-weight-input").mask('00');
    $("#node-edit-size-input").mask('000');
})

let floorPlanBackground = document.querySelector('#floor-plan-background');
let features = {
    floorPlanBounds: {},
    nodes: [],
    lines: [],
    floorPlanSrc: "floor%20plan.jpg",
    lineTypes: [
        {
            lineTypeID: "0",
            name: "line0",
            color: "pink",
            weight: 5,
            stroke: "solid"
        },
        {
            lineTypeID: "1",
            name: "line1",
            color: "blue",
            weight: 5,
            stroke: "solid"
        },
        {
            lineTypeID: "2",
            name: "line2",
            color: "skyblue",
            weight: 5,
            stroke: "dashed"
        },
        {
            lineTypeID: "3",
            name: "line3",
            color: "green",
            weight: 5,
            stroke: "dashed"
        },
        {
            lineTypeID: "4",
            name: "line4",
            color: "teal",
            weight: 5,
            stroke: "dashed"
        },
        {
            lineTypeID: "5",
            name: "line5",
            color: "orange",
            weight: 5,
            stroke: "dashed"
        },
        {
            lineTypeID: "6",
            name: "line6",
            color: "lightsalmon",
            weight: 5,
            stroke: "dashed"
        },
        {
            lineTypeID: "7",
            name: "line7",
            color: "coral",
            weight: 5,
            stroke: "dotted"
        },
        {
            lineTypeID: "8",
            name: "line8",
            color: "blueviolet",
            weight: 5,
            stroke: "dotted"
        },
        {
            lineTypeID: "9",
            name: "line9",
            color: "crimson",
            weight: 5,
            stroke: "dotted"
        },
    ],
    nodeTypes: [
        {
            nodeTypeID: "0",
            name: "node0",
            shape: "circle",
            color: "red"
        },
        {
            nodeTypeID: "1",
            name: "node1",
            shape: "rect",
            color: "pink"
        },
        {
            nodeTypeID: "2",
            name: "node2",
            shape: "circle",
            color: "green"
        },
        {
            nodeTypeID: "3",
            name: "node3",
            shape: "circle",
            color: "orange"
        },
        {
            nodeTypeID: "4",
            name: "node4",
            shape: "circle",
            color: "teal"
        },
        {
            nodeTypeID: "5",
            name: "node5",
            shape: "circle",
            color: "lightsalmon"
        },
        {
            nodeTypeID: "6",
            name: "node6",
            shape: "circle",
            color: "purple"
        },
        {
            nodeTypeID: "7",
            name: "node7",
            shape: "circle",
            color: "blueviolet"
        },
        {
            nodeTypeID: "8",
            name: "node8",
            shape: "circle",
            color: "darkgreen"
        },
        {
            nodeTypeID: "9",
            name: "node9",
            shape: "circle",
            color: "skyblue"
        },
    ]
};

// TODO this needs to be update when loading in data
let nodeCounter = 0;
let lineCounter = 0;

// Used only if a click is starting a line
let lineStartNodeID;

function openImage() {
    let file = document.querySelector('#floor-plan-upload-input').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        floorPlanBackground.src = reader.result;
        features.floorPlanSrc = reader.result;
    });

    if (file) {
        reader.readAsDataURL(file);
    }
    features.floorPlanBounds.w = floorPlanBackground.width;
    features.floorPlanBounds.h = floorPlanBackground.height;
}

let defaultLineTypeSelect = document.getElementById("default-line-type-select");
let defaultNodeTypeSelect = document.getElementById("default-node-type-select");

// Populate the default line type select
for (let lineType of features.lineTypes) {
    let newLineTypeOption = document.createElement("option");
    newLineTypeOption.value = lineType.lineTypeID;
    newLineTypeOption.innerText = lineType.name;
    defaultLineTypeSelect.appendChild(newLineTypeOption);
}

// Populate the default node type select
for (let nodeType of features.nodeTypes) {
    let newNodeTypeOption = document.createElement("option");
    newNodeTypeOption.value = nodeType.nodeTypeID;
    newNodeTypeOption.innerText = nodeType.name;
    defaultNodeTypeSelect.appendChild(newNodeTypeOption);
}

if (localStorage.getItem("defaultLineType")) {
    defaultLineTypeSelect.value = localStorage.getItem("defaultLineType") + "";
} else {
    localStorage.setItem("defaultLineType", "0");
}

console.log(localStorage.getItem("defaultNodeType"));
if (localStorage.getItem("defaultNodeType")) {
    defaultNodeTypeSelect.value = localStorage.getItem("defaultNodeType");
    console.log(defaultNodeTypeSelect.value);
} else {
    localStorage.setItem("defaultNodeType", "0");
}

var svg = d3.select("#floor-plan-container").append("svg")
    .attr("width", floorPlanBackground.width)
    .attr("height", floorPlanBackground.height);

// Handling clicks
svg.on("click", function () {
    let coords = d3.mouse(this);
    let nodeTooltip = document.getElementById("node-tooltip");
    let lineTooltip = document.getElementById("line-tooltip");

    // If the tooltip is open, close it, and absorb the click
    if (nodeTooltip.style.display === "block") {
        nodeTooltip.style.display = "none";
        nodeTooltip.nodeID = null;
        return;
    }

    // If the tooltip is open, close it, and absorb the click
    if (lineTooltip.style.display === "block") {
        lineTooltip.style.display = "none";
        lineTooltip.lineID = null;
        return;
    }

    if (findNodeCollision(coords[0], coords[1])) {
        nodeTooltip.style.top = coords[1] + "px";
        nodeTooltip.style.left = coords[0] + "px";
        nodeTooltip.style.display = "block";
        nodeTooltip.nodeID = findNodeCollision(coords[0], coords[1], 100);
        let nodeTooltipTitle = document.getElementById("node-tooltip-title");
        nodeTooltipTitle.innerText = findNode(nodeTooltip.nodeID).name;
    }

    else if (findLineCollision(coords[0], coords[1])) {
        lineTooltip.style.top = coords[1] + "px";
        lineTooltip.style.left = coords[0] + "px";
        lineTooltip.style.display = "block";
        lineTooltip.lineID = findLineCollision(coords[0], coords[1], 100);
        let lineTooltipTitle = document.getElementById("line-tooltip-title");
        lineTooltipTitle.innerText = findLine(lineTooltip.lineID).name;
    }

    // if (features.nodes.length > 1 && (findNodeCollision(coords[0], coords[1]) || lineStartNodeID)) {
    //     // Checking if click is within an existing node
    //     console.log(lineStartNodeID);
    //     if (!lineStartNodeID && findNodeCollision(coords[0], coords[1])) {
    //         lineStartNodeID = findNodeCollision(coords[0], coords[1]);
    //         console.log("after" + lineStartNodeID);
    //     }
    //     // We already know that a line is started, so now to find the endpoint.
    //     else if (lineStartNodeID) {
    //         let startNode = findNode(lineStartNodeID);
    //         let closestNodeID = findClosestNode(coords[0], coords[1]);
    //         let endNode = findNode(closestNodeID);
    //         let lineTypeID = "0";
    //         let lineType = getLineType(lineTypeID);
    //         let newLine = {
    //             lineTypeID: lineTypeID,
    //             startNodeID: startNode.nodeID,
    //             endNodeID: endNode.nodeID,
    //             lineID: ++lineCounter,
    //             name: lineType.name,
    //             bi_directionality: false,
    //             color: lineType.color,
    //             stroke: lineType.stroke,
    //             weight: lineType.weight
    //         };
    //         lineStartNodeID = null;
    //         features.lines.push(newLine);
    //         drawLine(newLine);
    //     }
    // }

    //Make a new node
    else {
        let nodeTypeID = defaultNodeTypeSelect.value;
        let nodeType = getNodeType(nodeTypeID);
        let newNode = {
            nodeTypeID: nodeTypeID,
            nodeID: ++nodeCounter,
            name: nodeType.name,
            size: 10,
            x: coords[0],
            y: coords[1],
            color: nodeType.color,
            shape: nodeType.shape
        };
        features.nodes.push(newNode);
        drawNode(newNode);
    }
});

function deleteNode() {
    let nodeTooltip = document.getElementById("node-tooltip");
    let nodeID = nodeTooltip.nodeID;
    for (let i = 0; i < features.nodes.length; i++) {
        let node = features.nodes[i];
        if (node.nodeID === nodeID) {
            features.nodes.splice(i, 1);
        }
    }
    console.log(features.nodes);
    clearDrawing();
    drawFeatures(features);
    nodeTooltip.style.display = "none";
    nodeTooltip.nodeID = null;
}

function deleteLine() {
    let lineTooltip = document.getElementById("line-tooltip");
    let lineID = lineTooltip.lineID;
    for (let i = 0; i < features.lines.length; i++) {
        let line = features.lines[i];
        if (line.lineID === lineID) {
            features.lines.splice(i, 1);
        }
    }
    console.log(features.lines);
    clearDrawing();
    drawFeatures(features);
    lineTooltip.style.display = "none";
    lineTooltip.nodeID = null;
}

function drawLine(line) {
    for (let lineType of features.lineTypes) {
        if (line.lineTypeID === lineType.lineTypeID) {
            let startNode = findNode(line.startNodeID);
            let endNode = findNode(line.endNodeID);
            let newLine = svg.append("line")
                .attr("x1", startNode.x)
                .attr("y1", startNode.y)
                .attr("x2", endNode.x)
                .attr("y2", endNode.y)
                .attr("stroke-width", line.weight)
                .attr("stroke", line.color);
            if (line.stroke === "dashed") {
                newLine.style("stroke-dasharray", (line.weight * 3 + ", " + line.weight))
            } else if (line.stroke === "dotted") {
                newLine.style("stroke-dasharray", (line.weight + ", " + line.weight))
            }
        }
    }
}

function drawNode(node) {
    let nodeElement;
    if (node.shape === "rect") {
        nodeElement = svg.append("rect")
            .attr("x", (node.x - node.size))
            .attr("y", (node.y - node.size))
            .attr("width", node.size * 2)
            .attr("height", node.size * 2)
            .style("fill", node.color)
            .call(d3.drag()
                .clickDistance(10)
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded)
            );
    } else if (node.shape === "circle") {
        nodeElement = svg.append("circle")
            .attr("cx", node.x)
            .attr("cy", node.y)
            .attr("r", node.size)
            .style("fill", node.color)
            .call(d3.drag()
                .clickDistance(10)
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded)
            );
    }
}

function dragStarted(d) {
    let startCoords = d3.mouse(this);
    lineStartNodeID = findClosestNode(startCoords[0], startCoords[1], 100)
}

function dragged(d) {
}

function dragEnded(d) {
    if (lineStartNodeID) {
        let endCoords = d3.mouse(this);
        let lineEndNodeID = findClosestNode(endCoords[0], endCoords[1], 100);
        // Make sure we aren't making tons of tiny lines accidentally
        if (lineStartNodeID === lineEndNodeID) return;
        let startNode = findNode(lineStartNodeID);
        let endNode = findNode(lineEndNodeID);
        let lineTypeID = defaultLineTypeSelect.value;
        let lineType = getLineType(lineTypeID);
        let newLine = {
            lineTypeID: lineTypeID,
            startNodeID: startNode.nodeID,
            endNodeID: endNode.nodeID,
            lineID: ++lineCounter,
            name: lineType.name,
            bi_directionality: false,
            color: lineType.color,
            stroke: lineType.stroke,
            weight: lineType.weight
        };
        lineStartNodeID = null;
        console.log("ADDING NEW LINE");
        console.log(newLine);
        features.lines.push(newLine);
        reset();
    }
}

function showNodeTooltip(d, i) {
    console.log(d3.select(this));
    let node = d3.select(this)
        .attr("fill", "red");
    return;
    let nodeTooltip = document.getElementById("node-tooltip");
    console.log(node.x);
    console.log(node.y);
    nodeTooltip.style.top = node.y + "px";
    nodeTooltip.style.left = node.x + "px";
    nodeTooltip.style.display = "block";
}

//This function returns a nodeID if a click is within an existing node
function findNodeCollision(x, y) {
    for (let node of features.nodes) {
        let dist = Math.hypot(x - node.x, y - node.y);
        if (dist < node.size) {
            return node.nodeID;
        }
    }
    return null;
}

//This function returns the nodeID closest to x, y
//It should only be called if 1+ nodes exist
function findClosestNode(x, y, maxDist) {
    let closestNodeID;
    let closestDist = Number.MAX_VALUE;
    for (let node of features.nodes) {
        let dist = Math.hypot(x - node.x, y - node.y);
        if (dist < closestDist) {
            closestDist = dist;
            closestNodeID = node.nodeID;
        }
    }
    if (closestDist < maxDist) {
        return closestNodeID;
    } else return null;
}

//Finds a node in features.nodes from a nodeID
function findNode(nodeID) {
    for (let node of features.nodes) {
        if (node.nodeID === nodeID) return node;
    }
}

// Finds if x, y collide with a line provided a small buffer, and if so, returns its lineID
function findLineCollision(x, y) {
    const BUFFER = .5;
    for (let line of features.lines) {
        let startNode = findNode(line.startNodeID);
        let endNode = findNode(line.endNodeID);
        let d1 = Math.hypot(startNode.x - x, startNode.y - y);
        let d2 = Math.hypot(endNode.x - x, endNode.y - y);
        let totalDist = d1 + d2;
        let lineDist = Math.sqrt((Math.pow(startNode.x - endNode.x, 2) + Math.pow(startNode.y - endNode.y, 2)));

        if (totalDist >= lineDist - BUFFER && totalDist <= lineDist + BUFFER) {
            return line.lineID
        }
    }
}

function findLine(lineID) {
    for (let line of features.lines) {
        if (lineID === line.lineID) return line;
    }
}

function downloadData() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(features));
    let downloadAnchor = document.getElementById("downloadAnchor");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "features.json");
    downloadAnchor.click();
}

function drawFeatures(features) {
    svg.width = features.floorPlanBounds.w;
    svg.height = features.floorPlanBounds.h;
    floorPlanBackground.src = "";
    floorPlanBackground.src = features.floorPlanSrc;
    for (let line of features.lines) {
        drawLine(line);
    }
    for (let node of features.nodes) {
        drawNode(node);
    }
}

function clearDrawing() {
    let canvas = document.querySelector("svg");
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}

function getNodeType(nodeTypeID) {
    for (let nodeType of features.nodeTypes) {
        if (nodeTypeID === nodeType.nodeTypeID) return nodeType;
    }
}

function getLineType(lineTypeID) {
    for (let lineType of features.lineTypes) {
        if (lineTypeID === lineType.lineTypeID) return lineType;
    }
}
