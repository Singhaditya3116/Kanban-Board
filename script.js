//Task list Container
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("in-progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("onhold-list");

//Buttons
const addBtns = document.querySelectorAll(".add-btn");
const saveBtns = document.querySelectorAll(".save-btn");
const contentAreas = document.querySelectorAll(".content-area");

//Initializing Array
let taskArrays = {
  backlogArray: [],
  progressArray: [],
  completeArray: [],
  onHoldArray: [],
};

const containerArrayMaps = {
  0: "backlogArray",
  1: "progressArray",
  2: "completeArray",
  3: "onHoldArray",
};

// List Items
let draggedItem, currentContainer;
let list = [backlogList, progressList, completeList, onHoldList];

//set Data in localStorage
function updateLocalStorage() {
  localStorage.setItem("taskArrays", JSON.stringify(taskArrays));
}

//get Data From local Storage if available
function getData() {
  if (localStorage.getItem("taskArrays")) {
    taskArrays = JSON.parse(localStorage.taskArrays);
  } else {
    taskArrays = {
      backlogArray: ["Release the course", "Sit back and Relax"],
      progressArray: ["Work on Projects", "Relax to music"],
      completeArray: ["Being cool", "Getting stuff done"],
      onHoldArray: ["Being uncool"],
    };
  }
  updateDOM();
}

//Show Input Box When add btn is clicked.
function showInputBox(containerNumber) {
  addBtns[containerNumber].style.visibility = "hidden";
  saveBtns[containerNumber].style.visibility = "visible";
  contentAreas[containerNumber].style.display = "block";
}

//Hide Input Box when save btn is clicked.
function hideInputBox(containerNumber) {
  addBtns[containerNumber].style.visibility = "visible";
  saveBtns[containerNumber].style.visibility = "hidden";
  contentAreas[containerNumber].style.display = "none";

  //appending data in container.
  let inputValue = contentAreas[containerNumber].innerText;
  if (inputValue != "")
    taskArrays[containerArrayMaps[containerNumber]].push(inputValue);
  contentAreas[containerNumber].innerText = "";
  updateDOM();
  updateLocalStorage();
}

//Update DOM with the taskArray Data
function updateDOM() {
  let taskArrayKeys = Object.keys(taskArrays);

  taskArrayKeys.forEach((task, index) => {
    list[index].innerText = "";
    taskArrays[task].forEach((taskItem, innerIndex) => {
      let listItem = document.createElement("li");
      listItem.innerText = `${taskItem}`;
      listItem.draggable = true;
      listItem.setAttribute("ondragstart", "drag(event)");
      listItem.contentEditable = true;
      listItem.setAttribute(
        "onfocusout",
        `updateArrayItem(${index},${innerIndex})`
      );
      list[index].appendChild(listItem);
    });
  });
}

//Remove Null items from taskarrays
function filterArray() {
  let taskArrayKeys = Object.keys(taskArrays);
  taskArrayKeys.forEach((containerArray) => {
    //console.log(containerArray);
    taskArrays[containerArray] = taskArrays[containerArray].filter(
      (item) => item
    );
  });
  updateDOM();
}

//Update Item if changes happen in Items.
function updateArrayItem(containerIndex, index) {
  let itemValue = list[containerIndex].children[index].innerText;
  if (itemValue === "") {
    // If itemValue is empty remove it from DOM and array.
    list[containerIndex].children[index].classList.add("hidden");
    taskArrays[containerArrayMaps[containerIndex]][index] = null;
  } else {
    taskArrays[containerArrayMaps[containerIndex]][index] = itemValue;
  }
  filterArray();
  updateLocalStorage();
}

//Update task Array after drag and Drop is complete.
function updateArray(previousContainer, currentContainer, itemText) {
  //If drag and drop in same container
  if (previousContainer === currentContainer) {
    return;
  }
  //Deleting Item from previous container Array.
  let mapIndex = list.indexOf(previousContainer);
  let index = taskArrays[containerArrayMaps[mapIndex]].indexOf(itemText);
  taskArrays[containerArrayMaps[mapIndex]].splice(index, 1);

  //Appending Item to new container Array.
  mapIndex = list.indexOf(currentContainer);
  taskArrays[containerArrayMaps[mapIndex]].push(itemText);
}

//When Item starts dragging
function drag(e) {
  draggedItem = e.target;
}

//Allow Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

//When Item enters into Container area.
function dragEnter(container) {
  currentContainer = list[container];
  currentContainer.classList.add("over");
}

//Dropping Item in another container
function drop(e) {
  e.preventDefault();
  const previousContainer = draggedItem.parentElement;
  console.log(currentContainer);
  currentContainer.appendChild(draggedItem);
  list.forEach((container) => {
    container.classList.remove("over");
  });

  updateArray(previousContainer, currentContainer, draggedItem.innerText);
  updateLocalStorage();
}

//On load
getData();
