function contactTemplate(contact) {
    return `
    <li class="dropdown-item" onclick="toggleCheckbox(event, ${contact.contactID}); event.stopPropagation();">
        <div class="form-check p-lg-0">
            <a id="${contact['contactID']}" href="javascript:void(0);">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-10">
                        <div class="bg-color-${contact.contactColor} rounded-circle d-flex justify-content-center align-items-center height-35 width-35 color-white">${contact.contactIcon}</div>
                        <div class="color-black">${contact.contactName}</div>
                    </div>
                    <input onchange="updateAssignedUserIcons(${contact.contactID}); event.stopPropagation();" onclick="event.stopPropagation()" id="Checkme${contact.contactID}" class="form-check-input" type="checkbox" value="${contact['contactName']}">
                </div>
            </a>
        </div>
    </li>
    `;
}

function createUserIconDropdownHTML(contactID, contactName, contactColor, contactIcon) {
    return `
        <div title="${contactName}" id="${contactID}" class="rounded-circle min-height-35 min-width-35 color-white d-flex justify-content-center align-items-center margin-right-5 bg-color-${contactColor}">
            ${contactIcon}
        </div>
    `;
}

function createDropdownItemHTML(subtask) {
    const subtaskId = removeWhiteSpacesFromString(subtask);
    const subtaskText = removeComaFromString(subtask);
    return `
        <li class="custom-dropdown-item dropdown-item-hover" id="${subtaskId}">
            <div id="listItem${subtaskId}" class="custom-dropdown-item-container">
                <span class="subtask-list">${subtaskText}</span>
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="editDropdownItem('${subtaskId}')"><img src="../img/add-task/edit.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="deleteDropdownItem('${subtaskId}')"><img src="../img/add-task/trashcan.svg"></button>
                </div>
            </div>
            <div id="dropdownEdit${subtaskId}" class="custom-dropdown-item-container d-none">
                <input id="dropdownEditInput${subtaskId}" class="dropdown-edit-padding bg-color-white w-100 border-blue-bottom margin-right-negative-58">
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="deleteDropdownItem('${subtaskId}')"><img src="../img/add-task/trashcan.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="saveDropdownChanges('${subtaskId}')"><img class="height-24 width-24" src="../img/add-task/check.svg"></button>
                </div>
            </div>
        </li>
    `;
}

function createResponsiveDropdownItemHTML(contact) {
    return `
        <li class="dropdown-item" onclick="toggleAndKeepDropdownOpen(event, ${contact.contactID})">
            <div class="form-check p-lg-0">
                <a id="${contact['contactID']}" href="javascript:void(0);">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-10">
                            <div class="bg-color-${contact.contactColor} rounded-circle d-flex justify-content-center align-items-center height-35 width-35 color-white">${contact.contactIcon}</div>
                            <div class="color-black">${contact.contactName}</div>
                        </div>
                        <input onchange="updateResponsiveAssignedUserIcons(${contact.contactID})" onclick="event.stopPropagation()" id="responsiveCheckme${contact.contactID}" class="form-check-input" type="checkbox" value="${contact['contactName']}">
                    </div>
                </a>
            </div>
        </li>
    `;
}

function createUserIconHTML(user) {
    return `
    <div title="${user['contactName']}" class="rounded-circle min-height-35 min-width-35 color-white d-flex justify-content-center align-items-center margin-right-5 bg-color-${user['contactColor']}">
        ${user['contactIcon']}
    </div>
    `;
}

function createResponsiveSubtaskHTML(subtask) {
    const sanitizedId = removeWhiteSpacesFromString(subtask);
    const displayText = removeComaFromString(subtask);
    return `
        <li class="custom-dropdown-item dropdown-item-hover" id="responsive${sanitizedId}">
            <div id="responsiveListItem${sanitizedId}" class="custom-dropdown-item-container">
                <span class="responsive-subtask-list">${displayText}</span>
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="responsiveEditDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/edit.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="responsiveDeleteDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/trashcan.svg"></button>
                </div>
            </div>
            <div id="responsiveDropdownEdit${sanitizedId}" class="custom-dropdown-item-container d-none">
                <input id="responsiveDropdownEditInput${sanitizedId}" class="dropdown-edit-padding bg-color-white border-bottom-blue w-100 border-blue-bottom margin-right-negative-58">
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="responsiveDeleteDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/trashcan.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn d-flex justify-content-center align-items-center" onclick="responsiveSaveDropdownChanges('responsive${sanitizedId}')"><img class="height-24 width-24" src="../img/add-task/check.svg"></button>
                </div>
            </div>
        </li>
    `;
}

function createResponsiveSubtaskDropdownItemHTML(subtask) {
    const sanitizedId = removeWhiteSpacesFromString(subtask);
    const displayText = removeComaFromString(subtask);
    return `
        <li class="custom-dropdown-item dropdown-item-hover" id="responsive${sanitizedId}">
            <div id="responsiveListItem${sanitizedId}" class="custom-dropdown-item-container">
                <span class="responsive-subtask-list">${displayText}</span>
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn" onclick="responsiveEditDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/edit.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn" onclick="responsiveDeleteDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/trashcan.svg"></button>
                </div>
            </div>
            <div id="responsiveDropdownEdit${sanitizedId}" class="custom-dropdown-item-container d-none">
                <input id="responsiveDropdownEditInput${sanitizedId}" class="dropdown-edit-padding bg-color-white w-100 border-bottom-blue margin-right-negative-58">
                <div class="d-flex gap-4-custom">
                    <button type="button" class="dropdown-btn" onclick="responsiveDeleteDropdownItem('responsive${sanitizedId}')"><img src="../img/add-task/trashcan.svg"></button>
                    <div class="dropdown-seperator"></div>
                    <button type="button" class="dropdown-btn" onclick="responsiveSaveDropdownChanges('responsive${sanitizedId}')"><img class="height-24 width-24" src="../img/add-task/check.svg"></button>
                </div>
            </div>
        </li>
    `;
}
