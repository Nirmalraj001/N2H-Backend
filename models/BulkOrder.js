const mongoose = require('mongoose');

const BulkOrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // unit price
  subtotal: { type: Number, required: true }
});

const BulkOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [BulkOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BulkOrder', BulkOrderSchema);