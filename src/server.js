import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectToDatabase } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToDatabase();

  const server = http.createServer(app);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on port ${port} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});




