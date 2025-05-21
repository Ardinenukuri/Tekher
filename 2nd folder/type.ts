interface Product_ {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface ProductDetail {
    getInventory: () => void;
    Restock: (quantity: number) => void;
    IsProductExist: (id: number) => boolean;
    Sell: (quantity: number) => void;
    CreateProduct: (Prt: Product_) => void;
}

class Product implements ProductDetail {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public quantity: number,
        public prt: Product_[] = []
    ) {}

    getInventory() {
        console.log('Product Id:', this.id);
        console.log('Product Name:', this.name);
        console.log('Product Price:', this.price);
        console.log('Product Quantity:', this.quantity);
    }

    Restock(quantity: number) {
        if (quantity > 0) {
            this.quantity += quantity;
            console.log(`Restocked ${quantity} units. New quantity: ${this.quantity}`);
        } else {
            console.log('Invalid quantity for restock');
        }
    }

    IsProductExist(id: number): boolean {
        if(this.prt.find(product => product.id === id)){
        console.log(`Product with ID ${id} does exist'`)
        }else {
            console.log(`Product with ID ${id} does not exist`)
        }

    }

    Sell(quantity: number) {
        if (quantity <= 0) {
            console.log('Invalid sale quantity');
            return;
        }

        if (this.quantity >= quantity) {
            this.quantity -= quantity;
            console.log(`Sold ${quantity} units. Remaining: ${this.quantity}`);
        } else {
            console.log(`Not enough stock. Available: ${this.quantity}`);
        }
    }

    CreateProduct(prt: Product_) {
        if (this.IsProductExist(prt.id)) {
            console.log(`Product with ID ${prt.id} already exists`);
            return;
        }
        this.prt.push(prt);
        console.log(`Product ${prt.id} added to inventory`);
    }
}


const total = new Product(0, "Inventory Manager", 0, 0);


const productOne: Product_ = { id: 23, name: 'Potatoes', price: 25, quantity: 100 };
const productTwo: Product_ = { id: 32, name: 'beans', price: 15, quantity: 200 };
const productThree: Product_ = { id: 30, name: 'Rice', price: 10, quantity: 69 };
const productFour: Product_ = { id: 40, name: 'Black Pepper', price: 25, quantity: 120 };
const productFive: Product_ = { id: 40, name: 'Black Pepper', price: 25, quantity: 120 };

// // // // Add products to inventory
total.CreateProduct(productOne);
total.CreateProduct(productTwo);
total.CreateProduct(productThree);
total.CreateProduct(productFour);
total.CreateProduct(productFive);
// total.Restock(100)
// total.Sell(20)

total.IsProductExist(120)

