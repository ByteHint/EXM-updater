const jwt = require('jsonwebtoken');
const config = require('../config');

const checkIfAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
        status: 401,
      });
    }

    const decoded = jwt.verify(token, config.API_KEY_JWT);

    req.user = decoded; // optionally validate user from DB too
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({
      message: 'Invalid or expired token',
      status: 401,
    });
  }
};

module.exports = { checkIfAuthenticated };
