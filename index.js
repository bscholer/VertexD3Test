let floorPlanBackground = document.querySelector('#floor-plan-background');
let features = {
    "floorPlanBounds": {},
    "nodes": [],
    "lines": [],
    "floorPlanSrc": "floor%20plan.jpg"
};

// TODO this needs to be update when loading in data
let nodeCounter = 0;

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

var svg = d3.select("#floor-plan-container").append("svg")
    .attr("width", floorPlanBackground.width)
    .attr("height", floorPlanBackground.height);

// Creating nodes
svg.on("click", function () {
    let coords = d3.mouse(this);

    if (features.nodes.length > 1 && (findNodeCollision(coords[0], coords[1]) || lineStartNodeID)) {
        // Checking if click is within an existing node
        console.log(lineStartNodeID);
        if (!lineStartNodeID && findNodeCollision(coords[0], coords[1])) {
            lineStartNodeID = findNodeCollision(coords[0], coords[1]);
            console.log("after" + lineStartNodeID);
        }
        // We already know that a line is started, so now to find the endpoint.
        else if (lineStartNodeID) {
            let startNode = findNode(lineStartNodeID);
            let closestNodeID = findClosestNode(coords[0], coords[1]);
            let endNode = findNode(closestNodeID);
            let newLine = {
                lineTypeID: "0",
                startNodeID: startNode.nodeID,
                endNodeID: endNode.nodeID
            };
            lineStartNodeID = null;
            features.lines.push(newLine);
            drawLine(newLine);
        }
    }

    //Make a new node
    else {
        let newNode = {
            nodeID: ++nodeCounter,
            name: "",
            nodeTypeID: "0",
            size: 10,
            x: coords[0],
            y: coords[1]
        };
        features.nodes.push(newNode);
        drawNode(newNode);
    }
});

function drawLine(line) {
    for (let lineType of lineTypes) {
        if (line.lineTypeID === lineType.lineTypeID) {
            let startNode = findNode(line.startNodeID);
            let endNode = findNode(line.endNodeID);
            let newLine = svg.append("line")
                .attr("x1", startNode.x)
                .attr("y1", startNode.y)
                .attr("x2", endNode.x)
                .attr("y2", endNode.y)
                .attr("stroke-width", lineType.weight)
                .attr("stroke", lineType.color);
            if (lineType.stroke === "dashed") {
                newLine.style("stroke-dasharray", ("10, 3"))
            }
            else if (lineType.stroke === "dotted") {
                newLine.style("stroke-dasharray", ("3, 3"))
            }
        }
    }
}

function drawNode(node) {
    for (let nodeType of nodeTypes) {
        if (node.nodeTypeID === nodeType.nodeTypeID) {
            if (nodeType.shape === "rect") {
                let rect = svg.append("rect")
                    .attr("x", (node.x - node.size))
                    .attr("y", (node.y - node.size))
                    .attr("width", node.size * 2)
                    .attr("height", node.size * 2)
                    .style("fill", nodeType.color);
            } else if (nodeType.shape === "circle") {
                let circle = svg.append("circle")
                    .attr("cx", node.x)
                    .attr("cy", node.y)
                    .attr("r", node.size)
                    .style("fill", nodeType.color)
            }
        }
    }
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
function findClosestNode(x, y) {
    let closestNodeID;
    let closestDist = Number.MAX_VALUE;
    for (let node of features.nodes) {
        let dist = Math.hypot(x - node.x, y - node.y);
        if (dist < closestDist) {
            closestDist = dist;
            closestNodeID = node.nodeID;
        }
    }
    return closestNodeID;
}

//Finds a node in features.nodes from a nodeID
function findNode(nodeID) {
    for (let node of features.nodes) {
        if (node.nodeID === nodeID) return node;
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
    for (let node of features.nodes) {
        drawNode(node);
    }
    for (let line of features.lines) {
        drawLine(line);
    }
}

function clearDrawing() {
    let canvas = document.querySelector("svg");
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}
