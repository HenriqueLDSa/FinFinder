// Function to toggle password visibility
function togglePasswordVisibility(passwordField, toggleIcon) {
    // If the current type attribute is 'password', set it to 'text'. Otherwise, set it to 'password'.
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle icon between locked and unlocked
    toggleIcon.classList.toggle('bxs-lock');
    toggleIcon.classList.toggle('bxs-lock-open');
}

function doRegister() {
    console.log("register button clicked"); 

    //acquire variables: First name, last name, Login, Password
    let firstName = document.getElementById("firstName").value; 
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById('email').value; 
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value; 

     // Simple validation (if fields are empty)
    if (!firstName || !lastName || !login || !password || !confirmPassword) 
    {
        document.getElementById("registerResult").innerHTML = "Please fill out all fields.";
        return;
    }

    //simple validation (if passwords dont match)
    if (password !== confirmPassword) 
    {
        document.getElementById("registerResult").innerHTML = "Passwords do not match.";
        return;
    }

    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (regex.test(email) == false) {
        document.getElementById("registerResult").innerHTML = "Not an actual email address.";
        return;
    }

    // Create the payload with the user details
    let tmp = {firstName: firstName, lastName: lastName, email: email, login: login, password: password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                //if there is an error (as defined in the .php, print it)
                if (jsonObject.error) {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
                    return;
                }
                else if (jsonObject.message) //added success message in php (issue with reading "" for error)
                {
                     // Registration successful (no JSONobject error as defined in register.php)
                    document.getElementById("registerResult").innerHTML = jsonbObject.message;
                }
                
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
    
}



// Event Listeners when content on HTML is loaded/accessible
document.addEventListener("DOMContentLoaded", function() {
    // Event listener for password toggle 
    document.getElementById('togglePassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('password'), this);
    });

    //event listener for confirm password toggle
    document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('confirmPassword'), this);
    });

    // Event Listener for register button 
    let registerButton = this.getElementById("registerButton");
    if (registerButton) {
        registerButton.addEventListener("click", function() {
            doRegister(); 
        });
    }


});

// Base URL and extension for API
const urlBase = 'http://team27poosd.site/LAMPAPI'; //REPLACE IP
const extension = 'php';
