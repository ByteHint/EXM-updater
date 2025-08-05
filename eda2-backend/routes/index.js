const statusRoutes = require('../src/health/routes');
const userRoutes = require('../src/users/routes');
const validateAuth = require('../middlewares/validateAuth');
const getData = require('../middlewares/getData');

module.exports = (app) => {
  // Health check
  app.use('/status', statusRoutes);

  // Public user-related endpoints (login, register, OTP)
  app.use('/api/v1', userRoutes);

  // Authenticated user routes (profile, update, geo-tracking, etc.)
  app.use(
    '/api/v1/users',
    validateAuth.checkIfAuthenticated,
    getData.getGeoip,
    userRoutes
  );

  // Catch-all for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
};
