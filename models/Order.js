const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: '' },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
    shippingAddress: {
      id: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

