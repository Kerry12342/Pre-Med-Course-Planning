

// Database functions.
// Save database. Takes the updated database as an argument.
function saveDatabase(database) {

    fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: database })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Returns the database as it currently is.
function getDatabase() {
    return fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/get-json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return []; // Return an empty array in case of an error
        });
}


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


            getDatabase().then(data => {
                console.log(data);
                const student = data[0].data.students.find(s => s.email == email);
                const admin = data[0].data.admins.find(s => s.email == email);
                // if (admin && admin.password == password) {
                //     window.location.href = "./../Admin_Page/millstone2_initial.html";
                // }
                // else if (student && student.password == password) {
                //     window.location.href = "./../Student_Page/student.html";
                // }

                if (admin && admin.password == password) {
                    sessionStorage.setItem("user", JSON.stringify({
                        email: admin.email,
                        role: 'admin'
                    }));
                    window.location.href = "./../Admin_Page/millstone2_initial.html";
                }
                else if (student && student.password == password) {
                    sessionStorage.setItem("user", JSON.stringify({
                        email: student.email,
                        role: 'student'
                    }));
                    window.location.href = "./../Student_Page/student.html";
                }
                else {
                    alert('Incorrect Password');

                }
            })



            // Have fetch from user.
            // var userRole = "student"
            // if (userRole === "admin") {
            //     window.location.href = "./../Admin_Page/millstone2_initial.html";
            // } else if (userRole === "student") {
            //     window.location.href = "./../student-interface-demo/interface.html";
            // }

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
