document.addEventListener("DOMContentLoaded", function () {
    // Student data structure
    const students = [
        {
            "name": "Hi There",
            "id": "12345",
            "email": "hithere@hamilton.edu",
            "plannedCourses": [
                { "title": "BIO-100", "semester": "Fall 2025" },
                { "title": "CHEM-110", "semester": "Fall 2025" },
                { "title": "PHYS-120", "semester": "Fall 2025" },
                { "title": "CS-101", "semester": "Fall 2025" },

                { "title": "BIO-220", "semester": "Spring 2026" },
                { "title": "CHEM-220", "semester": "Spring 2026" },
                { "title": "PHYS-220", "semester": "Spring 2026" },
                { "title": "CS-201", "semester": "Spring 2026" },

                { "title": "BIO-300", "semester": "Fall 2026" },
                { "title": "CHEM-300", "semester": "Fall 2026" },
                { "title": "PHYS-300", "semester": "Fall 2026" },
                { "title": "CS-301", "semester": "Fall 2026" },

                { "title": "BIO-310", "semester": "Spring 2027" },
                { "title": "CHEM-310", "semester": "Spring 2027" },
                { "title": "PHYS-310", "semester": "Spring 2027" },
                { "title": "CS-310", "semester": "Spring 2027" },

                { "title": "BIO-400", "semester": "Fall 2027" },
                { "title": "CHEM-400", "semester": "Fall 2027" },
                { "title": "PHYS-400", "semester": "Fall 2027" },
                { "title": "CS-400", "semester": "Fall 2027" },

                { "title": "BIO-410", "semester": "Spring 2028" },
                { "title": "CHEM-410", "semester": "Spring 2028" },
                { "title": "PHYS-410", "semester": "Spring 2028" },
                { "title": "CS-410", "semester": "Spring 2028" },

                { "title": "BIO-490", "semester": "Fall 2028" },
                { "title": "CHEM-490", "semester": "Fall 2028" },
                { "title": "PHYS-490", "semester": "Fall 2028" },
                { "title": "CS-490", "semester": "Fall 2028" },

                { "title": "BIO-499", "semester": "Spring 2029" },
                { "title": "CHEM-499", "semester": "Spring 2029" },
                { "title": "PHYS-499", "semester": "Spring 2029" },
                { "title": "CS-499", "semester": "Spring 2029" },

                { "title": "BIO-THESIS", "semester": "Fall 2029" },
                { "title": "CHEM-THESIS", "semester": "Fall 2029" },
                { "title": "PHYS-THESIS", "semester": "Fall 2029" },
                { "title": "CS-THESIS", "semester": "Fall 2029" }
            ]
        }
    ];

    // Course data structure with track and major attributes
    const courses = [
        {
            "title": "BIO-100",
            "semester": "Fall 2025",
            "studentCount": 5,
            "department": "Biology",
            "track": "pre-medicine",
            "major": "Biology"
        },
        {
            "title": "BIO-100LAB",
            "semester": "Fall 2025",
            "studentCount": 3,
            "department": "Biology",
            "track": "pre-medicine",
            "major": "Biology"
        },
        {
            "title": "CHEM-400",
            "semester": "Spring 2026",
            "studentCount": 5,
            "department": "Chemistry",
            "track": "pre-dental-medicine",
            "major": "Chemistry"
        },
        {
            "title": "BIO-110",
            "semester": "Fall 2025",
            "studentCount": 7,
            "department": "Biology",
            "track": "pre-nursing",
            "major": "Biology"
        },
        {
            "title": "CHEM-110",
            "semester": "Spring 2026",
            "studentCount": 4,
            "department": "Chemistry",
            "track": "pre-medicine",
            "major": "Biochemistry"
        },
        {
            "title": "PHYS-120",
            "semester": "Fall 2025",
            "studentCount": 6,
            "department": "Physics",
            "track": "pre-physical-therapy",
            "major": "Physics"
        },
        {
            "title": "BIO-220",
            "semester": "Spring 2026",
            "studentCount": 2,
            "department": "Biology",
            "track": "pre-veterinary-medicine",
            "major": "Biology"
        },
        {
            "title": "CHEM-220",
            "semester": "Fall 2025",
            "studentCount": 8,
            "department": "Chemistry",
            "track": "pre-physical-assistant",
            "major": "Chemistry"
        },
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
                <div class="course-details">
                    <span class="course-track">Track: ${course.track || 'N/A'}</span>
                    <span class="course-major">Major: ${course.major || 'N/A'}</span>
                </div>
            `;
            courseListElement.appendChild(courseItem);
        });
    }

    // Function to filter courses based on search criteria (without showing errors)
    function filterCourses(showErrorMessage = false) {
        const courseSearch = document.getElementById('searchCourse').value.toUpperCase();
        const semesterSearch = document.getElementById('searchSemester').value.toUpperCase();
        const majorSearch = document.getElementById('searchMajor').value.toUpperCase();
        const trackSearch = document.getElementById('searchTrack').value.toUpperCase();


        const filteredCourses = courses.filter(course => {
            const courseMatch = course.title.toUpperCase().includes(courseSearch);
            const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);
            const majorMatch = course.major.toUpperCase().includes(majorSearch);
            const trackMatch = course.track.toUpperCase().includes(trackSearch);


            return (courseMatch && semesterMatch) && (majorMatch && trackMatch);
        });

        // Only show error if button was clicked and no results were found
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

    // Function to search for a student and display their schedule
    function searchStudent() {
        const searchInput = document.getElementById('searchStudent');
        if (!searchInput) return;

        const searchTerm = searchInput.value.trim().toLowerCase();

        // If the search term is empty, clear the calendar and return
        if (searchTerm === '') {
            clearCalendar();
            return;
        }

        // Find the student whose name contains the search term
        const student = students.find(s => s.name.toLowerCase().includes(searchTerm));

        // If no student is found, show an error
        if (!student) {
            showError("No student found matching '" + searchTerm + "'");
            clearCalendar();
            return;
        }

        // Display the student's courses in the calendar
        displayStudentSchedule(student);
    }

    // Function to clear all cells in the calendar
    function clearCalendar() {
        const cells = document.querySelectorAll('.calendar tbody td');
        cells.forEach(cell => {
            cell.innerHTML = '';
        });

        const modalCells = document.querySelectorAll('#modal-calendar tbody td');
        cells.forEach(cell => {
            cell.innerHTML = '';
        });
    }

    // Function to display a student's schedule in the calendar
    function displayStudentSchedule(student) {
        // Clear the calendar first
        clearCalendar();

        // Get all the columns in the calendar
        const headerRow = document.querySelector('.calendar thead tr');
        const semesterHeaders = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());

        const modalHeaderRow = document.querySelector('#modal-calendar thead tr');
        const modalSemesterHeaders = Array.from(modalHeaderRow.querySelectorAll('th')).map(th => th.textContent.trim());

        console.log("Calendar headers:", semesterHeaders);
        console.log("Student courses:", student.plannedCourses);

        console.log("Calendar headers:", modalSemesterHeaders);
        console.log("Student courses:", student.plannedCourses);

        // For each course in the student's planned courses
        student.plannedCourses.forEach(course => {
            // Find the index of the semester in the calendar headers
            const semesterIndex = semesterHeaders.findIndex(header =>
                header.toLowerCase() === course.semester.toLowerCase());

            console.log("Course:", course.title, "Semester:", course.semester, "Index:", semesterIndex);

            // If the semester is found in the calendar
            if (semesterIndex !== -1) {
                // Get all cells for that semester (column)
                const cells = document.querySelectorAll(`.calendar tbody tr td:nth-child(${semesterIndex + 1})`);

                // Find the first empty cell in that column
                let emptyCell = Array.from(cells).find(cell => cell.innerHTML === '');

                // If no empty cell is found, use the last cell
                if (!emptyCell && cells.length > 0) {
                    emptyCell = cells[cells.length - 1];
                }

                // If we have a cell to use, add the course
                if (emptyCell) {
                    const courseDiv = document.createElement('div');
                    courseDiv.className = 'calendar-course';
                    courseDiv.textContent = course.title;
                    emptyCell.appendChild(courseDiv);
                }
            }


            // Find the index of the semester in the calendar headers
            const modalSemesterIndex = modalSemesterHeaders.findIndex(header =>
                header.toLowerCase() === course.semester.toLowerCase());

            console.log("HECourse:", course.title, "Semester:", course.semester, "Index:", modalSemesterIndex);

            // If the semester is found in the calendar
            if (modalSemesterIndex !== -1) {
                // Get all cells for that semester (column)
                const modalCells = document.querySelectorAll(`#modal-calendar tbody tr td:nth-child(${modalSemesterIndex + 1})`);

                // Find the first empty cell in that column
                let modalEmptyCell = Array.from(modalCells).find(cell => cell.innerHTML === '');

                // If no empty cell is found, use the last cell
                if (!modalEmptyCell && modalCells.length > 0) {
                    modalEmptyCell = modalCells[modalCells.length - 1];
                }

                // If we have a cell to use, add the course
                if (modalEmptyCell) {
                    const modalCourseDiv = document.createElement('div');
                    modalCourseDiv.className = 'calendar-course';
                    modalCourseDiv.textContent = course.title;
                    modalEmptyCell.appendChild(modalCourseDiv);
                }
            }

        });
    }

    // Set up event listeners for search inputs
    const courseSearchInput = document.getElementById('searchCourse');
    const semesterSearchInput = document.getElementById('searchSemester');
    const trackSearchInput = document.getElementById('searchTrack');
    const majorSearchInput = document.getElementById('searchMajor');


    if (courseSearchInput) {
        // Remove any existing input event listeners first
        courseSearchInput.removeEventListener('input', function() {
            filterCourses(false);
        });

        // Add new event listener that ONLY updates the display without error messages
        courseSearchInput.addEventListener('input', function() {
            const courseSearch = courseSearchInput.value.toUpperCase();
            const semesterSearch = semesterSearchInput ? semesterSearchInput.value.toUpperCase() : '';
            const majorSearch = majorSearchInput ? majorSearchInput.value.toUpperCase() : '';
            const trackSearch = trackSearchInput ? trackSearchInput.value.toUpperCase() : '';


            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);
                const majorMatch = course.major.toUpperCase().includes(majorSearch);
                const trackMatch = course.track.toUpperCase().includes(trackSearch);



                return (courseMatch && semesterMatch) && (majorMatch && trackMatch);
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
            const trackSearch = trackSearchInput ? trackSearchInput.value.toUpperCase() : '';
            const majorSearch = majorSearchInput ? majorSearchInput.value.toUpperCase() : '';



            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);
                const trackMatch = course.track.toUpperCase().includes(trackSearch);
                const majorMatch = course.major.toUpperCase().includes(majorSearch);

                return (courseMatch && semesterMatch) && (trackMatch && majorMatch);
            });

            // Just update the display, never show errors
            displayCourses(filteredCourses);
        });
    }

    if (majorSearchInput) {
        // Remove any existing input event listeners first
        majorSearchInput.removeEventListener('input', function() {
            filterCourses(false);
        });

        // Add new event listener that ONLY updates the display without error messages
        majorSearchInput.addEventListener('input', function() {
            const majorSearch = majorSearchInput.value.toUpperCase();
            const semesterSearch = semesterSearchInput ? semesterSearchInput.value.toUpperCase() : '';
            const courseSearch = courseSearchInput ? courseSearchInput.value.toUpperCase() : '';
            const trackSearch = trackSearchInput ? trackSearchInput.value.toUpperCase() : '';

            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);
                const trackMatch = course.track.toUpperCase().includes(trackSearch);
                const majorMatch = course.major.toUpperCase().includes(majorSearch);


                return (courseMatch && semesterMatch) && (trackMatch && majorMatch);
            });

            // Just update the display, never show errors
            displayCourses(filteredCourses);
        });
    }

    if (trackSearchInput) {
        // Remove any existing input event listeners first
        trackSearchInput.removeEventListener('input', function() {
            filterCourses(false);
        });

        // Add new event listener that ONLY updates the display without error messages
        trackSearchInput.addEventListener('input', function() {
            const majorSearch = majorSearchInput ? majorSearchInput.value.toUpperCase() : '';
            const semesterSearch = semesterSearchInput ? semesterSearchInput.value.toUpperCase() : '';
            const courseSearch = courseSearchInput ? courseSearchInput.value.toUpperCase() : '';
            const trackSearch = trackSearchInput.value.toUpperCase();

            const filteredCourses = courses.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);
                const semesterMatch = course.semester.toUpperCase().includes(semesterSearch);
                const trackMatch = course.track.toUpperCase().includes(trackSearch);
                const majorMatch = course.major.toUpperCase().includes(majorSearch);


                return (courseMatch && semesterMatch) && (trackMatch && majorMatch);
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

    // Set up the student search button
    const studentSearchButton = document.querySelector('.student-schedule .search-bar button');
    if (studentSearchButton) {
        studentSearchButton.removeEventListener('click', function() { showError("Student search not implemented yet"); });
        studentSearchButton.addEventListener('click', searchStudent);
    }

    // Function to add a new course
    function addCourse() {
        const titleInput = document.getElementById('courseName');
        const trackSelect = document.getElementById('track');
        const majorSelect = document.getElementById('major');
        const semesterSelect = document.getElementById('semester');

        const title = titleInput.value.trim();
        const track = trackSelect.value;
        const major = majorSelect.value;
        const semester = semesterSelect.value;

        // Validate inputs
        if (!title) {
            showError("Please enter a course title");
            return;
        }

        if (!semester) {
            showError("Please select a semester");
            return;
        }

        // Check if the course already exists
        const existingCourse = courses.find(c =>
            c.title.toLowerCase() === title.toLowerCase() &&
            c.semester.toLowerCase() === semester.toLowerCase());

        if (existingCourse) {
            showError("This course already exists for the selected semester");
            return;
        }

        // Create new course object
        const newCourse = {
            title: title,
            semester: semester,
            studentCount: 0,
            department: major.split(' ')[0] || "General", // Use first word of major as department
            track: track,
            major: major
        };

        // Add to the courses array
        courses.push(newCourse);

        // Clear form inputs
        titleInput.value = '';
        trackSelect.selectedIndex = 0;
        majorSelect.selectedIndex = 0;
        semesterSelect.selectedIndex = 0;

        // Update the display to show the new course
        displayCourses(courses);

        // Show success message
        showSuccess("Course added successfully");
    }

    // Function to delete a course
    function deleteCourse() {
        const titleInput = document.getElementById('courseName');
        const semesterSelect = document.getElementById('semester');

        const title = titleInput.value.trim();
        const semester = semesterSelect.value;

        // Validate inputs
        if (!title) {
            showError("Please enter a course title to delete");
            return;
        }

        // Find the index of the course to delete
        const courseIndex = courses.findIndex(c =>
            c.title.toLowerCase() === title.toLowerCase() &&
            (!semester || c.semester.toLowerCase() === semester.toLowerCase()));

        if (courseIndex === -1) {
            showError("Course not found");
            return;
        }

        // Remove the course from the array
        courses.splice(courseIndex, 1);

        // Clear form inputs
        titleInput.value = '';
        semesterSelect.selectedIndex = 0;

        // Update the display
        displayCourses(courses);

        // Show success message
        showSuccess("Course deleted successfully");
    }

    // Function to show a success message
    function showSuccess(message) {
        const popupModal = document.getElementById("popupModal");
        const popupMessage = document.getElementById("popupMessage");
        if (popupModal && popupMessage) {
            popupMessage.style.color = "#28a745"; // Green color for success
            popupMessage.textContent = message;
            popupModal.style.display = "block";

            // Reset color after modal is closed
            const closeBtn = document.getElementById("closePopupBtn");
            if (closeBtn) {
                const originalHandler = closeBtn.onclick;
                closeBtn.onclick = function() {
                    if (originalHandler) originalHandler();
                    popupMessage.style.color = "#4F5971"; // Reset to default color
                };
            }
        }
    }

    // Setup form submit handler based on mode (Add or Delete)
    const submitButton = document.querySelector('.course-management button:last-child');
    if (submitButton) {
        submitButton.removeEventListener('click', function() { showError("Add/Delete course feature not implemented yet"); });
        submitButton.addEventListener('click', function() {
            const mode = document.getElementById('courseTitle').innerText;
            if (mode === "Add Course") {
                addCourse();
            } else {
                deleteCourse();
            }
        });
    }

    // Make functions available globally
    window.showError = showError;
    window.filterCourses = filterCourses;
    window.searchStudent = searchStudent;
    window.searchButtonClicked = searchButtonClicked;

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

const modal = document.getElementById("scheduleModal");

function openModal() {
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  // Close modal when clicking outside the modal content
  modal.addEventListener("click", closeModal);
