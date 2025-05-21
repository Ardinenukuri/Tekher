var ExampleOne = /** @class */ (function () {
    function ExampleOne() {
        this.name = '';
    }
    ExampleOne.prototype.setName = function (name) {
        this.name = name;
    };
    ExampleOne.prototype.getName = function () {
        return this.name;
    };
    return ExampleOne;
}());
var ExampleTwo = /** @class */ (function () {
    function ExampleTwo() {
        this.one = 0;
        this.two = 1;
    }
    ExampleTwo.prototype.AddNumber = function (one, two) {
        return one + two;
    };
    ExampleTwo.prototype.SubNumber = function (one, two) {
        return one - two;
    };
    ;
    ExampleTwo.prototype.quartNumber = function (one, two) {
        return one / two;
    };
    ExampleTwo.prototype.multNumber = function (one, two) {
        return one * two;
    };
    return ExampleTwo;
}());
