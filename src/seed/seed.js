import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

async function run() {
  await connectToDatabase();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const admin = await User.create({ name: 'Admin', email: 'admin@n2h.com', password: 'password', role: 'admin' });
  const user = await User.create({ name: 'User', email: 'user@n2h.com', password: 'password', role: 'user' });

  const catDry = await Category.create({ name: 'Dry Powders', slug: 'dry-powders' });
  const catSnacks = await Category.create({ name: 'Snacks', slug: 'snacks' });
  const catTea = await Category.create({ name: 'Tea Varieties', slug: 'tea-varieties' });

  await Product.insertMany([
    {
      name: 'Garam Masala 100g',
      slug: 'garam-masala-100g',
      description: 'Aromatic spice blend',
      category: catDry._id,
      images: [],
      tags: ['masala', 'spice'],
      price: 4.99,
      stock: 100,
    },
    {
      name: 'Masala Tea 250g',
      slug: 'masala-tea-250g',
      description: 'Rich spiced tea',
      category: catTea._id,
      images: [],
      tags: ['tea', 'masala'],
      price: 6.5,
      stock: 80,
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seeded:', { admin: admin.email, user: user.email });
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});




