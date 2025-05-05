document.addEventListener("DOMContentLoaded", () => {
    const signoutLink = document.getElementById("signout-link");
    signoutLink.addEventListener("click", () => {
        sessionStorage.clear();
    });
});

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
            window.location.href = "../Admin_Page/millstone2_initial.html"; // Adjust path if needed
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

