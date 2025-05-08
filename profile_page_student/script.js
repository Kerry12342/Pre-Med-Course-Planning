// SESSION SYSTEM + PROFILE PAGE SCRIPT

document.addEventListener("DOMContentLoaded", () => {
  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
          sessionStorage.clear();
          window.location.href = "../Login_Page/login_page.html"; // Adjust path if needed
      });
  }

  // Profile Button
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
      profileBtn.addEventListener("click", () => {
          window.location.href = "../Student_Page/student.html"; // Adjust path if needed
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

  // Load student profile when page loads
  loadStudentProfile();
});

const editBtn = document.getElementById('editProfileBtn');
const inputs = document.querySelectorAll('.section input');

let isEditing = false;

if (editBtn) {
  editBtn.addEventListener('click', () => {
      isEditing = !isEditing;

      inputs.forEach(input => {
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

// Loads student profile using session storage
function loadStudentProfile() {
  const studentEmail = sessionStorage.getItem("studentEmail");

  if (!studentEmail) {
      alert("No student session found. Please log in.");
      window.location.href = "../Login_Page/login_page.html";
      return;
  }

  getDatabase().then(data => {
      const students = data[0].data.students;
      const currentStudent = students.find(s => s.email.toLowerCase() === studentEmail.toLowerCase());

      if (!currentStudent) {
          alert("Student profile not found.");
          return;
      }

      // Populate fields
      document.getElementById("fullName").value = currentStudent.name || "";
      document.getElementById("email").value = currentStudent.email || "";
      document.getElementById("pronouns").value = currentStudent.pronouns || "";
      document.getElementById("advisors").value = currentStudent.advisors || "";
      document.getElementById("majors").value = currentStudent.majors || "";
      document.getElementById("track").value = currentStudent.track || "";
      document.getElementById("classYear").value = currentStudent.classYear || "";
  });
}

function saveProfile() {
  getDatabase().then(data => {
      const students = data[0].data.students;

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const pronouns = document.getElementById("pronouns").value.trim();
      const advisors = document.getElementById("advisors").value.trim();
      const majors = document.getElementById("majors").value.trim();
      const track = document.getElementById("track").value.trim();
      const classYear = document.getElementById("classYear").value.trim();

      const studentIndex = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());

      if (studentIndex === -1) {
          alert("Student not found in database.");
          return;
      }

      // Update student data
      students[studentIndex] = {
          ...students[studentIndex],
          fullName,
          email,
          pronouns,
          advisors,
          majors,
          track,
          classYear
      };

      saveDatabase(data[0].data);
      alert('Profile saved!');
  });
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
