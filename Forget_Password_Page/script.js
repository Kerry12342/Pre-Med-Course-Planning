document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const resetButton = document.querySelector('.reset-button');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const confirmationMessage = document.getElementById('confirmation');

    // Initially hide error and confirmation
    emailError.style.display = 'none';
    confirmationMessage.style.display = 'none';

    // Track if email field has been interacted with
    let emailTouched = false;

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', function() {
        console.log('Menu clicked');
        // Add your menu toggle functionality here
    });

    // Validate Hamilton email
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const isValid = emailValue && emailValue.toLowerCase().endsWith('@hamilton.edu');

        if (!isValid && emailValue && emailTouched) {
            emailError.style.display = 'flex';
            emailInput.style.borderColor = 'red';
            return false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '';
            return isValid;
        }
    }

    // Mark email as touched on blur
    emailInput.addEventListener('blur', function() {
        emailTouched = true;
        validateEmail();
    });

    // Real-time validation after field has been touched
    emailInput.addEventListener('input', function() {
        if (emailTouched) {
            validateEmail();
        }
    });

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        emailTouched = true;

        // Run validation
        const isEmailValid = validateEmail();

        // Check if email is empty
        if (!emailInput.value) {
            emailError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please enter your email address';
            emailError.style.display = 'flex';
            emailInput.style.borderColor = 'red';
            return;
        }

        // Submit if email is valid
        if (isEmailValid) {
            console.log('Reset password requested for:', emailInput.value);

            // Show confirmation message
            confirmationMessage.style.display = 'flex';

            // Disable reset button and input field
            resetButton.disabled = true;
            resetButton.style.opacity = '0.7';
            resetButton.textContent = 'Email Sent';
            emailInput.disabled = true;

            // In a real application, you would send a request to your backend here
        }
    });
});
