'use strict!';
let patientsPath = {
    startDate: '',
    endDate: '',
    city: '',
    location: ''
};
let patientDetails = {
    id: '',
    path: []
};

let newPatientVar = { ...patientDetails };
const dataTable = document.getElementById('dataTable');
const newPatient = document.getElementById('addUser');
const newPath = document.getElementById('addNewRow');
const table = document.getElementById('table');
const inputedPatientsID = document.getElementById('inputedPatientsID');
const switchPatient = document.getElementById('switchPatient');
const patientID = document.getElementById('patientID');
const startDateOfPath = document.getElementById('startDate');
const endDateOfPath = document.getElementById('endDate');
const cityOfPath = document.getElementById('city');
const locationOfPath = document.getElementById('location');
const oReq = new XMLHttpRequest();
const urlPath = "http://localhost:5500/Corona/";

let changeHTML = function changeHTMLAttributes() {
    patientID.style.display = 'none';
    inputedPatientsID.innerText = patientID.value;
    table.style.display = 'block';
    inputedPatientsID.style.display = 'block';
    switchPatient.style.display = 'block';
    newPatient.style.display = 'none';
};

let addPatient = function addAPatient(patientID) {
    newPatientVar.id = patientID.value;
    newPatientVar.path = [];
    let url = urlPath + newPatientVar.id;
    let promise = new Promise(function (resolve, reject) {
        oReq.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState === 4 && this.status !== 200) {
                reject(console.log(""));
                
            }
        }
    }).then(
        result => {
            newPatientVar.path = result;
            for (let i = 0; i < newPatientVar.path.length; i++) {
                addPath(newPatientVar.path[i]);
            }
            console.log(newPatientVar);
        },
        reject => alert("Bad Response")
    ).catch(e => {
        console.log(e);
    });
    oReq.open("Get", url, true);
    oReq.send();
    changeHTML();
};

let deleteInput = function deleteInputItems() {
    startDateOfPath.value = '';
    endDateOfPath.value = '';
    cityOfPath.value = '';
    locationOfPath.value = '';
};

let fillCell0 = function fillFirstCell(newCell, patientPath, numOfRows) {
    const string = document.createTextNode(patientPath.startDate);
    newCell.appendChild(string);
};

let fillCell1 = function fillFirstCell(newCell, patientPath, numOfRows) {
    const string = document.createTextNode(patientPath.endDate);
    newCell.appendChild(string);
};

let fillCell2 = function fillFirstCell(newCell, patientPath, numOfRows) {
    const string = document.createTextNode(patientPath.city);
    newCell.appendChild(string);
};

let fillCell3 = function fillFirstCell(newCell, patientPath, numOfRows) {
    const string = document.createTextNode(patientPath.location);
    newCell.appendChild(string);
};

let fillCell4 = function fillFourthCell(newCell, numOfRows) {
    const deleted = document.createElement('button');
    deleted.innerText = 'X';
    deleted.setAttribute("id", numOfRows);
    deleted.setAttribute("class", "deleted");
    newCell.setAttribute("class", "button");
    oldPath(deleted);
    newCell.appendChild(deleted);
};

let fillCell = function (newCell, cellId, numOfRows, patientPath) {
    //button to delete
    if (cellId === 4) {
        fillCell4(newCell, numOfRows);
    }
    else {
        //add start date
        if (cellId === 0) {
            fillCell0(newCell, patientPath, numOfRows);
        }
        //add end date
        else if (cellId === 1) {
            fillCell1(newCell, patientPath, numOfRows);
        }
        //add city
        else if (cellId === 2) {
            fillCell2(newCell, patientPath, numOfRows);
        }
        //addlocation
        else if (cellId === 3) {
            fillCell3(newCell, patientPath, numOfRows);
        }
    }

};

let addCells = function addCellsToRow(newRow, numOfRows, patientPath) {
    for (let i = 0; i < 5; i++) {
        let newCell = newRow.insertCell(i);
        newCell.setAttribute("class", "cell");
        fillCell(newCell, i, numOfRows, patientPath);
    }
};

let addPath = function addAPathToAPatient(patientPath) {
    let numOfRows = dataTable.rows.length;
    if (numOfRows === 0 || dataTable.style.display === "none") {
        dataTable.style.display = 'block';
    }
    let newRow = dataTable.insertRow(numOfRows);
    newRow.setAttribute("class", "row");
    addCells(newRow, numOfRows, patientPath);
};

let addPathObject = function addANewObjectToPatientPathArray() {
    let newPatientsPath = { ...patientsPath };
    newPatientsPath.startDate = startDateOfPath.value;
    newPatientsPath.endDate = endDateOfPath.value;
    newPatientsPath.city = cityOfPath.value;
    newPatientsPath.location = locationOfPath.value;
    newPatientVar.path.push(newPatientsPath);
    return newPatientsPath;
};

let removePath = function removeApathFromAPatient(rowID) {
    let removedRow = dataTable.deleteRow(rowID);
    newPatientVar.path.splice(rowID, 1);
};

let oldPath = function setsClickForDeleteButton(deleted) {
    deleted.addEventListener('click', function () {
        removePath(deleted.id);
    });
};

let removeDataTable = function removeDataTableFromDisplay() {
    let max = dataTable.rows.length;
    for (let i = 0; i < max; i++) {
        dataTable.deleteRow(0);
    }
};

let savePaths = function savePathsOfPatient() {
    let url = urlPath + newPatientVar.id;
    let promise = new Promise(function (resolve, reject) {
        oReq.onreadystatechange = function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState === 4 && this.status !== 200) {
                reject();
            }
        }
    }).then(
        result => console.log(result),
        reject => alert("Bad Response")
    );
    oReq.open("POST", url, true);
    oReq.setRequestHeader("Content-Type", "application/json");
    let jsonString = JSON.stringify(newPatientVar.path);
    console.log(jsonString);
    oReq.send(jsonString);
}

newPatient.addEventListener('click', function () {
    if (patientID.value.trim() === '') {
        alert('No ID Inputed');
    }
    else {
        addPatient(patientID);
    }
});

newPath.addEventListener('click', function () {
    let patientPath = addPathObject();
    deleteInput();
    addPath(patientPath);
});

switchPatient.addEventListener('click', function () {
    switchPatient.style.display = 'none';
    patientID.value = '';
    patientID.style.display = 'inline';
    newPatient.style.display = 'inline';
    table.style.display = 'none';
    inputedPatientsID.style.display = 'none';
    dataTable.style.display = 'none';
    switchPatient.setAttribute("className", 1);
    removeDataTable();
    deleteInput();
    savePaths();
});

