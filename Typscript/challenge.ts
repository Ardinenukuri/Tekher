interface eleve{
    addStudent:(name:string, rollNumber:number, grade:number) => void;
    displayStudents: () =>void;
    calculateAverage:() => number;

}

class Operation implements eleve {
    students:{name:string, rollNumber: number, grade:number}[] =[];

    addStudent(name: string, rollNumber: number, grade: number):void {
        this.students.push({name, rollNumber, grade})
    }

    displayStudents(): void {
        for(let i=0; i < this.students.length; i++){
            const student = this.students[i];
            console.log(student.rollNumber ,student.name, student.grade)
        }
    }

    calculateAverage(): number {
        if (this.students.length===0) return 0;

        let sum =0
        for(const student of this.students){
            sum += student.grade
        }
        return sum/this.students.length;
    }

}

const wolo = new Operation();
wolo.addStudent('KOKO', 1, 30 );
wolo.addStudent('Claude', 2, 30);
wolo.displayStudents();
console.log( 'AVERAGE:', wolo.calculateAverage());

