const mongoose = require('../../../services/mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.oauthProvider;
      },
    },

    oauthProvider: {
      type: String,
      enum: ['google', 'discord', "email"],
      default: 'email',
    },

    oauthId: {
      type: String,
      default: null,
      index: true,
    },

    username: {
      type: String,
      default: '',
    },

    avatar: {
      type: String,
      default: '',
    },

    hardwareId: {
      type: String,
      required: false,
      unique: true,
      index: true,
    },

    // Token-based session
    accessToken: {
      type: String,
      default: null,
    },

    tokenExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP Verification
    otp: {
      type: String, // Store hashed OTP for security
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    // Admin / system fields
    lastLogin: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for oauth logins
userSchema.index({ oauthProvider: 1, oauthId: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User };
