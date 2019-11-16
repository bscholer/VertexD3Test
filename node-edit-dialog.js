let nodeEditModal = document.getElementById("node-edit-dialog");

let closeButton = document.getElementById("node-edit-dialog-close-button");

let nodeEditTypeSelect = document.getElementById("node-edit-type-select");
let nodeEditNameInput = document.getElementById("node-edit-name-input");
let nodeEditShapeSelect = document.getElementById("node-edit-shape-select");
let nodeEditColorSelect = document.getElementById("node-edit-color-select");
let nodeEditSizeInput = document.getElementById("node-edit-size-input");
let nodeEditPositionInput = document.getElementById("node-edit-position-input");

function openNodeEditDialog() {
    let nodeTooltip = document.getElementById("node-tooltip");
    let nodeID = nodeTooltip.nodeID;
    let nodeEditDialog = document.getElementById("node-edit-dialog");
    nodeEditDialog.style.display = "block";
    populateNodeEditDialog(nodeID);
}

function populateNodeEditDialog(nodeID) {
    populateColorSelect(nodeEditColorSelect);
    let node = findNode(nodeID);
    let nodeEditTitle = document.getElementById("node-edit-dialog-title");
    nodeEditTitle.innerText = "Edit Node #" + nodeID + " (" + node.name + ")";
    while (nodeEditTypeSelect.firstChild) {
        nodeEditTypeSelect.removeChild(nodeEditTypeSelect.firstChild);
    }
    for (let nodeType of features.nodeTypes) {
        let newNodeTypeOption = document.createElement("option");
        newNodeTypeOption.value = nodeType.nodeTypeID;
        newNodeTypeOption.innerText = nodeType.name;
        nodeEditTypeSelect.appendChild(newNodeTypeOption);
    }
    nodeEditTypeSelect.value = node.nodeTypeID;
    nodeEditNameInput.value = node.name;
    nodeEditShapeSelect.value = node.shape;
    nodeEditColorSelect.value = node.color;
    nodeEditSizeInput.value = node.size;
    nodeEditPositionInput.value = node.x + ", " + node.y;
}

function nodeEditChangeType() {
    let nodeID = document.getElementById("node-tooltip").nodeID;
    let nodeType;
    for (let nodeTypeI of features.nodeTypes) {
        if (nodeEditTypeSelect.value === nodeTypeI.nodeTypeID) {
            nodeType = nodeTypeI;
        }
    }
    for (let node of features.nodes) {
        if (node.nodeID === nodeID) {
            node.nodeTypeID = nodeEditTypeSelect.value;
            node.color = nodeType.color;
            node.shape = nodeType.shape;
        }
    }
    populateNodeEditDialog(nodeID);
    reset(svg);
}

function autoSaveNodes() {
    let nodeID = document.getElementById("node-tooltip").nodeID;
    for (let node of features.nodes) {
        if (node.nodeID === nodeID) {
            node.name = nodeEditNameInput.value;
            node.shape = nodeEditShapeSelect.value;
            node.size = nodeEditSizeInput.value;
            node.color = nodeEditColorSelect.value;
            node.x = nodeEditPositionInput.value.match(/([0-9]+), ?([0-9]+)/)[1];
            node.y = nodeEditPositionInput.value.match(/([0-9]+), ?([0-9]+)/)[2];
        }
    }
    populateNodeEditDialog(nodeID);
    document.getElementById("node-tooltip-title").innerText = nodeEditNameInput.value;
    reset(svg);
}

// When the user clicks on <span> (x), close the nodeEditModal
closeButton.onclick = function () {
    nodeEditModal.style.display = "none";
};

// This was causing more problems than it was worth.
// When the user clicks anywhere outside of the nodeEditModal, close it
// window.onmousedown = function (event) {
//     if (event.target === nodeEditModal) {
//         nodeEditModal.style.display = "none";
//     }
// };
