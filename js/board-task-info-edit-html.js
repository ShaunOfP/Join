function generateTaskInfoPopupHTML(task, id, categoryElement, titleElement, descriptionElement, dateElement, priorityElement, priorityImage, subtasksElement) {
    return `
        <div class="task-info-popup-header d-flex justify-between align-items-center">
            <div class="status-dropdown">
                <div class="task-info-popup-category d-flex" style="background-color:${getCategoryColor(task['category'])}" id="task-info-popup-category">
                    <div class="d-flex align-items-center gap-8 height-36">
                        <p class="margin-0">${categoryElement}</p>
                        <button type="button" onclick="showStatusDropdown()" class="height-24 width-24 justify-content-center align-items-center card-status-dropdown color-white">
                            <div class="status-dropdown-arrow"></div>
                        </button>
                    </div>
                </div>
                <div id="dropdown-${currentTaskID}" class="position-absolute d-flex d-none flex-column bg-color-special padding-5 z-1 rounded-border-all">
                    <a href="#" onclick="changeTodoStatus('todo')" class="text-center color-white blue-hover text-deco-none">To Do</a>
                    <a href="#" onclick="changeTodoStatus('progress')" class="text-center color-white blue-hover text-deco-none">In Progress</a>
                    <a href="#" onclick="changeTodoStatus('feedback')" class="text-center color-white blue-hover text-deco-none">Awaiting Feedback</a>
                    <a href="#" onclick="changeTodoStatus('done')" class="text-center color-white blue-hover text-deco-none">Done</a>
                </div>
            </div>
            <button class="x-button" type="button" onclick="closeInfoFormPopup()"></button>
        </div>
        <div id="task-info-popup-container" class="task-info-popup-container d-flex flex-column-custom gap-24">
            <div class="task-info-popup-title max-height-175 overflow-auto" id="task-info-popup-title">
                <p class="margin-0">${titleElement}</p>
            </div>
            <div class="size-20 max-height-120 overflow-auto margin-bottom" id="task-info-popup-description">
                <p class="margin-0">${descriptionElement}</p>
            </div>
            <div class="task-info-popup-date gap-25 d-flex" id="task-info-popup-date">
                <p>Due date: </p>
                <p>${dateElement}</p>
            </div>
            <div class="d-flex align-items-center size-20 gap-25" id="task-info-popup-priority">
                <p>Priority: </p>
                <p>${priorityElement} <img src="../img/icons/${priorityImage}.svg" alt="${task.priority}"></p>
            </div>
            <div class="d-flex-column size-20" id="task-info-popup-users">
                <p class="height-24">Assigned To:</p>
                <div id="task-info-popup-assigned-users" class="max-height-84 gap-11 overflow-y-auto"></div>
            </div>
            <div class="task-info-popup-subtask size-20" id="task-info-popup-subtasks">
                <p class="margin-0">Subtasks</p>
                <div class="max-height-120 margin-0 overflow-y-auto" id="edit-subtask-element-container">${populateSubtasksToInfoPopup(subtasksElement, task)}</div>
            </div>
        </div>
        <div class="task-info-popup-buttons d-flex justify-content-end align-items-center gap-16">
            <div class="deletebutton d-flex g-2" onclick="deleteTodo(${id}); closeInfoFormPopup(); updateHTML();" onmouseover="changeDeletePic(1, this)" 
            onmouseout="changeDeletePic(2, this)" class="hover d-flex gap-4"> 
                <img class="height-24 width-24 scale-down" src="../img/board/trashcan-grey.svg">
                <p class="margin-0 size-16 weight-400">Delete</p>
            </div>
            <div class="search-seperator"></div>
            <div class="editbutton d-flex g-2" onclick="showEditFormPopup();" onmouseover="changeEditPic(1, this)"
            onmouseout="changeEditPic(2, this)" class="hover d-flex gap-2">
                <img class="height-24 width-24 scale-down" src="../img/board/edit-grey.svg">
                <p class="margin-0 size-16 weight-400">Edit</p>
            </div>
        </div>
    `;
}

function generateUserHTML(userArray) {
    return `
        <div class="task-info-popup-usernames d-flex justify-content-start align-items-center">
            <div class="board-task-popup-user bg-color-${userArray[0]['contactColor']}" id="task-info-popup-users">${userArray[0]['contactIcon']}</div>
            <div class="task-info-popup-users">${userArray[0]['contactName']}</div>
        </div>
    `;
}

function generateSubtaskHTML(subtask, taskId) {
    if (subtask['subStatus'] == 'open') {
        return `
            <div class="d-flex justify-content-start align-items-center subtask-hover">
                <input id="${subtask['name']}" type="checkbox" onchange="mergeUpdatedDataIntoTodos(this, ${taskId})">
                <div class="task-info-popup-users">${subtask['name']}</div>
            </div>
        `;
    } else {
        return `
            <div class="d-flex justify-content-start align-items-center subtask-hover">
                <input id="${subtask['name']}" checked="checked" type="checkbox" onchange="mergeUpdatedDataIntoTodos(this, ${taskId})">
                <div class="task-info-popup-users">${subtask['name']}</div>
            </div>
        `;
    }
}

function generateEditTaskFormHTML() {
    return `
        <div class="task-info-popup-header d-flex justify-content-end align-items-center margin-bottom-24">
            <button class="x-button" type="button" onclick="closeEditFormPopup()"></button>
        </div>
        <div id="task-info-popup-container" class="task-info-popup-container height-697 overflow-auto d-flex flex-column-custom gap-24">
            <div class="d-flex flex-column-custom gap-16">
                <div>
                    <p class="margin-0 size-20">Title</p>
                    <input id="edit-form-title-input" class="w-95 size-20 padding-12-21 border-radius-10 border-1-solid-grey" required value="${todos[currentTaskID].title}">
                </div>
                <div>
                    <p class="margin-0 size-20">Description</p>
                    <textarea id="edit-form-description-input" class="w-95 size-21 padding-18-16 border-radius-10 border-1-solid-grey">${todos[currentTaskID].description}</textarea>
                </div>
                <div>
                    <p class="margin-0 size-20">Due date</p>
                    <input id="edit-form-date-input" type="date" required class="w-95 border-radius-10 size-20 padding-12-16 border-1-solid-grey" value="${todos[currentTaskID].date}">
                </div>
            </div>
            <div class="d-flex flex-column-custom gap-8">
                <p class="margin-0 size-19 weight-700 color-special">Priority</p>
                <div class="w-95 d-flex align-items-center gap-16 responsive-button-area-layout">
                    <button type="button"
                    class="priority-button add-task-buttons add-task-button-selected d-flex align-items-center justify-content-center urgent-selected selected-priority"
                    value="urgent" onclick="updatePriority(this)">Urgent
                        <img src="../img/icons/urgenticon.svg" alt="">
                    </button>
                    <button type="button"
                    class="priority-button add-task-buttons d-flex align-items-center justify-content-center medium-selected"
                    value="medium" onclick="updatePriority(this)">Medium
                        <img src="../img/icons/mediumicon.svg" alt="">
                    </button>
                    <button type="button"
                    class="priority-button add-task-buttons d-flex align-items-center justify-content-center low-selected"
                    value="low" onclick="updatePriority(this)">Low
                        <img src="../img/icons/lowicon.svg" alt="">
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column-custom gap-8">
                <p class="margin-0 size-20">Assigned to</p>
                <div class="dropdown">
                    <button onclick="toggleDropdown()" class="form-select text-align-left w-95 box-shadow-none" id="dropdrownMenuButton" type="button">Select contacts to assign</button>
                    <ul id="edit-form-dropdown-container" class="dropdown-menu flex-column-custom overflow-auto height-160 w-95"></ul>
                </div>
                <div id="edit-form-assigned-container" class="w-95 padding-top-5 padding-bottom-5 d-flex gap-8 overflow-auto"></div>
            </div>
            <div class="w-95">
                <div>
                    <p class="margin-0 size-20">Subtasks</p>
                    <div class="d-flex align-items-center">
                        <input id="edit-new-subtask-value" class="w-100 border-radius-10 border-1-solid-grey padding-12-16" placeholder="Add a new subtask">
                        <img class="margin-left-negative-40 add-subtask rounded-circle" onclick="addNewSubtaskToEditTaskForm()" src="../img/board/plus-grey.svg">
                    </div>
                </div>
                <div id="edit-subtask-container" class="padding-top-5"></div>
            </div>
            <div class="d-flex justify-content-end position-sticky bottom-0 padding-top-10 bg-color-white width-525-custom responsive-submit-button-div">
                <button class="d-flex gap-4-custom padding-16 border-none align-items-center justify-content-center bg-color-special color-white border-radius-10 height-57 width-89 responsive-margin-right-5" type="submit">Ok <img src="../img/board/check-white.svg"></button>
            </div>
        </div>
    `;
}

function generateContactDropdownHTML(contact) {
    return `
        <li class="dropdown-item d-flex justify-content-between">
            <div class="d-flex align-items-center gap-4-custom">
                <div class="min-height-42 min-width-42 max-width-42 bg-color-${contact['contactColor']} color-white rounded-circle d-flex justify-content-center align-items-center">
                    ${contact['contactIcon']}
                </div>
                <div class="responsive-max-width-94 responsive-overflow-auto">
                    ${contact['contactName']}
                </div>
            </div>
            <input id="board-checkbox-${contact['contactID']}" type="checkbox" onchange="boardUpdateAssignedUsers(${contact['contactID']})">
        </li>
    `;
}

function generateEditFormDropdownItemHTML(contact) {
    return `
        <li class="dropdown-item d-flex justify-content-between">
            <div class="d-flex align-items-center gap-4-custom">
                <div class="min-height-42 min-width-42 max-width-42 bg-color-${contact['contactColor']} color-white rounded-circle d-flex justify-content-center align-items-center">
                    ${contact['contactIcon']}
                </div>
                <div class="responsive-max-width-94 responsive-overflow-auto">
                    ${contact['contactName']}
                </div>
            </div>
            <input id="board-checkbox-${contact['contactID']}" type="checkbox" onchange="boardUpdateAssignedUsers(${contact['contactID']})">
        </li>
    `;
}

function generateSubtaskEditFormHTML(subtask) {
    return `
        <div id="${boardRemoveWhiteSpacesFromString(subtask)}container" class="d-flex padding-6-16 subtask-hover border-radius-10" onmouseenter="changeEnterDisplayClassValue(${boardRemoveWhiteSpacesFromString(subtask)})" onmouseleave="changeLeaveDisplayClassValue(${boardRemoveWhiteSpacesFromString(subtask)})">
            <div id="subtask${boardRemoveWhiteSpacesFromString(subtask)}" class="d-flex justify-content-between w-100">
                <div class="d-flex gap-4-custom">
                    <div class="d-flex justify-content-center align-items-center">•</div>
                    <div>${subtask}</div>
                </div>
                <div id="${boardRemoveWhiteSpacesFromString(subtask)}" class="d-flex gap-8 hidden responsive-align-items-center">
                    <img class="hover height-24 width-24 scale-down" src="../img/board/edit-grey.svg" onclick="showEditSubtaskEditForm(${boardRemoveWhiteSpacesFromString(subtask)})">
                    <div class="height-24 border-1-solid-grey"></div>
                    <img class="hover height-24 width-24 scale-down" src="../img/board/trashcan-grey.svg" onclick="deleteSubtaskEditForm(${boardRemoveWhiteSpacesFromString(subtask)})">
                </div>
            </div>
            <div id="editSubtask${boardRemoveWhiteSpacesFromString(subtask)}" class="d-none w-100">
                <input id="newSubtask${boardRemoveWhiteSpacesFromString(subtask)}" class="w-100 border-blue-bottom bg-color-white padding-4-16" value="${subtask}">
                <div class="d-flex gap-4-custom margin-left-negative-67 align-items-center">
                    <img class="subtask-hover rounded-circle height-24 width-24 scale-down" src="../img/board/trashcan-grey.svg" onclick="deleteSubtaskEditForm(${boardRemoveWhiteSpacesFromString(subtask)})">
                    <div class="border-1-solid-grey height-24"></div>
                    <img class="subtask-hover rounded-circle height-24 width-24" src="../img/board/check-grey.svg" onclick="saveNewSubtaskEditForm(${boardRemoveWhiteSpacesFromString(subtask)})">
                </div>
            </div>
        </div>
    `;
}

function generateDropdownItemHTML(contact) {
    return `
        <li class="dropdown-item">
            <div class="form-check p-lg-0">
                <a id="${contact['contactID']}">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-10">
                            <div class="bg-color-${contact.contactColor} rounded-circle d-flex justify-content-center align-items-center height-35 width-35 color-white">${contact.contactIcon}</div>
                            <div class="color-black">${contact.contactName}</div>
                        </div>
                        <input onchange="updateAssignedUserIcons(${contact.contactID})" id="Checkme${contact.contactID}" class="form-check-input" type="checkbox" value="${contact['contactName']}">
                    </div>
                </a>
            </div>
        </li>
    `;
}

function generateAssignedUserIconHTML(user) {
    return `
        <div class="min-height-42 min-width-42 max-width-42 rounded-circle color-white bg-color-${user[0]['contactColor']} d-flex justify-content-center align-items-center" title="${user[0]['contactName']}">
            ${user[0]['contactIcon']}
        </div>
    `;
}