document.addEventListener("DOMContentLoaded", function () {
    // Select the toggle button for switching between "Add Course" and "Delete Course" mode
    const toggleButton = document.getElementById("toggleCourse");

    // Select the course title element to change text dynamically
    const courseTitle = document.getElementById("courseTitle");

    // Get the Student Interface button
    const studentInterfaceButton = document.querySelector("a[href='./../student-interface-demo/interface.html'] button");

    // Select all buttons except the toggle button and Student Interface button
    const allButtons = document.querySelectorAll("button:not(#toggleCourse):not(.student-interface-button)");

    // Function to show an error message using the popup modal
    function showError(message) {
        const popupModal = document.getElementById("popupModal");
        const popupMessage = document.getElementById("popupMessage");

        if (popupModal && popupMessage) {
            popupMessage.textContent = message || "Invalid Search";
            popupModal.style.display = "block";
        } else {
            // Fallback to alert if modal elements don't exist
            alert(message || "Invalid Search");
        }
    }

    // Set up the close button for the popup modal
    const closePopupBtn = document.getElementById("closePopupBtn");
    if (closePopupBtn) {
        closePopupBtn.addEventListener("click", function() {
            const popupModal = document.getElementById("popupModal");
            if (popupModal) {
                popupModal.style.display = "none";
            }
        });
    }

    // Function to toggle between "Add Course" and "Delete Course" modes
    function toggleCourseMode() {
        if (courseTitle && toggleButton) { // Ensure elements exist before modifying them
            if (courseTitle.innerText === "Add Course") {
                courseTitle.innerText = "Delete Course"; // Change title to "Delete Course"
                toggleButton.innerText = "Switch to Add Course"; // Update button text accordingly
            } else {
                courseTitle.innerText = "Add Course"; // Change title back to "Add Course"
                toggleButton.innerText = "Switch to Delete Course"; // Update button text accordingly
            }
        }
    }

    // Attach an event listener to the search buttons to show an error message
    allButtons.forEach(button => {
        // Only attach to buttons that aren't the close popup button
        if (button !== closePopupBtn && button !== studentInterfaceButton) {
            button.addEventListener("click", function () {
                showError("Invalid Search"); // Display an error message when any other button is clicked
            });
        }
    });

    // Make window.showError available globally
    window.showError = showError;

    // Ensure the toggle button still functions properly
    if (toggleButton) {
        // Remove any previous event listeners to avoid duplicate handlers
        toggleButton.removeEventListener("click", toggleCourseMode);
        // Add the event listener
        toggleButton.addEventListener("click", toggleCourseMode);
    } else {
        console.error("Toggle button not found."); // Log an error if the toggle button is missing
    }

    // Prevent Student Interface button from triggering error
    if (studentInterfaceButton) {
        studentInterfaceButton.addEventListener("click", function(event) {
            // Stop any other event listeners from firing
            event.stopPropagation();
            // Let the default navigation behavior happen
        });
    }
});
