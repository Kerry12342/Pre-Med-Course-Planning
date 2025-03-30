
// Student class. Is able to plan courses and add them to their schedule

class Student {
    constructor(start_term, track_or_major_list, contact_info, advisor_contact_info, completed_courses, planned_courses) {
        this.start_term = start_term;
        this.track_or_major_list = track_or_major_list;
        this.contact_info = contact_info;
        this.advisor_contact_info = advisor_contact_info;
        this.completed_courses = completed_courses;
        this.planned_courses = planned_courses;
    }

    //add a given course to the schedule and fulfil the relevant requirements in
    this students tracks / majors
plan_course(target_course) {
    this.planned_courses.push(target_course)
    for (track_or_major of this.track_or_major_list) {
        for (requirement of track_or_major.requirements) {
            if (target_course.fulfills(requirement)) {
                requirement.fulfilled = true;
            }
        }
    }
    target_course.number_of_students_who_planned += 1;
}

//if the course is available and the student has the prerequisites,
//it can be planned.
can_plan_course(target_course) {
    return this.has_prerequisites_for_course(target_course) && target_course.has_availability();
}

//check if there are enough completed courses that fulfil the prerequisite
//(may need to redo this because its not technically how prerequisites work)
has_prerequisites_for_course(target_course) {
    number_unfulfilled = target_course.prerequisites.length;
    for (course of this.completed_courses) {
        if (course of target_course.prerequisites) {
            number_unfulfilled -= 1;
        }
    }
    return (number_unfulfilled == 0);
}
  }

//courses can be available and fill requirements, and also store other
//relevant data like the term, prerequisites, capacity, name etc.
class Course {
    constructor(name, weekly_schedule, term, prerequisites, capacity, number_of_students_who_planned) {
        this.name = name;
        this.weekly_schedule = weekly_schedule;
        this.term = term;
        this.prerequisites = prerequisites;
        this.capacity = capacity;
        this.number_of_students_who_planned = number_of_students_who_planned;
    }

    //the course is available if the student count is strictly below capacity
    has_availability() {
        return (this.number_of_students_who_planned < this.capacity);
    }

    //if this course is in the requirement, it fulfills it
    fulfills(requirement) {
        for (course of requirement.possible_courses_to_fulfill) {
            if (course.name == this.name) {
                return true;
            }
        }
        return false
    }
}

//a requirement may only be fulfilled by some courses, and has a term due date
class Requirement {
    constructor(possible_courses_to_fulfill, term_due) {
        this.possible_courses_to_fulfill = possible_courses_to_fulfill;
        this.term_due = term_due;
        this.fulfilled = false;
    }
}

//base class for tracks and majors, which are just named lists of requirements.
class TrackOrMajor {
    constructor(name, requirements) {
        this.name = name;
        this.requirements = requirements;
    }
}

//Interface with the remote database (in progress)

class Database {
    build_list_of_all_courses() {

    }

    build_list_of_all_tracks_and_majors() {

    }

    build_student_object(student_identifier) {

    }
}


//test database that returns some dummy data

class TestDatabase extends Database {


    build_class_object(choice) {
        if (choice == 1) {
            const bio101 = new Course("BIO101", [["M", "1:00-1:50"], ["F", "2:00-2:50"]], "FALL2025", [], 60, 12);
            return bio101;
        }
        const chem201 = new Course("CHEM201", [["M", "1:00-1:50"], ["W", "2:00-2:50"]], "SPRING2025", ["CHEM101"], 24, 11);
        return chem201;
    }

    build_student_object() {
        const jacob = new Student("SPRING25", "BIOLOGY", "jhelzner@hamilton.edu", "thelmuth@hamilton.edu", ["BIO101", "CS240", "CHEM315", "BIO202"], []);
        return jacob;
    }


    build_list_of_all_courses() {

    }
}




/*
Original script before break
const availableCourses = [
    { id: 1, name: 'Course 1', track: 'track1', major: 'major1', semester: '2025-Fall' },
    { id: 2, name: 'Course 2', track: 'track1', major: 'major2', semester: '2025-Spring' },
    { id: 3, name: 'Course 3', track: 'track2', major: 'major3', semester: '2025-Summer' },
    { id: 4, name: 'Course 4', track: 'track2', major: 'major1', semester: '2025-Fall' },
    { id: 5, name: 'Course 5', track: 'track3', major: 'major2', semester: '2025-Spring' }
];

const completedCourses = [
    { id: 6, name: 'Course 6', track: 'track1', major: 'major3', semester: '2025-Spring' },
    { id: 7, name: 'Course 7', track: 'track2', major: 'major1', semester: '2025-Summer' }
];

const courseList = document.getElementById('courseList');
const filterButton = document.getElementById('filterButton');
const calendarTable = document.getElementById('calendarTable');
const completedCoursesList = document.getElementById('completedCoursesList');
const trackFilter = document.getElementById('track');
const majorFilter = document.getElementById('major');
const yearFilter = document.getElementById('year');

function displayCourses(courses) {
    courseList.innerHTML = '';
    courses.forEach(course => {
        const li = document.createElement('div');
        li.textContent = course.name;
        li.class = "highlight_hover";
        li.style = "text-align: center; width: 100px; background-color: lightgreen; padding: 10px; border: 0px solid #ccc; border-radius: 10px; margin: 20px;"
        li.setAttribute('data-id', course.id);
        li.addEventListener('click', () => addCourseToCalendar(course));
        courseList.appendChild(li);
    });
}

function displayCompletedCourses() {
    completedCoursesList.innerHTML = '';
    completedCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course.name + ' (Completed)';
        completedCoursesList.appendChild(li);
    });
}

function addCourseToCalendar(course) {
    const cell = calendarTable.querySelector(`td[data-semester="${course.semester}"]`);
    if (cell) {
        // Create a new div for the course to be added to the calendar cell
        const courseDiv = document.createElement('div');
        courseDiv.textContent = course.name;
        courseDiv.style = "background-color: lightgreen; padding: 10px; border: 0px solid #ccc; border-radius: 10px;"
        courseDiv.classList.add('course-name');
        courseDiv.setAttribute('data-id', course.id);
        courseDiv.addEventListener('click', (e) => removeCourseFromCalendar(e, course, cell));
        cell.appendChild(courseDiv);
    }
}

function removeCourseFromCalendar(e, course, cell) {
    e.stopPropagation(); // Prevent event propagation to the cell
    const courseDiv = e.target;
    if (courseDiv) {
        cell.removeChild(courseDiv); // Remove course from the calendar cell
    }
}

filterButton.addEventListener('click', () => {
    const filteredCourses = availableCourses.filter(course => {
        return (
            (trackFilter.value === '' || course.track === trackFilter.value) &&
            (majorFilter.value === '' || course.major === majorFilter.value) &&
            (yearFilter.value === '' || course.semester === yearFilter.value)
        );
    });
    displayCourses(filteredCourses);
});

displayCourses(availableCourses);
displayCompletedCourses();

*/
