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
        window.location.href = "index.html";
        return;
    }
}

async function loadContacts() {
    let payloadObj = 
    {
        "userID": userId
    };

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

function deleteContact(){
    
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
	window.location.href = "index.html";
});

contactBtn.addEventListener('click', () => {
    window.location.href = "dashboard.html";
});

aboutUsBtn.addEventListener('click', () => {
    window.location.href = "about.html";
});

refreshBtn.addEventListener('click', loadContacts); 

function handleNewContactSubmit() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const phoneNum = numberInput.value;
    const emailAdd = emailInput.value;

    if (!firstName) {
        alert('Please enter the first name.');
    } else if (!lastName) {
        alert('Please enter the last name.');
    } else if (!phoneNum) {
        alert('Please enter the phone number.');
    } else if (!emailAdd) {
        alert('Please enter the email address.');
    } else {
        addContact(firstName, lastName, phoneNum, emailAdd);
        contactDataModal.style.display = 'none';
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

    if (!firstName) {
        alert('Please enter the first name.');
    } else if (!lastName) {
        alert('Please enter the last name.');
    } else if (!phoneNum) {
        alert('Please enter the phone number.');
    } else if (!emailAdd) {
        alert('Please enter the email address.');
    } else {
        editContact(contactID, firstName, lastName, phoneNum, emailAdd);
        contactDataModal.style.display = 'none';
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
                console.log(contactID);
            }
        });

        contactDataModal.style.display = 'flex';
        document.body.classList.add('modal-open');

        submitDataBtn.removeEventListener('click', handleNewContactSubmit);  
        submitDataBtn.removeEventListener('click', handleEditContactSubmit); 
        submitDataBtn.addEventListener('click', () => handleEditContactSubmit(contactID)); 
    }
});

exitBtn.addEventListener('click', function() {
    contactDataModal.style.display = 'none';
    document.body.classList.remove('modal-open'); 
    firstNameInput.value = '';
    lastNameInput.value = ''
    numberInput.value = '';
    emailInput.value = '';
});

// contactList.addEventListener('click', (event) => {
//     if (event.target && event.target.id === 'edit-icon') {
//         const contactItem = event.target.closest('.contact-item');
        
//         const contactNameElement = contactItem.querySelector('#contact-name');
//         const contactFirstNameElement = contactNameElement.querySelector("#first-name");
//         const contactLastNameElement = contactNameElement.querySelector("#last-name");
//         const contactNumberElement = contactItem.querySelector('#contact-number');
//         const contactEmailElement = contactItem.querySelector('#contact-email');

//         let contactID;

//         userContacts.forEach(contact => {
//             if (contact.FirstName === contactFirstNameElement.textContent && 
//                 contact.LastName === contactLastNameElement.textContent && 
//                 contact.Phone === contactNumberElement.textContent && 
//                 contact.Email === contactEmailElement.textContent) {
//                 contactID = contact.ID;
//                 console.log(contactID);
//             }
//         });
        
//         contactDataModal.style.display = 'flex';
//         document.body.classList.add('modal-open');

//         submitDataBtn.onclick = function() {
//             const firstName = firstNameInput.value;
//             const lastName = lastNameInput.value;
//             const phoneNum = numberInput.value;
//             const emailAdd = emailInput.value;
        
//             if (!firstName) {
//                 alert('Please enter the first name.');
//             }
//             else if (!lastName) {
//                 alert('Please enter the last name.');
//             }    
//             else if (!phoneNum) {
//                 alert('Please enter the phone number.');
//             }
//             else if (!emailAdd) {
//                 alert('Please enter the email address.');
//             }
//             else {
//                 editContact(contactID, firstName, lastName, phoneNum, emailAdd);
//                 contactDataModal.style.display = 'none';
//                 document.body.classList.remove('modal-open');
//                 firstNameInput.value = '';
//                 lastNameInput.value = ''
//                 numberInput.value = '';
//                 emailInput.value = '';
//             }
//         };
//     }
// });

//testing

//editIcon.addEventListener('click', function() {      
    
    // document.getElementById('edit-contact-modal').style.display = 'flex';
    // document.body.classList.add('modal-open');

    // // Save button event to trigger editContacts
    // document.getElementById('submitEditBtn').onclick = function() {
    //     const updatedFirstName = document.getElementById('FirstNameInput').value;
    //     const updatedLastName = document.getElementById('lastNameInput').value; 
    //     const updatedNumber = document.getElementById('NumberInput').value;
    //     const updatedEmail = document.getElementById('EmailInput').value;
        
    //     //we need the id to track which contact we're editing. Each contact has a unique userID that we can use to track it

    //     //FOR HENRIQUE (Uncomment editContact(jsonObject[i].ID, updatedFirstName, updatedLastName, updatedNumber, updatedEmail) )
    //     //editContact(jsonObject[i].ID, updatedFirstName, updatedLastName, updatedNumber, updatedEmail);

    //     document.getElementById('edit-contact-modal').style.display = 'none';
    //     document.body.classList.remove('modal-open');
    // };
    
    // // Exit button event in editContacts
    // document.getElementById('exitEditBtn').onclick = function() {
    //     document.getElementById('edit-contact-modal').style.display = 'none';
    //     document.body.classList.remove('modal-open'); 
    // };

//});

// function loadContacts() {
//     let newContactObj = 
//     {
//         "userID": userId
//     };

//     let jsonPayload = JSON.stringify(newContactObj);

//     let url = urlBase + '/getContacts.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//     try {
//         xhr.onreadystatechange = function() {
//             if (this.readyState == 4 && this.status == 200) {
//                 let jsonObject = JSON.parse(xhr.responseText);
                
//                 //log entire contacts object
//                 console.log("Contacts:", jsonObject);
                
//                 // Clear the current contact list
//                 const contactContainer = document.querySelector(".contact-item-container");
//                 contactContainer.innerHTML = "";

//                 // Loop through each contact and display it
//                 for (let i = 0; i < jsonObject.length; i++) {
//                     //MAKE SURE JSON OBJECTS MATCH CONTACTS COLUMN NAMES IN DATABASE 
//                     const newContactElement = document.createElement("div");
//                     newContactElement.className = "contact-item";
                
//                     const contactName = document.createElement("span");
//                     contactName.id = "contact-name";
//                     contactName.textContent = jsonObject[i].FirstName + ' ' + jsonObject[i].LastName;
//                     newContactElement.appendChild(contactName);
                
//                     const contactNumber = document.createElement("span");
//                     contactNumber.id = "contact-number";
//                     contactNumber.textContent = jsonObject[i].Phone; 
//                     newContactElement.appendChild(contactNumber);
                
//                     const contactEmail = document.createElement("span");
//                     contactEmail.id = "contact-email";
//                     contactEmail.textContent = jsonObject[i].Email;
//                     newContactElement.appendChild(contactEmail);

//                     //edit and delete buttons
//                     const contactMods = document.createElement("div");
//                     contactMods.className = "contact-mods";
//                     const editIcon = document.createElement("i");
//                     editIcon.className = "far fa-edit";
//                     const trashIcon = document.createElement("i");
//                     trashIcon.className = "fa fa-trash-alt";
//                     contactMods.appendChild(editIcon);
//                     contactMods.appendChild(trashIcon);
//                     newContactElement.appendChild(contactMods);
                
//                     // Append the new contact element to the contact container
//                     const contactContainer = document.querySelector(".contact-item-container");
//                     contactContainer.appendChild(newContactElement);
                    
//                     //EDIT CONTACTS
//                     editIcon.addEventListener('click', function() {
                    
//                         // Open the edit modal and populate fields with current contact info
//                         //jsonObject[i] pulls contact we're editing from the list we're iterating through (it's in the for loop)
//                         document.getElementById('FirstNameInput').value = jsonObject[i].FirstName;
//                         document.getElementById('lastNameInput').value = jsonObject[i].LastName;
//                         document.getElementById('NumberInput').value = jsonObject[i].Phone;
//                         document.getElementById('EmailInput').value = jsonObject[i].Email;

//                         // Open the edit modal
//                         document.getElementById('edit-contact-modal').style.display = 'flex';
//                         document.body.classList.add('modal-open');

//                         // Save button event to trigger editContacts
//                         document.getElementById('submitEditBtn').onclick = function() {
//                             const updatedFirstName = document.getElementById('FirstNameInput').value;
//                             const updatedLastName = document.getElementById('lastNameInput').value; 
//                             const updatedNumber = document.getElementById('NumberInput').value;
//                             const updatedEmail = document.getElementById('EmailInput').value;
                            
//                             //we need the id to track which contact we're editing. Each contact has a unique userID that we can use to track it

//                             //FOR HENRIQUE (Uncomment editContact(jsonObject[i].ID, updatedFirstName, updatedLastName, updatedNumber, updatedEmail) )
//                             //editContact(jsonObject[i].ID, updatedFirstName, updatedLastName, updatedNumber, updatedEmail);

//                             // Close the modal
//                             document.getElementById('edit-contact-modal').style.display = 'none';
//                             document.body.classList.remove('modal-open');
//                         };
                        
//                         // Exit button event in editContacts
//                         document.getElementById('exitEditBtn').onclick = function() {
//                             document.getElementById('edit-contact-modal').style.display = 'none';
//                             document.body.classList.remove('modal-open'); 
//                         };

//                     });


//                     // DELETE CONTACTS
//                     trashIcon.addEventListener('click', function() {
//                         //we also need id to erase the contact from the table 

//                         //FOR HENRIQUE (Uncomment deleteContact(jsonObject[i].ID)
//                         //deleteContact(jsonObject[i].ID)
//                     });
                
//                 }
//             }
//         };
//         xhr.send(jsonPayload);
//     } catch (err) {
//         console.log("Error loading contacts: " + err.message);
//     }
// }