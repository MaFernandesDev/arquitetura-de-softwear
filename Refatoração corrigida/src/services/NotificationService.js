class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log(`[NOTIFICACAO] Confirmacao enviada para ${customer.email}: pedido ${orderId}, total R$ ${total.toFixed(2)}.`);
  }
}
module.exports = NotificationService;
