import Category from '../models/Category.js';

export async function getCategories(req, res) {
  const categories = await Category.find({ isActive: true }).lean();
  // Build nested tree
  const idToNode = new Map(categories.map((c) => [String(c._id), { ...c, children: [] }]));
  const roots = [];
  for (const cat of idToNode.values()) {
    if (cat.parent) {
      const parentNode = idToNode.get(String(cat.parent));
      if (parentNode) parentNode.children.push(cat);
      else roots.push(cat);
    } else {
      roots.push(cat);
    }
  }
  res.json(roots);
}

export async function createCategory(req, res) {
  const category = await Category.create(req.body);
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
}

export async function deleteCategory(req, res) {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
}




