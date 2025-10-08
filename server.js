const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bulkOrderRoutes = require('./routes/bulkOrderRoutes');

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

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

// Bind server to 0.0.0.0 for Render
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const server = http.createServer(app);

server.keepAliveTimeout = 120000; // 120s
server.headersTimeout = 120000;

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});

module.exports = app;
