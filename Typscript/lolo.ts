// enum gender{
//     Female = 'FEMALE',
//     MALE = 'MALE'
// }
//
// let gender : gender = gender.MALE;
//

enum status{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

//functions
function deposit(currentBalance: number, amount:number): void{
    let balance:number = currentBalance + amount;

}

function depositReturn(currentBalance: number, amount:number):number{
    return currentBalance +amount;

}

//class

class Stock{
    public stockBalance: number;
    private difference: number;

    constructor(balance: number){
        this.stockBalance = balance;
        this.difference = 0;

    }

    stockIn(quantity: number): void{
        this.stockBalance +=quantity;
    }

    stockOut(quantity: number): void{
        this.stockBalance -=quantity;

    }

    getDifference() : number {
        return this.difference
    }
}

let stock : Stock = new Stock(200);
let stocktwo: Stock = new Stock (100);
let stockthree: Stock = new Stock (1000);
stock.stockIn(50);
stocktwo.stockIn(10);
stock.getDifference();

//car class
class Car {
    public Distance: number;
    private Moving: boolean;

    constructor() {
        this.Distance = 0;
        this.Moving = false;
    }

    drive(km: number): void {
        this.Distance += km;
        this.Moving = true;

    }

    stop(): void {
        if (this.Moving) {
            this.Moving = false;
            console.log("Car has stopped.");
        } else {
            console.log("Car was already stopped.");
        }
    }

    getStatus(): boolean {
        return this.Moving;
    }
}



let myCar = new Car();
myCar.drive(50);
myCar.drive(30);
myCar.stop();
console.log(myCar.getStatus());

//class user

class User {
    public firstname: string;
    public lastname: string;
    private age: number;

    constructor(firstname: string, lastname: string, age: number) {
        this.firstname = firstname,
            this.lastname = lastname,
            this.age = age
    }

    getRegisteredUser():{firstname:string, lastname: string, age: number} {
        return {
            firstname: this.firstname,
            lastname:this.lastname,
            age:this.age
        };
    };

}


//inheritance
//parent class

class Book{
    public manufacture: string;
    public title: string;

    constructor(man: string, tit: string){
        this.manufacture= man;
        this.title = tit;
    }

}

class EducationBook extends Book{
    constructor(){
        super("UR", "Math Book");
    }
}

const educationBook = new EducationBook();
educationBook.title;
educationBook.manufacture



// inheritance class House
class House{
    public size: number;
    public floors: number;
    public district: string;

    constructor(size: number, floors: number, district: string){
        this.size=size,
            this.floors=floors,
            this.district=district
    }

}

class NyarugengeHouse extends House{
    constructor(){
        super(22, 3, 'Nyarugenge');
    }
}

class KicukiroHouse extends House{
    constructor(){
        super(24, 2, 'Kicukiro')
    }
}

const nyarugengeHouse = new NyarugengeHouse
nyarugengeHouse.district
nyarugengeHouse.floors
nyarugengeHouse.size

const kicukiroHouse = new NyarugengeHouse
kicukiroHouse.district
kicukiroHouse.floors
kicukiroHouse.size

//interface
interface Person{
    names: string;
    age: number;
    address: string;
}

const personOne: Person = {
    names: 'Mugisha',
    age: 21,
    address: 'Rwanda'

};

const {names, age} = personOne;

console.log(names);
console.log(age);

const countries: string[] = ['Rwanda', 'Ghana', 'Burundi'];
const [contryOne, countryTwo] = countries;
console.log(contryOne);
console.log(countryTwo);
export interface Category {
    name: string;
}
