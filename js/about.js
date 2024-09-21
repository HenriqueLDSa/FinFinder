
const aboutUsBtn = document.getElementById("about-us-btn");
const logoutBtn = document.getElementById("logout-btn");
const contactBtn = document.getElementById("contacts-btn");

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/welcome";
}

logoutBtn.addEventListener('click', doLogout);

aboutUsBtn.addEventListener('click', () => {
    window.location.href = "/about";
});

contactBtn.addEventListener('click', () => {
    window.location.href = "/dashboard";
});