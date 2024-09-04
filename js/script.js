// Function to toggle password visibility
function togglePasswordVisibility(passwordField, toggleIcon) {
    
    // If the current type attribute is 'password', set it to 'text'. Otherwise, set it to 'password'.
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle icon between locked and unlocked
    toggleIcon.classList.toggle('bxs-lock');
    toggleIcon.classList.toggle('bxs-lock-open');
}

//show login button when fields are entered, keep hidden otherwise
function checkFields() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginButton = document.getElementById("loginButton");

    if (username && password) {
        loginButton.disabled = false; // Enable the button
		console.log("button enabled");
    } else {
        loginButton.disabled = true; // Disable the button
		console.log("button disabled"); 
    }
}

//login.php function
function Login()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
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
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}


//event Listeners when content on HTML is loaded/accessible
document.addEventListener("DOMContentLoaded", function() {
    // Event listener for password and confirm password (index and register html)
    document.getElementById('togglePassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('password'), this);
    });

    document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
        togglePasswordVisibility(document.getElementById('confirm-password'), this);
    });

    //check if fields have been entered
    document.getElementById("username").addEventListener("input", checkFields);
    document.getElementById("password").addEventListener("input", checkFields);

    // Add click event listener to the login button
    let loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", function () {
            Login();  // Call the Login function when the button is clicked
        });
    }

});
