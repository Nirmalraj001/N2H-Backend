const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, parentCategory, description, image } = req.body;
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) {
      res.status(400);
      throw new Error('Category with same name or slug already exists');
    }
    const category = await Category.create({ name, slug, parentCategory: parentCategory || null, description, image });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

