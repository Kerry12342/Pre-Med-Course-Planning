function showError() {
        document.getElementById('popupModal').style.display = 'block';
    }
    function closePopup() {
        document.getElementById('popupModal').style.display = 'none';
    }
    function toggleCourseMode() {
        let courseTitle = document.getElementById("courseTitle");
        let toggleButton = document.getElementById("toggleCourse");
        if (courseTitle.innerText === "Add Course") {
            courseTitle.innerText = "Delete Course";
            toggleButton.innerText = "Switch to Add Course";
        } else {
            courseTitle.innerText = "Add Course";
            toggleButton.innerText = "Switch to Delete Course";
        }
    }
