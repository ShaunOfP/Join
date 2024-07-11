/**
 * Function toggleButton() checks, if the checkBox on the Sign-Up Page is checked.
 * If true it activates the Sign-Up Button. If false the Button remains not active/clickable.
 */
function toggleButton() {
    let checkBox = document.getElementById('accept-tos-checkbox');
    let signUpButton = document.getElementById('signup-btn');

    if (!checkBox.checked) {
        signUpButton.disabled = true;
        return;
    }
    signUpButton.disabled = false;
}


/**
 * Function confirmPw() checks, if both Passwordfield-values are identical. If false it throws an Error-Message.
 */
function confirmPw() {
    let pw = document.getElementById('pw-field');
    let repeatPw = document.getElementById('repeat-pw-field');
    let errorContainer = document.getElementById('signup-error-container');
    let errorField = document.getElementById('signup-error-field');

    if (pw.value != repeatPw.value) {
        errorContainer.classList.remove('d-none');
        errorField.innerHTML = `Your Passwords don't match`;
        return;
    } else {
        addUser();
    }
}


/**
 * Function addUser() pushes the JSON to the users-Array, uploads it to the Backend, changes and adds Classes
 * of the Message-Box and calls the resetForm-Function after 5 seconds
 */
async function addUser() {
    let userName = document.getElementById('name-field').value;
    let email = document.getElementById('mail-field').value;
    let password = document.getElementById('pw-field').value;
    let successMessage = document.getElementById('success');

    users.push({
        userName: userName,
        email: email,
        password: password
    });

    await setItem('users', JSON.stringify(users));

    if (window.getComputedStyle(successMessage).display === "none") {
        successMessage.style.display = 'flex';
    }

    successMessage.classList.add('fade-in');

    setTimeout(resetForm, 2000);
}


/**
 * Function resetForm() resets the Userinputs after a successfull registration
 */
function resetForm() {
    let name = document.getElementById('name-field');
    let mail = document.getElementById('mail-field');
    let password = document.getElementById('pw-field');
    let repeatPassword = document.getElementById('repeat-pw-field');

    name.value = '';
    mail.value = '';
    password.value = '';
    repeatPassword.value = '';
    document.getElementById('accept-tos-checkbox').checked = false;

    changeWindow();
}


/**
 * Function changeWindow() changes the current Window to Index.html (Login) 
 */
function changeWindow() {
    window.location.href = '../index.html?msg=You Signed Up successfully';
}


//Responsive Section

/**
 * Function responsiveToggleButton() checks, if the checkBox on the Sign-Up Page is checked.
 * If true it activates the Sign-Up Button. If false the Button remains not active/clickable.
 */
function responsiveToggleButton() {
    let responsiveCheckBox = document.getElementById('responsive-accept-tos-checkbox');
    let responsiveSignUpButton = document.getElementById('responsive-signup-button');

    if (!responsiveCheckBox.checked) {
        responsiveSignUpButton.disabled = true;
        return;
    }
    responsiveSignUpButton.disabled = false;
}


/**
 * Function responsiveConfirmPw() checks, if both Passwordfield-values are identical. If false it throws an Error-Message.
 */
function responsiveConfirmPw() {
    let responsivePw = document.getElementById('responsive-pw-field');
    let responsiveRepeatPw = document.getElementById('responsive-repeat-pw-field');
    let errorContainer = document.getElementById('responsive-signup-error-container');
    let errorField = document.getElementById('responsive-signup-error-field');

    if (responsivePw.value != responsiveRepeatPw.value) {
        errorContainer.classList.remove('d-none');
        errorField.innerHTML = `Your Passwords don't match`;
        return;
    } else {
        responsiveAddUser();
    }
}


/**
 * Function responsiveAddUser() pushes the JSON to the users-Array, uploads it to the Backend, changes and adds Classes
 * of the Message-Box and calls the resetForm-Function after 5 seconds
 */
async function responsiveAddUser() {
    let responsiveUserName = document.getElementById('responsive-name-field').value;
    let responsiveEmail = document.getElementById('responsive-mail-field').value;
    let responsivePassword = document.getElementById('responsive-pw-field').value;

    users.push({
        userName: responsiveUserName,
        email: responsiveEmail,
        password: responsivePassword
    });

    await setItem('users', JSON.stringify(users));

    responsiveShowSuccessMessage();
}


/**
 * Displays a success message with a fade-in effect and resets the form after 2 seconds.
 * It first checks if the success message is hidden and then displays it using flex layout.
 * Finally, it adds a fade-in animation class and schedules the form reset function to run after 2 seconds.
 */
function responsiveShowSuccessMessage(){
    let responsiveSuccessMessage = document.getElementById('responsive-success');

    if (window.getComputedStyle(responsiveSuccessMessage).display === "none") {
        responsiveSuccessMessage.style.display = 'flex';
    }

    responsiveSuccessMessage.classList.add('responsive-fade-in');

    setTimeout(responsiveResetForm, 2000);
}


/**
 * Function responsiveResetForm() resets the Userinputs after a successfull registration
 */
function responsiveResetForm() {
    let responsiveName = document.getElementById('responsive-name-field');
    let responsiveMail = document.getElementById('responsive-mail-field');
    let responsivePassword = document.getElementById('responsive-pw-field');
    let responsiveRepeatPassword = document.getElementById('responsive-repeat-pw-field');

    responsiveName.value = '';
    responsiveMail.value = '';
    responsivePassword.value = '';
    responsiveRepeatPassword.value = '';
    document.getElementById('responsive-accept-tos-checkbox').checked = false;

    responsiveChangeWindow();
}


/**
 * Navigates to 'index.html' with a success message query parameter.
 */
function responsiveChangeWindow() {
    window.location.href = '../index.html?msg=You Signed Up successfully';
}