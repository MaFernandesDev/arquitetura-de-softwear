class OrderItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }
  getProduct() { return this.product; }
  getProductId() { return this.product?.getId?.() ?? this.product?.id; }
  getProductName() { return this.product?.getName?.() ?? this.product?.name; }
  getQuantity() { return this.quantity; }
  getSubtotal() { return this.product.price * this.quantity; }
  getTotalWeight() { return this.product.weight * this.quantity; }
}
module.exports = OrderItem;
