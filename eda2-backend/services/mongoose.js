const mongoose = require('mongoose');
const config = require('../config');

const dbUrl = config.MONGODB_URI;

const connectOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(dbUrl, connectOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Server will continue without database connection');
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying in 5 seconds...');
  setTimeout(() => mongoose.connect(dbUrl, connectOptions), 5000);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed on app termination');
  process.exit(0);
});

module.exports = mongoose;
