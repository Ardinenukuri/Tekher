// - Switch Case condition
// - If condition
// - do while loop
// - Array functions

interface student_{
    names:string,
    age:number,
    rollnumber:number,

}

class StudentOperation{
    public students: student_[] =[];
    public st: student_[] =[];

    public studentss: [] = [];

    constructor(){
    }

    addStudent(st:student_){
        //check if student doesn't exist by rollnumber
        if(this.isStudentExist(st.rollnumber)){
            console.log(`Student with this roll number ${st.rollnumber} already registered`)

        }
        this.students.push(st)
    }

    removeStudent(rollnumber:number) {
        //check if the student exists
        if (this.isStudentExist(rollnumber)) {
            const student = this.students.find((t: student_) => t.rollnumber !== rollnumber);
            console.log('student removed')
        } else {
            console.log('student not found')


        }
    }
  isStudentExist(rollnumber: number): boolean {
        return !! this.students.filter((student) => student.rollnumber === rollnumber);

      //   if (this.isStudentExist(rollnumber)){
      //       this.students = this.students.filter((student) => student.rollnumber !== rollnumber);
      //       console.log('student exists')
      // } else{
      //       console.log('student not found')
      // }




  }
  //
  // listAllStudents(st: student_): void{
  //       console.log("student_.names", student.rollnumber, student_.grade)
  //
  // }


}
//
const educationalStudents =new StudentOperation();
let studentOne: student_ = {names: "Gil",age: 30, rollnumber: 4674};
let studentTwo: student_ = { names:"nukuri", age: 20, rollnumber:23}
let studentThree: student_= {names:'kaze', age: 300, rollnumber:24}
let studentFour: student_ = {names:'livia', age: 50, rollnumber:25}
let studentFive: student_ = {names:'erica', age: 60, rollnumber:30}


educationalStudents.addStudent(studentOne)
educationalStudents.addStudent(studentTwo)
educationalStudents.addStudent(studentThree)
educationalStudents.addStudent(studentFour)
educationalStudents.addStudent(studentFive)

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