//implement the interface
var StudentManager = /** @class */ (function () {
    function StudentManager() {
        this.students = [];
    }
    StudentManager.prototype.addStudent = function (name, grade, rollNumber) {
        this.students.push({ name: name, grade: grade, rollNumber: rollNumber });
    };
    ;
    StudentManager.prototype.displayStudents = function () {
        console.log("Student List");
        // for loop
        for (var i = 0; i < this.students.length; i++) {
            var student = this.students[i];
            console.log(student.rollNumber, student.name, student.grade);
        }
    };
    StudentManager.prototype.calculateAverageGrade = function () {
        if (this.students.length === 0)
            return 0;
        var sum = 0;
        // Using for...of loop
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            sum += student.grade;
        }
        return sum / this.students.length;
    };
    return StudentManager;
}());
//Menu
var manager = new StudentManager();
manager.addStudent("Ardine", 85, 1);
manager.addStudent("Erica", 90, 2);
manager.addStudent("Martine", 70, 3);
manager.addStudent("Nukuri", 100, 4);
manager.addStudent("Livia", 105, 5);
manager.addStudent("Kaze", 95, 6);
manager.displayStudents();
console.log("Average:", manager.calculateAverageGrade());
