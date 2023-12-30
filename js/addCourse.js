import Course from "./course.js";

//MenuToggle Button
const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');
menuToggle.onclick = function () {
    // Toggle the navigation menu open or closed    
    navigation.classList.toggle('open')
}
let courses=[];
// All list items
const list = document.querySelectorAll('.list');
function activeLink() {
    // Remove 'active' class from all list items
    list.forEach((item) => item.classList.remove('active'));
    // Add 'active' class to the clicked item
    this.classList.add('active');
}
// Add click event listener to each list item
list.forEach((item) =>
    item.addEventListener('click', activeLink));

// Form and input fields
const form = document.querySelector('#courseForm');
const courseCodeInput = document.querySelector('#courseCode');
const courseNameInput = document.querySelector('#courseName');
const creditInput = document.querySelector('#credit');
const listGroup = document.querySelector('#list-group');
const gradingScaleInput = document.querySelector('#gradingScale');

// Define event listeners
eventListeners();

function eventListeners() {
    // Call addCourse function when the form is submitted
    form.addEventListener("submit", addCourse);
}

// Function to show an alert to the user
function showAlert(message) {
    // Create a new div
    const alert = document.createElement("div");
    alert.role = "alert";
    // Add the message to the div
    alert.textContent = message;

    // Add the alert just below the form
    const form = document.querySelector('#courseForm');
    form.parentNode.insertBefore(alert, form.nextSibling);

    // Remove the alert after a certain time
    setTimeout(function () {
        alert.remove();
    }, 2000); // The message will disappear after 2 seconds
}

// Function to add a new course
function addCourse(e) {
    e.preventDefault();

    // Get data from input fields
    const newCourseCode = courseCodeInput.value.trim();
    const newCourseName = courseNameInput.value.trim();
    const newCredit = creditInput.value.trim();
    const newGradingScale=gradingScale.value.trim();

    // Get existing courses or create an empty array
    courses = JSON.parse(localStorage.getItem("courses")) || [];

    // Loop through the courses
    for (let i = 0; i < courses.length; i++) {
        // If the course code or course name already exists, show an alert and exit the function
        if (newCourseCode === courses[i].courseCode || newCourseCode === courses[i].courseName) {
            showAlert("This course already available");
            return;
        }
    }

    // If any required field is empty, show an alert
    if (newCourseCode === "" || newCourseName === "" || newCredit === "" || newGradingScale==="") {
        showAlert( "Please enter all information...");
    } else {
        // Create a new Course object
        const newCourse = new Course(newCourseCode, newCourseName, newCredit, newGradingScale);
        // Call the function to add the new course to storage
        addCourseStorage(newCourse);
        showAlert("Student added succesfully...");
    }
}
// Function to add the course to storage
function addCourseStorage(newCourse) {
    // Get existing courses or create an empty array
    courses = JSON.parse(localStorage.getItem("courses")) || [];
    // Add the new course to the array
    courses.push(newCourse);
    // Save the updated courses to local storage
    localStorage.setItem("courses", JSON.stringify(courses));
    // Reset the form
    document.getElementById("courseForm").reset();
}

