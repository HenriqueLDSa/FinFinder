const urlBase = 'http://team27poosd.site/LAMPAPI';
const extension = 'php';

const aboutUsBtn = document.getElementById("about-us-btn");
const logoutBtn = document.getElementById("logout-btn");

const newContactBtn = document.querySelector(".new-user-button");
const nameModal = document.getElementById('contact-data-modal');
const submitDataBtn = document.getElementById('submitDataBtn');
const firstNameInput = document.getElementById('firstNameInput');
const numberInput = document.getElementById('numberInput');
const emailInput = document.getElementById('emailInput');

let userId = 0;
let firstName = "";
let lastName = "";

function doLogout()
{
	// userId = 0;
	// firstName = "";
	// lastName = "";
	// document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact(name, number, email){
    const newContactElement = document.createElement("div");
    newContactElement.className = "contact-item";
    
    const contactName = document.createElement("span");
    contactName.id = "contact-name";
    contactName.textContent = name;
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

logoutBtn.addEventListener('click', doLogout());

newContactBtn.addEventListener('click', function() {
    nameModal.style.display = 'flex';
    document.body.classList.add('modal-open');
});

submitDataBtn.addEventListener('click', function() {
    const firstName = firstNameInput.value;
    const phoneNum = numberInput.value;
    const emailAdd = emailInput.value;

    if (!firstName) {
        alert('Please enter the first name.');
    }
    else if (!phoneNum) {
        alert('Please enter the phone number.');
    }
    else if (!emailAdd) {
        alert('Please enter the email address.');
    }
    else {
        addContact(firstName, phoneNum, emailAdd);
        nameModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});