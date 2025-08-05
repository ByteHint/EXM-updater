require('dotenv').config();

const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || '7d',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,

  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Session Configuration
  SESSION_SECRET:
    process.env.SESSION_SECRET || 'your-secret-key-change-in-production',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = config;
