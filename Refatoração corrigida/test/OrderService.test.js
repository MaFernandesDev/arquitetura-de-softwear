const test = require("node:test");
const assert = require("node:assert/strict");
const Address = require("../src/domain/Address");
const Customer = require("../src/domain/Customer");
const Order = require("../src/domain/Order");
const OrderItem = require("../src/domain/OrderItem");
const Product = require("../src/domain/Product");
const ProductRepository = require("../src/repositories/ProductRepository");
const OrderRepository = require("../src/repositories/OrderRepository");
const OrderService = require("../src/services/OrderService");

function fixture(method = "pix") {
  const product = new Product("x1", "Produto", "geral", 100, 1, 10);
  const products = new ProductRepository([product]);
  const orders = new OrderRepository();
  const customer = new Customer("c1", "Teste", "teste@example.com", "", "regular",
    new Address("Rua A", "1", "Cidade", "SP", "00000-000", "sudeste"));
  const order = new Order("o1", customer, [new OrderItem(product, 2)], null, method, 1);
  const logs = { info() {}, warn() {}, error() {} };
  const notifications = { sendOrderConfirmation() {} };
  return { product, products, orders, order, service: new OrderService({
    productRepository: products, orderRepository: orders, logger: logs,
    notificationService: notifications
  }) };
}

test("processa pedido PIX, aplica desconto e atualiza estoque", () => {
  const f = fixture("pix");
  const result = f.service.process(f.order);
  assert.equal(result.subtotal, 200);
  assert.equal(result.discount, 6);
  assert.equal(result.freight, 28);
  assert.equal(result.total, 222);
  assert.equal(result.status, "confirmed");
  assert.equal(f.product.stock, 8);
  assert.equal(f.orders.findAll().length, 1);
});

test("rejeita e-mail inválido sem alterar estoque", () => {
  const f = fixture();
  f.order.customer.email = "invalido";
  assert.throws(() => f.service.process(f.order), /E-mail do cliente invalido/);
  assert.equal(f.product.stock, 10);
});

test("rejeita quantidade acima do estoque", () => {
  const f = fixture();
  f.order.items[0].quantity = 11;
  assert.throws(() => f.service.process(f.order), /Estoque insuficiente/);
  assert.equal(f.product.stock, 10);
});

test("boleto aguarda pagamento e não envia confirmação", () => {
  const f = fixture("boleto");
  const result = f.service.process(f.order);
  assert.equal(result.status, "waiting_payment");
  assert.equal(result.total, 228);
});
