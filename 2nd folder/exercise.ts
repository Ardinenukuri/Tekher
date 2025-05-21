// //person with salary
// class Person {
//     constructor(public name: string) {}
// }
//
// class Employee extends Person {
//     constructor(name: string, public salary: number) {
//         super(name);
//     }
//
//     printDetails(): void {
//         console.log(`Employee: ${this.name}, Salary: $${this.salary.toLocaleString()}`);
//     }
// }
//
// const tole = new Employee("Nukuri", 75000);
// tole.printDetails();

//Bank account

class BankAccount {
    private _balance: number;

    constructor(initialBalance: number) {
        this._balance = initialBalance;
    }

    getBalance(): number {
        return this._balance;
    }


    protected setBalance(amount: number): void {
        this._balance = amount;
    }
}

class SavingsAccount extends BankAccount {
    addInterest(rate: number): void {
        const currentBalance = this.getBalance();
        const interest = currentBalance * (rate / 100);
        this.setBalance(currentBalance + interest);
    }
}


const savings = new SavingsAccount(10);
console.log("Initial:", savings.getBalance());

savings.addInterest(5);
console.log("After interest:", savings.getBalance());