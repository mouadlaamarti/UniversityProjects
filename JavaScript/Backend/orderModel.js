const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;