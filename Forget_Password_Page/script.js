document.addEventListener('DOMContentLoaded', function() {

    // Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const resetButton = document.querySelector('.reset-button');
    const confirmationMessage = document.getElementById('confirmation');
    const emailInput = document.getElementById('email');
    const adminPassReset = "12345";
    const adminInput = document.getElementById('admincode');
    const passwordInput = document.getElementById('newpassword');
    //confirmationMessage.style.display = 'none';


    // Database functions

    // Saves database. Pass it the updated database.
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


  

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', function() {
        console.log('Menu clicked');
        // Add your menu toggle functionality here
    });


    console.log(resetButton)

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        console.log(adminPassReset)
        console.log(adminInput)
        emailTouched = true;


        // Check if email is empty
        if (!emailInput.value) {
            emailError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please enter your email address';
            emailError.style.display = 'flex';
            emailInput.style.borderColor = 'red';
            return;
        }

        getDatabase().then(data => {

            if (adminPassReset == adminInput.value) {
                console.log(data)

                const student = data[0].data.students.find(s => s.email == emailInput.value);
                const admin = data[0].data.admins.find(s => s.email == emailInput.value);
                if (!student && !admin) {
                    alert('No account with this email exists');
                    return;
                }
                else if (student) {
                    data[0].data.students.splice([data[0].data.students.indexOf(student)], 1);
                    student.password = passwordInput.value;
                    data[0].data.students.push(student);
                }
                else if (admin) {
                    data[0].data.admins.splice([data[0].data.admins.indexOf(admin)], 1);
                    admin.password = passwordInput.value;
                    data[0].data.admins.push(admin);
                }
                saveDatabase(data[0].data);
                console.log('Reset password requested for:', emailInput.value);
                alert('Password Reset!');

            }
            else {
                alert('Invalid admin code!');
            }
            window.location.href = "./../Login_Page/login_page.html";

        });



        // Show confirmation message
        confirmationMessage.style.display = 'flex';

        // Disable reset button and input field
        resetButton.disabled = true;
        resetButton.style.opacity = '0.7';
        resetButton.textContent = 'Email Sent';
        emailInput.disabled = true;


            // In a real application, you would send a request to your backend here
    });
});
