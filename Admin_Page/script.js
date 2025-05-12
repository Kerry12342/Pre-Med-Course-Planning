/*
 Admin Page Script

 Holds the code for the administrator page which views students and course information, as well as
 features to add and remove tracks, majors, and students.
 */

// Fetches database information.
function getDatabase() {
    return fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/get-json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return []; // Return an empty array in case of an error
        });
}

// Saves database information. Takes updated database as a parameter.
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


document.addEventListener("DOMContentLoaded", function () {

    requireLogin();

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
    function showTooltip(courseElement, tracks, majors, prerequisites, corequisites) {
        // Format tracks and majors for display
        const tracksDisplay = tracks && tracks.length ?
            tracks.join(', ') : 'N/A';
        const majorsDisplay = majors && majors.length ?
            majors.join(', ') : 'N/A';
        const prerequisitesDisplay = prerequisites && prerequisites.length ?
            prerequisites.join(', ') : 'N/A';
        const corequisitesDisplay = corequisites && corequisites.length ?
            corequisites.join(', ') : 'N/A';

        // Populate the tooltip text
        globalTooltip.innerHTML = `
            <div><strong>Tracks:</strong> ${tracksDisplay}</div>
            <div><strong>Majors:</strong> ${majorsDisplay}</div>
            <div><strong>Prerequisites:</strong> ${prerequisitesDisplay}</div>
            <div><strong>Corequisites:</strong> ${corequisitesDisplay}</div>
        `;

        // Position it above (or near) the hovered element
        const rect = courseElement.getBoundingClientRect();
        globalTooltip.style.left = (rect.left + rect.width / 2) + 'px';
        globalTooltip.style.top = (rect.top + window.scrollY - globalTooltip.offsetHeight - 8) + 'px';

        // Show the tooltip
        globalTooltip.style.display = 'block';
    }



    function hideTooltip() {
        globalTooltip.style.display = 'none';
    }



    // DATABASE FUNCTIONS:
    //USAGE:
    // save  ->   saveDatabase(jsonData);
    // retrieve   ->    getDatabase().then(data => {
    //                      // must do everything in here. variable is "data"
    //                  });




    // Toggle + headings
    const toggleButton = document.getElementById("toggleCourse");
    const courseTitle = document.getElementById("courseTitle");
    const studentInterfaceButton = document.querySelector("a[href='./../student-interface-demo/interface.html'] button");
    const allButtons = document.querySelectorAll("button:not(#toggleCourse):not(.student-interface-button)");




        // Course enrollment button
    const exportEnrollmentBtn = document.getElementById("exportEnrollmentBtn");
    if (exportEnrollmentBtn) {
        exportEnrollmentBtn.addEventListener("click", exportCourseEnrollmentToCSV);
    } else {
        // If the button doesn't exist yet, create it
        const exportBtnsContainer = document.querySelector('.export-buttons') ||
            document.querySelector('.modal-content .buttons') ||
            document.querySelector('.modal-content');

        if (exportBtnsContainer) {
            const newBtn = document.createElement("button");
            newBtn.id = "exportEnrollmentBtn";
            newBtn.className = "btn";
            newBtn.textContent = "Export Course Enrollment";
            newBtn.addEventListener("click", exportCourseEnrollmentToCSV);
            exportBtnsContainer.appendChild(newBtn);
        }
    }


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

            // Format tracks and majors as comma-separated lists
            const tracksDisplay = course.tracks && course.tracks.length ?
                course.tracks.join(', ') : 'N/A';
            const majorsDisplay = course.majors && course.majors.length ?
                course.majors.join(', ') : 'N/A';

            const prerequisitesDisplay = course.prerequisites && course.prerequisites.length ?
                course.prerequisites.join(', ') : 'N/A';
            const corequisitesDisplay = course.corequisites && course.corequisites.length ?
                course.corequisites.join(', ') : 'N/A';

            courseItem.innerHTML = `
                <strong>${course.title}</strong> <br>
                <span class="note">Num of Students Planned</span>
                <input type="text" value="${course.studentCount}" disabled>
                <div class="course-details">
                    <span class="course-track">Tracks: ${tracksDisplay}</span>
                    <span class="course-major">Majors: ${majorsDisplay}</span>
                    <span class="course-major">Prerequisites: ${prerequisitesDisplay}</span>
                    <span class="course-major">Corequisites: ${corequisitesDisplay}</span>
                </div>
            `;
            courseListElement.appendChild(courseItem);
        });
    }



    // Filter courses
    function filterCourses(showErrorMessage = false) {
        getDatabase().then(data => {
            const courseSearch = document.getElementById('searchCourse').value.toUpperCase();
            const majorSearch = document.getElementById('searchMajor').value.toUpperCase();
            const trackSearch = document.getElementById('searchTrack').value.toUpperCase();
            const semesterSearch = document.getElementById('searchSemesterPlanned') ?
                document.getElementById('searchSemesterPlanned').value.toUpperCase() : '';

            const dbCourses = data[0].data.courses;
            const allStudents = data[0].data.students;

            // Create a copy of the courses array to avoid modifying the database
            const coursesWithCounts = dbCourses.map(course => {
                // Create a clone of the course object
                const courseCopy = { ...course };

                // Count only for the specified semester
                let count = 0;
                allStudents.forEach(student => {
                    const hasCourse = student.plannedCourses.some(
                        plannedCourse => plannedCourse.title.toUpperCase() === course.title.toUpperCase() &&
                            plannedCourse.semester.toUpperCase().includes(semesterSearch)
                    );
                    if (hasCourse) count++;
                });
                courseCopy.studentCount = count;

                return courseCopy;
            });

            const filteredCourses = coursesWithCounts.filter(course => {
                const courseMatch = course.title.toUpperCase().includes(courseSearch);

                // Check if any major matches the search term
                const majorMatch = majorSearch === '' ||
                    (course.majors && course.majors.some(major =>
                        major.toUpperCase().includes(majorSearch)
                    ));

                // Check if any track matches the search term
                const trackMatch = trackSearch === '' ||
                    (course.tracks && course.tracks.some(track =>
                        track.toUpperCase().includes(trackSearch)
                    ));

                return courseMatch && majorMatch && trackMatch;
            });

            if (showErrorMessage && filteredCourses.length === 0 && courseSearch !== '') {
                showError("No courses found matching your search criteria");
            }
            displayCourses(filteredCourses);
            return filteredCourses.length > 0;
        });
    }



    // Search button calls filterCourses when clicked
    function searchButtonClicked() {
        filterCourses(true);
    }

    // Get unique semesters from a student's planned courses. Students may have different
    // semesters based on when they started college.
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

    // Displays the searched student's schedule on the calendar.
    function displayStudentSchedule(student) {
        if (!student || !student.plannedCourses || student.plannedCourses.length === 0) return;
        const semesters = getUniqueSemesters(student);

        // Get all course data from database first
        getDatabase().then(data => {
            const allCourses = data[0].data.courses;

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

                            // Get course info from the database courses
                            const courseInfo = allCourses.find(c => c.title === course.title);

                            // Default tracks and majors if not found
                            let trackInfo = [];
                            let majorInfo = [];
                            let prereqInfo = [];
                            let coreqInfo = [];

                            if (courseInfo) {
                                // Handle both array and singular properties
                                trackInfo = courseInfo.tracks || (courseInfo.track ? [].concat(courseInfo.track) : []);
                                majorInfo = courseInfo.majors || (courseInfo.major ? [].concat(courseInfo.major) : []);
                                prereqInfo = courseInfo.prerequisites || [];
                                coreqInfo = courseInfo.corequisites || [];
                            }

                            // Special case for "Study Off-Campus"
                            if (course.title === "Study Off-Campus") {
                                courseDiv.classList.add('study-abroad');
                                trackInfo = ["N/A"];
                                majorInfo = ["Study Abroad Program"];
                                prereqInfo = ["N/A"];
                                coreqInfo = ["N/A"];
                            }

                            courseDiv.textContent = course.title;

                            // Add hover event listeners for tooltip
                            courseDiv.addEventListener('mouseenter', () => {
                                showTooltip(courseDiv, trackInfo, majorInfo, prereqInfo, coreqInfo);
                            });

                            courseDiv.addEventListener('mouseleave', () => {
                                hideTooltip();
                            });

                            cells[index].appendChild(courseDiv);
                        }
                    });
                });
            });
        });
    }



    // Student search functionality.
    function searchStudent() {

        getDatabase().then(data => {
            const searchInput = document.getElementById('searchStudent');
            if (!searchInput) return;
            const searchTerm = searchInput.value.trim().toLowerCase();

            if (searchTerm === '') {
                clearCalendar();
                return;
            }
            const student = data[0].data.students.find(s => s.name.toLowerCase().includes(searchTerm));
            if (!student) {
                showError("No student found matching '" + searchTerm + "'");
                clearCalendar();
                return;
            }
            const semesters = getUniqueSemesters(student);
            createCalendarTable('.calendar-container', semesters);
            createCalendarTable('#modal-calendar', semesters);
            displayStudentSchedule(student);
        });
    }

    // Set up event listeners for search inputs (course/semester/major/track)
    const courseSearchInput = document.getElementById('searchCourse');
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

    const semesterSearchInput = document.getElementById('searchSemesterPlanned');
    if (semesterSearchInput) {
        semesterSearchInput.removeEventListener('input', function () { filterCourses(false); });
        semesterSearchInput.addEventListener('input', function () {
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
        getDatabase().then(data => {
            const trackSelect = document.getElementById('track');
            const majorSelect = document.getElementById('major');
            const prerequisitesSelect = document.getElementById('prerequisites');
            const corequisitesSelect = document.getElementById('corequisites');

            if (trackSelect) {
                // Clear existing options except the first one
                while (trackSelect.options.length > 1) {
                    trackSelect.remove(1);
                }

                // Add options from the tracks array
                data[0].data.tracks.forEach(track => {
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
                data[0].data.majors.forEach(major => {
                    const option = document.createElement('option');
                    option.value = major;
                    option.textContent = major;
                    majorSelect.appendChild(option);
                });
            }

            if (prerequisitesSelect) {
                // Clear existing options except the first one
                while (prerequisitesSelect.options.length > 1) {
                    prerequisitesSelect.remove(1);
                }

                // Add options from the majors array
                data[0].data.courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.title;
                    option.textContent = course.title;
                    prerequisitesSelect.appendChild(option);
                });
            }

            if (corequisitesSelect) {
                // Clear existing options except the first one
                while (corequisitesSelect.options.length > 1) {
                    corequisitesSelect.remove(1);
                }

                // Add options from the majors array
                data[0].data.courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.title;
                    option.textContent = course.title;
                    corequisitesSelect.appendChild(option);
                });
            }
        });
    }

    // Delete a course with the selected name and update dropdown
    function deleteCourse() {
        getDatabase().then(data => {
            const titleInput = document.getElementById('courseName');
            const title = titleInput.value.trim();

            if (!title) {
                showError("Please enter a course title to delete");
                return;
            }
            const courseIndex = data[0].data.courses.findIndex(c =>
                c.title.toLowerCase() === title.toLowerCase()
            );
            if (courseIndex === -1) {
                showError("Course not found");
                return;
            }
            data[0].data.courses.splice(courseIndex, 1);

            // Save the database and THEN update the interface when the save is complete
            fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: data[0].data })
            })
            .then(response => response.json())
            .then(() => {
                // Clear the input
                titleInput.value = '';

                // Update the course-related dropdowns AFTER the save is complete
                populateDropdowns();

                // Update the course display
                displayCourses(data[0].data.courses);

                // Show success message
                showSuccess("Course deleted successfully");
            })
            .catch(error => {
                console.error('Error:', error);
                showError("Error saving changes");
            });
        });
    }

    // AddCourse function add a course and update dropdowns after addition
    function addCourse() {
        getDatabase().then(data => {
            const titleInput = document.getElementById('courseName');
            const trackSelect = document.getElementById('track');
            const majorSelect = document.getElementById('major');
            const prerequisitesSelect = document.getElementById('prerequisites');
            const corequisitesSelect = document.getElementById('corequisites');

            const title = titleInput.value.trim();

            // Get all selected tracks
            const tracks = Array.from(trackSelect.selectedOptions)
                .filter(option => option.value) // Filter out the empty option
                .map(option => option.value);

            // Get all selected majors
            const majors = Array.from(majorSelect.selectedOptions)
                .filter(option => option.value) // Filter out the empty option
                .map(option => option.value);

            const prerequisites = Array.from(prerequisitesSelect.selectedOptions)
                .filter(option => option.value) // Filter out the empty option
                .map(option => option.value);

            const corequisites = Array.from(corequisitesSelect.selectedOptions)
                .filter(option => option.value) // Filter out the empty option
                .map(option => option.value);

            if (!title) {
                showError("Please enter a course title");
                return;
            }

            // Prevent duplicates - checking by title
            const existingCourse = data[0].data.courses.find(c =>
                c.title.toLowerCase() === title.toLowerCase()
            );
            if (existingCourse) {
                showError("This course already exists");
                return;
            }

            // Get department from the first major if available
            const department = majors.length > 0 ?
                majors[0].split(' ')[0] || "General" : "General";

            // Create new course
            const newCourse = {
                title: title,
                studentCount: 0,
                department: department,
                tracks: tracks,
                majors: majors,
                prerequisites: prerequisites,
                corequisites: corequisites
            };
            data[0].data.courses.push(newCourse);

            // Save the database and THEN update the interface when the save is complete
            fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: data[0].data })
            })
            .then(response => response.json())
            .then(() => {
                // Clear selections
                titleInput.value = '';
                for (let i = 0; i < trackSelect.options.length; i++) {
                    trackSelect.options[i].selected = false;
                }
                for (let i = 0; i < majorSelect.options.length; i++) {
                    majorSelect.options[i].selected = false;
                }
                for (let i = 0; i < prerequisitesSelect.options.length; i++) {
                    prerequisitesSelect.options[i].selected = false;
                }
                for (let i = 0; i < corequisitesSelect.options.length; i++) {
                    corequisitesSelect.options[i].selected = false;
                }

                // Reset the dropdown appearance
                trackSelect.blur();
                majorSelect.blur();
                prerequisitesSelect.blur();
                corequisitesSelect.blur();

                // Update the dropdowns
                populateDropdowns();

                // Update the course display
                displayCourses(data[0].data.courses);

                // Show success message
                showSuccess("Course added successfully");
            })
            .catch(error => {
                console.error('Error:', error);
                showError("Error saving changes");
            });
        });
    }

    // add a major with the selected name
    function addMajor() {
    getDatabase().then(data => {
        const majorInput = document.getElementById('newMajor');
        const major = majorInput.value.trim();

        if (!major) {
            showError("Please enter a major to add");
            return;
        }
        data[0].data.majors.push(major);

        // Save the database and THEN update the interface when the save is complete
        fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data[0].data })
        })
        .then(response => response.json())
        .then(() => {
            // Clear the input
            majorInput.value = '';

            // Update the dropdowns AFTER the save is complete
            populateDropdowns();

            // Show success message
            showSuccess("Major added successfully");
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error saving changes");
        });
    });
    }

    // Delete a major with the selected name
    function deleteMajor() {
    getDatabase().then(data => {
        const majorInput = document.getElementById('newMajor');
        const major = majorInput.value.trim();

        if (!major) {
            showError("Please enter a major to delete");
            return;
        }
        const majorIndex = data[0].data.majors.findIndex(c =>
            c.toLowerCase() === major.toLowerCase()
        );
        if (majorIndex === -1) {
            showError("Major not found");
            return;
        }
        data[0].data.majors.splice(majorIndex, 1);

        // Save the database and THEN update the interface when the save is complete
        fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data[0].data })
        })
        .then(response => response.json())
        .then(() => {
            // Clear the input
            majorInput.value = '';

            // Update the dropdowns AFTER the save is complete
            populateDropdowns();

            // Show success message
            showSuccess("Major deleted successfully");
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error saving changes");
        });
    });
    }

    // add a track with the selected name
    function addTrack() {
    getDatabase().then(data => {
        const trackInput = document.getElementById('newTrack');
        const track = trackInput.value.trim();

        if (!track) {
            showError("Please enter a track to add");
            return;
        }
        data[0].data.tracks.push(track);

        // Save the database and THEN update the interface when the save is complete
        fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data[0].data })
        })
        .then(response => response.json())
        .then(() => {
            // Clear the input
            trackInput.value = '';

            // Update the dropdowns AFTER the save is complete
            populateDropdowns();

            // Show success message
            showSuccess("Track added successfully");
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error saving changes");
        });
    });
    }

    // Delete a track with the selected name
    function deleteTrack() {
    getDatabase().then(data => {
        const trackInput = document.getElementById('newTrack');
        const track = trackInput.value.trim();

        if (!track) {
            showError("Please enter a track to delete");
            return;
        }
        const trackIndex = data[0].data.tracks.findIndex(c =>
            c.toLowerCase() === track.toLowerCase()
        );
        if (trackIndex === -1) {
            showError("Track not found");
            return;
        }
        data[0].data.tracks.splice(trackIndex, 1);

        // Save the database and THEN update the interface when the save is complete
        fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/store-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data[0].data })
        })
        .then(response => response.json())
        .then(() => {
            // Clear the input
            trackInput.value = '';

            // Update the dropdowns AFTER the save is complete
            populateDropdowns();

            // Show success message
            showSuccess("Track deleted successfully");
        })
        .catch(error => {
            console.error('Error:', error);
            showError("Error saving changes");
        });
    });
    }


        // Delete a student with the selected email
        function deleteStudent() {
            getDatabase().then(data => {
                const studentInput = document.getElementById('studentEmail');
                const student = studentInput.value.trim();
                const confirmInput = document.getElementById('confirm');
                const confirm = confirmInput.value.trim();

                if (!student) {
                    showError("Please enter a Student to Input");
                    return;
                }
                const studentIndex = data[0].data.students.findIndex(c =>
                    c.email.toLowerCase() === student.toLowerCase()
                );
                if (studentIndex === -1) {
                    showError("Student not found");
                    return;
                }
                if (confirm.toLowerCase() != "confirm") {
                    showError("Please enter confirm text!");
                    return;
                }

                data[0].data.students.splice(studentIndex, 1);
                saveDatabase(data[0].data);
                studentInput.value = '';
                confirmInput.value = '';
                // displayCourses(data[0].data.ma);

                showSuccess("Student deleted successfully");
            });
        }



    // Make sure the dropdowns allow multiple selections
    function fixMultipleSelection() {
        const trackSelect = document.getElementById('track');
        const majorSelect = document.getElementById('major');
        const prerequisitesSelect = document.getElementById('prerequisites');
        const corequisitesSelect = document.getElementById('corequisites');

        // Ensure multiple attribute is set
        if (trackSelect) {
            trackSelect.multiple = true;

            // Add click handler to prevent default behavior that might be interfering
            trackSelect.addEventListener('mousedown', function(e) {
                if (e.target.tagName === 'OPTION') {
                    // Prevent deselection of other options
                    e.preventDefault();

                    // Toggle selection of the clicked option
                    e.target.selected = !e.target.selected;

                    // Trigger a change event
                    const event = new Event('change');
                    this.dispatchEvent(event);

                    return false;
                }
            });
        }

        // Same for major select
        if (majorSelect) {
            majorSelect.multiple = true;

            majorSelect.addEventListener('mousedown', function(e) {
                if (e.target.tagName === 'OPTION') {
                    e.preventDefault();
                    e.target.selected = !e.target.selected;

                    const event = new Event('change');
                    this.dispatchEvent(event);

                    return false;
                }
            });
        }

        if (prerequisitesSelect) {
            prerequisitesSelect.multiple = true;

            prerequisitesSelect.addEventListener('mousedown', function (e) {
                if (e.target.tagName === 'OPTION') {
                    e.preventDefault();
                    e.target.selected = !e.target.selected;

                    const event = new Event('change');
                    this.dispatchEvent(event);

                    return false;
                }
            });
        }

        if (corequisitesSelect) {
            corequisitesSelect.multiple = true;

            corequisitesSelect.addEventListener('mousedown', function (e) {
                if (e.target.tagName === 'OPTION') {
                    e.preventDefault();
                    e.target.selected = !e.target.selected;

                    const event = new Event('change');
                    this.dispatchEvent(event);

                    return false;
                }
            });
        }
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
    const submitButton = document.getElementById('courseSubmitBtn');
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

    const remMajorButton = document.getElementById('remMajorBtn');
    remMajorButton.addEventListener('click', function() {
        deleteMajor();
    });

    const remTrackButton = document.getElementById('remTrackBtn');
    remTrackButton.addEventListener('click', function() {
        deleteTrack();
    });

    const addMajorButton = document.getElementById('addMajorBtn');
    addMajorButton.addEventListener('click', function () {
        addMajor();
    });

    const addTrackButton = document.getElementById('addTrackBtn');
    addTrackButton.addEventListener('click', function () {
        addTrack();
    });

    const remStudentButton = document.getElementById('remStudent');
    remStudentButton.addEventListener('click', function() {
        deleteStudent();
    });

    // Initialize with empty course list
    displayCourses([]);

    // Initialize the track and major dropdowns
    populateDropdowns();

    // Fix multiple selection
    fixMultipleSelection();
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

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        const tabId = button.dataset.tab;

        // Update tab button styling
        document.querySelectorAll(".tab").forEach(btn => {
            btn.classList.remove("active");
            btn.style.backgroundColor = "#62626c ";
        });
        button.classList.add("active");
        button.style.backgroundColor = "#002f86";

        // Show the selected tab content
        document.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = content.id === tabId ? "block" : "none";
        });
    });
});

// Exports all courses with their enrollment counts per semester
function exportCourseEnrollmentToCSV() {
    // Get database information
    getDatabase().then(data => {
        const courses = data[0].data.courses;
        const students = data[0].data.students;

        // Get all unique semesters across all student plans
        const allSemesters = new Set();
        students.forEach(student => {
            if (student.plannedCourses) {
                student.plannedCourses.forEach(course => {
                    allSemesters.add(course.semester.toUpperCase());
                });
            }
        });

        // Convert to array and sort semesters chronologically
        const sortedSemesters = Array.from(allSemesters).sort((a, b) => {
            const aSeason = a.split(' ')[0];
            const aYear = parseInt(a.split(' ')[1]);
            const bSeason = b.split(' ')[0];
            const bYear = parseInt(b.split(' ')[1]);

            if (aYear !== bYear) return aYear - bYear;
            return aSeason === 'SPRING' && bSeason === 'FALL' ? -1 : 1;
        });

        // Initialize CSV header row with course info columns
        let csvContent = "Course Title,Department,Total Students";

        // Add semester columns to header
        sortedSemesters.forEach(semester => {
            csvContent += `,${semester}`;
        });
        csvContent += "\r\n";

        // Process each course
        courses.forEach(course => {
            // Initialize enrollment counts for each semester
            const semesterCounts = {};
            sortedSemesters.forEach(semester => {
                semesterCounts[semester] = 0;
            });

            // Count enrollments per semester
            let totalStudents = 0;
            students.forEach(student => {
                if (student.plannedCourses) {
                    student.plannedCourses.forEach(plannedCourse => {
                        if (plannedCourse.title.toUpperCase() === course.title.toUpperCase()) {
                            semesterCounts[plannedCourse.semester.toUpperCase()]++;
                            totalStudents++;
                        }
                    });
                }
            });

            // Add course info to CSV
            csvContent += `"${course.title.toUpperCase()}","${course.department || ''}",${totalStudents}`;

            // Add semester counts
            sortedSemesters.forEach(semester => {
                csvContent += `,${semesterCounts[semester]}`;
            });
            csvContent += "\r\n";
        });

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "course_enrollment_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}


// Exports a student's schedule to a CSV file.
function exportScheduleToCSV() {
    const rows = document.querySelectorAll('#modal-calendar table tr');
    let csvContent = "";

    rows.forEach(row => {
        const cols = row.querySelectorAll('th, td');
        const rowData = Array.from(cols).map(cell => {
            let text = cell.innerText.replace(/"/g, '""'); // escape quotes
            return `"${text}"`;
        }).join(",");
        csvContent += rowData + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "full_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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
            window.location.href = "../profile_page_admin/admin_profile.html"; // Adjust path if needed
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

function requireLogin() {
    const user = sessionStorage.getItem('user');
    if (!user) {
        alert("No admin session found. Please log in.");
        window.location.href = "../Login_Page/login_page.html"; // Adjust path if needed
    }
}
