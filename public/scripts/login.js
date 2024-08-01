// Scripts for Pop-up login window
function openLoginPopUp(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: for smooth scrolling
    });
    document.querySelector("#search-popup").classList.remove("active");
    document.querySelector("#login-area").classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {

    // Only add event listener if the login button is present
    if (document.querySelector("#login")){
        document.querySelector("#login").addEventListener("click", function(){
            // Remove search bar if opened
            document.querySelector("#search-popup").classList.remove("active");
            document.querySelector(".popup").classList.add("active");
        });

        document.querySelector(".popup .close-btn").addEventListener("click", function(){
            document.querySelector(".popup").classList.remove("active");
        });
    }
});

// Confirmation message pop-ups after login

// link swal-base.js in 
function showloginSuccessPopup(username) {
    showSuccessPopUp(`Welcome back,\n${username}`,`You have successfully logged in!.`);
}

function showloginFailedPopup(){
    showErrorPopup('Login Unsuccessful.', 'You entered the incorrect username or password.');
}

// Logout
$(document).ready(function() {
    $('#logout-button').on('click', function() {
        Swal.fire({
            title: 'Are you sure you want to log out?',
            text: "Click confirm to log out",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/logout';
            }
        });
    });
});

// sign up error pop up; fail case 1: username already taken
function showSignUpFailed(failCase){

    let msg = "Error.";

    if (failCase === 1){
        msg = 'Username already taken!'
    } else if (failCase === 2){
        msg = 'Make sure your passwords match!'
    }
    showErrorPopup('Sign up failed!', msg);
}

function isUsernameUnique(usernameList, username){
    if (usernameList.includes(username)) {
        return false;
    } else {
        return true;
    }
}

function validateSignUpForm(usernameList){

    let username = document.getElementById('reviewer-username').value;
    var email = document.getElementById('reviewer-email').value;
    var firstname = document.getElementById('reviewer-firstname').value;
    var lastname = document.getElementById('reviewer-lastname').value;
    
    var password = document.getElementById('reviewer-password').value;
    var verifyPassword = document.getElementById('reviewer-verify-pass').value;

    if (!isUsernameUnique(usernameList, username)){
        showSignUpFailed(1);
        return false;
    }

    // Perform validation
    if (password !== verifyPassword) {
        showSignUpFailed(2);
        return false; // Prevent form submission
    }

    return true;
}

function validateRestoSignUp(usernameList){

    let username = document.getElementById('establishment-username').value;
    if (!isUsernameUnique(usernameList, username)){
        showSignUpFailed(1);
        return false;
    }

    return true;
}

function show404Popup(){
    Swal.fire({
        icon: 'warning',
        title: '404 Not Found',
        text: 'Your requested restaurant or user may have been deleted.' 
        // ,
        // footer: '<a href="/">Return to Home</a>'
    });
}