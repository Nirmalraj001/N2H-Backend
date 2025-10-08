const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort('name');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Allow self-update or admin
    if (req.user.role !== 'admin' && String(req.user._id) !== String(req.params.id)) {
      res.status(403);
      throw new Error('Not allowed to update this user');
    }
    const updates = { name: req.body.name, address: req.body.address, role: req.body.role };
    if (req.user.role !== 'admin') {
      delete updates.role; // regular users cannot change role
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

