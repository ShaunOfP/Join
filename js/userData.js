const STORAGE_TOKEN = 'GFHI23ZPF35BS0P8O7SQNMHHFXV85NX4JNN2VVZD';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


let users = [];
let contactData = [];
let sortedContactData = [];
let sortedNamesWithRelatedData = [];


/**
 * Used to download the User-Data from the Server (for the Login/Signup)
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        alert('No users found:' + e); //provisorium
    }
}


/**
 * This uploads Data onto the Server 
 * @param {string} key The Label of the Key
 * @param {object} value Data assigned to the Key
 * @returns Either succeeds to upload the Data or fails to do so
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}


/**
 * Downloads the Data for the indicated Key
 * @param {string} key The Label of the Key
 * @returns If exists, the Data for the indicated Key
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


/**
 * Used to load the Contacts and their Data
 */
async function loadContactData() {
    try {
        contactData = JSON.parse(await getContacts('contacts'));
    } catch (e) {
        alert('No contacts found: ' + e); //provisorium
    }
}

/**
 * Sorts the contact data array alphabetically by contact name.
 */
function sortContactData() {
    contactData.forEach(contact => {
        sortedContactData.push(contact.contactName)
    });
    sortedContactData.sort();
    getDataOfContact();
}

/**
 * Retrieves data of contacts, sorting them alphabetically by contact name.
 */
function getDataOfContact() {
    sortedContactData = contactData.sort((a, b) => {
        const nameA = a.contactName.toUpperCase();
        const nameB = b.contactName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    sortedNamesWithRelatedData = sortedContactData.map(contact => ({
        contactName: contact.contactName,
        contactMail: contact.contactMail,
        contactPhoneNumber: contact.contactPhoneNumber,
        contactIcon: contact.contactIcon,
        contactID: contact.contactID,
    }));
}


/**
 * Used to upload a new Contact to the Server-Data
 * @param {string} key The Label of the Key
 * @param {object} value Array with the Values
 * @returns Either succeeds to upload the Data or fails to do so
 */
async function setContacts(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}


/**
 * Used to download the values from the Data on the Server, used to display Contact-Information
 * @param {string} key The Label of the Key
 * @returns Values of the Data from the Server
 */
async function getContacts(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


/**
 * Used to load the Data for the Todos-Array
 */
async function loadTodos() {
    try {
        todos = JSON.parse(await getItem("todos"));
    } catch (e) {
        alert("No Todos found:" + e);
    }
}