// Function to toggle password visibility
function togglePasswordVisibility(passwordField, toggleIcon) {
    // If the current type attribute is 'password', set it to 'text'. Otherwise, set it to 'password'.
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle icon between locked and unlocked
    toggleIcon.classList.toggle('bxs-lock');
    toggleIcon.classList.toggle('bxs-lock-open');
}

function doLogin() {
    console.log("login button clicked"); 
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("username").value; // Updated ID
    let password = document.getElementById("password").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login: login, password: password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "dashboard.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    let expires = "; expires=" + date.toUTCString();

    document.cookie = "firstName=" + firstName + expires + "; path=/";
    document.cookie = "lastName=" + lastName + expires + "; path=/";
    document.cookie = "userId=" + userId + expires + "; path=/";
}


// Event Listeners when content on HTML is loaded/accessible
document.addEventListener("DOMContentLoaded", function() {
    // Event listener for password toggle (login HTML)
    document.getElementById('togglePassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('password'), this);
    });

    // Add click event listener to the login button
    let loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", function () {
            doLogin();  // Call the Login function when the button is clicked
        });
    }
});

// Base URL and extension for API
const urlBase = 'http://team27poosd.site/LAMPAPI'; //REPLACE IP
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
