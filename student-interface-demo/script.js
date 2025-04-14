// ---------------------------------------------------------
// DUMMY DATA
// ---------------------------------------------------------
const student_data = {
    "start_term": "FA2024",
    "track_or_major_list": [
        {
            "title": "CS",
            "requisites": ["CS101", "CS102", "CS220"]
        }
    ],
    "contact_info": {
        "email": "student@example.com",
        "phone": "555-1234"
    },
    "advisor_contact_info": {
        "name": "Dr. John Doe",
        "email": "advisor@example.com",
        "phone": "555-5678"
    },
    "completed_courses": [],
    "planned_courses": []
};

const course_data = [
    {
        "title": "CS101",
        "requisites": []
    },
    {
        "title": "CS102",
        "requisites": ["CS101"]
    },
    {
        "title": "CS220",
        "requisites": ["CS101", "CS102"]
    },
    {
        "title": "CHEM101",
        "requisites": []
    },
    {
        "title": "BIO100",
        "requisites": []
    },
    {
        "title": "BIO100-L",
        "requisites": []
    }
];

const major_data = [
    {
        "title": "CS",
        "requisites": ["CS101", "CS102", "CS220"]
    },
    {
        "title": "BIOCHEM",
        "requisites": ["CHEM101", "BIO100", "BIO100-L"]
    },
    {
        "title": "BIOINFORMATICS",
        "requisites": ["CS101", "CS102", "BIO100", "BIO100-L"]
    }
];

const track_data = [
    {
        "title": "GAME DEVELOPMENT",
        "requisites": ["CS101", "CS102", "CS220"]
    },
    {
        "title": "PUBLIC HEALTH",
        "requisites": ["BIO100", "BIO100-L"]
    },
    {
        "title": "PHARMA",
        "requisites": ["CS101", "CHEM101", "BIO100", "BIO100-L"]
    }
];

const semester_range = ["FA2025", "SP2030"];

// ---------------------------------------------------------
// Data retrieving functions
// ---------------------------------------------------------
function get_student_data() { return student_data; }
function get_course_data() { return JSON.parse(JSON.stringify(course_data)); }
function get_major_data() { return major_data; }
function get_track_data() { return track_data; }
function get_semester_range() { return semester_range; }

// ---------------------------------------------------------
// Utility function to compare terms (FA20XX, SP20XX)
// ---------------------------------------------------------
function before(term_1, term_2) {
    const term_1_year = parseInt(term_1.substring(2));
    const term_2_year = parseInt(term_2.substring(2));
    if (term_1_year < term_2_year) {
        return true;
    } else if (term_1_year > term_2_year) {
        return false;
    } else {
        // If in the same year, SP is "earlier" than FA
        return ((term_1.substring(0, 2) === "SP") && (term_2.substring(0, 2) === "FA"));
    }
}

// ---------------------------------------------------------
// Helper function to find majors and tracks for a course
// ---------------------------------------------------------
function getCourseTracksAndMajors(courseTitle) {
    const belongingTracks = track_datas
        .filter(track => track.requisites.includes(courseTitle))
        .map(track => track.title);

    const belongingMajors = major_datas
        .filter(major => major.requisites.includes(courseTitle))
        .map(major => major.title);

    return {
        tracks: belongingTracks,
        majors: belongingMajors
    };
}

// ---------------------------------------------------------
// Student class
// ---------------------------------------------------------
class Student {
    constructor(start_term, track_or_major_list, contact_info, advisor_contact_info, completed_courses, planned_courses, all_course_data) {
        this.start_term = start_term;
        this.track_or_major_list = track_or_major_list;
        this.contact_info = contact_info;
        this.advisor_contact_info = advisor_contact_info;
        this.planned_courses = planned_courses;
        this.completed_courses = completed_courses;
        this.all_course_data = all_course_data;
    }

    all_planned_courses_before_term(target_term) {
        return this.planned_courses
            .filter(course => before(course[1], target_term))
            .map(course => course[0]);
    }

    display_all_course_data() {
        for (const dictionary of get_course_data()) {
            for (const key in dictionary) {
                alert(`${key}: ${dictionary[key]}`);
            }
        }
    }

    getCourseRequisites(courseName) {
        const course = this.all_course_data.find(c => c.title.toLowerCase() === courseName.toLowerCase());
        if (course) {
            return course.requisites;
        } else {
            console.error(`Course ${courseName} not found.`);
            return [];
        }
    }

    has_prereqs_for_course(target_course, target_term) {
        let course_prereqs = this.getCourseRequisites(target_course.title);
        let completed_and_planned = this.all_planned_courses_before_term(target_term);

        for (const course of completed_and_planned) {
            if (course_prereqs.includes(course)) {
                const idx = course_prereqs.indexOf(course);
                if (idx > -1) {
                    course_prereqs.splice(idx, 1);
                }
            }
        }
        return (course_prereqs.length === 0);
    }

    able_to_plan_course(target_course, target_term) {
        return (
            this.has_prereqs_for_course(target_course, target_term) &&
            !this.planned_courses.includes(target_course) &&
            !this.completed_courses.includes(target_course)
        );
    }

    plan_course(target_course, term) {
        if (this.able_to_plan_course(target_course, term)) {
            target_course.currentCount += 1;
            this.planned_courses.push([target_course, term]);
        } else {
            console.log("Could not plan course");
        }
    }

    complete_course(target_course, term) {
        const remindex = this.planned_courses.indexOf(target_course);
        this.planned_courses.splice(remindex, 1);
        this.completed_courses.push([target_course, term]);
    }

    remove_planned_courese(target_course) {
        const remindex = this.planned_courses.indexOf(target_course);
        this.planned_courses.splice(remindex, 1);
    }
}

// ---------------------------------------------------------
// UI stuff below
// ---------------------------------------------------------
const student_datas = get_student_data();
const course_datas = get_course_data();
const major_datas = get_major_data();
const track_datas = get_track_data();
const semesters_range = get_semester_range();

// <<< 1) Create or reference the globalTooltip element from the HTML
const globalTooltip = document.getElementById("globalTooltip");

// <<< 2) Helper functions to show/hide the global tooltip
function showTooltip(anchorElement, htmlContent) {
    if (!globalTooltip) return;

    // Fill the tooltip content
    globalTooltip.innerHTML = htmlContent;

    // Position it near the anchor element
    const rect = anchorElement.getBoundingClientRect();
    const tooltipWidth = globalTooltip.offsetWidth;
    const tooltipHeight = globalTooltip.offsetHeight;

    // Example: place it above, centered horizontally
    // Adjust to your liking (e.g. to the right, below, etc.)
    globalTooltip.style.left = (rect.left + (rect.width / 2) - tooltipWidth / 2) + "px";
    globalTooltip.style.top = (rect.top + window.scrollY - tooltipHeight - 8) + "px";

    // Show it
    globalTooltip.style.display = "block";
}

function hideTooltip() {
    if (!globalTooltip) return;
    globalTooltip.style.display = "none";
}

// Function to create a Student object
function createStudentFromData(studentData, all_courses) {
    const {
        start_term,
        track_or_major_list,
        contact_info,
        advisor_contact_info,
        completed_courses,
        planned_courses
    } = studentData;

    return new Student(
        start_term,
        track_or_major_list,
        contact_info,
        advisor_contact_info,
        completed_courses,
        planned_courses,
        all_courses
    );
}

function get_course_names(courseData) {
    return courseData.map(course => course.title);
}

// Filter courses
function filter_courses() {
    const trackSelect = document.getElementById("track");
    const majorSelect = document.getElementById("major");
    const selectedTrack = trackSelect.value;
    const selectedMajor = majorSelect.value;

    let filteredCourses = [];

    if (selectedTrack === "" && selectedMajor === "") {
        filteredCourses = get_course_names(course_datas);
    } else if (selectedTrack === "") {
        const major = major_datas.find(m => m.title === selectedMajor);
        if (major) {
            filteredCourses = get_course_names(course_datas.filter(course =>
                major.requisites.includes(course.title)
            ));
        }
    } else if (selectedMajor === "") {
        const track = track_datas.find(t => t.title === selectedTrack);
        if (track) {
            filteredCourses = get_course_names(course_datas.filter(course =>
                track.requisites.includes(course.title)
            ));
        }
    } else {
        const track = track_datas.find(t => t.title === selectedTrack);
        const major = major_datas.find(m => m.title === selectedMajor);
        if (track && major) {
            filteredCourses = get_course_names(course_datas.filter(course =>
                track.requisites.includes(course.title) && major.requisites.includes(course.title)
            ));
        }
    }

    display_courses(filteredCourses);
    makeCoursesDraggable();
    makeCalendarDroppable();
}

// Display filtered courses as buttons
function display_courses(courses) {
    const courseListDiv = document.getElementById("courseList");
    courseListDiv.innerHTML = '';

    if (courses.length === 0) {
        courseListDiv.innerHTML = "<p>No courses available based on the selected filter criteria.</p>";
        return;
    }

    courses.forEach(courseTitle => {
        const courseButton = document.createElement("button");
        courseButton.classList.add("course-button");
        courseButton.textContent = courseTitle;

        // Make it green
        courseButton.style.backgroundColor = "green";
        courseButton.style.color = "white";

        // <<< Remove the 'title' attribute approach
        // <<< Instead, show a custom tooltip on hover
        const { tracks, majors } = getCourseTracksAndMajors(courseTitle);
        // Build HTML for the tooltip
        const tooltipHtml = `
            <div><strong>Majors:</strong> ${majors.join(", ") || "None"}</div>
            <div><strong>Tracks:</strong> ${tracks.join(", ") || "None"}</div>
        `;

        courseButton.addEventListener("mouseenter", () => {
            showTooltip(courseButton, tooltipHtml);
        });
        courseButton.addEventListener("mouseleave", hideTooltip);

        courseListDiv.appendChild(courseButton);
    });
}

function populateTrackOptions() {
    const trackSelect = document.getElementById("track");
    trackSelect.innerHTML = '';

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Tracks";
    trackSelect.appendChild(defaultOption);

    track_datas.forEach(track => {
        const option = document.createElement("option");
        option.value = track.title;
        option.textContent = track.title;
        trackSelect.appendChild(option);
    });
}

function populateMajorOptions() {
    const majorSelect = document.getElementById("major");
    majorSelect.innerHTML = '';

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Majors";
    majorSelect.appendChild(defaultOption);

    major_datas.forEach(major => {
        const option = document.createElement("option");
        option.value = major.title;
        option.textContent = major.title;
        majorSelect.appendChild(option);
    });
}

// Generate and populate calendar
function generateSemesters(startTerm, endTerm) {
    const semesters = [];
    const startYear = parseInt(startTerm.substring(2, 6));
    const startSeason = startTerm.substring(0, 2);
    const endYear = parseInt(endTerm.substring(2, 6));
    const endSeason = endTerm.substring(0, 2);

    let year = startYear;
    let season = startSeason;

    while (year < endYear || (year === endYear && (season === startSeason || (season === "FA" && endSeason === "SP")))) {
        semesters.push(season + year);
        if (season === "FA") {
            season = "SP";
        } else {
            season = "FA";
            year++;
        }
    }
    return semesters;
}

function populateCalendar(semesters) {
    const calendarTable = document.getElementById("calendarTable");
    const headerRow = calendarTable.querySelector("thead tr");
    headerRow.innerHTML = '';

    semesters.forEach(semester => {
        const th = document.createElement("th");
        th.textContent = semester;
        headerRow.appendChild(th);
    });

    const calendarBody = calendarTable.querySelector("tbody");
    calendarBody.innerHTML = '';
    const numberOfRows = 1;

    for (let i = 0; i < numberOfRows; i++) {
        const row = document.createElement("tr");
        semesters.forEach(semester => {
            const td = document.createElement("td");
            td.classList.add("calendar-cell");
            td.setAttribute("data-semester", semester);
            row.appendChild(td);
        });
        calendarBody.appendChild(row);
    }
}

const student = createStudentFromData(student_data, course_datas);
const addedCourses = [];

// Update planned courses
function updateStudentPlannedCourses() {
    const studentCourses = [];
    const courseButtons = document.querySelectorAll(".calendar-cell button");

    courseButtons.forEach(button => {
        const cell = button.closest("td");
        const semester = cell.getAttribute("data-semester");
        studentCourses.push([button.textContent.trim(), semester]);
    });

    student.planned_courses = studentCourses;
}

// Make calendar droppable
function makeCalendarDroppable() {
    const calendarCells = document.querySelectorAll(".calendar-cell");

    calendarCells.forEach(cell => {
        cell.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        cell.addEventListener("drop", (event) => {
            event.preventDefault();
            const courseName = event.dataTransfer.getData("course").trim();
            const courseNameLower = courseName.toLowerCase();

            if (addedCourses.some(course => course.toLowerCase() === courseNameLower)) {
                return;
            }

            const semester = cell.getAttribute("data-semester");
            const course = course_datas.find(c => c.title.toLowerCase() === courseNameLower);

            if (!student.has_prereqs_for_course(course, semester)) {
                alert(`You do not meet the prerequisites for ${courseName}.`);
                return;
            }

            if (courseName) {
                const courseButton = document.createElement("button");
                courseButton.classList.add("course-button");
                courseButton.textContent = courseName;

                courseButton.style.backgroundColor = "green";
                courseButton.style.color = "white";

                // <<< Hover-based tooltip for dropped courses as well
                const { tracks, majors } = getCourseTracksAndMajors(courseName);
                const tooltipHtml = `
                    <div><strong>Majors:</strong> ${majors.join(", ") || "None"}</div>
                    <div><strong>Tracks:</strong> ${tracks.join(", ") || "None"}</div>
                `;
                courseButton.addEventListener("mouseenter", () => {
                    showTooltip(courseButton, tooltipHtml);
                });
                courseButton.addEventListener("mouseleave", hideTooltip);

                // Remove on click
                courseButton.addEventListener("click", (event) => {
                    const cell = event.target.closest("td");
                    cell.removeChild(event.target);
                    const index = addedCourses.indexOf(courseName);
                    if (index > -1) {
                        addedCourses.splice(index, 1);
                    }
                    updateStudentPlannedCourses();
                });

                cell.appendChild(courseButton);
                addedCourses.push(courseName);
                updateStudentPlannedCourses();
            }
        });
    });
}

// Make courses draggable
function makeCoursesDraggable() {
    const availableCourses = document.getElementById("courseList");
    const courseButtons = availableCourses.querySelectorAll("button");

    courseButtons.forEach(button => {
        button.setAttribute("draggable", "true");
        button.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("course", event.target.textContent);
        });
    });
}

// Populate everything on load
populateTrackOptions();
populateMajorOptions();
populateCalendar(generateSemesters(semesters_range[0], semesters_range[1]));
