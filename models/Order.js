const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'cash_on_delivery' },
});

module.exports = mongoose.model('Order', orderSchema);