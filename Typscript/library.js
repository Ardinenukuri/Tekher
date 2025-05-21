"use strict";
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
var Status;
(function (Status) {
    Status[Status["active"] = 0] = "active";
    Status[Status["inactive"] = 1] = "inactive";
})(Status || (Status = {}));
var Gender;
(function (Gender) {
    Gender["female"] = "FEMALE";
    Gender["male"] = "MALE";
})(Gender || (Gender = {}));
var Library = /** @class */ (function () {
    function Library(location, name) {
        this.location = location;
        this.name = name;
    }
    return Library;
}());
var KigaliBranch = /** @class */ (function (_super) {
    __extends(KigaliBranch, _super);
    function KigaliBranch(library) {
        return _super.call(this, library.location, library.name) || this;
    }
    KigaliBranch.prototype.getLibraryName = function () {
        return this.name;
    };
    KigaliBranch.prototype.setLibraryLocation = function (name) {
        this.location = name;
    };
    return KigaliBranch;
}(Library));
var b = {
    name: 'Kiyovu Library',
    location: 'Kigali'
};
var kglLibrary = new KigaliBranch(b);
console.log(kglLibrary.name);
console.log(kglLibrary.getLibraryName());
