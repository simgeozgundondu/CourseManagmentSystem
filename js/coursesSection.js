import Course from './course.js';

// Menu Toggle Button
const menuToggle = document.querySelector('.menuToggle');
const navigation = document.querySelector('.navigation');
menuToggle.onclick = function () {
    // Toggle the navigation menu open or closed
    navigation.classList.toggle('open')
}
// Event listener for list items
const list = document.querySelectorAll('.list');
function activeLink() {
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
}

// Event listener for the DOM content being loaded
document.addEventListener('DOMContentLoaded', function () {
    let courses = []
    courses = JSON.parse(localStorage.getItem("courses"));

    // Create a table element
    const table = document.createElement('table');

     // Create a table headers
    const headerRow = table.insertRow(0);
    const headers = ["#","Course Code","Course Name", "Credit", "Grading Scale", "", ""];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Process data for each course
    courses.forEach((courseData,rowIndex) => {
        const row = table.insertRow();
        const values = [
            rowIndex + 1,
            courseData.courseCode,
            courseData.courseName,
            courseData.credit,
            courseData.gradingScale
        ];

        values.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        const updateButtonCell = row.insertCell();
        const updateButton = createUpdateButton(courseData, fillDetailForm);
        updateButtonCell.appendChild(updateButton);
        const removeButtonCell = row.insertCell();
        const removeButton = createRemoveButton(courseData);
        removeButtonCell.appendChild(removeButton);
        const updateFormButton = document.querySelector('#updateFormButton');
        updateFormButton.addEventListener('click', function () {
        updateCourse(courseData);
        });
    });

    // Add the table to a div with a specific ID
    const containerId = 'coursesTableContainer';
    const contentDiv = document.getElementById(containerId);

    if (contentDiv) {
        contentDiv.innerHTML = '';
        contentDiv.appendChild(table);
    }
    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        filterTable(searchInput.value.toLowerCase());
    });


});
// Function to create an update button
function createUpdateButton(courseData, fillDetailForm) {
    const updateButton = document.createElement('button');
    updateButton.classList.add('updateButton');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'create-outline');

    updateButton.addEventListener('click', function () {
        const coursesTableContainer = document.querySelector('#coursesTableContainer');
        const courseDetailForm = document.querySelector('#coursDetailForm');
        const searchInput = document.querySelector('#searchInput');

        if (courseDetailForm.style.display === 'none') {
            courseDetailForm.style.display = 'block';
            coursesTableContainer.style.display = 'none';
            searchInput.style.display='none';
        } else {
            courseDetailForm.style.display = 'none';
            coursesTableContainer.style.display = 'block';
            searchInput.style.display='block';
        }

        fillDetailForm(courseData);
        updateFormButton.courseData = courseData;


    });
    updateButton.appendChild(icon);

    return updateButton;
}


// Function to create a remove button
function createRemoveButton(courseData) {
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeButton');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'trash-outline');

    removeButton.addEventListener('click', function () {
        const key = generateLocalStorageKey(courseData);
        removeFromLocalStorage(key);

        removeRowFromTable(courseData);
    });
    removeButton.appendChild(icon);

    return removeButton;
}
// Function to generate a local storage key
function generateLocalStorageKey(courseData) {
    return `course_${courseData.courseCode}_${courseData.courseName}`;
}
// Function to remove data from local storage
function removeFromLocalStorage(key) {
    // Local storage'dan belirtilen key'e sahip veriyi sil
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.filter(student => generateLocalStorageKey(student) !== key);
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Function to remove a row from the table
function removeRowFromTable(courseData) {
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0 && cells[1].innerHTML === courseData.courseCode) {
            table.deleteRow(i);
            break;
        }
    }
}

// Function to fill the course detail form
function fillDetailForm(courseData) {
    const coursDetailForm = document.querySelector('#coursDetailForm');
    const courseNameInput = coursDetailForm.querySelector('#courseName');
    const courseCodeInput = coursDetailForm.querySelector('#courseCode');
    const creditInput = coursDetailForm.querySelector('#credit');
    const gradingScaleInput = coursDetailForm.querySelector('#gradingScale');

    // Fill form elements with data
    courseNameInput.value = courseData.courseName;
    courseCodeInput.value = courseData.courseCode;
    creditInput.value = courseData.credit;
    gradingScaleInput.value = courseData.gradingScale;
}

// Function to update a course
function updateCourse() {
    const courseDetailForm = document.querySelector('#coursDetailForm');
    const courseNameInput = courseDetailForm.querySelector('#courseName');
    const courseCodeInput = courseDetailForm.querySelector('#courseCode');
    const creditInput = courseDetailForm.querySelector('#credit');
    const gradingScaleInput = courseDetailForm.querySelector('#gradingScale');

    // Create updated data
    const updatedCourse = {
        courseName: courseNameInput.value.trim(),
        courseCode: courseCodeInput.value.trim(),
        credit: creditInput.value.trim(),
        gradingScale: gradingScaleInput.value.trim()
    };


    // Retrieve all courses from local storage
    let courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Find the index of the selected course
    const index = courses.findIndex(course => generateLocalStorageKey(course) === generateLocalStorageKey(updateFormButton.courseData));


    // Replace the selected course with the updated data
    if (index !== -1) {
        courses[index] = updatedCourse;
        localStorage.setItem('courses', JSON.stringify(courses));

        // Update the table with the updated data
        updateRowInTable(updateFormButton.courseData, updatedCourse);

        // Hide the form and show the table
        courseDetailForm.style.display = 'none';
        coursesTableContainer.style.display = 'block';
    }
}

// Search function to filter the table based on user input
function filterTable(searchTerm) {
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    // Iterate through each row and show or hide based on the search term
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let rowText = '';

        // Concatenate text content of all cells in the row
        for (let j = 0; j < cells.length; j++) {
            rowText += cells[j].textContent.toLowerCase() + ' ';
        }

        // Show the row if the search term is present in the row text, otherwise hide it
        if (rowText.includes(searchTerm)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}






