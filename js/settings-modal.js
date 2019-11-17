if (localStorage.getItem("nodeTypes")) {
    features.nodeTypes = JSON.parse(localStorage.getItem("nodeTypes"));
}
else {
    localStorage.setItem("nodeTypes", JSON.stringify(features.nodeTypes));
}

if (localStorage.getItem("lineTypes")) {
    features.lineTypes = JSON.parse(localStorage.getItem("lineTypes"));
}
else {
    localStorage.setItem("lineTypes", JSON.stringify(features.lineTypes));
}

// Get the modal
let modal = document.getElementById("settings-dialog");

// Get the button that opens the modal
let btn = document.getElementById("open-settings-button");

// Get the <span> element that closes the modal
let span = document.getElementById("settings-dialog-close-button");

// Get the node and line tab buttons
let nodeTabBtn = document.getElementById("settings-node-tab");
let lineTabBtn = document.getElementById("settings-line-tab");

// Get the node and line menus
let nodeMenu = document.getElementById("node-settings-area");
let lineMenu = document.getElementById("line-settings-area");

// Get the components of the node menu
let nodeTypeSelect = document.getElementById("node-type-select");
let nodeNameInput = document.getElementById("node-name-input");
let nodeShapeSelect = document.getElementById("node-shape-select");
let nodeColorSelect = document.getElementById("node-color-select");

// Get the components of the line menu
let lineTypeSelect = document.getElementById("line-type-select");
let lineNameInput = document.getElementById("line-name-input");
let lineStrokeSelect = document.getElementById("line-stroke-select");
let lineColorSelect = document.getElementById("line-color-select");
let lineWeightInput = document.getElementById("line-weight-input");

function openNodeMenu (nodeTypeID) {
    nodeMenu.style.display = "block";
    lineMenu.style.display = "none";
    while (nodeTypeSelect.firstChild) {
        nodeTypeSelect.removeChild(nodeTypeSelect.firstChild);
    }
    for (let nodeType of features.nodeTypes) {
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
    for (let lineType of features.lineTypes) {
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
    for (let nodeType of features.nodeTypes) {
        if (nodeType.nodeTypeID === nodeTypeID + "") {
            nodeNameInput.value = nodeType.name;
            nodeShapeSelect.value = nodeType.shape;
            nodeColorSelect.value = nodeType.color;
        }
    }
}

function populateLineMenu (lineTypeID) {
    populateColorSelect(lineColorSelect);
    for (let lineType of features.lineTypes) {
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

function autoSaveNodeTypes() {
    for (let nodeType of features.nodeTypes) {
        if (nodeTypeSelect.value === nodeType.nodeTypeID) {
            nodeType.name = nodeNameInput.value;
            nodeType.shape = nodeShapeSelect.value;
            nodeType.color = nodeColorSelect.value;
        }
    }
    localStorage.setItem("nodeTypes", JSON.stringify(features.nodeTypes));
    openNodeMenu(nodeTypeSelect.value);
    reset(svg);
}

function autoSaveLineTypes() {
    for (let lineType of features.lineTypes) {
        if (lineTypeSelect.value === lineType.lineTypeID) {
            lineType.name = lineNameInput.value;
            lineType.stroke = lineStrokeSelect.value;
            lineType.color = lineColorSelect.value;
            lineType.weight = lineWeightInput.value;
        }
    }
    localStorage.setItem("lineTypes", JSON.stringify(features.lineTypes));
    openLineMenu(lineTypeSelect.value);
    reset(svg);
}

