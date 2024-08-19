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
// Requirement: link swal-base.js in 
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

// Sign up error pop up based on case
// Requirement: link swal-base.js in 
function showSignUpFailed(failCase){

    let msg = "Error.";

    switch(failCase){
        case 1: msg = 'Username already taken!'; break;
        case 2: msg = 'Make sure your passwords match!'; break;
        case 3: msg = 'Restaurant name already taken!'; break;
    }

    showErrorPopup('Sign up failed!', msg);
}


async function isUsernameUnique(username){
    
    let response = await fetch('/validate-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username})
    })
   
   return response.ok;
}

async function validateSignUpForm(){

    let username = document.getElementById('reviewer-username').value;
    let password = document.getElementById('reviewer-password').value;
    let verifyPassword = document.getElementById('reviewer-verify-pass').value;

    // Username should be unique
    const isUnique = await isUsernameUnique(username);

    if (!isUnique){
        showSignUpFailed(1);
        return false;
    }

    // Pws should be match
    if (password !== verifyPassword) {
        showSignUpFailed(2);
        return false;
    }

    return true;
}

async function validateRestoSignUp(){

    let username = document.getElementById('establishment-username').value;
    let restoName = document.getElementById('establishment-name').value;

    // Restaurant name should  be unique
    let response = await fetch('/validate-restoname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({restoName : restoName})
    });
    
    if (!response.ok){
        showSignUpFailed(3);
        return false;
    }

     // Username should be unique
     if ( !(await isUsernameUnique(username)) ){
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