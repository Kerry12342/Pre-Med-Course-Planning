
window.onload = loadStudent;



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

        const dbCourses = data[0].data.courses
        //

        const filteredCourses = dbCourses.filter(course => {
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
        td.id = `cell-${sem}`;
        row.appendChild(td);
    });
    body.appendChild(row);

    currentStudent.plannedCourses.forEach(course => {
        const cell = document.getElementById(`cell-${course.semester}`);
        if (cell) {
            const div = document.createElement("div");
            div.className = "calendar-course";
            div.textContent = course.title;
            cell.appendChild(div);
        }
    });
}


// Adds a course to the student's current list of courses.
function addCourse() {
    getDatabase().then(data => {
        const title = document.getElementById("courseInput").value.trim().toUpperCase();
        const semester = document.getElementById("semesterSelect").value;

        if (!title || !semester) return showMessage("Missing course title or semester.");

        if (data[0].data.courses.some(c => c.title === title)) {
            // If the course is already in the student's list, then they can't plan it again.
            if (currentStudent.plannedCourses.some(c => c.title === title)) {
                return showMessage("Course already planned.");
            }
            // Can't take if they don't meet the prerequisistes.
            if (!prerequisitesMet(title, semester)) {
                return showMessage("Missing prerequisites.");
            }
        }
        else {
            return showMessage("Course does not exist.");
        }

        currentStudent.plannedCourses.push({ title, semester });
        populateCalendar();
        showMessage("Course added.", true);
    });
}


// Removes a course from the student's list of courses.
function removeCourse() {
    const title = document.getElementById("courseInput").value.trim().toUpperCase();
    const semester = document.getElementById("semesterSelect").value;
    const index = currentStudent.plannedCourses.findIndex(c => c.title === title && c.semester === semester);

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
