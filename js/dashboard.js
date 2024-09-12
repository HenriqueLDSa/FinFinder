document.addEventListener("DOMContentLoaded", readCookie);

const urlBase = 'http://team27poosd.site/LAMPAPI';
const extension = 'php';

const aboutUsBtn = document.getElementById("about-us-btn");
const logoutBtn = document.getElementById("logout-btn");

const newContactBtn = document.querySelector(".new-user-button");
const nameModal = document.getElementById('contact-data-modal');
const submitDataBtn = document.getElementById('submitDataBtn');
const cancelBtn = document.getElementById('cancelBtn');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const numberInput = document.getElementById('numberInput');
const emailInput = document.getElementById('emailInput');

let userId = 0;
let firstName = "";
let lastName = "";

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }

        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }

        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact(firstName, lastName, number, email){
    let newContactObj = 
    {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phone": number,
        "userID": userId
    };

    let jsonPayload = JSON.stringify(newContactObj);

    let url = urlBase + "/addContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                alert("Contact added.");
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        alert(err);
    }

    const newContactElement = document.createElement("div");
    newContactElement.className = "contact-item";

    const contactName = document.createElement("span");
    contactName.id = "contact-name";
    contactName.textContent = firstName + " " + lastName;
    newContactElement.appendChild(contactName);

    const contactNumber = document.createElement("span");
    contactNumber.id = "contact-number";
    contactNumber.textContent = number;
    newContactElement.appendChild(contactNumber);
    
    const contactEmail = document.createElement("span");
    contactEmail.id = "contact-email";
    contactEmail.textContent = email;
    newContactElement.appendChild(contactEmail);

    const contactMods = document.createElement("div");
    contactMods.className = "contact-mods";
    const editIcon = document.createElement("i");
    editIcon.className = "far fa-edit";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa fa-trash-alt";
    contactMods.appendChild(editIcon);
    contactMods.appendChild(trashIcon);
    newContactElement.appendChild(contactMods);

    const contactContainer = document.querySelector(".contact-item-container");
    contactContainer.appendChild(newContactElement);
}

logoutBtn.addEventListener('click', doLogout);

aboutUsBtn.addEventListener('click', () => {
    window.location.href = "about.html";
});

newContactBtn.addEventListener('click', function() {
    nameModal.style.display = 'flex';
    document.body.classList.add('modal-open');
});

submitDataBtn.addEventListener('click', function() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const phoneNum = numberInput.value;
    const emailAdd = emailInput.value;

    if (!firstName) {
        alert('Please enter the first name.');
    }
    else if (!lastName) {
        alert('Please enter the last name.');
    }
    else if (!phoneNum) {
        alert('Please enter the phone number.');
    }
    else if (!emailAdd) {
        alert('Please enter the email address.');
    }
    else {
        addContact(firstName, lastName, phoneNum, emailAdd);
        nameModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});

cancelBtn.addEventListener('click', () => {
    firstNameInput.value = "";
    lastNameInput.value = "";
    numberInput.value = "";
    emailInput.value = "";

    nameModal.style.display = 'none';
    document.body.classList.remove('modal-open');
});