const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);