const jwt = require('jsonwebtoken');
const config = require('../../../config');

const generate4DigitOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const generateJWTToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    },
    config.API_KEY_JWT,
    { expiresIn: config.TOKEN_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  generate4DigitOTP,
  generateJWTToken,
};
