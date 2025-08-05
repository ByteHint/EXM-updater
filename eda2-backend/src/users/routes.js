const express = require('express');

const controller = require('./controller/index');
const validateSchemas = require('../../middlewares/validateSchemas');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const schemas = require('./utils/schemasValidation');

const router = express.Router();
router.post(
  '/signup',
  validateSchemas.inputs(schemas.signUp, 'body'),
  controller.signUp
);

router.post(
  '/login',
  validateSchemas.inputs(schemas.login, 'body'),
  controller.login
);

// Protected Routes
router.get('/validate-token', authenticateToken, controller.validateToken);

router.get('/profile', authenticateToken, controller.getUserProfile);

router.put(
  '/profile',
  authenticateToken,
  validateSchemas.inputs(schemas.updateProfile, 'body'),
  controller.updateUserProfile
);

// OAuth Routes
router.get('/auth/google', controller.googleAuth);
router.get('/auth/google/callback', controller.handleGoogleCallback);

router.get('/auth/discord', controller.discordAuth);
router.get('/auth/discord/callback', controller.handleDiscordCallback);

// Password Management Routes
router.post(
  '/forgot-password',
  validateSchemas.inputs(schemas.forgotPassword, 'body'),
  controller.forgotPassword
);

router.post(
  '/verify-otp',
  validateSchemas.inputs(schemas.verifyOtp, 'body'),
  controller.verifyOtp
);

router.post(
  '/reset-password',
  validateSchemas.inputs(schemas.resetPassword, 'body'),
  controller.resetPassword
);

router.post(
  '/resend-otp',
  validateSchemas.inputs(schemas.resendOtp, 'body'),
  controller.resendOtp
);

module.exports = router;
