document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const loginButton = document.querySelector('.login-button');
    const forgotPasswordBtn = document.querySelector('.forgot-password-btn');
    const createAccount = document.querySelector('.create-account');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', function() {
        // Add your menu toggle logic here
        console.log('Menu clicked');
    });

    // Login button functionality
    loginButton.addEventListener('click', function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            // Add your login logic here
            console.log('Login attempted with email:', email);

            // Have fetch from user.
            var userRole = "student"
            if (userRole === "admin") {
                window.location.href = "./../Admin_Page/millstone2_initial.html";
            } else if (userRole === "student") {
                window.location.href = "./../student-interface-demo/interface.html";
            } else {
              alert("User role not recognized");
            }
            // Here you would typically make an API call to verify credentials
        } else {
            // Show validation error
            if (!email) {
                emailInput.style.borderColor = 'red';
            }

            if (!password) {
                passwordInput.style.borderColor = 'red';
            }

            alert('Please fill in all required fields');

            
        }
    });

    // Remove validation styling on input
    emailInput.addEventListener('input', function() {
        this.style.borderColor = '';
    });

    passwordInput.addEventListener('input', function() {
        this.style.borderColor = '';
    });

    // Forgot password functionality
    forgotPasswordBtn.addEventListener('click', function() {
        const email = emailInput.value;

        if (email) {
            // Add your password reset logic here
            console.log('Password reset requested for email:', email);
            alert('Password reset instructions have been sent to your email.');
        } else {
            emailInput.style.borderColor = 'red';
            alert('Please enter your email address to reset your password');
        }
    });

    // Create account functionality
    createAccount.addEventListener('click', function(e) {
        e.preventDefault();
        // Add your account creation logic here or redirect to registration page
        console.log('Create account requested');
        // Example of redirect: window.location.href = 'register.html';
    });

    // Handle Enter key press in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });


});
