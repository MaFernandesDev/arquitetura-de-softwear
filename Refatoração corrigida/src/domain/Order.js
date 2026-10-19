class Order {
  constructor(id, customer, items, couponCode, paymentMethod, installments) {
    Object.assign(this, { id, customer, items, couponCode, paymentMethod, installments });
    this.status = "created";
    this.createdAt = new Date();
  }
  getTotalItems() { return this.items.reduce((total, item) => total + item.getQuantity(), 0); }
  getSubtotal() { return this.items.reduce((total, item) => total + item.getSubtotal(), 0); }
  getTotalWeight() { return this.items.reduce((total, item) => total + item.getTotalWeight(), 0); }
}
module.exports = Order;
