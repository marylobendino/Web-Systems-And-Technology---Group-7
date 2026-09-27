const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

function showLoginForm() {
    if (signupForm) {
        signupForm.classList.add("hidden");
    }

    if (loginForm) {
        loginForm.classList.remove("hidden");
    }
}

function showSignupForm() {
    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    if (signupForm) {
        signupForm.classList.remove("hidden");
    }
}

const urlParams = new URLSearchParams(
    window.location.search
);

if (urlParams.get("form") === "signup") {
    showSignupForm();
}

if (showSignup) {
    showSignup.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            showSignupForm();
        }
    );
}

if (showLogin) {
    showLogin.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            showLoginForm();
        }
    );
}