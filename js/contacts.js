let filterLetters = [];
let currentID;
let currentResponsiveID;

/**
 * initContacts initializes the Main components of the Contacts-File
 * First it gets the Data (JSON-Array) from the DA-Server,
 * then it calls the addLetterToArray-Function to generate the Letter-Sections
 * and then it renders the Contact-Cards to the Document
 */
async function initContacts() {
    await loadContactData();
    addLetterToArray();
    renderContacts();
    renderResponsiveContacts();
}


/**
 * Generates the HTML to render the Contacts into the Contact List by looping through the Entries within each Letter
 */
function renderContacts() {
    let contactList = document.getElementById('contact-list-entries-container');
    contactList.innerHTML = '';

    for (let j = 0; j < filterLetters.length; j++) {
        contactList.innerHTML += generateContactListLetter(filterLetters[j]);
        for (let i = 0; i < contactData.length; i++) {
            if (contactData[i]['contactName'].charAt(0).toUpperCase() == filterLetters[j]) {
                contactList.innerHTML += generateContactListContacts(contactData[i]);
            }
        }
    }
}


/**
 * This returns the HTML for the Contact List Header-Letters
 * @param {string} letter 
 * @returns HTML
 */
function generateContactListLetter(letter){
    return `
    <div class="height-58 width-352 d-flex justify-content-start align-items-center gap-8 padding-left-35 size-20">
        ${letter}
    </div>
    <div class="height-16 width-352 d-flex gap-10">
        <img src="../img/contact/grey-line.svg">
    </div>
`;
}


/**
 * This returns the HTML for the Contacts in the Contact-List
 * @param {array} contact 
 * @returns HTML
 */
function generateContactListContacts(contact){
    return `
    <a id="${contact['contactID']}" onclick="stayClicked(${contact['contactID']})" class="deco-none contact-card">
        <div class="bg-color-${contact['contactColor']} rounded-circle d-flex justify-content-center align-items-center height-35 width-35 color-white">
            <div>${contact['contactIcon']}</div>
        </div>
        <div>
            <div class="color-black">${contact['contactName']}</div>
            <div class="color-blue">${contact['contactMail']}</div>
        </div>
    </a>
`;
}


/**
 * This Function compares the Parameter "id" to the global currentID. Therefore it determines,
 * if a Contact is clicked and should be highlighted as such, if the global Variable should be cleared,
 * because no Contact is selected, or if the seleckted Contact should no longer be highlighted.
 * @param {integer} id A uniqe User ID
 */
function stayClicked(id) {
    let currentContact = document.getElementById(id);
    let nameDiv = currentContact.getElementsByTagName('div');

    if (currentID == id) {
        unclickCurrentElement(id);
        return;
    }

    if (currentID == null) {
        currentID = id;
    }

    if (currentID != id) {
        removeClickedStatusFromOldElement();
    }

    loadContactInfo(id);
    currentID = id;
    nameDiv[3].classList.add('color-white');
    nameDiv[0].classList.add('border-white-2');
    currentContact.classList.add('bg-color-special');
}


/**
 * Used to remove the Highlight-Effects from a selected Contact when it is clicked again
 * @param {integer} id to identify the current clicked Contact
 */
function unclickCurrentElement(id) {
    let currentContact = document.getElementById(id);
    let nameDiv = currentContact.getElementsByTagName('div');
    let detailSection = document.getElementById('contact-information-container');

    nameDiv[3].classList.remove('color-white');
    nameDiv[0].classList.remove('border-white-2');
    currentContact.classList.remove('bg-color-special');
    detailSection.classList.remove('animation-info-in-from-right');
    resetDetailSection();
    currentID = null;
}


/**
 * Used to remove the Highlight-Effects from another Contact when a new Contact is clicked
 */
function removeClickedStatusFromOldElement(){
    let oldContact = document.getElementById(currentID);
        try {
            oldContact.classList.remove('bg-color-special');
            oldContact.classList.remove('animation-info-in-from-right');
        } catch (e) { }

        try {
            let nameDiv = oldContact.getElementsByTagName('div');
            nameDiv[3].classList.remove('color-white');
            nameDiv[0].classList.remove('border-white-2');
        } catch (e) { }
}


/**
 * resetRemoteCache is used to clear the Cache on the Server, so it deletes all Contact-Entries
 * Use with caution
 */
async function resetRemoteCache() {
    contactData = [];
    await setContacts('contacts', JSON.stringify(contactData));
}


/**
 * Assigns the Value inside the Input Fields to the matching Key in the contactData-Array,
 * uploads it to the server and shows a Success Message.
 */
async function addNewContact() {
    let newName = document.getElementById('newContactName').value;
    let newMail = document.getElementById('newContactMail').value;
    let newPhoneNumber = document.getElementById('newContactPhoneNumber').value;
    let icon = createIcons(newName);
    contactData.push({
        contactName: newName,
        contactMail: newMail,
        contactPhoneNumber: newPhoneNumber,
        contactIcon: icon,
        contactID: generateRandomID(),
        contactColor: getColor()
    });
    await updateServerArray();
    resetAddContactForm();
    closeAddContactForm();
    sortContactData();
    successMsgAddSlideIn();
}


/**
 * This function changes the style of the Message Box and adds the right animation. Then it calls
 * the successMsgAddSlideOut-Function.
 */
function successMsgAddSlideIn() {
    let msgBox = document.getElementById(`success-message`);
    msgBox.style.display = 'inline';
    msgBox.classList.remove('success-animation-slide-out');
    msgBox.classList.add(`success-animation-slide-in`);
    setTimeout(successMsgAddSlideOut, 1000);
}



/**
 * This function removes the Slide-In-Animation and adds the Slide-Out-Animation for the Message Box.
 * After the Slide-Out it removes the Message Box.
 */
function successMsgAddSlideOut() {
    let msgBox = document.getElementById(`success-message`);
    msgBox.classList.remove(`success-animation-slide-in`);
    msgBox.classList.add(`success-animation-slide-out`);
    setTimeout(() => {
        msgBox.style.display = `none`;
    }, 150);
}


/**
 * Generates a random color from an Array for the User
 * @returns the Color, which will be used as the Background-Color for the UserIcon
 */
function getColor() {
    let colors = ['green', 'blue', 'yellow', 'purple', 'orange'];
    let randomColor = Math.floor(Math.random() * colors.length);
    return colors[randomColor];
}


/**
 * This generates the Icon, which will be Displayed for the User on various objects
 * @param {string} cName The Username
 * @returns the Icon of the User aka the first Letter(s) from the Name (and Surname)
 */
function createIcons(cName) {
    let icon;

    if (cName.indexOf(' ') != 0) {
        let match = cName.match(/\b(\w)/g);
        let acronym = match.join('');
        icon = acronym.toUpperCase();
        return icon;
    } else {
        icon = cName.charAt(0).toUpperCase();
        return icon;
    }
}


/**
 * This function generates a random Id for the User. The ID is a random number from the Date.now()-Function,
 * which returns the number of milliseconds since January 1, 1970.
 * @returns a random ID as Integer
 */
function generateRandomID() {
    let randomID = Math.floor(Math.random() * Date.now());
    return randomID;
}


/**
 * This Function adds the first Letter of the User's first Name to an Array, to generate a new Section-Head with the Letter.
 * If the Letter already exists it will do nothing. The Letters are sorted in the end.
 */
function addLetterToArray() {
    filterLetters = [];
    contactData.forEach((contactName) => {
        let letter = contactName.contactName.charAt(0);
        letter = letter.toUpperCase();

        if (!filterLetters.includes(letter)) {
            filterLetters.push(letter);
        }
    });
    filterLetters.sort();
}


/**
 * This resets the Values of the Input-Fields from the AddContact-Form.
 */
function resetAddContactForm() {
    let newName = document.getElementById('newContactName');
    let newMail = document.getElementById('newContactMail');
    let newPhoneNumber = document.getElementById('newContactPhoneNumber');
    newName.value = '';
    newMail.value = '';
    newPhoneNumber.value = '';
    addLetterToArray();
    initContacts();
}


/**
 * This function first tries to remove the Animation-Class. If it's not available it
 * will continue to change the display style. Then it adds the Slide-In-Animation.
 */
function showAddContactForm() {
    let contactFormBG = document.getElementById('form-bg');
    let contactForm = document.getElementById('add-contact-container');

    try {
        contactForm.classList.remove('animation-slideout');
    } catch (e) {

    }

    contactFormBG.style.display = 'inline';
    contactForm.classList.add('animation-slidein');
}


/**
 * Here the Slide-In-Animation is removed and the Slide-Out-Animation is added. After .2 seconds the Form get's removed.
 */
function closeAddContactForm() {
    let contactFormBG = document.getElementById('form-bg');
    let contactForm = document.getElementById('add-contact-container');
    contactForm.classList.remove('animation-slidein');
    contactForm.classList.add('animation-slideout');
    setTimeout(() => contactFormBG.style.display = 'none', 200);
}


/**
 * This function first tries to remove the Animation-Class. If it's not available it
 * will continue to change the display style. Then it adds the Slide-In-Animation.
 */
function showEditContactForm() {
    let contactFormBG = document.getElementById('edit-form');
    let contactForm = document.getElementById('edit-contact-container');

    try {
        contactForm.classList.remove('animation-slideout');
    } catch (e) {

    }

    contactFormBG.style.display = 'inline';
    contactForm.classList.add('animation-slidein');
    editFormUserIcon();
    fillFieldsWithData();
}


/**
 * Here the Slide-In-Animation is removed and the Slide-Out-Animation is added. After .2 seconds the Form get's removed.
 */
function closeEditContactForm() {
    let contactFormBG = document.getElementById('edit-form');
    let contactForm = document.getElementById('edit-contact-container');
    contactForm.classList.remove('animation-slidein');
    contactForm.classList.add('animation-slideout');
    setTimeout(() => contactFormBG.style.display = 'none', 200);
}


/**
 * When a contact is clicked this function generates the HTML for the contactInfo (right Side of the browser).
 * @param {integer} id The contactID of the clicked Contact
 */
function loadContactInfo(id) {
    let selectedContact = identifyUser(id);
    let detailSection = document.getElementById('contact-information-container');
    detailSection.classList.add('animation-info-in-from-right');
    detailSection.innerHTML = '';
    detailSection.innerHTML = generateContactInfoHTML(selectedContact[0]);
}


/**
 * Returns the HTML for the Contact Info
 * @param {array} contact 
 * @returns HTML with userdata
 */
function generateContactInfoHTML(contact){
    return `
    <div class="d-flex flex-column align-items-start gap-21">
        <div class="d-flex gap-54">
            <div class="height-120 min-width-120 rounded-circle bg-color-${contact['contactColor']} d-flex justify-content-center align-items-center border-white-3 color-white size-47 weight-500">${contact['contactIcon']}</div>
            <div class="d-flex flex-column align-items-start">
                <div class="weight-500 size-47">${contact['contactName']}</div>
                <div class="d-flex gap-13">
                    <div onclick="showEditContactForm()" onmouseover="changeEditPic(1, this)" onmouseout="changeEditPic(2, this)" class="hover d-flex gap-2"><img class="height-24 width-24" src="../img/contact/edit.svg"><p class="margin-0 size-16 weight-400">Edit</p></div>
                    <div onclick="deleteContact()" onmouseover="changeDeletePic(1, this)" onmouseout="changeDeletePic(2, this)" class="hover d-flex gap-2"><img class="height-24 width-24" src="../img/contact/delete.svg"><p class="margin-0 size-16 weight-400">Delete</p></div>
                </div>
            </div>
        </div>
        <p class="margin-0 d-flex justify-content-start align-items-center size-20 weight-400 height-74 width-207">Contact Information</p>
        <div class="gap-22">
            <div class="gap-15">
                <h6 class="size-16 weight-700">Email</h6>
                <p class="color-blue-special">${contact['contactMail']}</p>
            </div>
            <div class="gap-15">
                <h6 class="size-16 weight-700">Phone</h6>
                <p>${contact['contactPhoneNumber']}</p>
            </div>
        </div>
    </div>
`;
}


/**
 * This function changes the little pictures for the Edit-Pen in the ContactInfo-Section.
 * @param {integer} x A number, which indicates, if the Cursor is on the Element(1) or if the Cursor is no longer on the Element(2)
 * @param {object} image The Image-Object to let the Function know, which Element is referenced
 */
function changeEditPic(x, image) {
    let img = image.querySelector('img');

    if (x == 1) {
        img.src = "../img/contact/edit-blue.svg";
    }

    if (x == 2) {
        img.src = "../img/contact/edit.svg";
    }
}


/**
 * This function changes the little pictures for the Delete-Trashcan in the ContactInfo-Section.
 * @param {integer} x A number, which indicates, if the Cursor is on the Element(1) or if the Cursor is no longer on the Element(2)
 * @param {object} image The Image-Object to let the Function know, which Element is referenced
 */
function changeDeletePic(x, image) {
    let img = image.querySelector('img');

    if (x == 1) {
        img.src = "../img/contact/delete-blue.svg";
    }

    if (x == 2) {
        img.src = "../img/contact/delete.svg";
    }
}


/**
 * This function identifies the current User via his ID and returns a JSON-Array with his Data
 * @param {integer} userID The ID of the current User 
 * @returns JSON-Array with the Data of the current active User
 */
function identifyUser(userID) {
    return contactData.filter((contact) => {
        return contact.contactID == userID;
    });
}


/**
 * This function uses the Data from the current User to set the matching Icon and Icon background color
 */
function editFormUserIcon() {
    let selectedContact = identifyUser(currentID);
    let icon = document.getElementById('edit-icon');
    icon.innerHTML = `${selectedContact[0]['contactIcon']}`;
    icon.parentElement.classList.add(`bg-color-${selectedContact[0]['contactColor']}`);
}


/**
 * This function fills the Input Fields in the Edit-Form with the current Data of the current User.
 */
function fillFieldsWithData() {
    let selectedContact = identifyUser(currentID);
    let editName = document.getElementById('editContactName');
    let editMail = document.getElementById('editContactMail');
    let editPhoneNumber = document.getElementById('editContactPhoneNumber');
    editName.value = `${selectedContact[0]['contactName']}`;
    editMail.value = `${selectedContact[0]['contactMail']}`;
    editPhoneNumber.value = `${selectedContact[0]['contactPhoneNumber']}`;
}


/**
 * This function takes the Values from the Input Fields of the Edit-Form and updates the Data on the server.
 */
async function saveChanges() {
    let editName = document.getElementById('editContactName');
    let editMail = document.getElementById('editContactMail');
    let editPhoneNumber = document.getElementById('editContactPhoneNumber');
    let currentContact = contactData.find(getIDInfo);
    let errorField = document.getElementById('edit-contact-error');

    if (!validateUserInput(editPhoneNumber.value)) {
        errorField.innerHTML = `Phone number can't contain Letters`;
        return;
    } else {
        currentContact.contactName = editName.value;
        currentContact.contactMail = editMail.value;
        currentContact.contactPhoneNumber = editPhoneNumber.value;
        currentContact.contactIcon = createIcons(editName.value);
        errorField.innerHTML = ``;
        await updateServerArray();
        resetEditForm();
        resetDetailSection();
        initContacts();
    }
}


/**
 * Validates the Userinput to determine if there are only Numbers
 * @param {string} string Value of the Edit-Input-Field for the Phone number
 * @returns True or false
 */
function validateUserInput(string) {
    let pattern = /^[0-9]+$/;
    return pattern.test(string);
}


/**
 * This function resets the Input Fields in the Edit-Form.
 */
function resetEditForm() {
    let editName = document.getElementById('editContactName').value;
    let editMail = document.getElementById('editContactMail').value;
    let editPhoneNumber = document.getElementById('editContactPhoneNumber').value;
    editName = ``;
    editMail = ``;
    editPhoneNumber = ``;
    closeEditForm();
}


/**
 * Used to close the Edit-Form after saving
 */
function closeEditForm() {
    let form = document.getElementById('edit-contact-container');
    let formBg = document.getElementById('edit-form');
    formBg.style.display = 'none';
    form.style.display = `none`;
}


/**
 * This function is used to locate the current User in the JSON-Array "contactData" (which contains the Data of all of the Contacts)
 * @param {object} contact The Array with the User Data
 * @returns The Index of the User with the currentID.
 */
function getIDInfo(contact) {
    return contact.contactID == currentID;
}


/**
 * This function is used to delete a Contact.
 * First the Location of the currently selected Contact retrieved, then the result is deleted.
 * Afterwards the Data on the Server is updated.
 */
async function deleteContact() {
    let arrayIndex = contactData.findIndex(getIDInfo);
    contactData.splice(arrayIndex, 1);
    await updateServerArray();
    resetDetailSection();
    addLetterToArray();
    initContacts();
}


/**
 * This function is used to Update the Server JSON-Array.
 */
async function updateServerArray() {
    await setContacts('contacts', JSON.stringify(contactData));
}


/**
 * This function is used to clear the Detail-Section of the currently displayed Contact-Info after the Contact is deleted.
 */
function resetDetailSection() {
    let detailSection = document.getElementById('contact-information-container');
    detailSection.innerHTML = ``;
}