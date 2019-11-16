// These are commonly called functions that were cluttering up index.js.

function drawLine(line, svg) {
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

function drawNode(node, svg) {
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

function drawFeatures(features, svg) {
    svg.width = features.floorPlanBounds.w;
    svg.height = features.floorPlanBounds.h;
    floorPlanBackground.src = "";
    floorPlanBackground.src = features.floorPlanSrc;
    for (let line of features.lines) {
        drawLine(line, svg);
    }
    for (let node of features.nodes) {
        drawNode(node, svg);
    }
}

function reset(svg) {
    clearDrawing();
    drawFeatures(features, svg);
}

function clearDrawing() {
    let canvas = document.querySelector("svg");
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
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
    drawFeatures(features, svg);
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
    drawFeatures(features, svg);
    lineTooltip.style.display = "none";
    lineTooltip.nodeID = null;
}
