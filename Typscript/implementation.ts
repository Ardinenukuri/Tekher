interface ClassStructure{
    setName: (name: string) => void;
    getName: () => string;
}

class ExampleOne implements ClassStructure{
    name:string ='';

    setName(name: string): void {
        this.name=name;
    }

    getName(): string{
        return this.name;
    }
}

//Exercise1
interface ClassNumbers{
    AddNumber: (one: number, two: number)=> number;
    SubNumber: (one: number, two:number)=> number;
    quartNumber: (one:number, two:number) =>number;
    multNumber:(one:number, two:number) => number;
}

class ExampleTwo implements ClassNumbers{
    one:number =0;
    two:number =1;

    AddNumber(one: number, two: number):  number{
        return one+ two;
    }

    SubNumber(one: number, two: number):  number{
        return one- two;
    };

    quartNumber(one: number, two: number):number{
        return one/two;
    }

    multNumber(one: number, two: number):number{
        return one*two
    }

}