/**
 * Used to generate the Responsive Dropdown Menu Items
 */
function responsiveFillDropdownItems() {
    const dropdownMenu = document.querySelector('#responsive-assign-contacts + .dropdown-menu');
    dropdownMenu.innerHTML = '';
    dropdownMenu.style.maxHeight = '300px';
    dropdownMenu.style.overflowY = 'auto';

    contactData.forEach(contact => {
        dropdownMenu.innerHTML += createResponsiveDropdownItemHTML(contact);
    });
}

/**
 * Toggles checkbox and keeps dropdown open.
 * @param {Event} event - Prevents default action and stops propagation.
 * @param {number|string} contactID - ID of the contact for the checkbox.
 */
function toggleAndKeepDropdownOpen(event, contactID) {
    event.preventDefault();
    const checkbox = document.getElementById(`responsiveCheckme${contactID}`);
    checkbox.checked = !checkbox.checked;
    updateResponsiveAssignedUserIcons(contactID);
    event.stopPropagation();
}


/**
 * used to add the HTML for the assigned Users on the responsive Page
 * @param {int} checkboxID 
 */
function updateResponsiveAssignedUserIcons(checkboxID) {
    let user = findUser(checkboxID);
    let checkbox = document.getElementById(`responsiveCheckme` + checkboxID);

    if (checkbox.checked) {
        responsiveAssignedUsers = responsiveAssignedUsers.concat(user);
    } else {
        responsiveAssignedUsers = responsiveAssignedUsers.filter(u => u['contactID'] !== checkboxID);
    }

    let iconContainer = document.getElementById('responsive-assigned-user-icons');
    iconContainer.innerHTML = responsiveAssignedUsers.map(user => createUserIconHTML(user)).join('');
}


/**
 * Used to push the new Todo to the Array (responsive Page)
 */
async function responsiveAddTodos() {
    const selectedUsers = responsiveGetSelectedCheckboxes();
    const id = responsiveGetNextId();
    const title = document.getElementById('responsive-add-task-title').value;
    const description = document.getElementById('responsive-add-task-description').value;
    const date = new Date().toISOString().slice(0, 10);
    const priority = getSelectedPriority();
    const category = document.getElementById('responsive-add-task-category').value;
    const newSubtasks = Array.from(document.querySelectorAll('.responsive-subtask-list')).map(item => item.textContent);

    const status = setStatusViaUrl() || 'todo';

    const newTodo = {
        id,
        title,
        description,
        date,
        priority,
        category,
        status,
        subtasks: createSubtasks(newSubtasks),
        users: selectedUsers
    };

    todos.push(newTodo);
    await setItem('todos', JSON.stringify(todos));
    responsiveEditSuccessMessageSlideIn();
}

/**
 * used to let the Success Message slide in (responsive Page)
 */
function responsiveEditSuccessMessageSlideIn() {
    let responsiveMessage = document.getElementById('responsive-edit-success-message');

    responsiveMessage.classList.remove('d-none');
    responsiveMessage.style.display = 'flex';
    responsiveMessage.classList.add('edit-success-slide-in');

    setTimeout(backToBoard, 2000);
}


/**
 * This returns the Contacts, where the Checkboxes are checked
 * @returns Array with the selected Users
 */
function responsiveGetSelectedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.id);
    return selectedValues;
}


/**
 * This returns the next Todo ID's
 * @returns id
 */
function responsiveGetNextId() {
    let id = 0;
    while (todos.some(todo => todo.id === id)) {
        id++;
    }
    return id;
}


/**
 * This is used to get the Value from the selected Priority Button
 * @returns either a Button-Value or nothing
 */
function responsiveGetSelectedPriority() {
    const buttons = document.querySelectorAll('.responsivePrioBtn');
    for (const button of buttons) {
        if (button.classList.contains('add-task-button-selected')) {
            return button.value;
        }
    }
    return '';
}


/**
 * This returns JSON-Objects which have the needed format for the Subtask-Array
 * @param {array} subtasks 
 * @returns a JSON for the Subtask-Array
 */
function responsiveCreateSubtasks(subtasks) {
    const result = subtasks.map((subtask) => {
        return {
            name: subtask,
            subStatus: "open",
        };
    });
    return result;
}


/**
 * Used to reset the Page after the Task has been added (responsive Page)
 */
function responsiveClearFields() {
    document.getElementById('responsive-add-task-title').value = '';
    document.getElementById('responsive-add-task-description').value = '';
    document.getElementById('responsive-add-task-date').value = '';
    document.getElementById('responsive-edit-success-message').classList.remove('edit-success-slide-in');
    document.getElementById('responsive-edit-success-message').classList.add('d-none');

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const subtaskInput = document.getElementById('responsive-add-task-subtasks');
    subtaskInput.value = '';

    const dropdownContainer = document.getElementById('responsive-add-task-subtask-dropdown-container');
    dropdownContainer.innerHTML = '';

    const allButtons = document.querySelectorAll('.responsivePrioBtn');
    allButtons.forEach(button => {
        if (button.value == "medium") {
            button.classList.add('medium-selected', 'responsive-add-task-button-selected');
        } else {
            button.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
            button.classList.remove('responsive-add-task-button-selected');
        }
    });
}


/**
 * This is used to determine the clicked Priority Button and visualize it
 * @param {object} clickedButton 
 */
function responsiveUpdatePriority(clickedButton) {
    const allButtons = document.querySelectorAll('.responsivePrioBtn');
    for (const button of allButtons) {
        if (button !== clickedButton) {
            button.classList.remove('responsive-add-task-button-selected');
        }
    }
    clickedButton.classList.add('responsive-add-task-button-selected');
}


/**
 * Listens for the Buttonclick of the Priority Buttons
 */
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.responsivePrioBtn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            responsiveUpdatePriority(button);
        });
    });
});


/**
 * This splits the input string into a substring
 * @param {string} string 
 * @returns substring
 */
function splitSubtaskStringIntoArrays(string) {
    let subtaskString = [];
    let splittedString = [];
    splittedString = string.split(/\s/g);
    subtaskString.push(splittedString);
    return subtaskString;
}


/**
 * This is used to generate the responsive Subtasks Section and its content
 * @returns nothing
 */
function responsiveAddToDropdown() {
    const subtaskInput = document.getElementById('responsive-add-task-subtasks');
    let subtaskValue = subtaskInput.value;
    let listContainer = document.getElementById('responsive-add-task-subtask-dropdown-container');

    if (subtaskValue == `` || subtaskValue == null) {
        return;
    }

    if (currentSubtasks.length != 0) {
        if (currentSubtasks.includes(subtaskValue)) {
            return;
        }
    }

    subtaskValue = splitSubtaskStringIntoArrays(subtaskValue);
    currentSubtasks.push(subtaskValue);

    listContainer.innerHTML = ``;
    for (let i = 0; i < currentSubtasks.length; i++) {
        listContainer.innerHTML += createResponsiveSubtaskHTML(currentSubtasks[i]);
    }
    listContainer.style.display = 'block';
    subtaskInput.value = ``;
}


/**
 * This is used to change the Design of the Subtask-Field when it is edited
 * @param {string} taskName 
 */
function responsiveEditDropdownItem(taskName) {
    let dropdownItem = document.querySelectorAll('li');

    dropdownItem.forEach(item => {
        if (item.id != taskName.id) {
            return;
        }
        item.style.display = "block";
        item.classList.add('margin-left-negative-32');
    });

    let task = taskName.id;
    let newTaskName = task.substr(10, task.length - 10);

    let itemContainer = document.getElementById(`responsiveListItem` + newTaskName);
    let editInput = document.getElementById(`responsiveDropdownEdit` + newTaskName);
    let newInput = document.getElementById(`responsiveDropdownEditInput` + newTaskName);

    itemContainer.classList.add('d-none');
    editInput.classList.remove('d-none');
    editInput.style.display = "flex";
    newInput.value = newTaskName;
}

/**
 * Used to change the Changes made to a Subtask
 * @param {string} taskName 
 */
function responsiveSaveDropdownChanges(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    let task = taskName.id;
    let newTaskName = task.substr(10, task.length - 10);
    let newInput = document.getElementById(`responsiveDropdownEditInput` + newTaskName);
    let taskIndex = removeWhiteSpacesFromString(currentSubtasks).indexOf(taskName.id);
    currentSubtasks.splice(taskIndex, 1);

    dropdownItem.forEach(listItem => {
        if (listItem.id != taskName.id) {
            return;
        }
        currentSubtasks.push(splitSubtaskStringIntoArrays(newInput.value));
        newInput.innerHTML = ``;
    });
    responsiveShowSubtasksAgain(taskName);
    responsiveRefreshSubtasksDropdown();
}


/**
 * This reloads the HTML for the changed Subtasks
 */
function responsiveRefreshSubtasksDropdown() {
    let listContainer = document.getElementById('responsive-add-task-subtask-dropdown-container');

    listContainer.innerHTML = '';
    currentSubtasks.forEach(subtask => {
        listContainer.innerHTML += createResponsiveSubtaskItemHTML(subtask);
    });
    listContainer.style.display = 'block';
}


/**
 * This is used to change the Design of the edited Subtask back to its original Form
 * @param {string} taskName 
 */
function responsiveShowSubtasksAgain(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    let task = taskName.id;
    let newTaskName = task.substr(10, task.length - 10);
    let itemContainer = document.getElementById(`responsiveListItem` + newTaskName);
    let editInput = document.getElementById(`responsiveDropdownEdit` + newTaskName);

    dropdownItem.forEach(item => {
        if (item.id != taskName.id) {
            return;
        }
        item.style.display = "list-item";
        item.classList.remove('margin-left-negative-32');
    });

    itemContainer.classList.remove('d-none');
    editInput.classList.add('d-none');
}


/**
 * This is used to delete a Substring from the Dropdown
 * @param {string} taskName 
 */
function responsiveDeleteDropdownItem(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    dropdownItem.forEach(item => {
        if (item.id == ``) {
            return;
        }

        if (item.id == taskName.id) {
            item.remove();
            let taskIndex = currentSubtasks.indexOf(taskName.id);
            currentSubtasks.splice(taskIndex, 1);
        }
    });
}