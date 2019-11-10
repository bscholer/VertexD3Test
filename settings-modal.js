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

// Get the modal
var modal = document.getElementById("settings-dialog");

// Get the button that opens the modal
var btn = document.getElementById("open-settings-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the node and line tab buttons
var nodeTabBtn = document.getElementById("settings-node-tab");
var lineTabBtn = document.getElementById("settings-line-tab");

// Get the components of the node menu
var nodeTypeSelect = document.getElementById("node-type-select");
var nodeNameInput = document.getElementById("node-name-input");
var nodeShapeSelect = document.getElementById("node-shape-select");
var nodeColorSelect = document.getElementById("node-color-select");

function openNodeMenu (nodeTypeID) {
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

function openLineMenu () {

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
    for (let nodeType of nodeTypes) {
        if (nodeTypeSelect.value === nodeType.nodeTypeID) {
            nodeType.name = nodeNameInput.value;
            nodeType.shape = nodeShapeSelect.value;
            nodeType.color = nodeColorSelect.value;
        }
    }
    localStorage.setItem("nodeTypes", JSON.stringify(nodeTypes));
    openNodeMenu(nodeTypeSelect.value);
}
