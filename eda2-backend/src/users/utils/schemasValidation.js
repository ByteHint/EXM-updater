const { z } = require('zod');

const email = z.email();
const password = z.string().min(6, 'Password must be at least 8 characters');
const otp = z.string().length(4).regex(/^\d+$/, 'OTP must be 4 digits');
const refreshToken = z.string().min(10);
const hardwareId = z.string().min(10, 'Hardware ID is required');

// All schemas
const schemas = {
  signUp: z.object({
    email,
    password,
    hardwareId,
  }),

  login: z.object({
    email,
    password,
    hardwareId,
  }),

  forgotPassword: z.object({
    email,
  }),

  verifyOtp: z.object({
    email,
    otp,
  }),

  resetPassword: z.object({
    email,
    newPassword: password,
    hardwareId,
  }),

  resendOtp: z.object({
    email,
  }),

  updateProfile: z.object({
    username: z.string().min(2).max(50).optional(),
    avatar: z.url().optional(),
  }),

  refreshToken: z.object({
    refreshToken,
    hardwareId,
  }),

  googleOAuthCallback: z.object({
    code: z.string().min(5),
    state: z.string().optional(),
    hardwareId,
  }),

  discordOAuthCallback: z.object({
    code: z.string().min(5),
    state: z.string().optional(),
    hardwareId,
  }),
};

module.exports = schemas;
