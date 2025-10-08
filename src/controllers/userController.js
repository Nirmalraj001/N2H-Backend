import User from '../models/User.js';

export async function getUsers(req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
}

export async function getUserById(req, res) {
  if (req.user.role !== 'admin' && String(req.user._id) !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function updateUser(req, res) {
  if (req.user.role !== 'admin' && String(req.user._id) !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const updates = { name: req.body.name, isActive: req.body.isActive };
  if (req.user.role === 'admin' && req.body.role) updates.role = req.body.role;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}




