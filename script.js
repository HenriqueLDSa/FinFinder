// Function to toggle password visibility
function togglePasswordVisibility(passwordField, toggleIcon) {
    
    // If the current type attribute is 'password', set it to 'text'. Otherwise, set it to 'password'.
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle icon between locked and unlocked
    toggleIcon.classList.toggle('bxs-lock');
    toggleIcon.classList.toggle('bxs-lock-open');
}

// Event listener for password and confirm password (index and register html)
document.getElementById('togglePassword').addEventListener('click', function () {
    togglePasswordVisibility(document.getElementById('password'), this);
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    togglePasswordVisibility(document.getElementById('confirm-password'), this);
});
