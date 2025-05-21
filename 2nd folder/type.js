var Product = /** @class */ (function () {
    function Product(id, name, price, quantity, prt) {
        if (prt === void 0) { prt = []; }
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.prt = prt;
    }
    Product.prototype.getInventory = function () {
        console.log('Product Id:', this.id);
        console.log('Product Name:', this.name);
        console.log('Product Price:', this.price);
        console.log('Product Quantity:', this.quantity);
    };
    Product.prototype.Restock = function (quantity) {
        if (quantity > 0) {
            this.quantity += quantity;
            console.log("Restocked ".concat(quantity, " units. New quantity: ").concat(this.quantity));
        }
        else {
            console.log('Invalid quantity for restock');
        }
    };
    Product.prototype.IsProductExist = function (id) {
        if (this.prt.find(function (product) { return product.id === id; })) {
            console.log("Product with ID ".concat(id, " does exist'"));
        }
        else {
            console.log("Product with ID ".concat(id, " does not exist"));
        }
    };
    Product.prototype.Sell = function (quantity) {
        if (quantity <= 0) {
            console.log('Invalid sale quantity');
            return;
        }
        if (this.quantity >= quantity) {
            this.quantity -= quantity;
            console.log("Sold ".concat(quantity, " units. Remaining: ").concat(this.quantity));
        }
        else {
            console.log("Not enough stock. Available: ".concat(this.quantity));
        }
    };
    Product.prototype.CreateProduct = function (prt) {
        if (this.IsProductExist(prt.id)) {
            console.log("Product with ID ".concat(prt.id, " already exists"));
            return;
        }
        this.prt.push(prt);
        console.log("Product ".concat(prt.id, " added to inventory"));
    };
    return Product;
}());
var total = new Product(0, "Inventory Manager", 0, 0);
var productOne = { id: 23, name: 'Potatoes', price: 25, quantity: 100 };
var productTwo = { id: 32, name: 'beans', price: 15, quantity: 200 };
var productThree = { id: 30, name: 'Rice', price: 10, quantity: 69 };
var productFour = { id: 40, name: 'Black Pepper', price: 25, quantity: 120 };
var productFive = { id: 40, name: 'Black Pepper', price: 25, quantity: 120 };
// // // // Add products to inventory
total.CreateProduct(productOne);
total.CreateProduct(productTwo);
total.CreateProduct(productThree);
total.CreateProduct(productFour);
total.CreateProduct(productFive);
// total.Restock(100)
// total.Sell(20)
total.IsProductExist(120);
