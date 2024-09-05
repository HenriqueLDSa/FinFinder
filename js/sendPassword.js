function sendPassword() {
    console.log("send password button clicked"); 

    //acquire variables: First name, last name, Login, Password
    let email = document.getElementById('email').value; 

    //validation checks - 
    
    //check if email field is empty
    if (!email) 
    {
        document.getElementById("passwordResult").innerHTML = "Please fill the email field";
        return;
    }

    // Validate email format using regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) 
    {
        document.getElementById("passwordResult").innerHTML = "Please enter a valid email address";
        return;
    }

    // Create the payload with the user details
    let tmp = {email: email};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/resetPassword.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                //if there is an error (as defined in the .php, print it)
                if (jsonObject.error != "") {
                    document.getElementById("passwordResult").innerHTML = jsonObject.error;
                    return;
                }

                // Registration successful (no JSONobject error as defined in register.php)
                document.getElementById("passwordResult").innerHTML = "An Email has Been Sent to You with Your Password.";
                
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("passwordResult").innerHTML = err.message;
    }
    
}


// Event Listeners when content on HTML is loaded/accessible
document.addEventListener("DOMContentLoaded", function() {
    // Event Listener for register button 
    let sendButton = this.getElementById("sendPassword");
    
    if (sendButton) {
        sendButton.addEventListener("click", function() {
            sendPassword(); 
        });
    }
});


// Base URL and extension for API
const urlBase = 'http://team27poosd.site/LAMPAPI'; //REPLACE IP
const extension = 'php';