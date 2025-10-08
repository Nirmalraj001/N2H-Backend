import Order from '../models/Order.js';

export async function getOrders(req, res) {
  const { user, status } = req.query;
  const filter = {};
  if (user) filter.user = user;
  if (status) filter.status = status;
  const orders = await Order.find(filter).populate('user').sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id).populate('user items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user.role !== 'admin' && String(order.user._id) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
}

export async function createOrder(req, res) {
  const order = await Order.create({ ...req.body, user: req.user._id, status: 'pending' });
  res.status(201).json(order);
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status ?? order.status;
  if (order.status === 'paid' && !order.paidAt) order.paidAt = new Date();
  if (order.status === 'delivered' && !order.deliveredAt) order.deliveredAt = new Date();
  await order.save();
  res.json(order);
}




