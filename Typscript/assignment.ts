//part one: Create an Interface
interface StudentOperations{
    addStudent:(name: string, grade:number, rollNumber:number) =>void;
    displayStudents:() => void;
    calculateAverageGrade:() => number;
}
interface student{
    name:string,
    grade:number,
    rollNumber:number
}

//implement the interface
class StudentManager implements StudentOperations{
    students: student  []= [];
    addStudent(name: string, grade: number, rollNumber: number): void {
        this.students.push({name, grade, rollNumber})
    };

    displayStudents(): void {
        console.log("Student List");
        // for loop
        for (let i = 0; i < this.students.length; i++) {
            const student = this.students[i];
            console.log(student.rollNumber ,student.name, student.grade)
        }
    }

    calculateAverageGrade(): number {
        if (this.students.length === 0) return 0;

        let sum = 0;
        // Using for...of loop
        for (const student of this.students) {
            sum += student.grade;
        }
        return sum / this.students.length;
    }
}


//Menu
const manager = new StudentManager();
manager.addStudent("Ardine", 85, 1);
manager.addStudent("Erica", 90, 2);
manager.addStudent("Martine", 70, 3);
manager.addStudent("Nukuri", 100,4 );
manager.addStudent("Livia", 105, 5);
manager.addStudent("Kaze", 95, 6);
manager.displayStudents();
console.log("Average:", manager.calculateAverageGrade());