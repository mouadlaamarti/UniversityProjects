const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  }
});
