/**
 * This function Generates the HTML to render the Contacts into the responsive Contactlist by looping through the Entries within each Letter
 */
function renderResponsiveContacts() {
    let responsiveContactList = document.getElementById('responsive-contact-container');

    responsiveContactList.innerHTML = ``;

    for (let j = 0; j < filterLetters.length; j++) {
        responsiveContactList.innerHTML += `
            <div class="height-58 max-width-352 w-100 d-flex justify-content-start align-items-center gap-8 padding-left-35 size-20">
                ${filterLetters[j]}
            </div>
            <div class="height-16 max-width-352 d-flex justify-content-center gap-10 w-100">
                <img class="height-2 width-300" src="../img/contact/grey-line.svg">
            </div>
        `;

        for (let i = 0; i < contactData.length; i++) {
            if (contactData[i]['contactName'].charAt(0).toUpperCase() == filterLetters[j]) {
                responsiveContactList.innerHTML += `
                    <a id="${contactData[i]['contactID']}" class="deco-none contact-card" href="javascript:showResponsiveContactInfo(${contactData[i]['contactID']})">
                        <div class="bg-color-${contactData[i]['contactColor']} rounded-circle d-flex justify-content-center align-items-center height-35 min-width-35 color-white">
                            <div>${contactData[i]['contactIcon']}</div>
                        </div>
                        <div>
                            <div class="color-black">${contactData[i]['contactName']}</div>
                            <div class="color-blue">${contactData[i]['contactMail']}</div>
                        </div>
                    </a>
                `;
            }
        }
    }
}


/**
 * This function removes and adds classes to show the responsive Contact-Information.
 * It also updates the global Variable currentResponsiveID.
 * @param {integer} userID The ID of the current Contact.
 */
function showResponsiveContactInfo(userID) {
    document.getElementById('responsive-contact-list').classList.remove('responsive-contact-list');
    document.getElementById('responsive-contact-list').classList.remove('d-flex');
    document.getElementById('responsive-contact-list').classList.add('dp-none');
    document.getElementById('responsive-contact-details').classList.remove('d-none');
    document.getElementById('responsive-contact-details').classList.remove('dp-none');
    document.getElementById('responsive-contact-details').style.display == 'flex';

    currentResponsiveID = userID;

    generateResponsiveContactDetails();
}


/**
 * This function changes classes so that the Contact Info is removed and the Contact List is shown again.
 */
function closeResponsiveContactInfo() {
    document.getElementById('responsive-contact-details').classList.add('d-none');
    document.getElementById('responsive-contact-list').classList.remove('dp-none');
    document.getElementById('responsive-contact-list').classList.add('responsive-contact-list');
    document.getElementById('responsive-contact-list').classList.add('d-flex');
}


/**
 * This function first fetches the currently selected Contact-Data and generates the HTML for
 * Details afterwards.
 */
function generateResponsiveContactDetails() {
    let container = document.getElementById('responsive-contact-details');
    let currentContact = identifyUser(currentResponsiveID);
    container.innerHTML = ``;
    container.innerHTML = `
    <a class="position-absolute height-32 width-32 right-20 top-128" href="javascript:showResponsiveContactList(); javascript:responsiveDotsSlideOut()">
        <img src="../img/contact/blue-arrow.svg">
    </a>
    <div class="d-flex row gap-45 margin-right-0" onclick="responsiveDotsSlideOut()">
        <header class="d-flex row gap-16">
            <div class="size-47 weight-700">Contacts</div>
            <p class="margin-0 weight-400 size-20">Better with a team</p>
            <div class="border-color-special-blue width-90"></div>
        </header>
        <div class="d-flex row gap-21">
            <div class="d-flex gap-20">
                <div class="height-80 min-width-80 rounded-circle bg-color-${currentContact[0]['contactColor']} d-flex justify-content-center align-items-center border-white-3 color-white size-27 weight-500">
                    ${currentContact[0]['contactIcon']}
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <span class="size-36 weight-700">${currentContact[0]['contactName']}</span>
                </div>
            </div>
            <span class="size-20 weight-400">Contact Information</span>
            <div class="d-flex row gap-15">
                <span class="weight-700 size-16">Email</span>
                <span class="size-16 color-blue-special deco-none">${currentContact[0]['contactMail']}</span>
            </div>
            <div class="d-flex row gap-15">
                <span class="weight-700 size-16">Phone</span>
                <span class="size-16">${currentContact[0]['contactPhoneNumber']}</span>
            </div>
        </div>
    </div>
    <a onclick="changeContactDetailsDotsBackground(this); responsiveDotsSlideIn()" id="dots-trigger" class="bg-color-special hover rounded-circle d-flex justify-content-center align-items-center position-fixed right-20 bottom-110 height-56 width-56">
        <img id="dots-trigger-img" src="../img/contact/dots.svg">
    </a>
    `;
}


/**
 * This function is used to display the List with the Contacts and updates this List afterwards.
 */
function showResponsiveContactList() {
    document.getElementById('responsive-contact-details').style.display == 'none';
    document.getElementById('responsive-contact-details').classList.add('d-none');
    document.getElementById('responsive-contact-list').classList.remove('dp-none');
    document.getElementById('responsive-contact-list').classList.add('d-flex');
    initContacts();
}


/**
 * This function is used to add a new Contact from the Inputs of the Add-New-Contact-Form.
 * It assigns the Value inside the Input Fields to the matching Key in the contactData-Array,
 * uploads it to the server and shows a Success Message.
 */
async function responsiveAddContact() {
    let newResponsiveName = document.getElementById('responsiveInputName').value;
    let newResponsiveMail = document.getElementById('responsiveInputMail').value;
    let newResponsivePhoneNumber = document.getElementById('responsiveInputPhoneNumber').value;
    let responsiveIcon = createIcons(newResponsiveName);
    contactData.push({
        contactName: newResponsiveName,
        contactMail: newResponsiveMail,
        contactPhoneNumber: newResponsivePhoneNumber,
        contactIcon: responsiveIcon,
        contactID: generateRandomID(),
        contactColor: getColor()
    });
    await updateServerArray();
    responsiveResetAddContactForm();
    closeResponsiveAddContactForm();
    sortContactData();
    responsiveSuccessMsgAddSlideIn();
}


/**
 * This function resets the Input-Fields on the Add-New-Contact-Form.
 */
function responsiveResetAddContactForm() {
    let newResponsiveName = document.getElementById('responsiveInputName');
    let newResponsiveMail = document.getElementById('responsiveInputMail');
    let newResponsivePhoneNumber = document.getElementById('responsiveInputPhoneNumber');
    newResponsiveName.value = ``;
    newResponsiveMail.value = ``;
    newResponsivePhoneNumber.value = ``;
    initContacts();
}


/**
 * This function is used to display the Success-Message for the successful Creation of a new Contact.
 */
function responsiveSuccessMsgAddSlideIn() {
    let successMessage = document.getElementById('responsive-success-message');
    successMessage.classList.remove('responsive-animation-slideOut');
    successMessage.style.display = 'inline';
    successMessage.classList.add('responsive-animation-slideIn');
    setTimeout(responsiveSuccessMsgAddSlideOut, 1000);
}


/**
 * This function is used to let the displayed Success-Message slide out of the Frame.
 */
function responsiveSuccessMsgAddSlideOut() {
    let successMessage = document.getElementById('responsive-success-message');
    successMessage.classList.remove(`responsive-animation-slideIn`);
    successMessage.classList.add(`responsive-animation-slideOut`);
    setTimeout(() => {
        successMessage.style.display = `none`;
    }, 450);
}


/**
 * This function displays the Menu for editing/deleting a contact
 */
function responsiveDotsSlideIn() {
    let dotsMenu = document.getElementById('dots-menu');
    dotsMenu.classList.remove('responsive-dots-slide-out');
    dotsMenu.classList.remove('dp-none');
    dotsMenu.style.display = 'flex';
    dotsMenu.classList.add('responsive-dots-slide-in');
}


/**
 * This function is used to hide the Menu for editing/deleting a contact
 */
function responsiveDotsSlideOut() {
    let dotsMenu = document.getElementById('dots-menu');
    dotsMenu.classList.remove(`responsive-dots-slide-in`);
    dotsMenu.classList.add(`responsive-dots-slide-out`);
    setTimeout(() => {
        dotsMenu.style.display = `none`;
        dotsMenu.classList.add('dp-none');
    }, 150);
}


/**
 * This function changes the background-color of the Add-Contact-Circle-Menu
 * @param {object} element The circle itself
 */
function changeAddContactImageBackgroundColor(element) {
    element.classList.remove('bg-color-special');
    element.classList.add('bg-color-babyblue');
}


/**
 * This function changes the background-color of the Editing/Delete-Circle-Menu
 * @param {object} element The circle itself
 */
function changeContactDetailsDotsBackground(element) {
    element.classList.remove('bg-color-special');
    element.classList.add('bg-color-babyblue');
}


/**
 * This function is used to make the Add-Contact-Form visible using a Slide-Up-Animation
 */
function showResponsiveAddContact() {
    let addContactContainer = document.getElementById('responsiveAddContact');
    addContactContainer.classList.remove('responsive-add-contact-slide-out');
    addContactContainer.classList.remove('dp-none');
    addContactContainer.classList.remove('d-none');
    addContactContainer.classList.add('responsive-add-contact-slide-in');
}


/**
 * This function is used to hide the Add-Contact-Form using a Slide-Down-Animation
 */
function closeResponsiveAddContactForm() {
    let addContactContainer = document.getElementById('responsiveAddContact');
    addContactContainer.classList.remove('responsive-add-contact-slide-in');
    addContactContainer.classList.add('responsive-add-contact-slide-out');
    setTimeout(() => {
        addContactContainer.classList.add('dp-none');
    }, 1000);
}


/**
 * This function makes the Editing-Form visible using a Slide-Up-Animation
 */
function showResponsiveEditForm() {
    let editContainer = document.getElementById('responsiveEditContact');
    editContainer.classList.remove('responsive-add-contact-slide-out');
    editContainer.classList.remove('dp-none');
    editContainer.classList.add('responsive-add-contact-slide-in');
    generateResponsiveEditFormHTML();
    responsiveFillEditInputFields();
}


/**
 * This function is used to hide the Editing-Form using a Slide-Down-Animation
 */
function closeResponsiveEditForm() {
    let editContainer = document.getElementById('responsiveEditContact');
    editContainer.classList.remove('responsive-add-contact-slide-in');
    editContainer.classList.add('responsive-add-contact-slide-out');
    setTimeout(() => {
        editContainer.classList.add('dp-none');
    }, 1000);
}


/**
 * This function fills the Editing-Form Input-Fields with the Data from the currently selected Contact
 */
function responsiveFillEditInputFields() {
    let currentContact = identifyUser(currentResponsiveID);
    let nameInputField = document.getElementById('responsiveEditInputName');
    let mailInputField = document.getElementById('responsiveEditInputMail');
    let phoneNumberInputField = document.getElementById('responsiveEditInputPhoneNumber');
    nameInputField.value = `${currentContact[0]['contactName']}`;
    mailInputField.value = `${currentContact[0]['contactMail']}`;
    phoneNumberInputField.value = `${currentContact[0]['contactPhoneNumber']}`;
}


/**
 * This function generates the HTML for the Editing-Form
 */
function generateResponsiveEditFormHTML() {
    let editContainer = document.getElementById('responsiveEditContact');
    let currentContact = identifyUser(currentResponsiveID);
    editContainer.innerHTML = ``;
    editContainer.innerHTML = `
    <div class="height-full width-full d-flex justify-content-center align-items-center">
        <div class="position-absolute">
            <div class="position-relative height-120 width-120 top-negative-30 d-flex justify-content-center align-items-center bg-color-${currentContact[0]['contactColor']} rounded-circle border-width-3 border-white">
                <div class="size-47 weight-500 color-white">${currentContact[0]['contactIcon']}</div>
            </div>
        </div>
        <form id="responsive-edit-contact-form" class="height-760 max-width-396 responsive-border-style w-100" onsubmit="responsiveSaveChanges(); return false;">
            <div class="height-352 max-width-396 bg-color-special d-flex justify-content-around align-items-start border-rounded-top flex-column padding-20 margin-left-right-10">
                <a class="d-flex justify-content-end w-100">
                    <img class="hover" onclick="closeResponsiveEditForm()" src="../img/contact/close-white.svg">
                </a>
                <div class="d-flex flex-column justify-content-center align-items-start">
                    <span id="edit-contact-h2" class="color-white size-47 weight-700">Edit contact</span>
                    <div class="border-color-special-blue width-90 margin-0"></div>
                </div>
                <div class="w-100 height-2"> </div>
            </div>

            <div class="height-408 max-width-396 bg-color-white border-rounded-bottom bg-color-white d-flex flex-column justify-content-evenly align-items-center padding-top-20 margin-left-right-10">
                <div class="d-flex flex-column gap-15 max-width-364 w-90">
                    <div class="height-41 w-100 d-flex">
                        <input class="form-control height-41 border-color-grey input-padding"
                        id="responsiveEditInputName" type="text" placeholder="Name" required="required">
                        <img class="margin-left-negative-44" src="../img/contact/person.svg">
                    </div>
                    <div class="height-41 w-100 d-flex">
                        <input class="form-control height-41 border-color-grey input-padding"
                        id="responsiveEditInputMail" type="email" placeholder="Email" required="required">
                        <img class="margin-left-negative-42" src="../img/contact/mail.svg">
                    </div>
                    <div class="height-41 w-100 d-flex">
                        <input class="form-control height-41 border-color-grey input-padding"
                        id="responsiveEditInputPhoneNumber" type="tel" placeholder="Phone" required="required">
                        <img class="margin-left-negative-42" src="../img/contact/call.svg">
                    </div>
                    <div class="w-100">
                        <p id="responsive-edit-error-field" class="color-red margin-top-negative-15 margin-bottom-negative-25 font-size-14"></p>
                    </div>
                </div>
                <div class="d-flex gap-18">
                    <button class="bg-color-white d-flex justify-content-center align-items-center btn border-black" onclick="responsiveDeleteContact()">
                        <p class="margin-0 color-black size-20 weight-400">Delete</p>
                    </button>
                    <button class="bg-color-special d-flex justify-content-center align-items-center gap-4-px btn btn-primary border-color-special color-white" type="submit">
                        <p class="weight-700 size-21 margin-0">Save</p>
                        <img src="../img/contact/check.svg">
                    </button>
                </div>
            </div>
        </form>
    </div>
    `;
}


/**
 * This function overwrites the current Data on the selected Contact and uploads them to the server
 */
async function responsiveSaveChanges() {
    let currentContact = contactData.find(getResponsiveIDInfo);
    let nameInputField = document.getElementById('responsiveEditInputName');
    let mailInputField = document.getElementById('responsiveEditInputMail');
    let phoneNumberInputField = document.getElementById('responsiveEditInputPhoneNumber');
    let errorField = document.getElementById('responsive-edit-error-field');
    if (!validateUserInput(phoneNumberInputField.value)) {
        errorField.innerHTML = `Phone number can't contain Letters`;
        return;
    } else {
        currentContact.contactName = nameInputField.value;
        currentContact.contactMail = mailInputField.value;
        currentContact.contactPhoneNumber = phoneNumberInputField.value;
        currentContact.contactIcon = createIcons(nameInputField.value);
        errorField.innerHTML = ``;
        await updateServerArray();
        resetResponsiveEditForm();
        closeResponsiveEditForm();
        initContacts();
        showResponsiveContactInfo(currentResponsiveID);
    }
}


/**
 * This function clears the Input-Fields on the Editing-Form
 */
function resetResponsiveEditForm() {
    let nameInputField = document.getElementById('responsiveEditInputName');
    let mailInputField = document.getElementById('responsiveEditInputMail');
    let phoneNumberInputField = document.getElementById('responsiveEditInputPhoneNumber');
    nameInputField.value = ``;
    mailInputField.value = ``;
    phoneNumberInputField.value = ``;
}


/**
 * This function is used to delete a contact
 */
async function responsiveDeleteContact() {
    let arrayIndex = contactData.findIndex(getResponsiveIDInfo);
    contactData.splice(arrayIndex, 1);
    await updateServerArray();
    closeResponsiveEditForm();
    initContacts();
    responsiveDotsSlideOut();
    closeResponsiveContactInfo();
}


/**
 * This function compares the contact-id's with the currentResponsiveID to find the matching contact
 * @param {object} contact A JSON-Array with the Contact Data
 * @returns the Array index
 */
function getResponsiveIDInfo(contact) {
    return contact.contactID == currentResponsiveID;
}


/**
 * This is used to close the Dots-menu on the Contact-Info page
 */
document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (e) {
        const dotsMenuTrigger = document.querySelector('#dots-trigger');
        const dotsMenuTriggerImg = document.querySelector('#dots-trigger-img');
        const detailsSite = document.querySelector('#responsive-contact-details');
        if (detailsSite.contains(e.target) && (e.target !== dotsMenuTrigger && e.target !== dotsMenuTriggerImg)) {
            responsiveDotsSlideOut();
        }
    });
});