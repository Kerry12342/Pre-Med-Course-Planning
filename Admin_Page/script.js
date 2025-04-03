document.addEventListener("DOMContentLoaded", function () {
    // Course data structure
    const courses = [
        {
            "title": "BIO-100",
            "semester": "Fall 2025",
            "studentCount": 5,
            "department": "Biology"
        },
        {
            "title": "BIO-100LAB",
            "semester": "Fall 2025",
            "studentCount": 3,
            "department": "Biology"
        },
        {
            "title": "CHEM-400",
            "semester": "Spring 2026",
            "studentCount": 5,
            "department": "Chemistry"
        },
        {
            "title": "BIO-110",
            "semester": "Fall 2025",
            "studentCount": 7,
            "department": "Biology"
        },
        {
            "title": "CHEM-110",
            "semester": "Spring 2026",
            "studentCount": 4,
            "department": "Chemistry"
        },
        {
            "title": "PHYS-120",
            "semester": "Fall 2025",
            "studentCount": 6,
            "department": "Physics"
        },
        {
            "title": "BIO-220",
            "semester": "Spring 2026",
            "studentCount": 2,
            "department": "Biology"
        },
        {
            "title": "CHEM-220",
            "semester": "Fall 2025",
            "studentCount": 8,
            "department": "Chemistry"
        }
    ];

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

    // Function to display courses in the enrollment section
    function displayCourses(courseList) {
        const courseListElement = document.querySelector('.course-list ul');
        courseListElement.innerHTML = ''; // Clear existing list

        if (courseList.length === 0) {
            // If no courses match, display a message
            const noCoursesItem = document.createElement('li');
            noCoursesItem.textContent = 'No courses match your search criteria.';
            courseListElement.appendChild(noCoursesItem);
            return;
        }

        // Add each course to the list
        courseList.forEach(course => {
            const courseItem = document.createElement('li');
            courseItem.innerHTML = `
                <strong>${course.title}</strong> <br>
                <span class="note">Num of Students Planned</span>
                <input type="text" value="${course.studentCount}" disabled>
                <div class="course-semester">${course.semester}</div>
            `;
            courseListElement.appendChild(courseItem);
        });
    }

    // Function to filter courses based on search criteria (without showing errors)
    function filterCourses(showErrorMessage = false) {
        const courseSearch = document.getElementById('searchCourse').value.toUpperCase();
        const semesterSearch = document.getElementById('searchSemester').value.toUpperCase();

        const filteredCourses = courses.filter(course => {
            const courseMatch = course.title.toUpperCase().includes(courseSearch);
            const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);

            return courseMatch && semesterMatch;
        });

        // Only show error if button was clicked AND no results were found
        if (showErrorMessage === true && filteredCourses.length === 0 && (courseSearch !== '' || semesterSearch !== '')) {
            showError("No courses found matching your search criteria");
        }

        displayCourses(filteredCourses);

        return filteredCourses.length > 0;
    }

    // Function called when search button is clicked
    function searchButtonClicked() {
        filterCourses(true); // Pass true to show error message if needed
    }

    // Set up event listeners for search inputs
    const courseSearchInput = document.getElementById('searchCourse');
    const semesterSearchInput = document.getElementById('searchSemester');

    if (courseSearchInput) {
        // Remove any existing input event listeners first
        courseSearchInput.removeEventListener('input', function() {
            filterCourses(false);
        });

        // Add new event listener that ONLY updates the display without error messages
        courseSearchInput.addEventListener('input', function() {
            const courseSearch = courseSearchInput.value.toUpperCase();
            const semesterSearch = semesterSearchInput ? semesterSearchInput.value.toUpperCase() : '';

            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);

                return courseMatch && semesterMatch;
            });

            // Just update the display, never show errors
            displayCourses(filteredCourses);
        });
    }

    if (semesterSearchInput) {
        // Remove any existing input event listeners first
        semesterSearchInput.removeEventListener('input', function() {
            filterCourses(false);
        });

        // Add new event listener that ONLY updates the display without error messages
        semesterSearchInput.addEventListener('input', function() {
            const courseSearch = courseSearchInput ? courseSearchInput.value.toUpperCase() : '';
            const semesterSearch = semesterSearchInput.value.toUpperCase();

            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);

                return courseMatch && semesterMatch;
            });

            // Just update the display, never show errors
            displayCourses(filteredCourses);
        });
    }

    // Update search button click handlers for enrollment section
    const enrollmentSearchButtons = document.querySelectorAll('.enrollment .search-bar button');
    enrollmentSearchButtons.forEach(button => {
        button.removeEventListener('click', function() { showError("Invalid Search"); });
        button.addEventListener('click', searchButtonClicked); // Use the new button click handler
    });

    // Attach an event listener to other buttons to show an error message
    allButtons.forEach(button => {
        // Skip search buttons and close popup button
        if (!button.closest('.search-bar') && button !== closePopupBtn && button !== studentInterfaceButton) {
            button.addEventListener("click", function () {
                showError("Feature not implemented yet"); // Display a more helpful error message
            });
        }
    });

    // Make functions available globally
    window.showError = showError;
    window.filterCourses = filterCourses;

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

    // Initialize with an empty course list (clear static courses)
    displayCourses([]);
});
