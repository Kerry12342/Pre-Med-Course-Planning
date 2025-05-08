// SESSION SYSTEM + PROFILE PAGE SCRIPT

document.addEventListener("DOMContentLoaded", () => {
  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (isDirty) {
        const proceed = confirm("You have unsaved changes. Are you sure you want to log out without saving?");
        if (!proceed) return;
      }
      sessionStorage.clear();
      window.location.href = "../Login_Page/login_page.html"; // Adjust path if needed
    });
  }
  

  // Profile Button
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (isDirty) {
        const proceed = confirm("You have unsaved changes. Are you sure you want to go back without saving?");
        if (!proceed) return;
      }
      window.location.href = "../Admin_Page/millstone2_initial.html"; // Adjust path if needed
    });
  }
  

  // Hamburger Menu
  const hamburger = document.getElementById("hamburgerMenu");
  const logoutContainer = document.getElementById("logoutContainer");
  const profilePage = document.getElementById("profileContainer");

  if (hamburger) {
      hamburger.addEventListener("click", () => {
          logoutContainer.classList.toggle("active");
          profilePage.classList.toggle("active");
          hamburger.classList.toggle('active');
      });
  }

  // Load admin profile when page loads
  loadAdminProfile();
});

const editBtn = document.getElementById('editProfileBtn');
const inputs = document.querySelectorAll('.section input');
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (isEditing) {
      isDirty = true;
    }
  });
});


let isEditing = false;
let isDirty = false;

if (editBtn) {
  editBtn.addEventListener('click', () => {
      isEditing = !isEditing;

      inputs.forEach(input => {
        if (input.id === "fullName" || input.id === "email") {
          input.readOnly = true; // Always readonly
          return;
        }
        input.readOnly = !isEditing;
        input.style.borderColor = isEditing ? '#002f86' : '#ccc';
        input.style.backgroundColor = isEditing ? '#f9f9ff' : 'white';
      });      

      editBtn.textContent = isEditing ? 'Save Profile' : 'Edit Profile';

      if (!isEditing) {
          saveProfile();
      }
  });
}

// Loads admin profile using session storage
function loadAdminProfile() {
  const adminEmail = sessionStorage.getItem("adminEmail");

  if (!adminEmail) {
      alert("No admin session found. Please log in.");
      window.location.href = "../Login_Page/login_page.html";
      return;
  }

  getDatabase().then(data => {
      const admin = data[0].data.admins;
      const currentAdmin = admin.find(s => s.email.toLowerCase() === adminEmail.toLowerCase());

      if (!currentAdmin) {
          alert("Admin profile not found.");
          return;
      }

      // Populate fields
      document.getElementById("fullName").value = currentAdmin.name || "";
      document.getElementById("email").value = currentAdmin.email || "";
      document.getElementById("Pronouns").value = currentAdmin.Pronouns || "";
      document.getElementById("advisee").value = currentAdmin.advisee || "";
      document.getElementById("department").value = currentAdmin.department || "";
      document.getElementById("notes").value = currentAdmin.notes || "";
  });
}

function saveProfile() {
  getDatabase().then(data => {
      const admin = data[0].data.admins;

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const Pronouns = document.getElementById("Pronouns").value.trim();
      const advisee = document.getElementById("advisee").value.trim();
      const department = document.getElementById("department").value.trim();
      const notes = document.getElementById("notes").value.trim();

      const adminIndex = admin.findIndex(s => s.email.toLowerCase() === email.toLowerCase());

      if (adminIndex === -1) {
          alert("Admin not found in database.");
          return;
      }

      // Update admin data
      admin[adminIndex] = {
          ...admin[adminIndex],
          fullName,
          email,
          Pronouns,
          advisee,
          department,
          notes
      };

      saveDatabase(data[0].data);
      alert('Profile saved!');
  });
  
  isDirty = false;
}

// Saves database information
function saveDatabase(database) {
  fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: database })
  })
  .then(response => response.json())
  .then(data => {
      console.log('Database saved:', data);
  })
  .catch(error => {
      console.error('Error saving database:', error);
  });
}

// Fetches database information
function getDatabase() {
  return fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/get-json')
      .then(response => response.json())
      .catch(error => {
          console.error('Error fetching database:', error);
          return []; 
      });
}


// Change Password Modal Setup
const changePasswordBtn = document.getElementById("changePassword");
const passwordModal = document.getElementById("passwordModal");
const submitPasswordChange = document.getElementById("submitPasswordChange");
const cancelPasswordChange = document.getElementById("cancelPasswordChange");

if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", () => {
    openPasswordModal();
  });
}

function openPasswordModal() {
  // Clear previous input
  document.getElementById("currentPasswordInput").value = "";
  document.getElementById("newPasswordInput").value = "";
  document.getElementById("confirmPasswordInput").value = "";

  passwordModal.style.display = "flex";
}

cancelPasswordChange.addEventListener("click", () => {
  passwordModal.style.display = "none";
});

submitPasswordChange.addEventListener("click", () => {
  handlePasswordSubmit();
});

function handlePasswordSubmit() {
  const currentPassword = document.getElementById("currentPasswordInput").value.trim();
  const newPassword = document.getElementById("newPasswordInput").value.trim();
  const confirmPassword = document.getElementById("confirmPasswordInput").value.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return alert("Please fill in all fields.");
  }

  if (newPassword.length < 6) {
    return alert("New password must be at least 6 characters.");
  }

  if (newPassword !== confirmPassword) {
    return alert("New password and confirmation do not match.");
  }

  // Proceed to update password
  updatePassword(currentPassword, newPassword);
  passwordModal.style.display = "none";
}


function updatePassword(currentPassword, newPassword) {
  const adminEmail = sessionStorage.getItem("adminEmail");
  if (!adminEmail) {
    return alert("No admin session found. Please log in.");
  }

  getDatabase().then(data => {
    const admins = data[0].data.admins;
    const adminIndex = admins.findIndex(s => s.email.toLowerCase() === adminEmail.toLowerCase());

    if (adminIndex === -1) {
      return alert("Admin not found in database.");
    }

    const admin = admins[adminIndex];

    // Simple password check (assuming you store plain text password, though in real apps this should be hashed)
    if (admins.password !== currentPassword) {
      return alert("Current password is incorrect.");
    }

    // Update password
    admins[adminIndex].password = newPassword;

    saveDatabase(data[0].data);
    alert("Password changed successfully!");
  });
}
