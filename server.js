const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes')
const bulkOrderRoutes = require('./routes/bulkOrderRoutes');

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "*", // frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // allow cookies/authorization headers
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Dry & Tea Varieties Store API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/bulk-orders", bulkOrderRoutes);



// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

