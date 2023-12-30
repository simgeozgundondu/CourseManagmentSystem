// Class of Student
class Student {
    // Constructor for initializing Student properties
    constructor({ studentID, name, surname, courses, midterm, final, grade = 0, letterGrade, result }) {
        this.studentID = studentID;
        this.name = name;
        this.surname = surname;
        this.courses = [];
        this.midterm = midterm;
        this.final = final;
        this.grade = grade;
        this.letterGrade = letterGrade;
        this.result = result;
    }
}
// Export the Course class for use in other modules
export default Student;
