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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//Bank account
var BankAccount = /** @class */ (function () {
    function BankAccount(initialBalance) {
        this._balance = initialBalance;
    }
    BankAccount.prototype.getBalance = function () {
        return this._balance;
    };
    BankAccount.prototype.setBalance = function (amount) {
        this._balance = amount;
    };
    return BankAccount;
}());
var SavingsAccount = /** @class */ (function (_super) {
    __extends(SavingsAccount, _super);
    function SavingsAccount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SavingsAccount.prototype.addInterest = function (rate) {
        var currentBalance = this.getBalance();
        var interest = currentBalance * (rate / 100);
        this.setBalance(currentBalance + interest);
    };
    return SavingsAccount;
}(BankAccount));
var savings = new SavingsAccount(1000);
console.log("Initial:", savings.getBalance()); // 1000
savings.addInterest(5);
console.log("After interest:", savings.getBalance());
