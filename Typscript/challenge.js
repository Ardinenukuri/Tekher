var Operation = /** @class */ (function () {
    function Operation() {
        this.students = [];
    }
    Operation.prototype.addStudent = function (name, rollNumber, grade) {
        this.students.push({ name: name, rollNumber: rollNumber, grade: grade });
    };
    Operation.prototype.displayStudents = function () {
        for (var i = 0; i < this.students.length; i++) {
            var student = this.students[i];
            console.log(student.rollNumber, student.name, student.grade);
        }
    };
    Operation.prototype.calculateAverage = function () {
        if (this.students.length === 0)
            return 0;
        var sum = 0;
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            sum += student.grade;
        }
        return sum / this.students.length;
    };
    return Operation;
}());
var wolo = new Operation();
wolo.addStudent('KOKO', 1, 30);
wolo.addStudent('Claude', 2, 30);
wolo.displayStudents();
console.log('AVERAGE:', wolo.calculateAverage());
