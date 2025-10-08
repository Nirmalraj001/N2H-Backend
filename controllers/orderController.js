const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (req.user.role !== 'admin' && String(order.userId) !== String(req.user._id)) {
      res.status(403);
      throw new Error('Not allowed to view this order');
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { products, totalPrice, shippingAddress } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      res.status(400);
      throw new Error('Order products are required');
    }
    const order = await Order.create({
      userId: req.user._id,
      products,
      totalPrice,
      shippingAddress,
    });

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true }
    );

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.status = status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

