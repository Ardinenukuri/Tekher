var SchoolCategory;
(function (SchoolCategory) {
    SchoolCategory["PRIMARY"] = "Primary";
    SchoolCategory["SECONDARY"] = "Secondary";
    SchoolCategory["UNIVERSITY"] = "University";
})(SchoolCategory || (SchoolCategory = {}));
var SchoolManagementSystem = /** @class */ (function () {
    function SchoolManagementSystem() {
        this.schools = [];
        this.idCounter = 1;
    }
    // Generate simple numeric ID
    SchoolManagementSystem.prototype.generateId = function () {
        return (this.idCounter++).toString();
    };
    // Add new school
    SchoolManagementSystem.prototype.addSchool = function (name, address, category) {
        var newSchool = {
            id: this.generateId(),
            name: name,
            address: address,
            category: category
        };
        this.schools.push(newSchool);
        console.log("Added school: ".concat(name, " (ID: ").concat(newSchool.id, ")"));
        return newSchool;
    };
    // Edit existing school
    SchoolManagementSystem.prototype.editSchool = function (id, newName, newAddress) {
        var school = this.schools.find(function (s) { return s.id === id; });
        if (!school) {
            console.log("School with ID ".concat(id, " not found"));
            return false;
        }
        school.name = newName;
        school.address = newAddress;
        console.log("Updated school ".concat(id));
        return true;
    };
    // Remove school completely
    SchoolManagementSystem.prototype.removeSchool = function (id) {
        var index = this.schools.findIndex(function (s) { return s.id === id; });
        if (index === -1)
            return false;
        this.schools.splice(index, 1);
        console.log("Removed school ".concat(id));
        return true;
    };
    // Display all schools or filtered by category
    SchoolManagementSystem.prototype.displaySchools = function (category) {
        console.log("\nSCHOOL LIST");
        console.log("-------------------");
        var toDisplay = category
            ? this.schools.filter(function (s) { return s.category === category; })
            : this.schools;
        if (toDisplay.length === 0) {
            console.log("No schools found");
            return;
        }
        toDisplay.forEach(function (school) {
            console.log("ID: ".concat(school.id, "\n") +
                "Name: ".concat(school.name, "\n") +
                "Address: ".concat(school.address, "\n") +
                "Type: ".concat(school.category, "\n") +
                "-------------------");
        });
    };
    // Find single school by ID
    SchoolManagementSystem.prototype.findSchoolById = function (id) {
        return this.schools.find(function (s) { return s.id === id; });
    };
    return SchoolManagementSystem;
}());
var sms = new SchoolManagementSystem();
sms.addSchool("Rubanga Primary", "KG 35", SchoolCategory.PRIMARY);
sms.addSchool("Lycee Rubanga", "KG 20", SchoolCategory.SECONDARY);
sms.addSchool("Rubanga University", "KG 100", SchoolCategory.UNIVERSITY);
sms.displaySchools();
sms.editSchool("2", "Lycee Rubanga", "KG 20");
var foundSchool = sms.findSchoolById("1");
console.log("\nFound school:", foundSchool);
sms.displaySchools(SchoolCategory.UNIVERSITY);
sms.removeSchool("3");
