enum Status {
    active = 0,
    inactive = 1,
}

enum Gender {
    female = 'FEMALE',
    male = 'MALE',
}

export interface Category {
    name: string;
}

interface Book {
    title: string;
    author: string;
    status: Status;
    category: Category[]
}

interface Employee{
    names: string;
    gender: Gender;
}

class Library {
    location: string;
    name: string;

    constructor(location: string, name: string) {
        this.location = location;
        this.name = name;
    }
}

interface Library_{
    name: string;
    location: string;
}

class KigaliBranch extends Library {
    constructor (library: Library_) {
        super(library.location, library.name);
    }

    getLibraryName() : string {
        return this.name;
    }

    setLibraryLocation(name: string) {
        this.location = name;
    }
}

const b: Library_ = {
    name: 'Kiyovu Library',
    location: 'Kigali'
}
const kglLibrary = new KigaliBranch(b);

console.log(kglLibrary.name)
console.log(kglLibrary.getLibraryName());
