const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../src/users/models/mongoose');

// Helper to decode and fetch user from token
const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, config.API_KEY_JWT);
  const user = await User.findById(decoded.id);
  if (!user || user.banReason) return null;

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };
};

// Required auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Access token is required' });
    }

    const token = authHeader.split(' ')[1];
    const userData = await getUserFromToken(token);

    if (!userData) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token or user banned' });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('[Auth Error]:', error);

    const isTokenExpired = error.name === 'TokenExpiredError';
    return res.status(403).json({
      success: false,
      message: isTokenExpired ? 'Token expired' : 'Invalid or expired token',
    });
  }
};

module.exports = {
  authenticateToken,
};
