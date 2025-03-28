let currentDraggedElement;
let todos = [];
let currentEditFormDataUsers = [];
let currentTaskID;
let boardCurrentSubtasks = [];


/**
 * initializes the Loading of the Data first and then loads the HTML
 */
async function boardInit() {
  await loadContactData();
  await loadTodos();
  updateHTML();
}


/**
 * Used to generate the HTML for the Board
 */
function updateHTML() {
  const categories = ["todo", "feedback", "progress", "done"];
  const searchText = document.getElementById("inputFilterTasks").value.trim().toLowerCase();
  const responsiveSearchText = document.getElementById("responsiveInputFilterTasks").value.trim().toLowerCase();

  for (const category of categories) {
    const filteredTodos = [];
    for (const todo of todos) {
      if (window.innerWidth > 1157) {
        if (
          todo.status === category &&
          (todo.title.toLowerCase().includes(searchText) || todo.description.toLowerCase().includes(searchText))
        ) {
          filteredTodos.push(todo);
        }
      } else {
        if (todo.status === category &&
          (todo.title.toLowerCase().includes(responsiveSearchText) || todo.description.toLowerCase().includes(responsiveSearchText))) {
          filteredTodos.push(todo);
        }
      }
    }
    let html = "";
    for (const todo of filteredTodos) {
      html += generateTodoHTML(todo);
    }
    document.getElementById(category).innerHTML = html;
  }
  checkEmptyTasks();
  setCategoryColor();
}


/**
 * Used to Start the Dragging of the Task Card and to mark the Areas u can drop the Card in
 * @param {int} id 
 */
function startDragging(id) {
  currentDraggedElement = id;
  const dragAreas = ["todo", "feedback", "progress", "done"];
  dragAreas.forEach((area) => document.getElementById(area).classList.add("drag-area"));

  const boardTaskCard = document.getElementById("element-" + id);
  boardTaskCard.classList.add("shake-animation");
}


/**
 * Used to return the name of the needed Image based on the Priority-String
 * @param {string} priority 
 * @returns a string
 */
function getPriorityImage(priority) {
  switch (priority) {
    case "low":
      return "lowicon";
    case "medium":
      return "mediumicon";
    case "urgent":
      return "urgenticon";
    default:
      return "";
  }
}


/**
 * Used to match Colors to the respective Category
 * @param {string} category 
 * @returns the color for the Category
 */
function getCategoryColor(category) {
  const categoryColors = {
    "User Story": "#0038ff",
    "Technical Task": "#1fd7c1",
  };

  return categoryColors[category];
}


/**
 * Used to get the color of the Progress Bar depending on the Caregory
 * @param {string} category 
 * @returns the Colorcode
 */
function getProgressBarColor(category) {
  const categoryColors = {
    "User Story": "#4589ff",
    "Technical Task": "#51fade",
  };
  return categoryColors[category];
}


/**
 * Used to return an Array with the matching Criteria
 * @param {array} users 
 * @returns the User matching the criteria
 */
function loadUserArrays(users) {
  return users.map(user => {
    return identifyUserViaID(user, checkForResponsive(user));
  });
}


/**
 * Generates HTML for a task card based on the provided task object
 * @param {Object} task - The task object containing id, category, title, description, subtasks, users, and priority
 * @returns {string} - The HTML string for the task card
 */
function generateTodoHTML(task) {
  const { id, category, title, description, subtasks, users, priority } = task;
  const completedSubtasks = countCompletedSubtasks(task.subtasks);
  const progress = (completedSubtasks / subtasks.length) * 100;
  let usernames = loadUserArrays(users);
  const priorityImage = getPriorityImage(priority);
  const progressBarColor = getProgressBarColor(category);

  return `
        <div id="element-${id}" draggable="true" ondragstart="startDragging(${id})" class="board-task-card flex-column justify-content-between align-items-start" onclick="showInfoFormPopup(${id})">
            <div class="board-task-category">${category}</div>
            <div class="board-task-title w-100">${title}</div>
            <div class="board-task-description">${description}</div>
            <div class="board-task-subtasks d-flex justify-content-between align-items-center w-100pc">
                <div class="board-task-progress">
                    <div class="progress" style="width: ${progress.toFixed(
    0
  )}%; background-color: ${progressBarColor}"></div>
                </div>
                <div class="board-task-subtask">${completedSubtasks} / ${subtasks.length} Subtasks</div>
            </div>
            <div class="board-task-users-priority d-flex justify-content-between align-items-center w-100pc">
                <div id="board-task-card-assigned-users" class="flex justify-between max-width-186 overflow-auto">${generateAssignedUsers(usernames)}</div>
                <div class="board-task-priority"><img src="../img/icons/${priorityImage}.svg" alt="${priority}" /></div>
            </div>
        </div>
    `;
}


/**
 * Used to generate HTML-Bubbles for the Task Card
 * @param {array} usernames 
 * @returns HTML 
 */
function generateAssignedUsers(usernames) {
  let result = ``;

  for (let i = 0; i < usernames.length; i++) {

    if (usernames[i][0] == null || usernames[i][0] == ``) return;
    result += `
      <div class="board-task-users bg-color-${usernames[i][0]['contactColor']}">${usernames[i][0]['contactIcon']}</div>
    `;
  }

  return result;
}


/**
 * This allows the dragged Card to be dragged as long as Mouse 1 is held down
 * @param {Event} ev 
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Used to change the Status of the Task when the Task Card is dropped
 * @param {string} newStatus 
 */
function moveTo(newStatus) {
  const todo = todos.find((todo) => todo.id === currentDraggedElement);
  if (todo) {
    todo.status = newStatus;
    updateStatus(todo.id, newStatus);
    removeDragArea();
    updateHTML();
  }
}


/**
 * Used to add a class to the highlighted Element
 * @param {int} id 
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}


/**
 * Used to remove the Highlight from the Element
 * @param {int} id 
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}


/**
 * Used to remove the Areas where the dragged Object can be pulled to
 */
function removeDragArea() {
  const elements = ["todo", "feedback", "progress", "done"];
  elements.forEach((elementId) => {
    document.getElementById(elementId).classList.remove("drag-area");
  });

  const boardTaskCard = document.getElementById("element-" + currentDraggedElement);
  boardTaskCard.classList.remove("shake-animation");
}


/**
 * Used to check if there are Tasks in the respective Statusfield
 */
function checkEmptyTasks() {
  const taskIds = ["todo", "feedback", "progress", "done"];
  const statusMap = {
    todo: "status-todo",
    feedback: "status-feedback",
    progress: "status-progress",
    done: "status-done",
  };

  for (const taskId of taskIds) {
    const taskElement = document.getElementById(taskId);
    const value = taskElement.innerHTML;
    const statusElement = document.getElementById(statusMap[taskId]);

    if (value === "") {
      statusElement.classList.remove("d-none");
    } else {
      statusElement.classList.add("d-none");
    }
  }
}


/**
 * Used to set the Color of the Category based on a Value
 */
function setCategoryColor() {
  const categoryElements = document.querySelectorAll(".board-task-category");
  const categoryColors = {
    "User Story": "#0038ff",
    "Technical Task": "#1fd7c1",
  };

  categoryElements.forEach((element) => {
    const categoryText = element.textContent;
    const color = categoryColors[categoryText];
    element.style.backgroundColor = color;
  });
}


/**
 * Used to get the Amount of Subtasks with the Status "Closed"
 * @param {array} subtasks 
 * @returns the Amount of Subtasks with the Status "Closed"
 */
function countCompletedSubtasks(subtasks) {
  return subtasks.filter((subtask) => subtask.subStatus === "closed").length;
}


/**
 * Used to count the Subtasks with the Status "Open"
 * @param {array} task 
 * @returns 
 */
function countOpenSubtasks(task) {
  return task.subtasks.filter((subtask) => subtask.status === "open").length;
}


/**
 * Used to update the Status of the Task
 * @param {int} id 
 * @param {string} newStatus 
 */
async function updateStatus(id, newStatus) {
  todos.find((todo) => todo.id === id).status = newStatus;
  await setItem("todos", JSON.stringify(todos));
}


/**
 * Used to show the Info Form
 * @param {int} id 
 */
function showInfoFormPopup(id) {
  let contactFormBG = document.getElementById("task-info-popup-all-container");
  let infoForm = document.getElementById('task-info-popup');
  contactFormBG.style.display = "flex";
  infoForm.classList.add('form-slide-in-animation');
  if (currentTaskID != null) {
    currentTaskID = undefined;
  }

  currentTaskID = id;

  fillTaskInfoForm(id);
  populateAssignedUsersToInfoPopup();
}


/**
 * Used to close the Info Form
 */
function closeInfoFormPopup() {
  let infoForm = document.getElementById('task-info-popup');
  infoForm.classList.add('form-slide-out-animation');
  boardCurrentSubtasks = [];
  setTimeout(changeInfoFormDisplayStyleOnClose, 200);
}


/**
 * Used to remove classes when the Info Form is closed
 */
function changeInfoFormDisplayStyleOnClose() {
  let contactFormBG = document.getElementById("task-info-popup-all-container");
  let infoForm = document.getElementById('task-info-popup');
  contactFormBG.style.display = "none";

  infoForm.classList.remove('form-slide-out-animation');
  infoForm.classList.remove('form-slide-in-animation');
}


/**
 * Used to close the Edit Form. Resets the Array with the current Task Data
 */
function closeEditFormPopup() {
  document.getElementById(`edit-form-popup`).style.display = `none`;
  document.getElementById('task-info-popup').classList.remove('d-none');

  currentEditFormDataUsers = [];
}


/**
 * Used to open the Edit Form. Also calls functions to Fill the Form with Data
 */
function showEditFormPopup() {
  document.getElementById("edit-form-popup").style.display = 'flex';;
  document.getElementById(`task-info-popup`).classList.add('d-none');

  openEditTaskForm();
  fillEditFormCurrentSubstrings();
  fillTaskInfoFormWithData();
}


/**
 * This function is used to Hide/show the Dropdown Container with the Contacts
 */
function toggleDropdown() {
  let container = document.getElementById('edit-form-dropdown-container');
  container.classList.toggle('d-flex');
}

