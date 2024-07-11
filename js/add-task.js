let timeoutId;
let currentSubtasks = [];
let assignedUsers = [];
let responsiveAssignedUsers = [];
let lengthOfFirstString = [];
let processedSubtaskNames = [];

/**
 * Initializes the Functions, which provide Data needed on Load of the Site
 * storeCurrentPage is found in the File script.js
 * loadContactData is found in the File userData.js
 */
async function initAddTask() {
    await loadTodos();
    await storeCurrentPage();
    await loadContactData();
    fillDropdownItems();
    responsiveFillDropdownItems();
}

/**
 * Loads todos from storage and initializes application state.
 * Uses 'getItem' to asynchronously fetch todos data, parsing it into 'todos' and 'todosCopy'.
 * On failure, alerts user with error details.
 */
async function loadTodos() {
    try {
        todos = JSON.parse(await getItem("todos"));
        todosCopy = JSON.parse(await getItem("todos"));
    } catch (e) {
        alert("No Todos found:" + e);
    }
}

/**
 * Retrieves a message status from the URL parameters to set the initial status of a task or notification.
 * It relies on 'checkUrlForMessage' to parse the URL and extract the relevant message status.
 * Returns the extracted message status for further processing or initialization.
 */
function setStatusViaUrl() {
    let msgStatus = checkUrlForMessage();
    return msgStatus;
}

/**
 * Extracts the 'msg' parameter value from the URL query string.
 * Returns the 'msg' value or undefined if not present.
 */
function checkUrlForMessage() {
    var url = window.location.href;
    var msgIndex = url.indexOf("msg=");

    if (msgIndex == -1) return;

    var msgValue = url.substring(msgIndex + 4);
    var ampersandIndex = msgValue.indexOf("&");

    if (ampersandIndex !== -1) {
        msgValue = msgValue.substring(0, ampersandIndex);
    }

    return msgValue;
}

/**
* Adds a new todo with details like title, description, priority, and subtasks to the 'todos' list.
* Uses helper functions for assigned users, unique ID, priority, subtasks, and status (default 'todo').
* Updates and saves the list, displaying a success message afterwards.
*/
async function addTodos() {
    const selectedUsers = getSelectedCheckboxes();
    const id = getNextId();
    const title = document.getElementById('addtask-title').value;
    const description = document.getElementById('addtask-description').value;
    const date = new Date().toISOString().slice(0, 10);
    const priority = getSelectedPriority();
    const category = document.getElementById('addtask-category').value;
    const newSubtasks = Array.from(document.querySelectorAll('.subtask-list')).map(item => item.textContent);

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
    editSuccessMessageSlideIn();
}

/**
 * Converts an array of subtask strings into objects with 'name' and 'subStatus' properties.
 * @param {string[]} subtasks - Subtask descriptions.
 * @returns {Object[]} Array of subtask objects with 'name' and initial 'subStatus' set to "open".
 */
function createSubtasks(subtasks) {
    const result = subtasks.map((subtask) => {
        return {
            name: subtask,
            subStatus: "open",
        };
    });
    return result;
}

/**
 * Collects the IDs of all checked checkboxes on the page.
 * @returns {string[]} An array of the IDs of selected checkboxes.
 */
function getSelectedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.id);
    return selectedValues;
}

/**
 * Generates the next unique ID for a new todo item.
 * It iterates through existing todo IDs to ensure the new ID is unique.
 * @returns {number} A unique ID for the next todo.
*/
function getNextId() {
    let id = 0;
    while (todos.some(todo => todo.id === id)) {
        id++;
    }
    return id;
}

/**
 * Retrieves the selected task priority based on the selected priority button.
*/
function getSelectedPriority() {
    const buttons = document.querySelectorAll('.btnpriority');
    for (const button of buttons) {
        if (button.classList.contains('add-task-button-selected')) {
            return button.value;
        }
    }
    return '';
}

/**
 * Updates the visual selection of a priority button and ensures only one is selected at a time.
*/
function updatePriority(clickedButton) {
    const allButtons = document.querySelectorAll('.btnpriority');
    for (const button of allButtons) {
        if (button !== clickedButton) {
            button.classList.remove('add-task-button-selected');
        }
    }
    clickedButton.classList.add('add-task-button-selected');
}

/**
 * Attaches click event listeners to priority buttons for handling priority selection upon page load.
*/
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btnpriority');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            updatePriority(button);
        });
    });
});

/**
 * Fills the task assignee dropdown with contacts, allowing multiple selections. 
 * Clears existing content, sets dropdown scrollability, and adds each contact with a checkbox, color icon, and name. 
 * Assigns unique IDs to checkboxes and updates user icons on selection.
*/
function fillDropdownItems() {
    const dropdownMenu = document.querySelector('#task-assignee + .dropdown-menu');
    dropdownMenu.innerHTML = ''; 
    dropdownMenu.style.maxHeight = '300px';
    dropdownMenu.style.overflowY = 'auto';

    contactData.forEach(contact => {
        const contactHTML = contactTemplate(contact);
        dropdownMenu.innerHTML += contactHTML;
    });
}

/**
 * Toggles a contact's checkbox state and updates UI accordingly.
 * @param {Event} event - Prevents event propagation.
 * @param {number|string} contactID - ID of the contact.
 */
function toggleCheckbox(event, contactID) {
    const checkbox = document.getElementById(`Checkme${contactID}`);
    checkbox.checked = !checkbox.checked;
    updateAssignedUserIcons(contactID);
}

/**
 * Updates assigned user icons based on checkbox selections. 
 * Adds or removes users from the assigned list according to checkbox state, identified by checkboxID. 
 * Utilizes findUser to match users and assignedUsers array for tracking. 
 * Refreshes icons to match current assignments, displaying each user's icon, name, and color.
*/
function updateAssignedUserIcons(checkboxID) {
    let user = findUser(checkboxID);
    let checkbox = document.getElementById(`Checkme` + checkboxID);

    if (checkbox.checked == true) {
        assignedUsers = assignedUsers.concat(user);
    } else {
        for (let i = assignedUsers.length - 1; i >= 0; i--) {
            if (assignedUsers[i]['contactID'] == checkboxID) {
                assignedUsers.splice(i, 1);
            }
        }
    }
    let iconContainer = document.getElementById('assigned-user-icons');
    iconContainer.innerHTML = ``;
    assignedUsers.forEach(user => {
        iconContainer.innerHTML += createUserIconDropdownHTML(user['contactID'], user['contactName'], user['contactColor'], user['contactIcon']);
    });
}

/**
 * Finds and returns a user by userID from contactData.
 * @param {string} userID - The ID of the user to find.
 * @returns {Object[]} An array with the found user, or empty if not found.
 */
function findUser(userID) {
    return contactData.filter((contact) => {
        return contact.contactID == userID;
    });
}

/**
 * Adds a new subtask to the dropdown list from the input field.
 * Validates to ensure no empty or duplicate subtasks are added.
 * Converts the input string to an array of subtasks, updates the global subtasks list,
 * and dynamically generates the dropdown list items with edit and delete options.
 */
function addToDropdown() {
    const subtaskInput = document.getElementById('addtask-subtasks');
    let subtaskValue = subtaskInput.value;
    let listContainer = document.getElementById('add-task-subtask-dropdown-container');
    if (subtaskValue == `` || subtaskValue == null) return;
    if (currentSubtasks.length != 0 && currentSubtasks.includes(subtaskValue)) return;

    showDropdown();

    subtaskValue = splitSubtaskStringIntoArrays(subtaskValue);
    currentSubtasks.push(subtaskValue);
    listContainer.innerHTML = ``;
    currentSubtasks.forEach(subtask => {
        listContainer.innerHTML += createDropdownItemHTML(subtask);
        pushSubstringDataToArray(subtask);
    });
    listContainer.style.display = 'block';
    subtaskInput.value = ``;
}

/**
 * Adds subtask data to an array for tracking, including the name of the subtask without whitespaces
 * and the length of the first word in the subtask. It ensures no duplicates are added.
 * @param {string} data - The subtask string to process and add to the array.
 */
function pushSubstringDataToArray(data) {
    if (!processedSubtaskNames.includes(data)) {
        lengthOfFirstString.push({
            'subtaskName': removeWhiteSpacesFromString(data),
            'subtaskFirstWordLength': data[0][0].length
        });
        processedSubtaskNames.push(data);
    }
}

/**
 * Concatenates elements of an array into a single string and removes all commas.
 * This function is useful for creating a compact representation of an array of strings,
 * for example, converting a list of words into a tag or identifier.
 * @param {string[]} array - An array of strings to be concatenated.
 * @returns {string} A single string derived from the array elements, with commas removed.
 */
function removeWhiteSpacesFromString(array) {
    let sentence = ``;
    array.forEach(string => {
        sentence = sentence + string;
    })
    sentence = sentence.replaceAll(",", "");
    return sentence;
}

/**
 * Joins elements of an array into a single string and replaces the first comma with a space.
 * Designed to format an array of strings by concatenating them and adjusting punctuation for readability.
 * Note: This function only replaces the first comma encountered. For multiple commas or global replacement,
 * consider modifying the replace method.
 * @param {string[]} array - An array of strings to be joined.
 * @returns {string} A concatenated string with the first comma replaced by a space.
 */
function removeComaFromString(array) {
    let sentence = ``;
    array.forEach(string => {
        sentence = sentence + string;
    })
    sentence = sentence.replaceAll(",", " ");
    return sentence;
}


/**
 * Toggles edit mode for a dropdown item by task name, switching between its display and an input field for editing. 
 * It hides the item's display container and shows a pre-filled input field. Identified by taskName.id.
*/
function editDropdownItem(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    let itemContainer = document.getElementById(`listItem` + taskName.id);
    let editInput = document.getElementById(`dropdownEdit` + taskName.id);
    let newInput = document.getElementById(`dropdownEditInput` + taskName.id);

    dropdownItem.forEach(item => {
        if (item.id != taskName.id) {
            return;
        }
        item.style.display = "block";
        item.classList.add('margin-left-negative-32');
    });

    itemContainer.classList.add('d-none');
    editInput.classList.remove('d-none');
    editInput.style.display = "flex";
    newInput.value = taskName.id;
}

/**
 * Saves changes made to a dropdown item's subtask and updates the display.
 * @param {object} taskName - The task object, where taskName.id identifies the dropdown item to update.
 */
function saveDropdownChanges(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    let newInput = document.getElementById(`dropdownEditInput` + taskName.id);
    let taskIndex = removeWhiteSpacesFromString(currentSubtasks).indexOf(taskName.id);
    currentSubtasks.splice(taskIndex, 1);


    dropdownItem.forEach(listItem => {
        if (listItem.id != taskName.id) {
            return;
        }
        currentSubtasks.push(splitSubtaskStringIntoArrays(newInput.value));
        newInput.innerHTML = ``;
    });
    showSubtasksAgain(taskName);
    refreshSubtasksDropdown();
}

/**
 * Clears and repopulates the subtasks dropdown with current subtasks.
 * Each subtask is displayed as a list item with options to edit or delete.
 * This function is called to refresh the dropdown's content after adding, editing, or removing a subtask.
 */
function refreshSubtasksDropdown() {
    let listContainer = document.getElementById('add-task-subtask-dropdown-container');
    listContainer.innerHTML = ``;

    currentSubtasks.forEach(subtask => {
        listContainer.innerHTML += createDropdownItemHTML(subtask);
        pushSubstringDataToArray(subtask);
    });

    listContainer.style.display = 'block';
}

/**
 * Reverts the display of a specific subtask from edit mode back to view mode.
 * It targets the subtask based on the provided taskName object and adjusts CSS classes and styles
 * to show the subtask in its normal, non-editable state.
 * 
 * @param {Object} taskName - Object containing the 'id' property of the subtask to be reverted.
 */
function showSubtasksAgain(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    let itemContainer = document.getElementById(`listItem` + taskName.id);
    let editInput = document.getElementById(`dropdownEdit` + taskName.id);

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
 * Removes a specific subtask item from the dropdown and updates the relevant arrays.
 * Identifies the subtask by its ID, removes it from the DOM, and then cleans up
 * the `currentSubtasks`, `lengthOfFirstString`, and `processedSubtaskNames` arrays
 * to reflect the deletion.
 * 
 * @param {Object} taskName - Object containing the 'id' property of the subtask to be removed.
 */
function deleteDropdownItem(taskName) {
    let dropdownItem = document.querySelectorAll('li');
    dropdownItem.forEach(item => {
        if (item.id == ``) {
            return;
        }
        if (item.id == taskName.id) {
            item.remove();
            let taskIndex = removeWhiteSpacesFromString(currentSubtasks).indexOf(taskName.id);
            currentSubtasks.splice(taskIndex, 1);
            lengthOfFirstString.splice(removeWhiteSpacesFromString(lengthOfFirstString).indexOf(taskName.id), 1);
            processedSubtaskNames.splice(removeWhiteSpacesFromString(processedSubtaskNames).indexOf(taskName.id), 1);
        }
    });
}

/**
 * Displays an edit success message with a slide-in animation.
 * After showing the message, it automatically triggers a transition back to the main board view
 * by calling the `backToBoard` function after a short delay.
 */
function editSuccessMessageSlideIn() {
    let message = document.getElementById('edit-success-message');
    message.classList.remove('d-none');
    message.style.display = 'flex';
    message.classList.add('edit-success-slide-in');
    setTimeout(backToBoard, 2000);
}

/**
Redirects to the board page post-task creation.
*/
function backToBoard() {
    clearFields();
    responsiveClearFields();
    window.location.href = 'board.html?msg=Task was created successfully';
}

/**
 * used to show the Dropdown Menu
 */
function showDropdown() {
    const dropdownContainer = document.getElementById('add-task-subtask-dropdown-container');
    const placeholderContainer = document.getElementById('placeholder');
    placeholderContainer.style.display = 'none';
    dropdownContainer.style.display = 'block';
}

/**
 * used to hide the Dropdown Menu
 */
function hideDropdown() {
    const dropdownContainer = document.getElementById('add-task-subtask-dropdown-container');
    const placeholderContainer = document.getElementById('placeholder');
    placeholderContainer.style.display = 'block';
    dropdownContainer.style.display = 'none';
}

/**
 * DEV-FUNCTION deletes the whole remote Cache with all todos to clear the Board
 * Reload needed after using this Function
 */
async function deleteALLTodos() {
    todos = [];
    await setContacts('todos', JSON.stringify(todos));
}

/**
 * used to reset Add-Task after a Task has been added
 */
function clearFields() {
    ['addtask-title', 'addtask-description', 'addtask-date', 'addtask-subtasks'].forEach(id => {
        document.getElementById(id).value = '';
    });

    const successMessage = document.getElementById('edit-success-message');
    successMessage.classList.add('d-none');
    successMessage.classList.remove('edit-success-slide-in');
    currentSubtasks = [];
    assignedUsers = [];
    document.getElementById('addtask-category').selectedIndex = 0;
    document.getElementById('assigned-user-icons').innerHTML = '';
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('add-task-subtask-dropdown-container').innerHTML = '';
    document.querySelectorAll('.btnpriority').forEach(button => {
        
        if (button.value == "medium"){
            button.classList.add('add-task-button-selected');
        } else {
            button.classList.remove('add-task-button-selected');
        }
    });
}