// ========================================
// LOGIN / SIGN UP FORM
// ========================================

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");


// ========================================
// CHECK WHICH FORM TO SHOW
// ========================================

const urlParams = new URLSearchParams(window.location.search);
const form = urlParams.get("form");

if (form === "signup") {

    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");

}


// ========================================
// SHOW SIGN UP
// ========================================

showSignup.addEventListener("click", function (event) {

    event.preventDefault();

    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");

});


// ========================================
// SHOW LOGIN
// ========================================

showLogin.addEventListener("click", function (event) {

    event.preventDefault();

    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

});