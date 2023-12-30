// Class of Course
import Student from './students.js';

class Course {
    // Constructor for initializing Course properties
    constructor(courseCode, courseName, credit, gradingScale) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credit = credit;
        this.gradingScale = gradingScale;
    }

    // Method to calculate and assign grades for a given student
    calculateGrade(student) {
        const { midterm, final } = student;
        const grade = midterm * 0.4 + final * 0.6;

        // Determine letter grade based on the grading scale
        if (this.gradingScale === "7") {
            if (grade >= 93) {
                student.letterGrade = 'A';
            } else if (grade >= 85) {
                student.letterGrade = 'B';
            } else if (grade >= 77) {
                student.letterGrade = 'C';
            } else if (grade >= 70) {
                student.letterGrade = 'D';
            } else {
                student.letterGrade = 'F';
                student.result = 'failed';
            }
        } else if (this.gradingScale === "10") {
            if (grade >= 90) {
                student.letterGrade = 'A';
            } else if (grade >= 80) {
                student.letterGrade = 'B';
            } else if (grade >= 70) {
                student.letterGrade = 'C';
            } else if (grade >= 60) {
                student.letterGrade = 'D';
            } else {
                student.letterGrade = 'F';
                student.result = 'failed';
            }
        }
        // Determine overall result (passed or failed) if not already assigned
        if (!student.result) {
            if (student.letterGrade === 'F') {
                student.result = 'failed';
            } else {
                student.result = 'passed';
            }
        }
        // Assign calculated grade to the student
        student.grade = grade;
    }

}
// Export the Course class for use in other modules
export default Course;

