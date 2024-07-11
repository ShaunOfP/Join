
/**
 * This function looks for the checked Checkboxes and generates the HTML for the checked Users
 * @param {int} userID 
 */
function boardUpdateAssignedUsers(userID) {
    let user = identifyUserViaIntegerID(userID);
    let checkbox = document.getElementById(`board-checkbox-${userID}`);
    let iconContainer = document.getElementById('edit-form-assigned-container');
  
    if (checkbox.checked == true) {
      currentEditFormDataUsers.push(user);
    } else {
      for (let i = currentEditFormDataUsers.length - 1; i >= 0; i--) {
        let boxID = cutStringFromID(checkbox.id);
        if (currentEditFormDataUsers[i][0]['contactID'] == boxID) {
          currentEditFormDataUsers.splice(i, 1);
        }
      }
    }
  
    if (currentEditFormDataUsers.length != 0) {
      iconContainer.innerHTML = ``;
      currentEditFormDataUsers.forEach(user => {
        iconContainer.innerHTML += `
          <div title="${user[0]['contactName']}" id="${user[0]['contactID']}" class="rounded-circle min-height-35 min-width-35 color-white d-flex justify-content-center align-items-center margin-right-5 bg-color-${user[0]['contactColor']}">
              ${user[0]['contactIcon']}
          </div>
          `;
      });
    }
  }
  
  
  /**
   * This function checks if a users Checkbox should be checked or unchecked
   */
  function checkUserCheckboxes() {
    currentEditFormDataUsers.forEach(users => {
      let checkbox = document.getElementById(`board-checkbox-${users[0]['contactID']}`);
      checkbox.checked = true;
    });
  }
  
  
  /**
   * Update priority selection based on user choice
   */
  function updatePriority(currentButton) {
    let prioButtons = document.querySelectorAll('.priority-button');
  
    prioButtons.forEach(button => button.classList.remove('add-task-button-selected'));
    prioButtons.forEach(button => {
      if (button.value == currentButton.value) {
        currentButton.classList.add('add-task-button-selected');
      }
    });
  }
  
  
  /**
   * Loads current assigned users.
   */
  function loadCurrentAssignedUsers() {
    if (todos[currentTaskID]['users']) {
      let idArray = (todos[currentTaskID]["users"]);
      idArray.forEach(id => {
        let data = identifyUserViaID(id, checkForResponsive(id));
  
        if (currentEditFormDataUsers == undefined) {
          currentEditFormDataUsers.push(data);
        }
        if (!currentEditFormDataUsers.some(user => user[0]['contactID'] === data[0]['contactID'])) {
          currentEditFormDataUsers.push(data);
        }
      });
    }
  }
  
  
  /**
   * This function toggles a class so that the Status Dropdown is shown or hidden
   */
  function showStatusDropdown() {
    let currentDropdownMenu = document.getElementById(`dropdown-${currentTaskID}`);
    currentDropdownMenu.classList.toggle('d-none');
  }
  
  
  /**
   * Checks if a string contains 'responsive'.
   * @param {string} string - The string to check.
   * @returns {boolean} - True if the string contains 'responsive', false otherwise.
   */
  function checkForResponsive(string) {
    if (string.includes('responsive')) {
      return true;
    } else {
      return false;
    }
  }
  
  
  /**
   * Used to get the Data from the contactData Array
   * @param {string} id The ID of the selected Checkbox
   * @returns Array from contactData with Contact Information
   */
  function identifyUserViaID(id, bool) {
    let contactID;
    if (bool == true) {
      contactID = splitStringAndKeepRest(id, 17);
    } else if (id.includes('Checkme')) {
      contactID = splitStringAndKeepRest(id, 7);
    } else {
      contactID = id[0]['contactID'];
    }
  
    return contactData.filter(contact => {
      if (contact['contactID'] == contactID) {
        return contact;
      };
    });
  }
  
  
  /**
   * Used to identify a User via its ID and return the whole Data-Array of that user
   * @param {int} userID 
   * @returns Array with Contact-Data
   */
  function identifyUserViaIntegerID(userID) {
    return contactData.filter(contact => {
      if (contact['contactID'] == userID) {
        return contact;
      };
    });
  }
  
  
  /**
   * Merges the updated data into the todos array asynchronously.
   * @param {HTMLElement} subtaskCheckbox - The checkbox element for the subtask.
   * @param {string} taskID - The ID of the task.
   */
  async function mergeUpdatedDataIntoTodos(subtaskCheckbox, taskID) {
    let updatedTodos = changeSubtaskStatus(subtaskCheckbox, taskID);
    await setItem('todos', JSON.stringify(updatedTodos));
    updateHTML();
  }
  
  
  /**
   * Retrieves the initials from a string.
   * @param {string} variable - The input string.
   * @returns {string} - The initials extracted from the input string.
   */
  function getInitials(variable) {
    return variable
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
  }
  
  
  /**
   * Updates the todos in the localStorage.
   * @returns {Promise<void>}
   */
  async function updateTodos() {
    await setItem("todos", JSON.stringify(todos));
  }
  
  
  /**
   * Deletes a todo with the specified id from the todos array and updates the localStorage.
   * @param {string} id - The id of the todo to delete.
   * @returns {Promise<void>}
   */
  async function deleteTodo(id) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
    await setItem("todos", JSON.stringify(todos));
    boardInit();
  }
  
  
  /**
   * Filters todos based on the specified id.
   * @param {string} id - The id to filter todos by.
   * @returns {Object[]} - An array containing todos with matching ids.
   */
  function filterID(id) {
    return todos.filter((todo) => {
      return todo.id == id;
    });
  }
  
  
  /**
   * Changes the image source of an edit icon based on the specified condition.
   * @param {number} x - The condition to determine which image source to set.
   * @param {HTMLElement} image - The container element containing the image to be changed.
   */
  function changeEditPic(x, image) {
    let img = image.querySelector("img");
  
    if (x == 1) {
      img.src = "../img/board/edit-blue.svg";
    }
  
    if (x == 2) {
      img.src = "../img/board/edit-grey.svg";
    }
  }
  
  
  /**
   * Changes the image source of a delete icon based on the specified condition.
   * @param {number} x - The condition to determine which image source to set.
   * @param {HTMLElement} image - The container element containing the image to be changed.
   */
  function changeDeletePic(x, image) {
    let img = image.querySelector("img");
  
    if (x == 1) {
      img.src = "../img/board/trashcan-blue.svg";
    }
  
    if (x == 2) {
      img.src = "../img/board/trashcan-grey.svg";
    }
  }
  
  
  /**
   * Redirects to the 'addtask.html' page with a specific message based on the clicked element's ID.
   * @param {HTMLElement} element - The element that triggered the function.
   */
  function moveToAddTask(element) {
    if (element.id == 'todo-to-addtask') {
      window.location.href = 'addtask.html?msg=todo';
    }
  
    if (element.id == 'progress-to-addtask') {
      window.location.href = 'addtask.html?msg=progress';
    }
  
    if (element.id == 'feedback-to-addtask') {
      window.location.href = 'addtask.html?msg=feedback';
    }
  
    if (element.id == 'done-to-addtask') {
      window.location.href = 'addtask.html?msg=done';
    }
  }
  
  
  /**
   * Capitalizes the first letter of a string.
   * @param {string} string - The input string.
   * @returns {string} - The string with the first letter capitalized.
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  
  /**
  * Changes the status of a subtask based on the checkbox state.
  * @param {HTMLElement} subtaskCheckbox - The checkbox element for the subtask.
  * @param {string} taskID - The ID of the task.
  * @returns {Array} - The updated todos array.
  */
  function changeSubtaskStatus(subtaskCheckbox, taskID) {
    let updatedTodos = todos.map(todo => {
        if (todo['id'] == taskID) {
            let subtask = todo['subtasks'].find(sub => sub['name'] == subtaskCheckbox.id);
            if (subtask) {
                subtask['subStatus'] = subtaskCheckbox.checked ? 'closed' : 'open';
            }
        }
        return todo;
    });
    return updatedTodos;
  }
  
  
  /**
  * Used to remove the "Checkme"-Part from the Checkbox-ID
  * @param {string} string The ID of the Checkbox
  * @param {integer} chunkSize always 7 because we want to get rid of the "Checkme" part of the Checkbox-ID
  * @returns 
  */
  function splitStringAndKeepRest(string, chunkSize) {
    return string.slice(chunkSize);
  }
  
  
  /**
  * This function takes the selected Status as Input and uploads it
  * @param {string} statusString from the Status Dropdown
  */
  async function changeTodoStatus(statusString) {
    todos[currentTaskID]['status'] = statusString;
    await setItem("todos", JSON.stringify(todos));
    boardInit();
    closeInfoFormPopup();
  }
  
  
  /**
  * This function modifies the Subtask so that the subStatus is added
  * @returns the updated Array
  */
  function modifyArrayToGetMerged() {
    return boardCurrentSubtasks.map(subtask => ({ 'name': subtask, 'subStatus': 'open' }));
  }
  
  
  /**
  * This function takes a string and returns it without white Spaces
  * @param {string} string 
  * @returns string without white Spaces
  */
  function boardRemoveWhiteSpacesFromString(string) {
    return string.replaceAll(" ", "");
  }
  
  
  /**
  * This function is used to take the Array with the Words from a Subtask and puts them together to form a Sentence
  * @param {object} array 
  * @returns The sentence 
  */
  function boardRemoveWhiteSpacesFromArrayStrings(array) {
    let sentence = ``;
    array.forEach(string => {
        sentence = sentence + string;
    })
    sentence = sentence.replaceAll(" ", "");
    return sentence;
  }
  
  
  /**
  * This function splits the different Parts of a Subtask into an array
  * @returns The Array with the Subtask-Words
  */
  function boardSplitSubtaskStringIntoArrays() {
    let subtaskString = [];
    let splittedString = [];
    splittedString = boardCurrentSubtasks.split(/\s/g);
    subtaskString.push(splittedString);
    return subtaskString;
  }
  
  
  /**
  * This function takes a string(an ID) and removes the first 15 Letters from it
  * @param {string} string 
  * @returns a Substring without the first 15 Letters
  */
  function cutStringFromID(string) {
    return string.substring(15);
  }