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
    const forgotPasswordLink = document.querySelector('a[href*="forget_password.html"]');
    const createAccountLink = document.querySelector('a[href*="create_account.html"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Login button functionality
    loginButton.addEventListener('click', function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        console.log('login pressed');

        if (email && password) {
            console.log('Login attempted with email:', email);

            getDatabase().then(data => {
                console.log(data);
                const student = data[0].data.students.find(s => s.email == email);
                const admin = data[0].data.admins.find(s => s.email == email);

                if (admin && admin.password == password) {
                    sessionStorage.setItem("user", JSON.stringify({
                        email: admin.email,
                        role: 'admin'
                    }));
                    sessionStorage.setItem("adminEmail", admin.email); //
                    window.location.href = "./../Admin_Page/millstone2_initial.html";
                }
                else if (student && student.password == password) {
                    sessionStorage.setItem("user", JSON.stringify({
                        email: student.email,
                        role: 'student'
                    }));
                    sessionStorage.setItem("studentEmail", student.email); //
                    window.location.href = "./../Student_Page/student.html";
                }
                else {
                    alert('Incorrect Password');
                }
            });
        } else {
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
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value;

            if (email) {
                console.log('Password reset requested for email:', email);
                alert('Password reset instructions have been sent to your email.');
            } else {
                emailInput.style.borderColor = 'red';
                alert('Please enter your email address to reset your password');
            }
        });
    }

    // Create account functionality
    if (createAccountLink) {
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Create account requested');
            window.location.href = '../Create_Account_Page/create_account.html';
        });
    }

    // Handle Enter key press in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
});
