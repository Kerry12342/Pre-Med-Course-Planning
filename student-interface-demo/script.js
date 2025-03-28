
// Student class. Is able to plan courses and add them to their schedule

test_course_format = {
    title: "CS101",
    prerequisites: ["CHEM101"],
    currentCount: 0
}

major_track_format = {
    title: "CS",
    requisites: ["CS101", "CS102", "CS220"]
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

    has_prereqs_for_course(target_course, target_term) {
        course_prereqs = target_course.prerequisites;
        completed_and_planned = self.completed_courses.concat(planned_courses)   
        for (const course of completed_and_planned) {
            if (course_prereqs.includes(course.title)) {
                const course_index = course_prereqs.indexOf(course.title);
                if (course_index > -1) { // only splice array when item is found
                    course_prereqs.splice(course_index, 1); // 2nd parameter means remove one item only
                }
            }
        }
        if (length(course_prereqs) === 0) {
            return true;
        }
    }

    able_to_plan_course(target_course, target_term) {
        return (has_prereqs_for_course(target_course, target_term) && (!this.planned_courses.includes(target_course) && !this.completed_courses.includes(target_course)))
    }

    //add a given course to the schedule and fulfil the relevant requirements in
    // this students tracks / majors
    plan_course(target_course, term) {
        // If time isn't conflicted, and not in completed or planned, add to planned.

        if (this.able_to_plan_course(target_course, term)) {
            target_course.currentCount += 1
            // 
        }
        else {
            console.log("Could not plan course")
        }
    }
}



//Interface with the remote database (in progress)

// class Database {
//     build_list_of_all_courses() {

//     }

//     build_list_of_all_tracks_and_majors() {
        
//     }

//     build_student_object(student_identifier) {

//     }
// }


//test database that returns some dummy data

class TestDatabase extends Database {


    build_class_object(choice) {
        if (choice == 1) {
            const bio101 = new Course("BIO101", [["M", "13:00-13:50"], ["F", "14:00-14:50"]], "FALL2025", [], 60, 12);
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