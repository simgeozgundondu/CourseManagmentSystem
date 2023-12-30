import Course from './course.js';
import Student from './students.js';

// Toggle the navigation menu when the menu icon is clicked
const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');
menuToggle.onclick = function () {
    navigation.classList.toggle('open')
}
// Define a function to handle the active state of navigation links
const list = document.querySelectorAll('.list');
function activeLink() {
    // Remove the 'active' class from all navigation links
    list.forEach((item) => item.classList.remove('active'));
    // Add the 'active' class to the clicked navigation link
    this.classList.add('active');
}


// Listen for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    let courses = []
    courses = JSON.parse(localStorage.getItem("courses"));

    let students = []
    students = JSON.parse(localStorage.getItem("students"));

            // Create the table
            const table = document.createElement('table');

            // Create the table headers
            const headerRow = table.insertRow(0);
            const headers = ["Student ID", "Name", "Surname","Course Code","Midterm", "Final", "Grade","Letter Grade","Result","",""];

            headers.forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            students.forEach(studentData => {
                // Get the course code of the student
                const courseCode = studentData.courseCode;
        
                // Find the course information in the courses list
                const foundCourse = courses.find(course => course.courseCode === courseCode);
        
                if (foundCourse) {
                    // If the course is found, create a Course object
                    const course = new Course(
                        foundCourse.courseCode,
                        foundCourse.courseName,
                        foundCourse.credit,
                        foundCourse.gradingScale
                    );
                    course.calculateGrade(studentData);
                    // Add student data to the table
                    const row = table.insertRow();
                    const values = [
                        studentData.studentId,
                        studentData.studentName,
                        studentData.studentSurname,
                        studentData.courseCode,
                        studentData.midterm,
                        studentData.final,
                        studentData.grade,
                        studentData.letterGrade,
                        studentData.result,
                    ];
        
                    values.forEach(value => {
                        const cell = row.insertCell();
                        cell.innerHTML = value;
                    });
                    // Add update and remove buttons
                    const updateButtonCell = row.insertCell();
                    const updateButton = createUpdateButton(studentData, fillForm);
                    updateButtonCell.appendChild(updateButton);
                    const removeButtonCell = row.insertCell();
                    const removeButton = createRemoveButton(studentData);
                    removeButtonCell.appendChild(removeButton);

                    // Add event listener for update form button
                    const updateFormButton = document.querySelector('#updateFormButton');
                    updateFormButton.addEventListener('click', function () {
                    updateStudent(studentData);
                });
                }
            });

            // Add the table to a div with a specific ID
            const containerId = 'studentsTableContainer';
            const contentDiv = document.getElementById(containerId);

            if (contentDiv) {
                contentDiv.innerHTML = '';
                contentDiv.appendChild(table);
            }
            // Add event listener for search input
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', function () {
                filterTable(searchInput.value.toLowerCase());
            });
            // Add event listener for student GPA button
            const studentGpaButton = document.getElementById("studentGpaButton");
            studentGpaButton.addEventListener('click', function(){
                createStudentGpaPage();
            });
});

// Function to create remove button
function createRemoveButton(studentData) {
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeButton');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'trash-outline');

    removeButton.addEventListener('click', function () {
        const key = generateLocalStorageKeyRemove(studentData);
        removeFromLocalStorage(key);

        removeRowFromTable(studentData);

    });
    removeButton.appendChild(icon);

    return removeButton;
}
// Function to generate localStorage key
function generateLocalStorageKey(studentData) {
    return `student_${studentData.studentId}`;
}
// Function to generate localStorage key for removal
function generateLocalStorageKeyRemove(studentData) {
    return `student_${studentData.studentId}_${studentData.courseCode}`;
}

// Function to remove data from localStorage
function removeFromLocalStorage(key) {
    // Remove data with the specified key from local storage
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(student => generateLocalStorageKeyRemove(student) !== key);
    localStorage.setItem('students', JSON.stringify(students));
}

// Function to remove a row from the table
function removeRowFromTable(studentData) {
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0 && cells[0].innerHTML === studentData.studentId) {
            table.deleteRow(i);
            break;
        }
    }
}

// Function to create update button
function createUpdateButton(studentData, fillForm) {
    const updateButton = document.createElement('button');
    updateButton.classList.add('updateButton');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'create-outline');

    updateButton.addEventListener('click', function () {
        const studentDetailForm = document.querySelector('#studentDetailForm');
        const searchInput = document.querySelector('#searchInput');
        const updateFormButton = document.querySelector('#updateFormButton');
        const studentGpaButton=document.querySelector('#studentGpaButton');

       
        studentDetailForm.style.display = 'block';
        studentsTableContainer.style.display = 'none';
        searchInput.style.display='none';
        studentGpaButton.style.display='none';

        fillForm(studentData);
        updateFormButton.studentData=studentData;
        
    });
    
    updateButton.appendChild(icon);

    return updateButton;
}


// Function to fill the form with student data
function fillForm(studentData) {
    // Access form elements
    const studentDetailForm = document.querySelector('#studentDetailForm');
    const courseCodeInput = studentDetailForm.querySelector('#courseCode');
    const studentIdInput= studentDetailForm.querySelector('#studentId');
    const studentNameInput = studentDetailForm.querySelector('#studentName');
    const studentSurnameInput = studentDetailForm.querySelector('#studentSurname');
    const studentMidtermInput = studentDetailForm.querySelector('#midterm');
    const studentFinalInput = studentDetailForm.querySelector('#final');
    const gradeInput = studentDetailForm.querySelector('#grade');
    const letterGradeInput = studentDetailForm.querySelector('#letterGrade');
    const resultInput = studentDetailForm.querySelector('#result');

    studentIdInput.value=studentData.studentId;
    studentNameInput.value = studentData.studentName;
    studentSurnameInput.value = studentData.studentSurname;
    studentMidtermInput.value = studentData.midterm;
    studentFinalInput.value = studentData.final;
    gradeInput.value=studentData.grade;
    letterGradeInput.value=studentData.letterGrade;
    resultInput.value=studentData.result;
    courseCodeInput.value=studentData.courseCode;
}

// Function to update student data
function updateStudent(studentData) {
    // Access form elements
    const studentDetailForm = document.querySelector('#studentDetailForm');
    const studentCourseInput= studentDetailForm.querySelector('#courseCode');
    const studentIdInput= studentDetailForm.querySelector('#studentId');
    const studentNameInput = studentDetailForm.querySelector('#studentName');
    const studentSurnameInput = studentDetailForm.querySelector('#studentSurname');
    const studentMidtermInput = studentDetailForm.querySelector('#midterm');
    const studentFinalInput = studentDetailForm.querySelector('#final');
    const studentGradeInput= studentDetailForm.querySelector('#grade');
    const studenResultInput= studentDetailForm.querySelector('#result');


    // Create updated student data
    const updatedStudent = {
        courseCode: studentCourseInput.value.trim(),
        studentId: studentIdInput.value.trim(),
        studentName: studentNameInput.value.trim(),
        studentSurname: studentSurnameInput.value.trim(),
        midterm: studentMidtermInput.value.trim(),
        final: studentFinalInput.value.trim(),
        grade: studentGradeInput.value.trim(),
        result: studenResultInput.value.trim()
    };
    
    //midterm and final note control
    const midterm = parseFloat(updatedStudent.midterm);
    const final = parseFloat(updatedStudent.final);

    if (isNaN(midterm) || isNaN(final) || midterm < 0 || midterm > 100 || final < 0 || final > 100) {
        alert("Midterm and final grades must be between 0 and 100.");
        return;
    }

    // Retrieve all students from local storage
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Find the index of the selected student
    const index = students.findIndex(student => generateLocalStorageKeyRemove(student) === generateLocalStorageKeyRemove(updateFormButton.studentData));


    // Replace the selected student with the updated data
    if (index !== -1) {
        students[index] = updatedStudent;
        localStorage.setItem('students', JSON.stringify(students));
        updateRowInTable(studentData, updatedStudent);

        // Hide the form and show the table
        studentDetailForm.style.display = 'none';
        studentsTableContainer.style.display = 'block';
    }
}
// Function to update a row in the table
function updateRowInTable(studentData, updatedStudent) {
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');

        // Find the row for the student we are checking
        if (cells.length > 0 && cells[0].innerHTML === studentData.studentId) {
            // Update only the relevant cells
            cells[1].innerHTML = updatedStudent.studentName;
            cells[2].innerHTML = updatedStudent.studentSurname;
            cells[3].innerHTML = updatedStudent.courseCode;
            cells[4].innerHTML = updatedStudent.midterm;
            cells[5].innerHTML = updatedStudent.final;
            cells[6].innerHTML = updatedStudent.grade;
            cells[7].innerHTML = updatedStudent.letterGrade;
            cells[8].innerHTML = updatedStudent.result;

            break;
        }
    }
}


//Search function
function filterTable(searchTerm) {
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    // Check each row and show those that match the search term
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let rowText = '';

        // Concatenate all cells in the row
        for (let j = 0; j < cells.length; j++) {
            rowText += cells[j].textContent.toLowerCase() + ' ';
        }

        // Show or hide based on whether the search term is present in the row text
        if (rowText.includes(searchTerm)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Function to create student GPA page
function createStudentGpaPage() {
    const studentsGpaTable= document.getElementById("studentsGpaTable");
    // Create a table
    const gpaTable = document.createElement('table');

    // Create a table headers
    const headerRow = gpaTable.insertRow(0);
    const headers = ["#","Student ID", "Name", "GPA"];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Retrieve all students from local storage
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Create a row for each student
    const uniqueStudentIds = new Set(); 
    let rowIndex = 1;

    students.forEach(studentData => {
        // Continue if the student ID has not been added before
        if (!uniqueStudentIds.has(studentData.studentId)) {
            uniqueStudentIds.add(studentData.studentId); // Add the student ID to the Set

            const row = gpaTable.insertRow();
            const values = [
                rowIndex,
                studentData.studentId,
                studentData.studentName,
                calculateGPA(studentData)
            ];

            values.forEach(value => {
                const cell = row.insertCell();
                cell.innerHTML = value;
            });
            rowIndex++;
        }
    });

    studentsGpaTable.appendChild(gpaTable);
        const searchInput = document.querySelector('#searchInput');
        const studentsTableContainer= document.querySelector('#studentsTableContainer');
        const studentGpaButton= document.querySelector("#studentGpaButton");
        const gpaTableTitle=document.querySelector('#gpaTableTitle');
        gpaTableTitle.style.display='block';
        studentGpaButton.style.display='none';
        studentsTableContainer.style.display = 'none';
        searchInput.style.display='none';


}

// GPA Calculation Function
function calculateGPA(studentData) {
    // Retrieve all students from local storage
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const sameIdStudents = students.filter(student => student.studentId === studentData.studentId);

    const numberOfStudents = sameIdStudents.length;

    // If there are no students or studentData is empty, do not calculate GPA
    if (numberOfStudents === 0 || !studentData) {
        return 'N/A';
    }

    // Calculate total grades
    const totalGrade = sameIdStudents.reduce((total, student) => {
        return total + parseFloat(student.grade);
    }, 0);

    // Calculate GPA and round to 2 decimal places
    const gpa = (totalGrade / numberOfStudents).toFixed(2);

    return gpa;
}


