const ProductRepository = require("../repositories/ProductRepository");
const OrderRepository = require("../repositories/OrderRepository");
const NotificationService = require("./NotificationService");
const DiscountService = require("./DiscountService");
const FreightService = require("./FreightService");
const PaymentService = require("./PaymentService");
const Logger = require("../utils/Logger");

class OrderService {
  constructor({
    productRepository = new ProductRepository(),
    orderRepository = new OrderRepository(),
    notificationService = new NotificationService(),
    discountService = new DiscountService(),
    freightService = new FreightService(),
    paymentService = new PaymentService(),
    logger = new Logger()
  } = {}) {
    Object.assign(this, { productRepository, orderRepository, notificationService,
      discountService, freightService, paymentService, logger });
  }

  validate(order) {
    if (!order.customer) throw new Error("Cliente obrigatorio.");
    const email = order.customer.email;
    if (!email || !email.includes("@")) throw new Error("E-mail do cliente invalido.");
    if (!order.items || order.items.length === 0) throw new Error("Pedido sem itens.");
    for (const item of order.items) {
      if (!item.product) throw new Error("Item sem produto.");
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) throw new Error("Quantidade invalida.");
      const product = this.productRepository.findById(item.getProductId());
      if (!product) throw new Error(`Produto ${item.getProductId()} nao encontrado.`);
      if (product.stock < item.quantity) throw new Error(`Estoque insuficiente para ${product.name}.`);
    }
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);
    this.validate(order);
    const subtotal = order.getSubtotal();
    const discount = this.discountService.calculate(order, subtotal);
    const freight = this.freightService.calculate(order);
    const payment = this.paymentService.process(order, subtotal);
    const total = Number((subtotal - discount + freight + payment.fee).toFixed(2));
    if (total <= 0) throw new Error("Total do pedido invalido.");

    // Valida todos os itens antes de alterar estoque; reduz risco de atualização parcial.
    for (const item of order.items) this.productRepository.updateStock(item.getProductId(), item.quantity);
    order.status = payment.status === "approved" ? "confirmed" : "waiting_payment";
    const customer = order.customer;
    const address = customer.address;
    const orderSummary = {
      id: order.id, customerName: customer.name, customerEmail: customer.email,
      city: address.city, state: address.state,
      items: order.items.map(item => ({
        productId: item.getProductId(), name: item.getProductName(),
        quantity: item.getQuantity(), subtotal: item.getSubtotal()
      })),
      subtotal, discount: Number(discount.toFixed(2)), freight: Number(freight.toFixed(2)),
      paymentFee: Number(payment.fee.toFixed(2)), total,
      paymentMethod: order.paymentMethod, status: order.status, createdAt: order.createdAt
    };
    this.orderRepository.save(orderSummary);
    if (order.status === "confirmed") this.notificationService.sendOrderConfirmation(customer, order.id, total);
    else this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    this.logger.info(`Pedido ${order.id} processado. Total: R$ ${total.toFixed(2)}.`);
    return orderSummary;
  }
}
module.exports = OrderService;
