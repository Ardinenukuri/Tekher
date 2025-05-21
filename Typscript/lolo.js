"use strict";
// enum gender{
//     Female = 'FEMALE',
//     MALE = 'MALE'
// }
//
// let gender : gender = gender.MALE;
//
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
Object.defineProperty(exports, "__esModule", { value: true });
var status;
(function (status) {
    status["ACTIVE"] = "ACTIVE";
    status["INACTIVE"] = "INACTIVE";
})(status || (status = {}));
//functions
function deposit(currentBalance, amount) {
    var balance = currentBalance + amount;
}
function depositReturn(currentBalance, amount) {
    return currentBalance + amount;
}
//class
var Stock = /** @class */ (function () {
    function Stock(balance) {
        this.stockBalance = balance;
        this.difference = 0;
    }
    Stock.prototype.stockIn = function (quantity) {
        this.stockBalance += quantity;
    };
    Stock.prototype.stockOut = function (quantity) {
        this.stockBalance -= quantity;
    };
    Stock.prototype.getDifference = function () {
        return this.difference;
    };
    return Stock;
}());
var stock = new Stock(200);
var stocktwo = new Stock(100);
var stockthree = new Stock(1000);
stock.stockIn(50);
stocktwo.stockIn(10);
stock.getDifference();
//car class
var Car = /** @class */ (function () {
    function Car() {
        this.Distance = 0;
        this.Moving = false;
    }
    Car.prototype.drive = function (km) {
        this.Distance += km;
        this.Moving = true;
    };
    Car.prototype.stop = function () {
        if (this.Moving) {
            this.Moving = false;
            console.log("Car has stopped.");
        }
        else {
            console.log("Car was already stopped.");
        }
    };
    Car.prototype.getStatus = function () {
        return this.Moving;
    };
    return Car;
}());
var myCar = new Car();
myCar.drive(50);
myCar.drive(30);
myCar.stop();
console.log(myCar.getStatus());
//class user
var User = /** @class */ (function () {
    function User(firstname, lastname, age) {
        this.firstname = firstname,
            this.lastname = lastname,
            this.age = age;
    }
    User.prototype.getRegisteredUser = function () {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            age: this.age
        };
    };
    ;
    return User;
}());
//inheritance
//parent class
var Book = /** @class */ (function () {
    function Book(man, tit) {
        this.manufacture = man;
        this.title = tit;
    }
    return Book;
}());
var EducationBook = /** @class */ (function (_super) {
    __extends(EducationBook, _super);
    function EducationBook() {
        return _super.call(this, "UR", "Math Book") || this;
    }
    return EducationBook;
}(Book));
var educationBook = new EducationBook();
educationBook.title;
educationBook.manufacture;
// inheritance class House
var House = /** @class */ (function () {
    function House(size, floors, district) {
        this.size = size,
            this.floors = floors,
            this.district = district;
    }
    return House;
}());
var NyarugengeHouse = /** @class */ (function (_super) {
    __extends(NyarugengeHouse, _super);
    function NyarugengeHouse() {
        return _super.call(this, 22, 3, 'Nyarugenge') || this;
    }
    return NyarugengeHouse;
}(House));
var KicukiroHouse = /** @class */ (function (_super) {
    __extends(KicukiroHouse, _super);
    function KicukiroHouse() {
        return _super.call(this, 24, 2, 'Kicukiro') || this;
    }
    return KicukiroHouse;
}(House));
var nyarugengeHouse = new NyarugengeHouse;
nyarugengeHouse.district;
nyarugengeHouse.floors;
nyarugengeHouse.size;
var kicukiroHouse = new NyarugengeHouse;
kicukiroHouse.district;
kicukiroHouse.floors;
kicukiroHouse.size;
var personOne = {
    names: 'Mugisha',
    age: 21,
    address: 'Rwanda'
};
var names = personOne.names, age = personOne.age;
console.log(names);
console.log(age);
var countries = ['Rwanda', 'Ghana', 'Burundi'];
var contryOne = countries[0], countryTwo = countries[1];
console.log(contryOne);
console.log(countryTwo);
