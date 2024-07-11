/**
 * Used to initialize the registrated Users to make the Login possible.
 */
async function init(){
    await loadUsers();
}


/**
 * login takes the Userinput, which is entered on the login.html-Form to verify the User via his Data
 */
function login(){
    let errorField = document.getElementById('login-error-field');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    errorField.innerHTML = ``;

    if (user){
        pushUserToLocalStorage(user['userName']);
        changeWindowToSummary();
    } else {
        errorField.innerHTML = `Wrong Email or Password`;
    }
}


/**
 * pushUserToLocalStorage gets the userName-Variable from the login()-function and pushes it to the Local Storage
 * @param {string} userName The Username
 */
function pushUserToLocalStorage(userName){
    localStorage.setItem('username', JSON.stringify(userName));
}


/**
 * changeWindowToSummary changes the current Window to the summary.html-File
 */
function changeWindowToSummary(){
    window.location.href='./html/summary.html';
}


/**
 * this takes the Userinput and validates it
 */
function responsiveLogin(){
    let responsiveErrorField = document.getElementById('responsive-login-error-field');
    let responsiveEmail = document.getElementById('responsive-email');
    let responsivePassword = document.getElementById('responsive-password');
    let responsiveUser = users.find(u => u.email == responsiveEmail.value && u.password == responsivePassword.value);
    responsiveErrorField.innerHTML = ``;

    if (responsiveUser){
        pushUserToLocalStorage(user['userName']);
        changeWindowToSummary();
    } else {
        responsiveErrorField.innerHTML = `Wrong Email or Password`;
    }
}