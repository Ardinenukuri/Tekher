var StockManagement = /** @class */ (function () {
    function StockManagement() {
        this.products = [];
    }
    StockManagement.prototype.getInventory = function () {
        this.products.map(function (prod) {
            console.log("Product Name: ".concat(prod.name, ", Price: ").concat(prod.price, ", Quantity: ").concat(prod.quantity));
        });
    };
    StockManagement.prototype.restock = function (id, quantity) {
        var product = this.products.find(function (prod) { return prod.id === id; });
        if (!product)
            return 0;
        product.quantity += quantity;
        var indexP = this.products.findIndex(function (prod) { return prod.id === id; });
        this.products[indexP] = product;
        return product.quantity;
    };
    StockManagement.prototype.sell = function (id, quantity) {
        var product = this.products.find(function (prod) { return prod.id === id; });
        if (!product)
            return 0;
        if (product.quantity >= quantity) {
            product.quantity -= quantity;
            var indexP = this.products.findIndex(function (prod) { return prod.id === id; });
            this.products[indexP] = product;
            console.log('Product Sold');
            return product.quantity;
        }
        else {
            console.log('We dont have sufficient quantity');
        }
        ;
        return product.quantity;
    };
    StockManagement.prototype.createProduct = function (product) {
        var productExist = this.products.find(function (prod) { return prod.id === product.id; });
        if (!productExist) {
            this.products.push(product);
        }
    };
    return StockManagement;
}());
var productStock = new StockManagement();
