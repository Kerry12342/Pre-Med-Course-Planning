document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const submitButton = document.querySelector('.submit-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Error messages
    const emailError = document.getElementById('email-error');
    const passwordComplexityError = document.getElementById('password-complexity-error');
    const passwordMatchError = document.getElementById('password-match-error');

    // Track if fields have been interacted with
    let emailTouched = false;
    let passwordTouched = false;
    let confirmPasswordTouched = false;
    let formSubmitted = false;

    // Initially hide all error messages
    emailError.style.display = 'none';
    passwordComplexityError.style.display = 'none';
    passwordMatchError.style.display = 'none';

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', function() {
        console.log('Menu clicked');
        // Add your menu toggle functionality here
    });

    // Validate Hamilton email
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const isValid = emailValue && emailValue.toLowerCase().endsWith('@hamilton.edu');

        if (!isValid && emailValue && (emailTouched || formSubmitted)) {
            emailError.style.display = 'flex';
            emailInput.style.borderColor = 'red';
            return false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '';
            return isValid || !formSubmitted;
        }
    }

    // Password matching validation
    function validatePasswordsMatch() {
        if (passwordInput.value && confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                if (confirmPasswordTouched || formSubmitted) {
                    passwordMatchError.style.display = 'flex';
                    confirmPasswordInput.style.borderColor = 'red';
                }
                return false;
            } else {
                passwordMatchError.style.display = 'none';
                confirmPasswordInput.style.borderColor = '';
                return true;
            }
        }
        return !formSubmitted;
    }

    // Check password complexity
    function validatePasswordComplexity() {
        const password = passwordInput.value;

        if (!password || (!passwordTouched && !formSubmitted)) {
            passwordComplexityError.style.display = 'none';
            passwordInput.style.borderColor = '';
            return !formSubmitted;
        }

        // At least 8 characters
        const hasMinLength = password.length >= 8;

        // At least one lowercase letter
        const hasLowerCase = /[a-z]/.test(password);

        // At least one uppercase letter
        const hasUpperCase = /[A-Z]/.test(password);

        // At least one number
        const hasNumber = /[0-9]/.test(password);

        // At least 3 special characters
        const specialChars = password.replace(/[a-zA-Z0-9]/g, '');
        const hasSpecialChars = new Set(specialChars).size >= 3;

        const isValid = hasMinLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChars;

        if (!isValid && (passwordTouched || formSubmitted)) {
            let errorMsg = "Password must contain:";
            if (!hasMinLength) errorMsg += " at least 8 characters;";
            if (!hasLowerCase) errorMsg += " at least one lowercase letter;";
            if (!hasUpperCase) errorMsg += " at least one uppercase letter;";
            if (!hasNumber) errorMsg += " at least one number;";
            if (!hasSpecialChars) errorMsg += " at least 3 different special characters;";

            passwordComplexityError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + errorMsg;
            passwordComplexityError.style.display = 'flex';
            passwordInput.style.borderColor = 'red';
            return false;
        } else {
            passwordComplexityError.style.display = 'none';
            passwordInput.style.borderColor = '';
            return isValid || !formSubmitted;
        }
    }

    // Mark fields as touched on blur (when user clicks away)
    emailInput.addEventListener('blur', function() {
        emailTouched = true;
        validateEmail();
    });

    passwordInput.addEventListener('blur', function() {
        passwordTouched = true;
        validatePasswordComplexity();
        if (confirmPasswordTouched) {
            validatePasswordsMatch();
        }
    });

    confirmPasswordInput.addEventListener('blur', function() {
        confirmPasswordTouched = true;
        validatePasswordsMatch();
    });

    // Real-time validation after fields have been touched
    emailInput.addEventListener('input', function() {
        if (emailTouched || formSubmitted) {
            validateEmail();
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordTouched || formSubmitted) {
            validatePasswordComplexity();
        }
        if (confirmPasswordTouched || formSubmitted) {
            validatePasswordsMatch();
        }
    });

    confirmPasswordInput.addEventListener('input', function() {
        if (confirmPasswordTouched || formSubmitted) {
            validatePasswordsMatch();
        }
    });

    // Submit button functionality
    submitButton.addEventListener('click', function() {
        formSubmitted = true;

        // Run all validations
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePasswordComplexity();
        const isPasswordMatching = validatePasswordsMatch();

        // Check if fields are empty
        if (!emailInput.value) {
            emailError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Email cannot be empty';
            emailError.style.display = 'flex';
            emailInput.style.borderColor = 'red';
        }

        if (!passwordInput.value) {
            passwordComplexityError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Password cannot be empty';
            passwordComplexityError.style.display = 'flex';
            passwordInput.style.borderColor = 'red';
        }

        if (!confirmPasswordInput.value) {
            passwordMatchError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please confirm your password';
            passwordMatchError.style.display = 'flex';
            confirmPasswordInput.style.borderColor = 'red';
        }

        // Submit if everything is valid
        if (isEmailValid && isPasswordValid && isPasswordMatching) {
            console.log('Account creation submitted');
            alert('Account created successfully! You will be redirected to the login page.');
            // Redirect to login page
            window.location.href = 'index.html';
        }
    });
});
