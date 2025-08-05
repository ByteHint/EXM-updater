// Main controller index - imports all separated controllers
const authController = require('./authController');
const oauthController = require('./oauthController');
const passwordController = require('./passwordController');

// Export all controller functions
module.exports = {
  // Authentication controllers
  ...authController,

  // OAuth controllers
  ...oauthController,

  // Password & OTP controllers
  ...passwordController,
};
