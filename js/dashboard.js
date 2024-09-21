document.addEventListener("DOMContentLoaded", function() {
    readCookie();
    loadContacts();
});

const urlBase = 'http://team27poosd.site/LAMPAPI';
const extension = 'php';

const aboutUsBtn = document.getElementById("about-us-btn");
const logoutBtn = document.getElementById("logout-btn");
const contactBtn = document.getElementById("contacts-btn");

const newContactBtn = document.querySelector(".new-user-button");
const refreshBtn = document.getElementById("refreshButton"); 

const contactList = document.querySelector('.contact-item-container');
const exitBtn = document.getElementById("exitBtn");
const contactDataModal = document.getElementById('contact-data-modal');
const submitDataBtn = document.getElementById('submitDataBtn');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const numberInput = document.getElementById('numberInput');
const emailInput = document.getElementById('emailInput'); 
const searchBarInput = document.querySelector('.search-bar');

let userId;
let firstName = "";
let lastName = "";
let userContacts = [];

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
        window.location.href = "/welcome";
        return;
    }
}

async function loadContacts() {
    let payloadObj = {"userID": userId};

    let jsonPayload = JSON.stringify(payloadObj);
    let url = urlBase + "/getContacts." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                userContacts = JSON.parse(this.responseText);

                if (userContacts.error != undefined) {
                    console.log(userContacts.error);  
                    return;
                } 
                else {
                    console.log(userContacts);
                }
                
                const contactContainer = document.querySelector(".contact-item-container");
                contactContainer.innerHTML = "";

                userContacts.forEach(element => {
                    addElementToTable(element.FirstName, element.LastName, element.Phone, element.Email);
                });
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error while fetching contacts: " + err);
    }
}

function addContact(firstName, lastName, number, email) {
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
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error != undefined) {
                    console.log(jsonObject.error); 
                    return; 
                } 
                else if (jsonObject.info != undefined){
                    console.log(jsonObject.info);
                }

                loadContacts();
            }            
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log("Error adding contact: " + err.message);
    }
}

function editContact(id, firstName, lastName, number, email){
    let editContactObj = {
        "id": id,
        "firstName": firstName,
        "lastName": lastName,
        "phone": number,
        "email": email
    }

    let jsonPayload = JSON.stringify(editContactObj);
    let url = urlBase + "/updateContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error != undefined) {
                    console.log(jsonObject.error);  
                    return;
                } 
                else if (jsonObject.info != undefined){
                    console.log(jsonObject.info);
                }    
                
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error editing contact: " + err.message);
    }
}

function deleteContact(id){
    let deleteContactObj = {"id": id};

    let jsonPayload = JSON.stringify(deleteContactObj);
    let url = urlBase + "/deleteContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error != undefined) {
                    console.log(jsonObject.error);  
                    return;
                } 
                else if (jsonObject.info != undefined){
                    console.log(jsonObject.info);
                }  
            }
        };
        xhr.send(jsonPayload);
    } catch (err){
        console.log("Error deleting contact: " + err.message);
    }
}

function searchContact(event){
    const regex = /^[a-zA-Z0-9]*$/;
    const inputValue = event.target.value;  

    if (!regex.test(inputValue)) 
        return

    contactList.innerHTML = "";

    userContacts.forEach(contact => {
        if (contact.FirstName.startsWith(inputValue) || contact.LastName.startsWith(inputValue)) {
            console.log(contact);
            addElementToTable(contact.FirstName, contact.LastName, contact.Phone, contact.Email);
        }    
    });

    if(inputValue.length == 0){
        contactList.innerHTML = "";
        userContacts.forEach(contact => {
            if (contact.FirstName.startsWith(inputValue) || contact.LastName.startsWith(inputValue))
                addElementToTable(contact.FirstName, contact.LastName, contact.Phone, contact.Email);  
        });
    }
}

function addElementToTable(firstName, lastName, phone, email){
    const newContactElement = document.createElement("div");
    newContactElement.className = "contact-item";

    const contactName = document.createElement("span");
    contactName.id = "contact-name";
    const firstNameSpan = document.createElement("span");
    firstNameSpan.id = "first-name";
    firstNameSpan.textContent = firstName;
    const lastNameSpan = document.createElement("span");
    lastNameSpan.id = "last-name";
    lastNameSpan.textContent = lastName;
    contactName.appendChild(firstNameSpan);
    contactName.appendChild(document.createTextNode(" ")); 
    contactName.appendChild(lastNameSpan);
    newContactElement.appendChild(contactName);

    const contactNumber = document.createElement("span");
    contactNumber.id = "contact-number";
    contactNumber.textContent = phone;
    newContactElement.appendChild(contactNumber);
    
    const contactEmail = document.createElement("span");
    contactEmail.id = "contact-email";
    contactEmail.textContent = email;
    newContactElement.appendChild(contactEmail);

    const contactMods = document.createElement("div");
    contactMods.className = "contact-mods";
    const editIcon = document.createElement("i");
    editIcon.className = "far fa-edit";
    editIcon.id = "edit-icon";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa fa-trash-alt";
    trashIcon.id = "trash-icon";
    contactMods.appendChild(editIcon);
    contactMods.appendChild(trashIcon);
    newContactElement.appendChild(contactMods);

    const contactContainer = document.querySelector(".contact-item-container");
    contactContainer.appendChild(newContactElement);
}

logoutBtn.addEventListener('click', () => {
    userId = -1;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/welcome";
});

contactBtn.addEventListener('click', () => {
    window.location.href = "/dashboard";
});

aboutUsBtn.addEventListener('click', () => {
    window.location.href = "/about";
});

searchBarInput.addEventListener('input', searchContact);

refreshBtn.addEventListener('click', loadContacts); 

function handleNewContactSubmit() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const phoneNum = numberInput.value;
    const emailAdd = emailInput.value;
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

    if (!firstName || !lastName || !phoneNum || !emailAdd) {
        document.getElementById("contactResult").innerHTML = "Please fill out all fields.";
    }else if(emailRegex.test(emailAdd) == false){
        document.getElementById("contactResult").innerHTML = "Invalid email address.";
    }else if(phoneRegex.test(phoneNum) == false){
        document.getElementById("contactResult").innerHTML = "Invalid phone number.";
    } else {
        addContact(firstName, lastName, phoneNum, emailAdd);
        contactDataModal.style.display = 'none';
        document.getElementById("contactResult").innerHTML = "";
        document.body.classList.remove('modal-open');
        firstNameInput.value = '';
        lastNameInput.value = '';
        numberInput.value = '';
        emailInput.value = '';
    }
}

function handleEditContactSubmit(contactID) {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const phoneNum = numberInput.value;
    const emailAdd = emailInput.value;
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

    if (!firstName || !lastName || !phoneNum || !emailAdd) {
        document.getElementById("contactResult").innerHTML = "Please fill out all fields.";
    }else if(emailRegex.test(emailAdd) == false){
        document.getElementById("contactResult").innerHTML = "Invalid email address.";
    }else if(phoneRegex.test(phoneNum) == false){
        document.getElementById("contactResult").innerHTML = "Invalid phone number.";
    } else {
        editContact(contactID, firstName, lastName, phoneNum, emailAdd);
        contactDataModal.style.display = 'none';
        document.getElementById("contactResult").innerHTML = "";
        document.body.classList.remove('modal-open');
        firstNameInput.value = '';
        lastNameInput.value = '';
        numberInput.value = '';
        emailInput.value = '';
    }
}

newContactBtn.addEventListener('click', function () {
    contactDataModal.style.display = 'flex';
    document.body.classList.add('modal-open');

    submitDataBtn.removeEventListener('click', handleNewContactSubmit);
    submitDataBtn.addEventListener('click', handleNewContactSubmit);
});

contactList.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'edit-icon') {
        const contactItem = event.target.closest('.contact-item');

        const contactFirstNameElement = contactItem.querySelector("#first-name");
        const contactLastNameElement = contactItem.querySelector("#last-name");
        const contactNumberElement = contactItem.querySelector('#contact-number');
        const contactEmailElement = contactItem.querySelector('#contact-email');

        let contactID;

        userContacts.forEach(contact => {
            if (contact.FirstName === contactFirstNameElement.textContent &&
                contact.LastName === contactLastNameElement.textContent &&
                contact.Phone === contactNumberElement.textContent &&
                contact.Email === contactEmailElement.textContent) {
                contactID = contact.ID;
                console.log(`Editing contact with ID ${contactID}`);
            }
        });

        contactDataModal.style.display = 'flex';
        document.getElementById('firstNameInput').value = contactFirstNameElement.textContent;
        document.getElementById('lastNameInput').value = contactLastNameElement.textContent;
        document.getElementById('numberInput').value = contactNumberElement.textContent;
        document.getElementById('emailInput').value = contactEmailElement.textContent;

        document.body.classList.add('modal-open');

        submitDataBtn.removeEventListener('click', handleNewContactSubmit);  
        submitDataBtn.removeEventListener('click', handleEditContactSubmit); 
        submitDataBtn.addEventListener('click', () => handleEditContactSubmit(contactID)); 
    }
    else if (event.target && event.target.id === 'trash-icon'){
        const contactItem = event.target.closest('.contact-item');
        
        const contactFirstNameElement = contactItem.querySelector("#first-name");
        const contactLastNameElement = contactItem.querySelector("#last-name");
        const contactNumberElement = contactItem.querySelector('#contact-number');
        const contactEmailElement = contactItem.querySelector('#contact-email');
        
        if (confirm(`Are you sure you want to delete the contact "${contactFirstNameElement.textContent} ${contactLastNameElement.textContent}"?`)) {
            let contactID;

            userContacts = userContacts.filter(contact => {
                if (contact.FirstName === contactFirstNameElement.textContent &&
                    contact.LastName === contactLastNameElement.textContent &&
                    contact.Phone === contactNumberElement.textContent &&
                    contact.Email === contactEmailElement.textContent) {
                    contactID = contact.ID;
                    console.log(`Deleting contact with ID ${contactID}`);
                    return false;
                }
                return true; 
            });

            deleteContact(contactID);
            contactItem.remove();
        }
    }
});

exitBtn.addEventListener('click', function() {
    contactDataModal.style.display = 'none';
    document.getElementById('firstNameInput').value = "";
    document.getElementById('lastNameInput').value = "";
    document.getElementById('numberInput').value = "";
    document.getElementById('emailInput').value = "";
    document.getElementById("contactResult").innerHTML = "";
    document.body.classList.remove('modal-open'); 
    firstNameInput.value = '';
    lastNameInput.value = ''
    numberInput.value = '';
    emailInput.value = '';
});