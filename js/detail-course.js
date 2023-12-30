import Course from "./course.js";

// Menu Toggle Button
const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');
// Toggle the navigation menu open or closed when the menu button is clicked
menuToggle.onclick = function () {
    navigation.classList.toggle('open')
}
// Array to store course data
let courses=[];

// List items event listener to highlight the active item
const list = document.querySelectorAll('.list');
function activeLink() {
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
}
// Event listener when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the course selection dropdown element
    var courseSelect = document.getElementById("selectCourseSelect");
    // Retrieve courses from local storage
    let courses = JSON.parse(localStorage.getItem("courses"));

    // Populate the course selection dropdown with course options
    courses.forEach(function (course) {
        var option = document.createElement("option");
        option.value = course.courseCode;
        option.text = course.courseName + "-" + course.courseCode;
        courseSelect.add(option);
    });

    // Event listener for course selection change
    courseSelect.addEventListener("change", function () {
        // Show results for the selected course
        showResultsForSelectedCourse(courseSelect.value);
    });
});
// Function to show results for the selected course
function showResultsForSelectedCourse(selectedCourseCode) {
    // Retrieve students from local storage
    let students = JSON.parse(localStorage.getItem("students")) || [];
    
    // Create tables for passed and failed students
    const passedTable = createResultTable('passedStudentsTable');
    const failedTable = createResultTable('failedStudentsTable');

    // Flags to check if passed and failed students exist
    let passedStudentsExist = false;
    let failedStudentsExist = false;

    // Iterate through students and display results for the selected course
    students.forEach(function (studentData) {
        if (studentData.courseCode === selectedCourseCode) {
            console.log(studentData);
            if (studentData.result === "passed") {
                console.log("passed data"+studentData);
                passedStudentsExist = true;
                addStudentToResultTable(studentData, passedTable);
            } else if (studentData.result === "failed") {
                console.log("failed data"+studentData);
                addStudentToResultTable(studentData, failedTable);
                failedStudentsExist = true;
            }
        }
    });
    // Containers for the passed and failed students tables
    const passedTableContainer = document.getElementById("passedStudentsTableContainer");
    const failedTableContainer = document.getElementById("failedStudentsTableContainer");

    // Update the table containers based on the existence of passed and failed students
    if (passedTableContainer && failedTableContainer) {
        passedTableContainer.innerHTML = '';
        if (passedStudentsExist) {
            passedTableContainer.appendChild(passedTable);
        } else {
            // Display "No passed students" message
            const noPassedStudentsMessage = document.createElement('p');
            noPassedStudentsMessage.textContent = 'No passed students!!!';
            passedTableContainer.appendChild(noPassedStudentsMessage);
        }

        failedTableContainer.innerHTML = '';
        if (failedStudentsExist) {
            failedTableContainer.appendChild(failedTable);
        } else {
            // Display "No failed students" message
            const noFailedStudentsMessage = document.createElement('p');
            noFailedStudentsMessage.textContent = 'No failed students!!!';
            failedTableContainer.appendChild(noFailedStudentsMessage);
        }
    }
}
// Function to create a result table
function createResultTable(tableId) {
    const resultTable = document.createElement('table');
    resultTable.id = tableId;

    // Create table headers
    const headerRow = resultTable.insertRow(0);
    const headers = ["#","Student ID", "Name", "Surname"];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    return resultTable;
}

// Function to add a student to the result table
function addStudentToResultTable(studentData, resultTable) {
    const row = resultTable.insertRow();
    let rowIndex=resultTable.rows.length-1;
    const values = [
        rowIndex,
        studentData.studentId,
        studentData.studentName,
        studentData.studentSurname
    ];

    values.forEach(value => {
        const cell = row.insertCell();
        cell.innerHTML = value;
    }); 
}


