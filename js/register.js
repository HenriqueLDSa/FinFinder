function togglePasswordVisibility(passwordField, toggleIcon) {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    toggleIcon.classList.toggle('bxs-lock');
    toggleIcon.classList.toggle('bxs-lock-open');
}

const passwordInput = document.getElementById('password');
const passwordRequirements = document.querySelector('.password-requirements');

passwordInput.addEventListener('focus', () => {
    passwordRequirements.style.display = 'block';
});

passwordInput.addEventListener('blur', () => {
    passwordRequirements.style.display = 'none';
});

function doRegister() {
    console.log("register button clicked"); 

    let firstName = document.getElementById("firstName").value; 
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById('email').value; 
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value; 

    if (!firstName || !lastName || !login || !password || !confirmPassword) 
    {
        document.getElementById("registerResult").innerHTML = "Please fill out all fields";
        return;
    }

    if (password !== confirmPassword) 
    {
        document.getElementById("registerResult").innerHTML = "Passwords do not match";
        return;
    }

    var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (regexEmail.test(email) == false) {
        document.getElementById("registerResult").innerHTML = "Invalid email address";
        return;
    }

    const regexName = /^[A-Za-z]+$/;
    if (!regexName.test(firstName) || !regexName.test(lastName)){
        document.getElementById("registerResult").innerHTML = "Name can only contain alphabetic characters";
        return;
    }

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
                
                if (jsonObject.error) {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("registerResult").innerHTML = jsonObject.message;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
    
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('togglePassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('password'), this);
    });

    document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('confirmPassword'), this);
    });

    let registerButton = this.getElementById("registerButton");
    if (registerButton) {
        registerButton.addEventListener("click", function() {
            doRegister(); 
        });
    }
});

const urlBase = 'http://team27poosd.site/LAMPAPI';
const extension = 'php';
