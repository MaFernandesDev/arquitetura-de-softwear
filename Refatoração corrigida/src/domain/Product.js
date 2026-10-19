class Product {
  constructor(id, name, category, price, weight, stock) {
    Object.assign(this, { id, name, category, price, weight, stock });
  }
  getId() { return this.id; }
  getName() { return this.name; }
  getPrice() { return this.price; }
  getWeight() { return this.weight; }
  getStock() { return this.stock; }
  decreaseStock(quantity) {
    if (quantity <= 0) throw new Error("Quantidade invalida.");
    if (this.stock < quantity) throw new Error(`Estoque insuficiente para ${this.name}.`);
    this.stock -= quantity;
  }
}
module.exports = Product;
