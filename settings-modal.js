var nodeTypes, lineTypes;
if (localStorage.getItem("nodeTypes")) {
    nodeTypes = JSON.parse(localStorage.getItem("nodeTypes"));
}
else {
    nodeTypes = [
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
    ];
    localStorage.setItem("nodeTypes", JSON.stringify(nodeTypes));
}

if (localStorage.getItem("lineTypes")) {
    lineTypes = JSON.parse(localStorage.getItem("lineTypes"));
}
else {
    lineTypes = [
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
    ];
    localStorage.setItem("lineTypes", JSON.stringify(lineTypes));
}

// Get the modal
var modal = document.getElementById("settings-dialog");

// Get the button that opens the modal
var btn = document.getElementById("open-settings-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the node and line tab buttons
var nodeTabBtn = document.getElementById("settings-node-tab");
var lineTabBtn = document.getElementById("settings-line-tab");

// Get the node and line menus
var nodeMenu = document.getElementById("node-settings-area");
var lineMenu = document.getElementById("line-settings-area");

// Get the components of the node menu
var nodeTypeSelect = document.getElementById("node-type-select");
var nodeNameInput = document.getElementById("node-name-input");
var nodeShapeSelect = document.getElementById("node-shape-select");
var nodeColorSelect = document.getElementById("node-color-select");

// Get the components of the line menu
var lineTypeSelect = document.getElementById("line-type-select");
var lineNameInput = document.getElementById("line-name-input");
var lineStrokeSelect = document.getElementById("line-stroke-select");
var lineColorSelect = document.getElementById("line-color-select");
var lineWeightInput = document.getElementById("line-weight-input");

function openNodeMenu (nodeTypeID) {
    nodeMenu.style.display = "block";
    lineMenu.style.display = "none";
    while (nodeTypeSelect.firstChild) {
        nodeTypeSelect.removeChild(nodeTypeSelect.firstChild);
    }
    for (let nodeType of nodeTypes) {
        let newNodeTypeOption = document.createElement("option");
        newNodeTypeOption.value = nodeType.nodeTypeID;
        newNodeTypeOption.innerText = nodeType.name;
        nodeTypeSelect.appendChild(newNodeTypeOption);
    }
    if (!nodeTypeID) nodeTypeID = 0;
    nodeTypeSelect.value = nodeTypeID;
    populateNodeMenu(nodeTypeID);
}

function openLineMenu (lineTypeID) {
    nodeMenu.style.display = "none";
    lineMenu.style.display = "block";
    while (lineTypeSelect.firstChild) {
        lineTypeSelect.removeChild(lineTypeSelect.firstChild);
    }
    for (let lineType of lineTypes) {
        let newLineTypeOption = document.createElement("option");
        newLineTypeOption.value = lineType.lineTypeID;
        newLineTypeOption.innerText = lineType.name;
        lineTypeSelect.appendChild(newLineTypeOption);
    }
    if (!lineTypeID) lineTypeID = 0;
    lineTypeSelect.value = lineTypeID;
    populateLineMenu(lineTypeID);
}

function populateNodeMenu (nodeTypeID) {
    populateColorSelect(nodeColorSelect);
    for (let nodeType of nodeTypes) {
        if (nodeType.nodeTypeID === nodeTypeID + "") {
            nodeNameInput.value = nodeType.name;
            nodeShapeSelect.value = nodeType.shape;
            nodeColorSelect.value = nodeType.color;
        }
    }
}

function populateLineMenu (lineTypeID) {
    populateColorSelect(lineColorSelect);
    for (let lineType of lineTypes) {
        if (lineType.lineTypeID === lineTypeID + "") {
            lineNameInput.value = lineType.name;
            console.log(lineType.stroke);
            lineStrokeSelect.value = lineType.stroke;
            lineColorSelect.value = lineType.color;
            lineWeightInput.value = lineType.weight;
        }
    }
}

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// Default to the node menu
nodeTabBtn.click();

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function populateColorSelect (selectElement) {
    for (let cssColor of colorNames) {
        let newColorOption = document.createElement("option");
        newColorOption.value = cssColor.name;
        newColorOption.innerText = cssColor.name;
        selectElement.appendChild(newColorOption);
    }
}

// TODO re-render nodes
function autoSaveNodeTypes() {
    for (let nodeType of nodeTypes) {
        if (nodeTypeSelect.value === nodeType.nodeTypeID) {
            nodeType.name = nodeNameInput.value;
            nodeType.shape = nodeShapeSelect.value;
            nodeType.color = nodeColorSelect.value;
        }
    }
    localStorage.setItem("nodeTypes", JSON.stringify(nodeTypes));
    openNodeMenu(nodeTypeSelect.value);
    reset();
}

// TODO re-render lines
function autoSaveLineTypes() {
    for (let lineType of lineTypes) {
        if (lineTypeSelect.value === lineType.lineTypeID) {
            lineType.name = lineNameInput.value;
            lineType.stroke = lineStrokeSelect.value;
            lineType.color = lineColorSelect.value;
            lineType.weight = lineWeightInput.value;
        }
    }
    localStorage.setItem("lineTypes", JSON.stringify(lineTypes));
    openLineMenu(lineTypeSelect.value);
    reset();
}

function reset() {
    clearDrawing();
    drawFeatures(features);
}
