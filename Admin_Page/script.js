document.addEventListener("DOMContentLoaded", function () {
    // Select the toggle button for switching between "Add Course" and "Delete Course" mode
    const toggleButton = document.getElementById("toggleCourse");

    // Select all buttons except the toggle button
    const allButtons = document.querySelectorAll("button:not(#toggleCourse)");

    // Select the course title element to change text dynamically
    const courseTitle = document.getElementById("courseTitle");

    // Function to show an error message using an alert
    function showError(message) {
        alert(message); // Display alert with the given error message
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

    // Attach an event listener to all buttons (except the toggle button) to show an error message
    allButtons.forEach(button => {
        button.addEventListener("click", function () {
            showError("Invalid Search"); // Display an error message when any other button is clicked
        });
    });

    // Ensure the toggle button still functions properly
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleCourseMode); // Attach event listener to toggle button
    } else {
        console.error("Toggle button not found."); // Log an error if the toggle button is missing
    }
});
