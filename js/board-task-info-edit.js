/**
 * Populates the edit task form with the details of the task specified by the ID.
 * @param {number} id - The ID of the task to be edited.
 */
function fillTaskInfoForm(id) {
    const task = filterID(id)[0];
    const priorityImage = getPriorityImage(task.priority);
    const categoryElement = task['category'];
    const titleElement = capitalizeFirstLetter(task['title']);
    const descriptionElement = capitalizeFirstLetter(task['description']);
    const dateElement = task['date'];
    const priorityElement = capitalizeFirstLetter(task['priority']);
    const subtasksElement = task['subtasks'];

    let todoDetailsContainer = document.getElementById("task-info-popup");
    let taskInfoPopupHTML = generateTaskInfoPopupHTML(task, id, categoryElement, titleElement, descriptionElement, dateElement, priorityElement, priorityImage, subtasksElement);
    todoDetailsContainer.innerHTML = taskInfoPopupHTML;
}


/**
 * This function is used to load the needed Data and load the HTML for the Edit Form
 */
function fillTaskInfoFormWithData() {
    loadCurrentAssignedUsers();
    loadAssignedUsersToEditFormPopup();
    populateSubtasksToEditFormPopup();
    fillEditFormDropdown();
    checkUserCheckboxes();
}


/**
 * Populates the assigned users to the info popup.
 */
function populateAssignedUsersToInfoPopup() {
  let container = document.getElementById('task-info-popup-assigned-users');
  container.innerHTML = ``;
  todos[currentTaskID]['users'].forEach(user => {
      let userArray;
      if (checkForResponsive(user) == true) {
          userArray = identifyUserViaID(user, true);
      } else {
          userArray = identifyUserViaID(user, false);
      }
      container.innerHTML += generateUserHTML(userArray);
  });
}


/**
 * This is used to generate HTML and the Checkboxes for the Subtask Info Form
 * @param {array} subtasks 
 * @param {array} task 
 * @returns HTML for the Subtask Section on the Info Form
 */
function populateSubtasksToInfoPopup(subtasks, task) {
  return subtasks.map((subtask) => {
      return generateSubtaskHTML(subtask, task['id']);
  }).join('');
}


/**
 * Used to generate the HTML for the whole EditTask Form
 */
function openEditTaskForm() {
  let editForm = document.getElementById("edit-form-popup");
  editForm.innerHTML = generateEditTaskFormHTML();
}


/**
 * Generates the Bubbles for the Edit Form Contacts
 */
function fillEditFormDropdown() {
  let container = document.getElementById('edit-form-dropdown-container');

  container.innerHTML = ``;
  contactData.forEach(contact => {
      container.innerHTML += generateEditFormDropdownItemHTML(contact);
  });
}

/**
 * Generates the HTML for the Edit Form
 */
function populateSubtasksToEditFormPopup() {
  let container = document.getElementById('edit-subtask-container');
  container.innerHTML = ``;

  for (let i = 0; i < boardCurrentSubtasks.length; i++) {
      let subtask = boardCurrentSubtasks[i];
      container.innerHTML += generateSubtaskEditFormHTML(subtask);
  }
}


/**
 * Generates the HTML for the Edit Form Dropdown List with all the Contacts and their Checkboxes
 */
function editFillDropdownItems() {
  const dropdownMenu = document.querySelector("#edit-assign-contacts + .dropdown-menu");

  dropdownMenu.innerHTML = "";
  dropdownMenu.style.maxHeight = "300px";
  dropdownMenu.style.overflowY = "auto";

  contactData.forEach((contact) => {
      dropdownMenu.innerHTML += generateDropdownItemHTML(contact);
  });
}


/**
 * Loads the assigned Users onto the Edit Form
 */
function loadAssignedUsersToEditFormPopup() {
  let container = document.getElementById('edit-form-assigned-container');

  container.innerHTML = ``;
  currentEditFormDataUsers.forEach(user => {
      container.innerHTML += generateAssignedUserIconHTML(user);
  });
}


/**
 * This function is called when the Delete Button on a subtask is pressed. It it used to remove the Subtask
 */
function deleteSubtaskEditForm(taskID) {
    let subtask = document.getElementById(`${taskID.id}container`);
    if (!subtask) return;
    subtask.remove();
    let taskIndex = boardCurrentSubtasks.indexOf(taskID.id);
    boardCurrentSubtasks.splice(taskIndex, 1);
}


/**
 * This function is used to show the Edit Field for a Subtask on the Edit Form
 * @param {int} taskID 
 */
function showEditSubtaskEditForm(taskID) {
    let editInput = document.getElementById(`editSubtask${taskID.id}`);
    let subtaskTitleField = document.getElementById(`subtask${taskID.id}`);
    editInput.parentElement.classList.remove('subtask-hover', 'border-radius-10');

    subtaskTitleField.classList.add('d-none');
    subtaskTitleField.classList.remove('d-flex');
    editInput.classList.remove('d-none');
    editInput.classList.add('d-flex');
}


/**
 * This function hides the Edit/delete Buttons on the Subtasks
 * @param {int} idValue 
 */
function changeEnterDisplayClassValue(idValue) {
    let subtaskDiv = document.getElementById(idValue.id);
    subtaskDiv.classList.remove('hidden');
}


/**
 * This function hides the Edit Form so that the Info Form is shown again
 * @param {int} taskID 
 * @returns nothing
 */
function hideEditSubtaskEditForm(taskID) {
    let editInput = document.getElementById(`editSubtask${taskID.id}`);
    let subtaskTitleField = document.getElementById(`subtask${taskID.id}`);
    if (!editInput) return;
    editInput.parentElement.classList.add('subtask-hover', 'border-radius-10');

    subtaskTitleField.classList.remove('d-none');
    subtaskTitleField.classList.add('d-flex');
    editInput.classList.add('d-none');
    editInput.classList.remove('d-flex');
}


/**
 * Used to add a new Subtask
 * @returns nothing
 */
function addNewSubtaskToEditTaskForm() {
    let newSubtaskValue = document.getElementById('edit-new-subtask-value');

    if (newSubtaskValue.value == `` || newSubtaskValue.value == null) return;
    if (boardCurrentSubtasks.includes(newSubtaskValue.value)) return;

    boardCurrentSubtasks.push(newSubtaskValue.value);
    populateSubtasksToEditFormPopup();
    newSubtaskValue.value = ``;
}


/**
 * This function shows the Edit/Delete Buttons on the Subtasks
 * @param {int} idValue 
 */
function changeLeaveDisplayClassValue(idValue) {
    let subtaskDiv = document.getElementById(idValue.id);
    subtaskDiv.classList.add('hidden');
}


/**
 * Used to save a new Subtask to the current Todo
 * @param {int} taskID 
 * @returns nothing
 */
function saveNewSubtaskEditForm(taskID) {
    let newSubtaskInput = document.getElementById(`newSubtask${taskID.id}`);
    let taskIndex = boardRemoveWhiteSpacesFromArrayStrings(boardCurrentSubtasks).indexOf(taskID.id);

    if (boardCurrentSubtasks.includes(newSubtaskInput.value)) return;

    if (!newSubtaskInput.value == null || !newSubtaskInput.value == ``) {
        document.getElementById(`${taskID.id}container`).remove();
        boardCurrentSubtasks.splice(taskIndex, 1);
        boardCurrentSubtasks.push(newSubtaskInput.value);
        newSubtaskInput.innerHTML = ``;
    }
    hideEditSubtaskEditForm(taskID);
    populateSubtasksToEditFormPopup();
}


/**
 * Fills the Edit Form with the current Substrings
 */
function fillEditFormCurrentSubstrings() {
    todos[currentTaskID]['subtasks'].forEach(subtask => {
        if (!boardCurrentSubtasks.includes(subtask['name'])) {
            boardCurrentSubtasks.push(subtask['name']);
        }
    });
}


/**
 * Saves the edited task details and updates the todo list and HTML display accordingly
 */
async function saveEditTaskChanges() {
    let newTitle = document.getElementById('edit-form-title-input').value;
    let newDescription = document.getElementById('edit-form-description-input').value;
    let newDate = document.getElementById('edit-form-date-input').value;
    let selectedPriority = document.querySelector(".add-task-button-selected");
    let newPrio = selectedPriority ? selectedPriority.getAttribute("value") : "";
    let newAssignedUsers = currentEditFormDataUsers;
    let newSubtasks = modifyArrayToGetMerged();
    let todoToUpdate = todos.find((todo) => todo.id === currentTaskID);

    if (todoToUpdate) {
        todoToUpdate.title = newTitle;
        todoToUpdate.description = newDescription;
        todoToUpdate.date = newDate;
        todoToUpdate.priority = newPrio;
        todoToUpdate.subtasks = newSubtasks;
        todoToUpdate.users = newAssignedUsers;
    }

    await setItem("todos", JSON.stringify(todos));
    closeEditFormPopup();
    showInfoFormPopup(currentTaskID);
    updateHTML();
}