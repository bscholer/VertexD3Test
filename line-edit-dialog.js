let lineEditModal = document.getElementById("line-edit-dialog");

let lineEditCloseButton = document.getElementById("line-edit-dialog-close-button");

let lineEditTypeSelect = document.getElementById("line-edit-type-select");
let lineEditNameInput = document.getElementById("line-edit-name-input");
let lineEditColorSelect = document.getElementById("line-edit-color-select");
let lineEditStrokeSelect = document.getElementById("line-edit-stroke-select");
let lineEditWeightInput = document.getElementById("line-edit-weight-input");
let lineEditBiDirectionalityInput = document.getElementById("line-edit-bi-directionality-input");

function openLineEditDialog() {
    let lineTooltip = document.getElementById("line-tooltip");
    let lineID = lineTooltip.lineID;
    let lineEditDialog = document.getElementById("line-edit-dialog");
    lineEditDialog.style.display = "block";
    populateLineEditDialog(lineID);
}

function populateLineEditDialog(lineID) {
    populateColorSelect(lineEditColorSelect);
    let line = findLine(lineID);
    let lineEditTitle = document.getElementById("line-edit-dialog-title");
    lineEditTitle.innerText = "Edit Line #" + lineID + " (" + line.name + ")";
    while (lineEditTypeSelect.firstChild) {
        lineEditTypeSelect.removeChild(lineEditTypeSelect.firstChild);
    }
    for (let lineType of features.lineTypes) {
        let newLineTypeOption = document.createElement("option");
        newLineTypeOption.value = lineType.lineTypeID;
        newLineTypeOption.innerText = lineType.name;
        lineEditTypeSelect.appendChild(newLineTypeOption);
    }
    lineEditTypeSelect.value = line.lineTypeID;
    lineEditNameInput.value = line.name;
    lineEditColorSelect.value = line.color;
    lineEditStrokeSelect.value = line.stroke;
    lineEditWeightInput.value = line.weight;
    lineEditBiDirectionalityInput.value = line.bi_directionality;
}

function lineEditChangeType() {
    let lineID = document.getElementById("line-tooltip").lineID;
    let lineType;
    for (let lineTypeI of features.lineTypes) {
        if (lineEditTypeSelect.value === lineTypeI.lineTypeID) {
            lineType = lineTypeI;
        }
    }
    for (let line of features.lines) {
        if (line.lineID === lineID) {
            line.lineTypeID = lineEditTypeSelect.value;
            line.color = lineType.color;
            line.stroke = lineType.stroke;
            line.weight = lineType.weight;
        }
    }
    populateLineEditDialog(lineID);
    console.log(features.lines);
    reset(svg);
}

function autoSaveLines() {
    let lineID = document.getElementById("line-tooltip").lineID;
    for (let line of features.lines) {
        if (line.lineID === lineID) {
            line.name = lineEditNameInput.value;
            line.color = lineEditColorSelect.value;
            line.stroke = lineEditStrokeSelect.value;
            line.weight = lineEditWeightInput.value;
            line.bi_directionality = lineEditBiDirectionalityInput.value;
        }
    }
    populateLineEditDialog(lineID);
    document.getElementById("line-tooltip-title").innerText = lineEditNameInput.value;
    reset(svg);
}

// When the user clicks on <span> (x), close the lineEditModal
lineEditCloseButton.onclick = function () {
    lineEditModal.style.display = "none";
};

// This was causing more problems than it was worth.
// When the user clicks anywhere outside of the lineEditModal, close it
// window.onmousedown = function (event) {
//     if (event.target === lineEditModal) {
//         lineEditModal.style.display = "none";
//     }
// };
