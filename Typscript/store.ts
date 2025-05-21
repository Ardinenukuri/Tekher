interface Product {
    id: number;
    name: string,
    price: number,
    quantity: number
}

interface IProduct {
    getInventory: () => void;
    restock: (id: number, quantity: number) => number;
    sell: (id: number, quantity: number) => number;
}

class StockManagement implements IProduct {
    public products: Product[] = [];

    constructor() {}

    getInventory(): void {
        this.products.map((prod: Product) => {
            console.log(`Product Name: ${prod.name}, Price: ${prod.price}, Quantity: ${prod.quantity}`)
        })
    }

    restock(id: number, quantity: number): number {
        const product = this.products.find((prod: Product) => prod.id === id)
        if (!product) return 0;
        product.quantity += quantity;
        const indexP = this.products.findIndex((prod: Product) => prod.id === id)
        this.products[indexP] = product;
        return product.quantity
    }

    sell(id: number, quantity: number): number {
        const product = this.products.find((prod: Product) => prod.id === id)
        if (!product) return 0;
        if (product.quantity >= quantity) {
            product.quantity -= quantity;
            const indexP = this.products.findIndex((prod: Product) => prod.id === id)
            this.products[indexP] = product;
            console.log('Product Sold')
            return product.quantity
        } else {
            console.log('We dont have sufficient quantity')
        };
        return product.quantity;
    }

    createProduct(product: Product) {
        const productExist = this.products.find((prod: Product) => prod.id === product.id)
        if (!productExist) {
            this.products.push(product)
        }
    }
}

const productStock = new StockManagement();