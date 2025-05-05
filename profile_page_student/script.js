// window.onload = loadStudent;


document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "../Login_Page/login_page.html"; // Adjust path if needed
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            window.location.href = "../Student_Page/student.html"; // Adjust path if needed
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburgerMenu");
    const logoutContainer = document.getElementById("logoutContainer");
    const profilePage = document.getElementById("profileContainer");

    hamburger.addEventListener("click", () => {
        logoutContainer.classList.toggle("active");
        profilePage.classList.toggle("active");
        hamburger.classList.toggle('active');
    });
});

const editBtn = document.getElementById('editProfileBtn');
const inputs = document.querySelectorAll('.section input');

let isEditing = false;

editBtn.addEventListener('click', () => {
  isEditing = !isEditing;

  // Toggle readonly attribute
  inputs.forEach(input => {
    input.readOnly = !isEditing;
    // Optional: add a border highlight when editing
    input.style.borderColor = isEditing ? '#002f86' : '#ccc';
    input.style.backgroundColor = isEditing ? '#f9f9ff' : 'white';
  });

  // Change button text
  editBtn.textContent = isEditing ? 'Save Profile' : 'Edit Profile';

  // (Optional) if saving, you can run save logic here
  if (!isEditing) {
    saveProfile(); // Define your save logic if you want
  }
});

// Example save function
function saveProfile() {
  inputs.forEach(input => {
    console.log(`${input.placeholder}: ${input.value}`);
  });
  alert('Profile saved!');
}

