// - Switch Case condition
// - If condition
// - do while loop
// - Array functions
var StudentOperation = /** @class */ (function () {
    function StudentOperation() {
        this.students = [];
        this.st = [];
        this.studentss = [];
    }
    StudentOperation.prototype.addStudent = function (st) {
        //check if student doesn't exist by rollnumber
        if (this.isStudentExist(st.rollnumber)) {
            console.log("Student with this roll number ".concat(st.rollnumber, " already registered"));
        }
        this.students.push(st);
    };
    StudentOperation.prototype.removeStudent = function (rollnumber) {
        //check if the student exists
        if (this.isStudentExist(rollnumber)) {
            var student = this.students.find(function (t) { return t.rollnumber !== rollnumber; });
            console.log('student removed');
        }
        else {
            console.log('student not found');
        }
    };
    StudentOperation.prototype.isStudentExist = function (rollnumber) {
        return !!this.students.filter(function (student) { return student.rollnumber === rollnumber; });
        //   if (this.isStudentExist(rollnumber)){
        //       this.students = this.students.filter((student) => student.rollnumber !== rollnumber);
        //       console.log('student exists')
        // } else{
        //       console.log('student not found')
        // }
    };
    return StudentOperation;
}());
//
var educationalStudents = new StudentOperation();
var studentOne = { names: "Gil", age: 30, rollnumber: 4674 };
var studentTwo = { names: "nukuri", age: 20, rollnumber: 23 };
var studentThree = { names: 'kaze', age: 300, rollnumber: 24 };
var studentFour = { names: 'livia', age: 50, rollnumber: 25 };
var studentFive = { names: 'erica', age: 60, rollnumber: 30 };
educationalStudents.addStudent(studentOne);
educationalStudents.addStudent(studentTwo);
educationalStudents.addStudent(studentThree);
educationalStudents.addStudent(studentFour);
educationalStudents.addStudent(studentFive);
// // // // //remove student from array
// educationalStudents.isStudentExist(30)
// educationalStudents.removeStudent(30)
//
// educationalStudents.listAllStudents()
//switch
//
// const country : string = 'RWANDA';
//
// switch (country){
//     case 'RWANDA': {
//         console.log('This is Rwanda');
//         break;
//     }
//     case "GHANA": {
//         console.log('This is Ghana');
//         break;
//     }
//
//     default:
//         console.log('No country')
// }
