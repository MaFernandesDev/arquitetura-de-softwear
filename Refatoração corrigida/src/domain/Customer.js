class Customer {
  constructor(id, name, email, phone, type, address) {
    Object.assign(this, { id, name, email, phone, type, address });
  }
  getName() { return this.name; }
  getEmail() { return this.email; }
  getType() { return this.type; }
  getAddress() { return this.address; }
}
module.exports = Customer;
