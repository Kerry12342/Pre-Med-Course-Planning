
window.onload = loadStudent;

// --- Create the GLOBAL tooltip at the document load ---
document.addEventListener("DOMContentLoaded", function() {

    // Add event listeners for search inputs to make them dynamic
    const courseSearchInput = document.getElementById('searchCourse');
    const trackSearchInput = document.getElementById('searchTrack');
    const majorSearchInput = document.getElementById('searchMajor');

    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    if (majorSearchInput) {
        majorSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    if (trackSearchInput) {
        trackSearchInput.addEventListener('input', function() {
            filterCourses(false);
        });
    }

    // Create the tooltip element if it doesn't exist
    if (!document.getElementById('globalTooltip')) {
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
    }
});

// Helper function to show tooltip
function showTooltip(courseElement, tracks, majors, prerequisites, corequisites) {
    const globalTooltip = document.getElementById('globalTooltip');
    if (!globalTooltip) return;

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

// Helper function to hide tooltip
function hideTooltip() {
    const globalTooltip = document.getElementById('globalTooltip');
    if (globalTooltip) {
        globalTooltip.style.display = 'none';
    }
}

//--------------------------------------------------------
//DATABASE REQUEST FUNCTIONS
//--------------------------------------------------------

// Save database. Pass it the updated database.
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



// Fetch the current database.
function getDatabase() {
    return fetch('https://hamiltoncollegeprehealthplanning.duckdns.org:3000/get-json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return []; // Return an empty array in case of an error
        });
}

//--------------------------------------------------------
    //USAGE:
    // save  ->   saveDatabase(jsonData);
    // retrieve   ->    getDatabase().then(data => {
    //                      // must do everything in here. variable is "data"
    //                  });
    //--------------------------------------------------------


// Display all of the courses to the student. Passed the list of courses to be displayed.
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


// Filters courses based on course title, major, and track
function filterCourses(showErrorMessage = false) {
    getDatabase().then(data => {
        const courseSearch = document.getElementById('searchCourse').value.toUpperCase();
        const majorSearch = document.getElementById('searchMajor').value.toUpperCase();
        const trackSearch = document.getElementById('searchTrack').value.toUpperCase();

        const dbCourses = data[0].data.courses;
        const allStudents = data[0].data.students;

        // Create a copy of the courses array with student counts
        const coursesWithCounts = dbCourses.map(course => {
            // Create a clone of the course object
            const courseCopy = { ...course };

            // Count students planning this course
            let count = 0;
            allStudents.forEach(student => {
                if (student.plannedCourses) {
                    const hasCourse = student.plannedCourses.some(
                        plannedCourse => plannedCourse.title.toUpperCase() === course.title.toUpperCase()
                    );
                    if (hasCourse) count++;
                }
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
            showMessage("No courses found matching your search criteria");
        }
        displayCourses(filteredCourses);
        return filteredCourses.length > 0;
    });
}

// When search button is clicked, courses are filtered.
function searchButtonClicked() {
    filterCourses(true);
}

let currentStudent = null;

function generateSemesters(startingFromFall = true, totalSemesters = 9) {
    const currentYear = new Date().getFullYear() - 1;
    const semesters = [];

    let year = currentYear;
    let isFall = startingFromFall;

    for (let i = 0; i < totalSemesters; i++) {
        const semester = isFall ? `Fall ${year}` : `Spring ${year + 1}`;
        semesters.push(semester);
        isFall = !isFall;
        if (isFall) year++; // only increment year after Spring
    }

    return semesters;
}

const semesters = generateSemesters();


// Gets the current student's information and populates the calendar and semesters accordingly.
function loadStudent() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData || userData.role !== 'student') {
        alert("No student session found. Please log in again. If the issue persists, try clearing your cache.");
        window.location.href = "../Login_Page/login_page.html";
        return;
    }

    getDatabase().then(data => {
        const allStudents = data[0].data.students;
        const match = allStudents.find(s => s.email.toLowerCase() === userData.email.toLowerCase());

        if (!match) {
            alert("Student not found in the database.");
            window.location.href = "../Login_Page/login_page.html";
            return;
        }

        currentStudent = match;
        populateCalendar();
        populateSemesterOptions();

        currentStudent.plannedCourses = currentStudent.plannedCourses.filter(item => semesters.includes(item.semester));


        // getDatabase().then(data => {
        //     const urlParams = new URLSearchParams(window.location.search);
        //     const email = urlParams.get('email');
        //     currentStudent = data[0].data.students.find(item => item.email === email); // Replace with dynamic lookup as needed
    });
}


// Populates the different semester options.
function populateSemesterOptions() {
    const select = document.getElementById("semesterSelect");
    semesters.forEach(sem => {
        const option = document.createElement("option");
        option.value = sem;
        option.textContent = sem;
        select.appendChild(option);
    });
}


// Fills in the calendar with the different courses the student is taking.
function populateCalendar() {
    const headerRow = document.getElementById("calendar-semesters");
    const body = document.getElementById("calendar-body");
    headerRow.innerHTML = "";
    body.innerHTML = "";

    semesters.forEach(sem => {
        const th = document.createElement("th");
        th.textContent = sem;
        headerRow.appendChild(th);
    });

    const row = document.createElement("tr");
    semesters.forEach(sem => {
        const td = document.createElement("td");
        td.id = `cell-${sem.toUpperCase()}`;
        row.appendChild(td);
    });
    body.appendChild(row);

    // Get all course data to display in tooltips
    getDatabase().then(data => {
        const allCourses = data[0].data.courses;

        currentStudent.plannedCourses.forEach(course => {
            const cell = document.getElementById(`cell-${course.semester.toUpperCase()}`);
            if (cell) {
                const div = document.createElement("div");
                div.className = "calendar-course";
                div.textContent = course.title;

                // Get course info from the database
                const courseInfo = allCourses.find(c => c.title.toUpperCase() === course.title.toUpperCase());

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
                    div.classList.add('study-abroad');
                    trackInfo = ["N/A"];
                    majorInfo = ["Study Abroad Program"];
                    prereqInfo = ["N/A"];
                    coreqInfo = ["N/A"];
                }

                // Add hover event listeners for tooltip
                div.addEventListener('mouseenter', () => {
                    showTooltip(div, trackInfo, majorInfo, prereqInfo, coreqInfo);
                });

                div.addEventListener('mouseleave', () => {
                    hideTooltip();
                });

                cell.appendChild(div);
            }
        });
    });
}

// Adds a course to the student's current list of courses.
function addCourse() {
    getDatabase().then(data => {
        const titleInput = document.getElementById("courseInput").value.trim();
        const title = titleInput.toUpperCase();
        const semester = document.getElementById("semesterSelect").value;

        if (!title || !semester) return showMessage("Missing course title or semester.");

        // Check if course exists in the database
        const courseExists = data[0].data.courses.some(c =>
            c.title.toUpperCase() === title
        );

        if (!courseExists) {
            return showMessage("Course does not exist in the database.");
        }

        // Check if course is already in student's plan
        if (currentStudent.plannedCourses.some(c =>
            c.title.toUpperCase() === title &&
            c.semester.toUpperCase() === semester.toUpperCase()
        )) {
            return showMessage("Course already planned for this semester.");
        }

        // Check prerequisites (the function is currently always returning true)
        if (!prerequisitesMet(title, semester)) {
            return showMessage("Missing prerequisites for this course.");
        }

        // Add the course using the original case from the input
        currentStudent.plannedCourses.push({
            title: titleInput,
            semester: semester
        });

        populateCalendar();
        showMessage("Course added successfully.", true);
    });
}



// Removes a course from the student's list of courses.
function removeCourse() {
    const title = document.getElementById("courseInput").value.trim().toUpperCase();
    const semester = document.getElementById("semesterSelect").value.toUpperCase();
    const index = currentStudent.plannedCourses.findIndex(c => c.title.toUpperCase() === title && c.semester.toUpperCase() === semester);

    if (index === -1) return showMessage("Course not found in that semester.");

    currentStudent.plannedCourses.splice(index, 1);
    populateCalendar();
    showMessage("Course removed.", true);
}

function prerequisitesMet(title, semester) {
    // TODO: Add logic to check prerequisites (e.g. search course catalog)
    return true;
}

function removeElement(arr, element) {
    const index = arr.indexOf(element);
    if (index > -1) {
        arr.splice(index, 1);
    }
}


// Saves student's current information to the database.
function saveStudent() {
    getDatabase().then(data => {
        const email = currentStudent.email;
        const foundStudent = data[0].data.students.find(obj => obj.email === email);
        removeElement(data[0].data.students, foundStudent);
        data[0].data.students.push(currentStudent);
        if (typeof saveDatabase === "function") {
            saveDatabase(data[0].data);
            showMessage("Schedule saved!", true);
        } else {
            showMessage("saveDatabase() not available.");
        }
    });
}

function showMessage(msg, success = false) {
    const box = document.getElementById("messageBox");
    box.textContent = msg;
    box.style.color = success ? "green" : "red";
}

displayCourses([]);

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
            window.location.href = "../profile_page_student/student_profile.html"; // Adjust path if needed
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
