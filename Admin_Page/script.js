document.addEventListener("DOMContentLoaded", function () {
    // --- 1) Create the GLOBAL tooltip at the body level ---
    const globalTooltip = document.createElement('div');
    globalTooltip.id = 'globalTooltip';
    // Inline styles to ensure it appears on top
    globalTooltip.style.display = 'none';
    globalTooltip.style.position = 'absolute';
    globalTooltip.style.zIndex = '999999';
    globalTooltip.style.backgroundColor = 'white';
    globalTooltip.style.border = '1px solid #ccc';
    globalTooltip.style.borderRadius = '4px';
    globalTooltip.style.padding = '5px';
    globalTooltip.style.fontSize = '14px';
    globalTooltip.style.color = '#333';
    globalTooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(globalTooltip);

    // --- 2) Helper functions to show/hide the tooltip ---
    function showTooltip(courseElement, track, major) {
        // Populate the tooltip text
        globalTooltip.innerHTML = `
            <div><strong>Track:</strong> ${track || 'N/A'}</div>
            <div><strong>Major:</strong> ${major || 'N/A'}</div>
        `;

        // Position it above (or near) the hovered element
        const rect = courseElement.getBoundingClientRect();
        // Example: center horizontally, appear above the course
        // Adjust left/top offsets as desired
        globalTooltip.style.left = (rect.left + rect.width / 2) + 'px';
        // Account for current scroll offset in Y
        globalTooltip.style.top = (rect.top + window.scrollY - globalTooltip.offsetHeight - 8) + 'px';

        // Show the tooltip
        globalTooltip.style.display = 'block';
    }

    function hideTooltip() {
        globalTooltip.style.display = 'none';
    }

    // --- Track and Major Lists ---
    let tracks = [
      "pre-dental-medicine",
      "pre-medicine",
      "pre-nursing",
      "pre-physical-assistant",
      "pre-physical-therapy",
      "pre-veterinary-medicine"
    ];

    let majors = [
      "Biology",
      "Chemistry",
      "Biochemistry",
      "Physics"
    ];


    // --- 3) Rest of your code remains the same, except displayStudentSchedule(...) ---
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
        },
        {
            "name": "John Smith",
            "id": "67890",
            "email": "jsmith@hamilton.edu",
            "plannedCourses": [
                { "title": "CHEM-120", "semester": "Fall 2027" },
                { "title": "BIO-101", "semester": "Fall 2027" },
                { "title": "MATH-113", "semester": "Fall 2027" },
                { "title": "ENG-110", "semester": "Fall 2027" },
                { "title": "PSYCH-101", "semester": "Fall 2027" },

                { "title": "CHEM-190", "semester": "Spring 2028" },
                { "title": "BIO-115", "semester": "Spring 2028" },
                { "title": "MATH-116", "semester": "Spring 2028" },
                { "title": "HIST-180", "semester": "Spring 2028" },
                { "title": "PSYCH-205", "semester": "Spring 2028" },

                { "title": "Study Off-Campus", "semester": "Fall 2028" },

                { "title": "CHEM-255", "semester": "Spring 2029" },
                { "title": "BIO-228", "semester": "Spring 2029" },
                { "title": "SOC-110", "semester": "Spring 2029" },
                { "title": "PHIL-120", "semester": "Spring 2029" },
                { "title": "ECON-110", "semester": "Spring 2029" },

                { "title": "CHEM-321", "semester": "Fall 2029" },
                { "title": "BIO-330", "semester": "Fall 2029" },
                { "title": "PHYS-190", "semester": "Fall 2029" },
                { "title": "GOVT-116", "semester": "Fall 2029" },
                { "title": "ECON-242", "semester": "Fall 2029" },

                { "title": "CHEM-322", "semester": "Spring 2030" },
                { "title": "BIO-331", "semester": "Spring 2030" },
                { "title": "PHYS-195", "semester": "Spring 2030" },
                { "title": "WGST-101", "semester": "Spring 2030" },
                { "title": "ANTH-113", "semester": "Spring 2030" },

                { "title": "CHEM-410", "semester": "Fall 2030" },
                { "title": "BIO-437", "semester": "Fall 2030" },
                { "title": "CHEM-371", "semester": "Fall 2030" },
                { "title": "PSYCH-380", "semester": "Fall 2030" },

                { "title": "CHEM-412", "semester": "Spring 2031" },
                { "title": "BIO-438", "semester": "Spring 2031" },
                { "title": "CHEM-551", "semester": "Spring 2031" },
                { "title": "CHEM-549", "semester": "Spring 2031" }
            ]
        }
    ];

    // Course data structure with track and major attributes
    const courses = [
        {
            "title": "BIO-100",
            "studentCount": 5,
            "department": "Biology",
            "track": "pre-medicine",
            "major": "Biology"
        },
        {
            "title": "BIO-100LAB",
            "studentCount": 3,
            "department": "Biology",
            "track": "pre-medicine",
            "major": "Biology"
        },
        {
            "title": "CHEM-400",
            "studentCount": 5,
            "department": "Chemistry",
            "track": "pre-dental-medicine",
            "major": "Chemistry"
        },
        {
            "title": "BIO-110",
            "studentCount": 7,
            "department": "Biology",
            "track": "pre-nursing",
            "major": "Biology"
        },
        {
            "title": "CHEM-110",
            "studentCount": 4,
            "department": "Chemistry",
            "track": "pre-medicine",
            "major": "Biochemistry"
        },
        {
            "title": "PHYS-120",
            "studentCount": 6,
            "department": "Physics",
            "track": "pre-physical-therapy",
            "major": "Physics"
        },
        {
            "title": "BIO-220",
            "studentCount": 2,
            "department": "Biology",
            "track": "pre-veterinary-medicine",
            "major": "Biology"
        },
        {
            "title": "CHEM-220",
            "studentCount": 8,
            "department": "Chemistry",
            "track": "pre-physical-assistant",
            "major": "Chemistry"
        },
    ];

    // Toggle + headings
    const toggleButton = document.getElementById("toggleCourse");
    const courseTitle = document.getElementById("courseTitle");
    const studentInterfaceButton = document.querySelector("a[href='./../student-interface-demo/interface.html'] button");
    const allButtons = document.querySelectorAll("button:not(#toggleCourse):not(.student-interface-button)");

    // Show error in modal or fallback
    function showError(message) {
        const popupModal = document.getElementById("popupModal");
        const popupMessage = document.getElementById("popupMessage");
        if (popupModal && popupMessage) {
            popupMessage.textContent = message || "Invalid Search";
            popupModal.style.display = "block";
        } else {
            alert(message || "Invalid Search");
        }
    }

    // Close popup
    const closePopupBtn = document.getElementById("closePopupBtn");
    if (closePopupBtn) {
        closePopupBtn.addEventListener("click", function() {
            const popupModal = document.getElementById("popupModal");
            if (popupModal) {
                popupModal.style.display = "none";
            }
        });
    }

    // Toggle between Add Course / Delete Course
    function toggleCourseMode() {
        if (courseTitle && toggleButton) {
            if (courseTitle.innerText === "Add Course") {
                courseTitle.innerText = "Delete Course";
                toggleButton.innerText = "Switch to Add Course";
            } else {
                courseTitle.innerText = "Add Course";
                toggleButton.innerText = "Switch to Delete Course";
            }
        }
    }

    // Display courses in enrollment section
    // Display courses in enrollment section
    function displayCourses(courseList) {
        const courseListElement = document.querySelector('.course-list ul');
        courseListElement.innerHTML = '';
        if (courseList.length === 0) {
            const noCoursesItem = document.createElement('li');
            noCoursesItem.textContent = 'No courses match your search criteria.';
            courseListElement.appendChild(noCoursesItem);
            return;
        }
        courseList.forEach(course => {
            const courseItem = document.createElement('li');
            courseItem.innerHTML = `
                <strong>${course.title}</strong> <br>
                <span class="note">Num of Students Planned</span>
                <input type="text" value="${course.studentCount}" disabled>
                <div class="course-details">
                    <span class="course-track">Track: ${course.track || 'N/A'}</span>
                    <span class="course-major">Major: ${course.major || 'N/A'}</span>
                </div>
            `;
            courseListElement.appendChild(courseItem);
        });
    }

    // Filter courses
    // Filter courses
    function filterCourses(showErrorMessage = false) {
        const courseSearch = document.getElementById('searchCourse').value.toUpperCase();
        const majorSearch = document.getElementById('searchMajor').value.toUpperCase();
        const trackSearch = document.getElementById('searchTrack').value.toUpperCase();

        const filteredCourses = courses.filter(course => {
            const courseMatch = course.title.toUpperCase().includes(courseSearch);
            const majorMatch = course.major.toUpperCase().includes(majorSearch);
            const trackMatch = course.track.toUpperCase().includes(trackSearch);
            return courseMatch && majorMatch && trackMatch;
        });

        if (showErrorMessage && filteredCourses.length === 0 && courseSearch !== '') {
            showError("No courses found matching your search criteria");
        }
        displayCourses(filteredCourses);
        return filteredCourses.length > 0;
    }

    // Search button
    function searchButtonClicked() {
        filterCourses(true);
    }

    // Get unique semesters from a student's planned courses
    function getUniqueSemesters(student) {
        if (!student || !student.plannedCourses) return [];
        const semesters = student.plannedCourses
            .map(course => course.semester)
            .filter((sem, i, self) => self.indexOf(sem) === i);

        return semesters.sort((a, b) => {
            const aSeason = a.split(' ')[0];
            const aYear = parseInt(a.split(' ')[1]);
            const bSeason = b.split(' ')[0];
            const bYear = parseInt(b.split(' ')[1]);
            if (aYear !== bYear) return aYear - bYear;
            return aSeason === 'Spring' && bSeason === 'Fall' ? -1 : 1;
        });
    }

    // Create calendar table dynamically
    function createCalendarTable(containerId, semesters) {
        const container = document.getElementById(containerId) || document.querySelector(containerId);
        if (!container) return;
        const table = document.createElement('table');
        table.className = 'calendar';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        semesters.forEach(sem => {
            const th = document.createElement('th');
            th.textContent = sem;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            semesters.forEach(() => {
                const cell = document.createElement('td');
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        }
        table.appendChild(tbody);

        container.innerHTML = '';
        container.appendChild(table);
        return table;
    }

    // Clear calendar
    function clearCalendar() {
        const mainCalendarContainer = document.querySelector('.calendar-container');
        const modalCalendarContainer = document.querySelector('#modal-calendar');
        if (mainCalendarContainer) mainCalendarContainer.innerHTML = '';
        if (modalCalendarContainer) modalCalendarContainer.innerHTML = '';
    }

    // --- 4) Updated displayStudentSchedule to use the global tooltip on hover ---
    function displayStudentSchedule(student) {
        if (!student || !student.plannedCourses || student.plannedCourses.length === 0) return;
        const semesters = getUniqueSemesters(student);

        // Helper: get info from the "courses" array
        function getCourseInfo(courseTitle) {
            const courseInfo = courses.find(c => c.title === courseTitle);
            return courseInfo || { track: "N/A", major: "N/A" };
        }

        // All calendars (main + modal)
        const calendars = document.querySelectorAll('.calendar');
        calendars.forEach(calendar => {
            // Clear existing cells
            const allCells = calendar.querySelectorAll('tbody td');
            allCells.forEach(cell => (cell.innerHTML = ''));

            const headerCells = calendar.querySelectorAll('thead th');
            const semesterHeaders = Array.from(headerCells).map(th => th.textContent.trim());

            const processedCourses = {};
            semesterHeaders.forEach(s => (processedCourses[s] = new Set()));

            const uniqueCoursesBySemester = {};
            semesterHeaders.forEach(s => {
                uniqueCoursesBySemester[s] = [];
            });

            // Group courses by semester
            student.plannedCourses.forEach(course => {
                const semester = course.semester;
                if (uniqueCoursesBySemester[semester] && !processedCourses[semester].has(course.title)) {
                    uniqueCoursesBySemester[semester].push(course);
                    processedCourses[semester].add(course.title);
                }
            });

            // Populate
            semesterHeaders.forEach((semester, semesterIndex) => {
                const courseGroup = uniqueCoursesBySemester[semester] || [];
                const cells = calendar.querySelectorAll(`tbody tr td:nth-child(${semesterIndex + 1})`);

                courseGroup.forEach((course, index) => {
                    if (index < cells.length) {
                        const courseDiv = document.createElement('div');
                        courseDiv.className = 'calendar-course';

                        // Info for the tooltip
                        const info = getCourseInfo(course.title);

                        // If it's "Study Off-Campus"
                        if (course.title === "Study Off-Campus") {
                            courseDiv.classList.add('study-abroad');
                            info.track = "N/A";
                            info.major = "Study Abroad Program";
                        }

                        courseDiv.textContent = course.title;

                        // ► On hover, show/hide the global tooltip
                        courseDiv.addEventListener('mouseenter', () => {
                            showTooltip(courseDiv, info.track, info.major);
                        });
                        courseDiv.addEventListener('mouseleave', () => {
                            hideTooltip();
                        });

                        cells[index].appendChild(courseDiv);
                    }
                });
            });
        });
    }

    // Student search
    function searchStudent() {
        const searchInput = document.getElementById('searchStudent');
        if (!searchInput) return;
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            clearCalendar();
            return;
        }
        const student = students.find(s => s.name.toLowerCase().includes(searchTerm));
        if (!student) {
            showError("No student found matching '" + searchTerm + "'");
            clearCalendar();
            return;
        }
        const semesters = getUniqueSemesters(student);
        createCalendarTable('.calendar-container', semesters);
        createCalendarTable('#modal-calendar', semesters);
        displayStudentSchedule(student);
    }

    // Set up event listeners for search inputs (course/semester/major/track)
    const courseSearchInput = document.getElementById('searchCourse');
    const semesterSearchInput = document.getElementById('searchSemester');
    const trackSearchInput = document.getElementById('searchTrack');
    const majorSearchInput = document.getElementById('searchMajor');

    if (courseSearchInput) {
        courseSearchInput.removeEventListener('input', function() { filterCourses(false); });
        courseSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    if (majorSearchInput) {
        majorSearchInput.removeEventListener('input', function() { filterCourses(false); });
        majorSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    if (trackSearchInput) {
        trackSearchInput.removeEventListener('input', function() { filterCourses(false); });
        trackSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    // Enrollment search buttons
    const enrollmentSearchButtons = document.querySelectorAll('.enrollment .search-bar button');
    enrollmentSearchButtons.forEach(button => {
        button.removeEventListener('click', function() { showError("Invalid Search"); });
        button.addEventListener('click', searchButtonClicked);
    });

    // Student search button
    const studentSearchButton = document.querySelector('.student-schedule .search-bar button');
    if (studentSearchButton) {
        studentSearchButton.removeEventListener('click', function() { showError("Student search not implemented yet"); });
        studentSearchButton.addEventListener('click', searchStudent);
    }

    // Function to populate track and major dropdowns
    function populateDropdowns() {
        const trackSelect = document.getElementById('track');
        const majorSelect = document.getElementById('major');

        if (trackSelect) {
            // Clear existing options except the first one
            while (trackSelect.options.length > 1) {
                trackSelect.remove(1);
            }

            // Add options from the tracks array
            tracks.forEach(track => {
                const option = document.createElement('option');
                option.value = track;
                option.textContent = track.charAt(0).toUpperCase() + track.slice(1).replace(/-/g, ' ');
                trackSelect.appendChild(option);
            });
        }

        if (majorSelect) {
            // Clear existing options except the first one
            while (majorSelect.options.length > 1) {
                majorSelect.remove(1);
            }

            // Add options from the majors array
            majors.forEach(major => {
                const option = document.createElement('option');
                option.value = major;
                option.textContent = major;
                majorSelect.appendChild(option);
            });
        }
    }

    // Add a new course
    function addCourse() {
        const titleInput = document.getElementById('courseName');
        const trackSelect = document.getElementById('track');
        const majorSelect = document.getElementById('major');

        const title = titleInput.value.trim();
        const track = trackSelect.value;
        const major = majorSelect.value;

        if (!title) {
            showError("Please enter a course title");
            return;
        }

        // Prevent duplicates - now only checking by title
        const existingCourse = courses.find(c =>
            c.title.toLowerCase() === title.toLowerCase()
        );
        if (existingCourse) {
            showError("This course already exists");
            return;
        }

        // Create new
        const newCourse = {
            title: title,
            studentCount: 0,
            department: major.split(' ')[0] || "General",
            track: track,
            major: major
        };
        courses.push(newCourse);

        // Clear
        titleInput.value = '';
        trackSelect.selectedIndex = 0;
        majorSelect.selectedIndex = 0;

        displayCourses(courses);
        showSuccess("Course added successfully");
    }

    // Delete a course
    function deleteCourse() {
        const titleInput = document.getElementById('courseName');
        const title = titleInput.value.trim();

        if (!title) {
            showError("Please enter a course title to delete");
            return;
        }
        const courseIndex = courses.findIndex(c =>
            c.title.toLowerCase() === title.toLowerCase()
        );
        if (courseIndex === -1) {
            showError("Course not found");
            return;
        }
        courses.splice(courseIndex, 1);

        titleInput.value = '';
        displayCourses(courses);

        showSuccess("Course deleted successfully");
    }

    // Success message
    function showSuccess(message) {
        const popupModal = document.getElementById("popupModal");
        const popupMessage = document.getElementById("popupMessage");
        if (popupModal && popupMessage) {
            popupMessage.style.color = "#28a745";
            popupMessage.textContent = message;
            popupModal.style.display = "block";
            const closeBtn = document.getElementById("closePopupBtn");
            if (closeBtn) {
                const originalHandler = closeBtn.onclick;
                closeBtn.onclick = function() {
                    if (originalHandler) originalHandler();
                    popupMessage.style.color = "#4F5971";
                };
            }
        }
    }

    // Submit handler
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

    // Make functions global
    window.showError = showError;
    window.filterCourses = filterCourses;
    window.searchStudent = searchStudent;
    window.searchButtonClicked = searchButtonClicked;
    window.openModal = openModal;
    window.closeModal = closeModal;

    if (toggleButton) {
        toggleButton.removeEventListener("click", toggleCourseMode);
        toggleButton.addEventListener("click", toggleCourseMode);
    } else {
        console.error("Toggle button not found.");
    }

    if (studentInterfaceButton) {
        studentInterfaceButton.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    }

    // Initialize with empty course list
    displayCourses([]);

    // Initialize the track and major dropdowns
    populateDropdowns();

});

// Modal
const modal = document.getElementById("scheduleModal");
function openModal() {
    modal.classList.remove("hidden");
}
function closeModal() {
    modal.classList.add("hidden");
}
modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});
