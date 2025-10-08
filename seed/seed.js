const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Mock data
const mockUsers = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin', address: '123 Admin St' },
  { name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user', address: '456 Main St' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password', role: 'user', address: '789 Oak Ave' },
];

const mockCategories = [
  // Snacks / Laddus
  { name: 'Laddus & Snacks', slug: 'laddus-snacks', description: 'Traditional Indian sweets and snacks.', image: 'https://images.pexels.com/photos/1618918/pexels-photo-1618918.jpeg?auto=compress&cs=tinysrgb&w=800' },

  // Teas & Drinks
  { name: 'Herbal & Special Teas', slug: 'herbal-teas', description: 'Healthy, herbal, and special tea blends.', image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Spiced Drinks', slug: 'spiced-drinks', description: 'Traditional hot drinks with health benefits.', image: 'https://images.pexels.com/photos/5946082/pexels-photo-5946082.jpeg?auto=compress&cs=tinysrgb&w=800' },

  // Masalas & Mixes
  { name: 'Spice Mix & Podi', slug: 'spice-mix', description: 'Idly podi, rasam, masala and health mixes.', image: 'https://images.pexels.com/photos/4198940/pexels-photo-4198940.jpeg?auto=compress&cs=tinysrgb&w=800' },

  // Herbal / Health Powders
  { name: 'Herbal Powders', slug: 'herbal-powders', description: 'Herbal and natural powders for health & wellness.', image: 'https://images.pexels.com/photos/4199293/pexels-photo-4199293.jpeg?auto=compress&cs=tinysrgb&w=800' },

  // Vegetable Powders
  { name: 'Vegetable Powders', slug: 'vegetable-powders', description: 'Nutritious vegetable powders for cooking & health.', image: 'https://images.pexels.com/photos/3739127/pexels-photo-3739127.jpeg?auto=compress&cs=tinysrgb&w=800' },
];


// Products
const mockProducts = (categoryDocs) => [
  // --- Laddus ---
  {
    name: 'Black Urad Dal Laddu',
    description: 'Traditional sweet made with urad dal and jaggery.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 4.5,
    stock: 100,
    images: ['https://images.pexels.com/photos/1618918/pexels-photo-1618918.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'sweet'],
    rating: 4.6,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },
  {
    name: 'Moong Bean Laddu',
    description: 'Healthy laddus made with moong beans and jaggery.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 4.0,
    stock: 80,
    images: ['https://images.pexels.com/photos/461430/pexels-photo-461430.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'protein'],
    rating: 4.5,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },
  {
    name: 'Dry Fruits Laddu',
    description: 'Rich laddu packed with cashew, almond, fig and dates.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 6.5,
    stock: 60,
    images: ['https://images.pexels.com/photos/4198023/pexels-photo-4198023.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'dry-fruits'],
    rating: 4.9,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },
  {
    name: 'Coconut Laddu',
    description: 'Soft and delicious laddus made with coconut and jaggery.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 3.5,
    stock: 120,
    images: ['https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'coconut'],
    rating: 4.4,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },
  {
    name: 'Sesame Laddu',
    description: 'Nutritious til laddus made with sesame seeds and jaggery.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 3.0,
    stock: 150,
    images: ['https://images.pexels.com/photos/1184056/pexels-photo-1184056.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'sesame'],
    rating: 4.7,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },
  {
    name: 'Peanut Laddu',
    description: 'Crispy laddus made with roasted peanuts and jaggery.',
    category: categoryDocs.find((c) => c.slug === 'laddus-snacks')._id,
    price: 3.2,
    stock: 140,
    images: ['https://images.pexels.com/photos/1359335/pexels-photo-1359335.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['laddu', 'peanut'],
    rating: 4.5,
    variants: [{ name: 'Pack Size', options: ['250g', '500g'] }],
  },

  // --- Teas ---
  {
    name: 'Herbal Tea',
    description: 'Refreshing and healthy herbal tea blend.',
    category: categoryDocs.find((c) => c.slug === 'herbal-teas')._id,
    price: 5.5,
    stock: 100,
    images: ['https://images.pexels.com/photos/3739128/pexels-photo-3739128.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['tea', 'herbal'],
    rating: 4.8,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Pepper Milk',
    description: 'Spiced milk mix with black pepper for immunity.',
    category: categoryDocs.find((c) => c.slug === 'spiced-drinks')._id,
    price: 4.0,
    stock: 80,
    images: ['https://images.pexels.com/photos/5946082/pexels-photo-5946082.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['milk', 'pepper'],
    rating: 4.3,
    variants: [{ name: 'Pack Size', options: ['100g', '200g'] }],
  },
  {
    name: 'Avarampoo Tea',
    description: 'Traditional herbal tea made with avarampoo flowers.',
    category: categoryDocs.find((c) => c.slug === 'herbal-teas')._id,
    price: 5.0,
    stock: 70,
    images: ['https://images.pexels.com/photos/3739127/pexels-photo-3739127.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['tea', 'avarampoo'],
    rating: 4.6,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },

  // --- Masala & Spice Mix ---
  {
    name: 'Idly Podi',
    description: 'Spicy South Indian idly podi mix.',
    category: categoryDocs.find((c) => c.slug === 'spice-mix')._id,
    price: 2.5,
    stock: 150,
    images: ['https://images.pexels.com/photos/4198940/pexels-photo-4198940.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['podi', 'idly'],
    rating: 4.7,
    variants: [{ name: 'Pack Size', options: ['100g', '250g', '500g'] }],
  },
  {
    name: 'Multi Mix Masala',
    description: 'Versatile spice blend for multiple recipes.',
    category: categoryDocs.find((c) => c.slug === 'spice-mix')._id,
    price: 3.0,
    stock: 90,
    images: ['https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['masala', 'mix'],
    rating: 4.5,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Avarampoo Idly Podi',
    description: 'Healthy idly podi mix with avarampoo flower.',
    category: categoryDocs.find((c) => c.slug === 'spice-mix')._id,
    price: 3.2,
    stock: 90,
    images: ['https://images.pexels.com/photos/3739127/pexels-photo-3739127.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['podi', 'avarampoo'],
    rating: 4.6,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },

  // --- Herbal Powders ---
  {
    name: 'Kasthuri Manjal (Face)',
    description: 'Natural kasthuri turmeric for glowing skin.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 2.0,
    stock: 120,
    images: ['https://images.pexels.com/photos/3738650/pexels-photo-3738650.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['turmeric', 'skin'],
    rating: 4.8,
    variants: [{ name: 'Pack Size', options: ['50g', '100g'] }],
  },
  {
    name: 'Fenugreek Powder',
    description: 'Ground fenugreek seeds for health and cooking.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 1.8,
    stock: 140,
    images: ['https://images.pexels.com/photos/4199300/pexels-photo-4199300.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['fenugreek', 'health'],
    rating: 4.5,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Betel Leaf Powder',
    description: 'Herbal powder made from betel leaves.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 2.2,
    stock: 90,
    images: ['https://images.pexels.com/photos/2341290/pexels-photo-2341290.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['betel', 'herbal'],
    rating: 4.3,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Ginger Powder',
    description: 'Dry ginger powder for cooking and health.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 2.5,
    stock: 100,
    images: ['https://images.pexels.com/photos/4199299/pexels-photo-4199299.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['ginger', 'spices'],
    rating: 4.7,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Sukku Powder',
    description: 'Dry ginger (sukku) powder used in herbal remedies.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 2.5,
    stock: 100,
    images: ['https://images.pexels.com/photos/4199299/pexels-photo-4199299.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['sukku', 'ginger'],
    rating: 4.7,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Sukku Mali Coffee Powder',
    description: 'Traditional sukku-mali herbal coffee blend.',
    category: categoryDocs.find((c) => c.slug === 'spiced-drinks')._id,
    price: 3.5,
    stock: 90,
    images: ['https://images.pexels.com/photos/5946082/pexels-photo-5946082.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['coffee', 'sukku'],
    rating: 4.6,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Masala Tea Powder',
    description: 'Spiced tea blend with cardamom, ginger, and cloves.',
    category: categoryDocs.find((c) => c.slug === 'herbal-teas')._id,
    price: 4.0,
    stock: 120,
    images: ['https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['masala', 'tea'],
    rating: 4.8,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Bitter Gourd Powder',
    description: 'Healthy karela (bitter gourd) powder for sugar control.',
    category: categoryDocs.find((c) => c.slug === 'herbal-powders')._id,
    price: 2.0,
    stock: 100,
    images: ['https://images.pexels.com/photos/4199301/pexels-photo-4199301.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['bitter-gourd', 'health'],
    rating: 4.2,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },

  // --- Vegetable Powders ---
  {
    name: 'Beetroot Powder',
    description: 'Natural beetroot powder rich in iron.',
    category: categoryDocs.find((c) => c.slug === 'vegetable-powders')._id,
    price: 2.5,
    stock: 110,
    images: ['https://images.pexels.com/photos/4199298/pexels-photo-4199298.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['beetroot', 'vegetable'],
    rating: 4.4,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
  {
    name: 'Carrot Powder',
    description: 'Natural carrot powder rich in beta-carotene.',
    category: categoryDocs.find((c) => c.slug === 'vegetable-powders')._id,
    price: 2.2,
    stock: 120,
    images: ['https://images.pexels.com/photos/4199297/pexels-photo-4199297.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['carrot', 'vegetable'],
    rating: 4.3,
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }],
  },
];



const seed = async () => {
  await connectDB();
  await mongoose.connection.db.dropDatabase();

  // Users
  const usersToInsert = await Promise.all(
    mockUsers.map(async (u) => ({
      name: u.name,
      email: u.email,
      passwordHash: await bcrypt.hash(u.password, 10),
      role: u.role,
      address: u.address,
    }))
  );
  const insertedUsers = await User.insertMany(usersToInsert);

  // Categories
  const insertedCategories = await Category.insertMany(mockCategories);

  // Products
  const insertedProducts = await Product.insertMany(mockProducts(insertedCategories));

  // Orders (mock)
  const userJohn = insertedUsers.find((u) => u.email === 'john@example.com');
  const p1 = insertedProducts[0];
  const p2 = insertedProducts[1];
  await Order.insertMany([
    {
      userId: userJohn._id,
      products: [
        { productId: p1._id, productName: p1.name, quantity: 2, price: p1.price, image: p1.images[0] || '' },
        { productId: p2._id, productName: p2.name, quantity: 1, price: p2.price, image: p2.images[0] || '' },
      ],
      status: 'processing',
      totalPrice: (p1.price * 2 + p2.price).toFixed(2),
      shippingAddress: userJohn.address,
    },
  ]);

  console.log('Database seeded successfully');
  process.exit(0);
};

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seed };

