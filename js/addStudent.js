import Course from "./course.js";
//MenuToggle Button
const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');
menuToggle.onclick = function () {
    // Toggle the navigation menu open or closed
    navigation.classList.toggle('open')
}
// Function to display an alert message
function showAlert(message) {
    const alert = document.createElement("div");
    alert.role = "alert";
    alert.textContent = message;

    const form = document.querySelector('#courseForm');
    form.parentNode.insertBefore(alert, form.nextSibling);

    // setTimeout
    setTimeout(function () {
        alert.remove();
    }, 2000); // The message will disappear after 2 seconds
}
// Event listener for the DOM content being loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the course dropdown element
    var courseSelect = document.getElementById("courseName");
    let courses = []
    courses = JSON.parse(localStorage.getItem("courses"));
    // Populate the course dropdown with options
    courses.forEach(function (course) {
        var option = document.createElement("option");
        option.value = course.courseCode;
        option.text = course.courseName;
        courseSelect.add(option);
    });

    // Add input event listener to studentId field
    document.getElementById("studentId").addEventListener("input", fillStudentInfo);

});
// Event listener for the form submission
document.getElementById("courseForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from refreshing the page

     // Get values from the form
    const courseCode = document.getElementById("courseName").value;
    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;
    const studentSurname = document.getElementById("studentSurname").value;
    const midterm = document.getElementById("midterm").value;
    const final = document.getElementById("final").value;

    // Create a new student object
    const student = {
        courseCode: courseCode,
        studentId: studentId,
        studentName: studentName,
        studentSurname: studentSurname,
        midterm: midterm,
        final: final,
        grade:"",
        letterGrade:"",
        result:""
    };

    //midterm and fınal note control
    if (isNaN(midterm) || isNaN(final) || midterm < 0 || midterm > 100 || final < 0 || final > 100) {
        showAlert("Midterm and final grades must be between 0 and 100.");
        return;
    }
    

    // Get the current list of students from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Add the new student to the list
    students.push(student);
    // Get the current list of courses from localStorage
    let courses = []
    courses = JSON.parse(localStorage.getItem("courses"));
    const foundCourse = courses.find(course => course.courseCode === courseCode);
    // If the course is found, create a Course object
    if (foundCourse) {
        const course = new Course(
            foundCourse.courseCode,
            foundCourse.courseName,
            foundCourse.credit,
            foundCourse.gradingScale
        );
        course.calculateGrade(student);
    }

  // Save the updated list of students to localStorage
    localStorage.setItem("students", JSON.stringify(students));
    showAlert("Student added succesfully...")
    // Reset the form
    document.getElementById("courseForm").reset();
});

// Function to display the added students on the page
function displayStudents(students) {
    const listGroup = document.getElementById("list-group");
    listGroup.innerHTML = ""; // Clear the list content

    students.forEach(function (student) {
        const listItem = document.createElement("li");
        listItem.textContent = `${student.studentName} ${student.studentSurname} - ${student.courseName}`;
        listGroup.appendChild(listItem);
    });
}
// Function to fill student information based on studentId
function fillStudentInfo() {
    const studentId = document.getElementById("studentId").value;
    const students = JSON.parse(localStorage.getItem("students")) || [];
    
    // Find the student with the matching studentId
    const foundStudent = students.find(student => student.studentId === studentId);

    // If the student is found, fill in the name and surname
    if (foundStudent) {
        document.getElementById("studentName").value = foundStudent.studentName;
        document.getElementById("studentSurname").value = foundStudent.studentSurname;
    } else {
        // If the student is not found, reset the name and surname fields
        document.getElementById("studentName").value = "";
        document.getElementById("studentSurname").value = "";
    }
}