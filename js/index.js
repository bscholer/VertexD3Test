/*
NOTE TO THE GRADER:
Due to some part of the instructions for this assignment being unclear, I wrote this site on the following assumptions:
1) When creating a new node/line, the initial attributes for it (color, stroke, name, etc.) are based off of the 'parent' node/line type.
2) Due to healthy 'mistrust' of users to create unique names, I use a node/line ID as the unique value instead of the name.
3) There is no other mention to bi-directionality for lines in the instructions, so it's a simple boolean value that doesn't really do anything. It can be changed per line though.
4) After changing the settings for node/line types, existing nodes/lines are NOT updated. Doing it this way would make it easy to accidentally 'delete' any customizations made to existing nodes/lines.
5) When downloading a drawing, the background image comes with it. It doesn't really make sense to store the bounds, but not the image itself.
6) The default node and line types, as well as all node and line types are automatically saved to the browser's localStorage. This is for ease of use.
 */

// Masking a few inputs throughout the site, preventing users from entering huge numbers.
$(document).ready(function () {
    $("#line-edit-weight-input").mask('00');
    $("#line-weight-input").mask('00');
    $("#node-edit-size-input").mask('00');
});

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

// Listen for attribute changes to the floor plan background.
// For whatever reason, width and height weren't being updated when the src was set.
let floorPlanBackgroundObserver = new MutationObserver(function (mutations) {
    floorPlanBackground = document.querySelector('#floor-plan-background');
    features.floorPlanBounds.w = floorPlanBackground.width;
    features.floorPlanBounds.h = floorPlanBackground.height;
    svg.width = floorPlanBackground.width;
    svg.height = floorPlanBackground.height;
    reset(svg);
});

floorPlanBackgroundObserver.observe(floorPlanBackground, {
    attributes: true // Listen for attribute changes
});

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
}

function openDrawing() {
    let file = document.querySelector('#drawing-upload-input').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        let upload = JSON.parse(reader.result);
        features.floorPlanSrc = upload.floorPlanSrc;
        features.floorPlanBounds = upload.floorPlanBounds;
        floorPlanBackground.src = features.floorPlanSrc;
        features.nodes = upload.nodes;
        // Set all nodes to visible
        for (let node of features.nodes) node.invisible = false;
        features.lines = upload.lines;
        // Set all lines to visible
        for (let line of features.lines) line.invisible = false;
        reset(svg);
    });

    if (file) {
        reader.readAsText(file);
    }
}

function openTypes() {
    let file = document.querySelector('#types-upload-input').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        let upload = JSON.parse(reader.result);
        console.log(upload);
        features.nodeTypes = upload.nodeTypes;
        features.lineTypes = upload.lineTypes;
        localStorage.setItem("lineTypes", JSON.stringify(upload.lineTypes));
        localStorage.setItem("nodeTypes", JSON.stringify(upload.nodeTypes));

        // Update the node type select in the settings menu.
        while (nodeTypeSelect.firstChild) {
            nodeTypeSelect.removeChild(nodeTypeSelect.firstChild);
        }
        for (let nodeType of features.nodeTypes) {
            let newNodeTypeOption = document.createElement("option");
            newNodeTypeOption.value = nodeType.nodeTypeID;
            newNodeTypeOption.innerText = nodeType.name;
            nodeTypeSelect.appendChild(newNodeTypeOption);
        }

        // Update the node type select in the settings menu.
        while (lineTypeSelect.firstChild) {
            lineTypeSelect.removeChild(lineTypeSelect.firstChild);
        }
        for (let lineType of features.lineTypes) {
            let newLineTypeOption = document.createElement("option");
            newLineTypeOption.value = lineType.lineTypeID;
            newLineTypeOption.innerText = lineType.name;
            lineTypeSelect.appendChild(newLineTypeOption);
        }
        reset(svg);
    });

    if (file) {
        reader.readAsText(file);
    }
}

function nodeVisibilityChange() {
    let nodeTypeID = document.getElementById("node-type-select").value;
    for (let node of features.nodes) {
        if (node.nodeTypeID === nodeTypeID) {
            node.invisible = !document.getElementById("node-visibility").checked;
        }
    }
    reset(svg);
}

function lineVisibilityChange() {
    let lineTypeID = document.getElementById("line-type-select").value;
    for (let line of features.lines) {
        if (line.lineTypeID === lineTypeID) {
            line.invisible = !document.getElementById("line-visibility").checked;
        }
    }
    reset(svg);
}

// Called on change of the show floor plan checkbox.
function showFloorPlan() {
    let checkbox = document.getElementById("show-floor-plan-input");
    floorPlanBackground.style.display = (checkbox.checked) ? "block" : "none";
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

if (localStorage.getItem("defaultNodeType")) {
    defaultNodeTypeSelect.value = localStorage.getItem("defaultNodeType");
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
    } else if (findLineCollision(coords[0], coords[1])) {
        lineTooltip.style.top = coords[1] + "px";
        lineTooltip.style.left = coords[0] + "px";
        lineTooltip.style.display = "block";
        lineTooltip.lineID = findLineCollision(coords[0], coords[1], 100);
        let lineTooltipTitle = document.getElementById("line-tooltip-title");
        lineTooltipTitle.innerText = findLine(lineTooltip.lineID).name;
    }

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
        drawNode(newNode, svg);
    }
});


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
        if (!lineEndNodeID) return;
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
        features.lines.push(newLine);
        reset(svg);
    }
}

function downloadDrawing() {
    let drawing = {};
    drawing.floorPlanSrc = features.floorPlanSrc;
    drawing.floorPlanBounds = features.floorPlanBounds;
    drawing.nodes = features.nodes;
    drawing.lines = features.lines;
    for (let line of drawing.lines) {
        let startNode = findNode(line.startNodeID);
        let endNode = findNode(line.endNodeID);
        line.from_node_id = {
            x: startNode.x,
            y: startNode.y
        };
        line.to_node_id = {
            x: endNode.x,
            y: endNode.y
        };
    }
    let drawingData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(drawing));
    let downloadAnchor = document.getElementById("downloadDrawingAnchor");
    downloadAnchor.setAttribute("href", drawingData);
    downloadAnchor.setAttribute("download", "drawing.json");
    downloadAnchor.click();
}

function downloadTypes() {
    let types = {};
    types.lineTypes = features.lineTypes;
    types.nodeTypes = features.nodeTypes;
    let typesData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(types));
    let downloadAnchor = document.getElementById("downloadTypesAnchor");
    downloadAnchor.setAttribute("href", typesData);
    downloadAnchor.setAttribute("download", "types.json");
    downloadAnchor.click();

}
