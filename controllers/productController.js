const mongoose = require('mongoose');
const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 20, tags } = req.query;
    console.log({category})
    const filter = {};
    
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      const validIds = categories.filter((id) => mongoose.isValidObjectId(id));
      if (validIds.length > 0) {
        filter.category = { $in: validIds };
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : String(tags).split(',');
      filter.tags = { $in: tagList };
    }
    let query = Product.find(filter).populate('category', 'name slug');
    if (sort) {
      const sortMap = { price_asc: 'price', price_desc: '-price', newest: '-createdAt', rating: '-rating' };
      query = query.sort(sortMap[sort] || sort);
    }
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;
    const [items, total] = await Promise.all([
      query.skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

