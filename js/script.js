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
// Add a click event listener to each navigation link to handle the active state
list.forEach((item) =>
    item.addEventListener('click', activeLink));














