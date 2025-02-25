class Student {
    constructor(start_term, track_or_major_list, contact_info, advisor_contact_info, completed_courses, planned_courses) {
      this.start_term = start_term;
      this.track_or_major_list = track_or_major_list;
      this.contact_info = contact_info;
      this.advisor_contact_info = advisor_contact_info;
      this.completed_courses = completed_courses;
      this.planned_courses = planned_courses;
    }

    plan_course(target_course) {
        this.planned_courses.push(target_course)
        for (track_or_major in this.track_or_major_list) {
            for (requirement in track_or_major) {
                if (target_course.fulfills(requirement)) {
                    requirement.fulfilled = true;
                }
            }
        }
        target_course.number_of_students_who_planned += 1;
    }

    can_plan_course(target_course) {
        return has_prerequisites_for_course(target_course) && target_course.has_availability();
    }

    has_prerequisites_for_course(target_course) {
        number_unfulfilled = target_course.prerequisites.length;
        for (course in self.completed_courses) {
            if (course in target_course.prerequisites) {
                number_unfulfilled -= 1;
            }
        }
        return (number_unfulfilled == 0);
    }
  }

  class Course {
    constructor(name, weekly_schedule, term, prerequisites, capacity, number_of_students_who_planned) {
      this.name = name;
      this.weekly_schedule = weekly_schedule;
      this.term = term;
      this.prerequisites = prerequisites;
      this.capacity = capacity;
      this.number_of_students_who_planned = number_of_students_who_planned;
    }

    has_availability() {
        return (this.number_of_students_who_planned < this.capacity);
    }

    fulfills(requirement) {
        for (course in requirement.possible_courses_to_fulfill) {
            if (course.name == this.name) {
                return true;
            }
        }
        return false
    }
  }

  class Requirement {
    constructor(possible_courses_to_fulfill, term_due) {
        this.possible_courses_to_fulfill = possible_courses_to_fulfill;
        this.term_due = term_due;
        this.fulfilled = false;
      }
  }
  //base class for tracks and majors
  class TrackOrMajor {
    constructor(name, requirements) {
        this.name = name;
        this.requirements = requirements;
    }
  }

  class Database {
    build_list_of_all_courses() {

    }

    build_list_of_all_tracks_and_majors() {

    }

    build_student_object(student_identifier) {

    }
  }




  class TestDatabase extends Database {


    build_class_object(choice) {
      if (choice == 1) {
        const bio101 = new Course("BIO101", [["M", "1:00-1:50"],["F", "2:00-2:50"]], "FALL2025", "NONE", 60, 12);
        return bio101
      }
      const chem201 = new Course("CHEM201", [["M", "1:00-1:50"],["W", "2:00-2:50"]], "SPRING2025", "CHEM101", 24, 11);
      return chem201
    }

    build_student_object() {
      const jacob = new Student("SPRING25", "BIOLOGY", "jhelzner@hamilton.edu", "thelmuth@hamilton.edu", ["BIO101", "CS240", "CHEM315", "BIO202"], []);
    }


    build_list_of_all_courses() {
        
    }
  }