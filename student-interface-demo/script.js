// Student class. Is able to plan courses and add them to their schedule

test_course_format = {
    title: "CS101",
    prerequisites: ["CHEM101"],
    currentCount: 0
};

major_track_format = {
    title: "CS",
    requisites: ["CS101", "CS102", "CS220"]
};

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

class Student {
    constructor(start_term, track_or_major_list, contact_info, advisor_contact_info, completed_courses, completed_req_courses, planned_courses) {
        this.start_term = start_term; //String
        this.track_or_major_list = track_or_major_list; // Array
        this.contact_info = contact_info; // Object
        this.advisor_contact_info = advisor_contact_info; // Object
        this.planned_courses = planned_courses; //array of arrays. 1st is title 2nd is term
        this.completed_courses = completed_courses; // Array
        this.completed_req_courses = completed_req_courses; // Array
    }

    all_planned_courses_before_term(target_term) {
        return this.planned_courses.filter(course => before(course[1], target_term)).map(function (course) {
            return course[0];
        });
    }

    has_prereqs_for_course(target_course, target_term) {
        let course_prereqs = target_course.prerequisites;
        let completed_and_planned = this.completed_courses.concat(this.all_planned_courses_before_term(target_term)); // Use this to call the method

        for (const course of completed_and_planned) {
            if (course_prereqs.includes(course.title)) {
                const course_index = course_prereqs.indexOf(course.title);
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

















test_course_format = {
    title: "CS101",
    prerequisites: ["CHEM101"],
    currentCount: 0
};




const fs = require('fs'); //to access json
const { pool } = require('pg'); //to access postgresql

const pool = new Pool({
    user: 'students',
    host: '150.209.91.82',
    database: 'developer',
    password: 'skull-patent-DOWNHILL-mongol-away',
    port: '5432'
})

class Admin {
    constructor(name, filename = 'courses.json') {
        this.name = name; //String
        this.filename = filename;
        this.courses = [];
        this.sync_from_db();
    }

    add_course(course_title, prerequisites) {
        newCourse = { title: course_title, prerequisites: prerequisites, currentCount: 0}
    }

    remove_course(course_title) {

    }

    find_student(student_name) {
        
    }
}