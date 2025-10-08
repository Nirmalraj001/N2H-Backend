const BulkOrder = require('../models/BulkOrder');

// POST /api/bulk-orders (create new bulk order from items)
exports.createBulkOrder = async (req, res) => {
  console.log('Creating bulk order:', req.body);  
  try {
    let { items, totalQuantity, totalPrice, status, userId } = req.body;

    // If items is wrapped in an object
    if (items && !Array.isArray(items) && items.items) {
      totalQuantity = items.totalQuantity || totalQuantity;
      totalPrice = items.totalPrice || totalPrice;
      status = items.status || status;
      items = items.items; // unwrap
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    const newOrder = new BulkOrder({
      userId: userId || req.user._id,   // ✅ match schema
      items,
      totalQuantity,
      totalPrice,
      status: status || "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/bulk-orders/:id (single bulk order)
exports.getBulkOrderById = async (req, res) => {
  try {
    const order = await BulkOrder.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bulk-orders (user’s bulk orders)
exports.getUserBulkOrders = async (req, res) => {
  try {
    const orders = await BulkOrder.find({ userId: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bulk-orders/:id (update order items or quantities before approval)
exports.updateBulkOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let order = await BulkOrder.findOne({ _id: req.params.id, userId: req.user.id });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== "pending") {
      return res.status(400).json({ message: 'Cannot update order once processing started' });
    }

    order.items = items.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.price * i.quantity
    }));
    order.totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    order.totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/bulk-orders/:id (cancel order)
exports.cancelBulkOrder = async (req, res) => {
  try {
    const order = await BulkOrder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== "pending") {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    await BulkOrder.findByIdAndDelete(order._id);
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBulkOrders = async (req, res) => {
  try {
    // Later you can add pagination, filters (status, date range, etc.)
    const orders = await BulkOrder.find()
      .populate('userId', 'name email')          // show user details
      .populate('items.productId', 'name price') // show product details
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bulk orders' });
  }
};

exports.updateBulkOrderStatus = async (req, res) => {
  try {
    const order = await BulkOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Bulk order not found" });
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

