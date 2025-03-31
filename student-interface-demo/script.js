
// ---------------------------------------------------------
// DUMMY DATA (will eventually be from JSON once our site is hosted)
// ---------------------------------------------------------

// Dummy student data. The json file will look exactly like this, we just
// need to host our site on the server first to use Fetch()

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

// Dummy course and tracks data. Same deal as above

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

// Semester range the student will be planning for. See get_semester_range() below

const semester_range = ["FA2025", "SP2030"];

// ---------------------------------------------------------
// Data retrieving functions (not yet implemented)
// ---------------------------------------------------------

// We'll get and parse the JSON with the functions below

function get_student_data() {
    // just return dummy data
    return student_data;
}

function get_course_data() {
    // just return dummy data
    return JSON.parse(JSON.stringify(course_data));
}

function get_major_data() {
    // just return dummy data
    return major_data;
}

function get_track_data() {
    // just return dummy data
    return track_data;
}

function get_semester_range() {
    // Maybe we should get this automatically from todays date/time?
    return semester_range;
}

// ---------------------------------------------------------
// Student class
// ---------------------------------------------------------

// terms must be formatted as FA20XX, SP20XX
function before(term_1, term_2) {
    term_1_year = parseInt(term_1.substring(2));
    term_2_year = parseInt(term_2.substring(2));
    if (term_1_year < term_2_year) {
        return true;
    } else if (term_1_year > term_2_year) {
        return false;
    } else {
        return ((term_1.substring(0, 2) == "SP") && (term_2.substring(0, 2) == "FA"));
    }
}

// Student class. Is able to plan courses and add them to their schedule

class Student {
    constructor(start_term, track_or_major_list, contact_info, advisor_contact_info, completed_courses, planned_courses, all_course_data) {
        this.start_term = start_term; //String
        this.track_or_major_list = track_or_major_list; // Array
        this.contact_info = contact_info; // Object
        this.advisor_contact_info = advisor_contact_info; // Object
        this.planned_courses = planned_courses; //array of arrays. 1st is title 2nd is term
        this.completed_courses = completed_courses; // Array
        this.all_course_data = all_course_data;
    }

    all_planned_courses_before_term(target_term) {
        return this.planned_courses.filter(course => before(course[1], target_term)).map(function (course) {
            return course[0];
        });
    }

    display_all_course_data() {
        for (const dictionary of get_course_data()) {
            for (const key in dictionary) {
                alert(`${key}: ${dictionary[key]}`);
            }
        }
    }

    getCourseRequisites(courseName) {
        // Find the course object that matches the given course name (case-insensitive)
        const course = this.all_course_data.find(c => c.title.toLowerCase() === courseName.toLowerCase());
        // If the course is found, return its requisites array
        if (course) {
            return course.requisites;
        } else {
            // If course is not found, return an empty array or null as appropriate
            console.error(`Course ${courseName} not found.`);
            return [];
        }
    }

    has_prereqs_for_course(target_course, target_term) {
        let course_prereqs = this.getCourseRequisites(target_course.title);
        let completed_and_planned = this.all_planned_courses_before_term(target_term); // Use this to call the method

        for (const course of completed_and_planned) {
            if (course_prereqs.includes(course)) {
                const course_index = course_prereqs.indexOf(course);
                if (course_index > -1) { // only splice array when item is found
                    course_prereqs.splice(course_index, 1); // 2nd parameter means remove one item only
                }
            }
        }
        return course_prereqs.length === 0; // Fix: 'length' is a property, not a function
    }

    able_to_plan_course(target_course, target_term) {
        return (this.has_prereqs_for_course(target_course, target_term) &&
            !this.planned_courses.includes(target_course) &&
            !this.completed_courses.includes(target_course));
    }

    // Add a given course to the schedule and fulfill the relevant requirements in
    // this student's tracks / majors
    plan_course(target_course, term) {
        // If time isn't conflicted, and not in completed or planned, add to planned.
        if (this.able_to_plan_course(target_course, term)) {
            target_course.currentCount += 1;
            this.planned_courses.push([target_course, term]);
        } else {
            console.log("Could not plan course");
        }
    }

    complete_course(target_course, term) {
        const remindex = this.planned_courses.indexOf(target_course)
        this.planned_courses.splice(remindex, 1)
        this.completed_courses.push([target_course, term])
    }

    remove_planned_courese(target_course) {
        const remindex = this.planned_courses.indexOf(target_course)
        this.planned_courses.splice(remindex, 1)
    }
}

// -----------------------------------------
// UI STUFF BELOW
// -----------------------------------------

// Retrieve the data

student_datas = get_student_data();
course_datas = get_course_data();
major_datas = get_major_data();
track_datas = get_track_data();
semesters_range = get_semester_range();

// UI functions

// Function to create a Student object from student_data dictionary

function createStudentFromData(studentData, all_courses) {
    // Destructure the properties from the student_data dictionary
    const {
        start_term,
        track_or_major_list,
        contact_info,
        advisor_contact_info,
        completed_courses,
        planned_courses
    } = studentData;

    // Create and return the new Student object
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

// Updated filter_courses function to populate "Available Courses" with buttons

function filter_courses() {
    const trackSelect = document.getElementById("track");
    const majorSelect = document.getElementById("major");
    const selectedTrack = trackSelect.value;
    const selectedMajor = majorSelect.value;

    let filteredCourses = [];

    // If "All Tracks" or "All Majors" is selected, include all courses from course_data
    if (selectedTrack === "" && selectedMajor === "") {
        // If both are "All", show all courses
        filteredCourses = get_course_names(course_datas);
    } else if (selectedTrack === "") {
        // If only "All Tracks" is selected, filter by major requisites
        const major = major_datas.find(m => m.title === selectedMajor);
        if (major) {
            filteredCourses = get_course_names(course_datas.filter(course => major.requisites.includes(course)));
        }
    } else if (selectedMajor === "") {
        // If only "All Majors" is selected, filter by track requisites
        const track = track_datas.find(t => t.title === selectedTrack);
        if (track) {
            filteredCourses = get_course_names(course_datas.filter(course => track.requisites.includes(course)));
        }
    } else {
        // If both track and major are selected, filter by both requisites
        const track = track_datas.find(t => t.title === selectedTrack);
        const major = major_datas.find(m => m.title === selectedMajor);

        if (track && major) {
            filteredCourses = get_course_names(course_datas.filter(course =>
                track.requisites.includes(course) && major.requisites.includes(course)
            ));
        }
    }

    // Display the filtered courses as buttons
    display_courses(filteredCourses);
    makeCoursesDraggable();
    makeCalendarDroppable();
}

// Function to display filtered courses as buttons under "Available Courses"
function display_courses(courses) {
    const courseListDiv = document.getElementById("courseList");
    courseListDiv.innerHTML = '';  // Clear any existing content

    if (courses.length === 0) {
        courseListDiv.innerHTML = "<p>No courses available based on the selected filter criteria.</p>";
        return;
    }

    courses.forEach(course => {
        const courseButton = document.createElement("button");
        courseButton.classList.add("course-button");
        courseButton.textContent = course;
        courseListDiv.appendChild(courseButton);
    });
}

function populateTrackOptions() {
    const trackSelect = document.getElementById("track");

    // Clear existing options (if any)
    trackSelect.innerHTML = '';

    // Create a default "All Tracks" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Tracks";
    trackSelect.appendChild(defaultOption);

    // Loop through track_datas and create an option for each track
    track_datas.forEach(track => {
        const option = document.createElement("option");
        option.value = track.title;  // Use the title as the value
        option.textContent = track.title;  // Display the title
        trackSelect.appendChild(option);
    });
}

function populateMajorOptions() {
    const majorSelect = document.getElementById("major");

    // Clear existing options (if any)
    majorSelect.innerHTML = '';

    // Create a default "All Tracks" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Majors";
    majorSelect.appendChild(defaultOption);

    // Loop through track_datas and create an option for each track
    major_datas.forEach(major => {
        const option = document.createElement("option");
        option.value = major.title;  // Use the title as the value
        option.textContent = major.title;  // Display the title
        majorSelect.appendChild(option);
    });
}

// Function to generate semesters between start and end
function generateSemesters(startTerm, endTerm) {
    const semesters = [];
    let currentTerm = startTerm;

    // Parse the start term and end term years and terms
    const startYear = parseInt(startTerm.substring(2, 6));
    const startSeason = startTerm.substring(0, 2); // "FA" or "SP"
    const endYear = parseInt(endTerm.substring(2, 6));
    const endSeason = endTerm.substring(0, 2); // "FA" or "SP"

    let year = startYear;
    let season = startSeason;

    while (year < endYear || (year === endYear && (season === startSeason || (season === "FA" && endSeason === "SP")))) {
        semesters.push(season + year);

        // Toggle the season (SP -> FA -> SP -> FA, etc.)
        if (season === "FA") {
            season = "SP";
        } else {
            season = "FA";
            year++; // Move to the next year once we toggle from "SP" to "FA"
        }
    }

    return semesters;
}

// Function to populate the calendar with semesters
function populateCalendar(semesters) {
    const calendarTable = document.getElementById("calendarTable");

    // Get the first row of the calendar to fill with semesters (header)
    const headerRow = calendarTable.querySelector("thead tr");

    // Clear the current headers
    headerRow.innerHTML = '';

    // Add the semester headers dynamically
    semesters.forEach(semester => {
        const th = document.createElement("th");
        th.textContent = semester;
        headerRow.appendChild(th);
    });

    // Now, populate the table body with the same number of columns (one per semester)
    const calendarBody = calendarTable.querySelector("tbody");
    // Clear the body to reset
    calendarBody.innerHTML = '';
    const numberOfRows = 1; // Customize this based on your needs

    // Add the rows dynamically
    for (let i = 0; i < numberOfRows; i++) {
        const row = document.createElement("tr");

        // For each semester, add a corresponding <td> (empty for now)
        semesters.forEach(semester => {
            const td = document.createElement("td");
            td.classList.add("calendar-cell");
            td.setAttribute("data-semester", semester); // You can add specific data to each td
            row.appendChild(td);
        });

        calendarBody.appendChild(row);
    }
}

const student = createStudentFromData(student_data, course_datas);

// Array to track all added courses
const addedCourses = [];

// Function to update the planned courses of the student based on the current state of the calendar table

function updateStudentPlannedCourses() {
    const studentCourses = [];

    // Find all course buttons in the calendar table cells
    const courseButtons = document.querySelectorAll(".calendar-cell button");

    // Loop through the buttons and add the course names to the studentCourses array
    courseButtons.forEach(button => {
        // Get the closest calendar cell to find the semester
        const cell = button.closest("td");
        const semester = cell.getAttribute("data-semester");  // Get the semester from the cell's data-semester attribute

        // Add the course name and semester to the array
        studentCourses.push([button.textContent.trim(), semester]);
    });

    // Update the student's planned_courses with the courses in the calendar
    student.planned_courses = studentCourses;
}

// Function to make the calendar cells accept the dropped course
function makeCalendarDroppable() {
    const calendarCells = document.querySelectorAll(".calendar-cell");

    calendarCells.forEach(cell => {
        // Allow the cell to accept the dragged item
        cell.addEventListener("dragover", (event) => {
            event.preventDefault();  // Allow the cell to accept the dragged item
        });

        // Handle the drop event
        cell.addEventListener("drop", (event) => {
            event.preventDefault();
            const courseName = event.dataTransfer.getData("course").trim();  // Get the course name from the drag event

            // Ensure case-insensitive comparison
            const courseNameLower = courseName.toLowerCase();

            // Check if the course has already been added (case-insensitive and whitespace-agnostic)

            if (addedCourses.some(course => course.toLowerCase() === courseNameLower)) {
                return;  // Prevent adding the course again
            }

            // Get the semester from the cell's data-semester attribute
            const semester = cell.getAttribute("data-semester");

            // Find the course object from course data
            const course = course_datas.find(c => c.title.toLowerCase() === courseNameLower);

            
            // Check if the student has the prerequisites for the course
            if (!student.has_prereqs_for_course(course, semester)) {
                // Alert if prerequisites are not met
                alert(`You do not meet the prerequisites for ${courseName}.`);
                return;  // Stop the course from being added
            }
            

            // Create a button for the dropped course
            if (courseName) {
                const courseButton = document.createElement("button");
                courseButton.classList.add("course-button");
                courseButton.textContent = courseName;

                // Optionally, add a click event to remove the course (or any other functionality)
                courseButton.addEventListener("click", (event) => {
                    // Remove the course from the calendar cell and the addedCourses array
                    const cell = event.target.closest("td");  // Get the closest table cell
                    cell.removeChild(event.target);  // Remove the clicked button from the cell
                    const index = addedCourses.indexOf(courseName);
                    if (index > -1) {
                        addedCourses.splice(index, 1);  // Remove from the addedCourses list
                    }

                    // After removal, update the student's planned courses list
                    updateStudentPlannedCourses();
                });

                // Add the new course button to the cell
                cell.appendChild(courseButton);

                // Add the course to the list of added courses (after adding to the table)
                addedCourses.push(courseName);

                // Update the student's planned courses list with the semester
                updateStudentPlannedCourses();
            }
        });
    });
}


// Function to make available courses draggable and allow dropping in the calendar
function makeCoursesDraggable() {
    const availableCourses = document.querySelector("#courseList");
    const courseButtons = availableCourses.querySelectorAll("button");

    courseButtons.forEach(button => {
        button.setAttribute("draggable", "true");

        // Store course data when starting the drag
        button.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("course", event.target.textContent); // Store the course name in the drag event
        });
    });
}



// Call the function to populate the options
populateTrackOptions();
populateMajorOptions();
populateCalendar(generateSemesters(semesters_range[0], semesters_range[1]));