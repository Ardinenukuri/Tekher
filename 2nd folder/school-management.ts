enum SchoolCategory {
    PRIMARY = "Primary",
    SECONDARY = "Secondary",
    UNIVERSITY = "University"
}

interface ISchool {
    id: string;
    name: string;
    address: string;
    category: SchoolCategory;
}

interface ISchoolOperations {
    addSchool(name: string, address: string, category: SchoolCategory): ISchool;
    editSchool(id: string, newName: string, newAddress: string): boolean;
    removeSchool(id: string): boolean;
    displaySchools(category?: SchoolCategory): void;
    findSchoolById(id: string): ISchool | undefined;
}

class SchoolManagementSystem implements ISchoolOperations {
    private schools: ISchool[] = [];
    private idCounter = 1;

    // Generate simple numeric ID
    private generateId(): string {
        return (this.idCounter++).toString();
    }

    // Add new school
    addSchool(name: string, address: string, category: SchoolCategory): ISchool {
        const newSchool: ISchool = {
            id: this.generateId(),
            name,
            address,
            category
        };
        this.schools.push(newSchool);
        console.log(`Added school: ${name} (ID: ${newSchool.id})`);
        return newSchool;
    }

    // Edit existing school
    editSchool(id: string, newName: string, newAddress: string): boolean {
        const school = this.schools.find(s => s.id === id);
        if (!school) {
            console.log(`School with ID ${id} not found`);
            return false;
        }

        school.name = newName;
        school.address = newAddress;
        console.log(`Updated school ${id}`);
        return true;
    }

    // Remove school completely
    removeSchool(id: string): boolean {
        const index = this.schools.findIndex(s => s.id === id);
        if (index === -1) return false;

        this.schools.splice(index, 1);
        console.log(`Removed school ${id}`);
        return true;
    }

    // Display all schools or filtered by category
    displaySchools(category?: SchoolCategory): void {
        console.log("\nSCHOOL LIST");
        console.log("-------------------");

        const toDisplay = category
            ? this.schools.filter(s => s.category === category)
            : this.schools;

        if (toDisplay.length === 0) {
            console.log("No schools found");
            return;
        }

        toDisplay.forEach(school => {
            console.log(
                `ID: ${school.id}\n` +
                `Name: ${school.name}\n` +
                `Address: ${school.address}\n` +
                `Type: ${school.category}\n` +
                "-------------------"
            );
        });
    }

    // Find single school by ID
    findSchoolById(id: string): ISchool | undefined {
        return this.schools.find(s => s.id === id);
    }
}


const sms = new SchoolManagementSystem();


sms.addSchool("Rubanga Primary", "KG 35", SchoolCategory.PRIMARY);
sms.addSchool("Lycee Rubanga", "KG 20", SchoolCategory.SECONDARY);
sms.addSchool("Rubanga University", "KG 100", SchoolCategory.UNIVERSITY);


sms.displaySchools();


sms.editSchool("2", "Lycee Rubanga", "KG 20");


const foundSchool = sms.findSchoolById("1");
console.log("\nFound school:", foundSchool);


sms.displaySchools(SchoolCategory.UNIVERSITY);


sms.removeSchool("3");