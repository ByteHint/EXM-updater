const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const schemes = require('../models/mongoose');
const { sendOTPEmail } = require('../utils/emails');

const { generateJWTToken, generate4DigitOTP } = require('../utils/otputils');

module.exports.signUp = async (req, res) => {
  const { password, email, hardwareId } = req.body;

  try {
    const existingUser = await schemes.User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'User already exists',
      });
    }

    const hashedPassword = Bcrypt.hashSync(password, 10);

    const otp = generate4DigitOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = new schemes.User({
      email,
      password: hashedPassword,
      hardwareId,
      oauthProvider: 'email',
      otp: otp,
      otpExpiresAt,
      isOtpVerified: false,
      otpAttempts: 0,
    });

    await newUser.save();

    sendOTPEmail({ email, otp });

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'User created. OTP sent to email.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  const { email, password, hardwareId } = req.body;

  try {
    const user = await schemes.User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid email or password',
      });
    }
    console.log('User found:', user);

    // Check if user has a password (OAuth users might not have one)
    if (!user.oauthProvider || user.oauthProvider !== 'email') {
      return res.status(400).json({
        success: false,
        status: 400,
        message:
          'This account uses social login. Please use Google or Discord to sign in.',
      });
    }

    const isPasswordValid = Bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid email or password',
      });
    }

    const isHardwareIdValid = user.hardwareId === hardwareId;
    if (!isHardwareIdValid) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Invalid hardware ID',
      });
    }

    if (!user.otpVerified) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Please verify your email first',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await user.save();

    const token = generateJWTToken(user);

    return res.status(200).json({
      success: true,
      status: 200,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Login failed',
      error: error.message,
    });
  }
};

module.exports.validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, config.API_KEY_JWT);
    const user = await schemes.User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await schemes.User.findById(userId).select(
      '-password -otp -otpExpiresAt -otpAttempts -isOtpVerified -tokenExpiresAt -hardwareId -__v'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
    });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, avatar } = req.body;

    const user = await schemes.User.findById(userId).select(
      '-password -otp -otpExpiresAt -otpAttempts -isOtpVerified -tokenExpiresAt -hardwareId -__v'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (username?.trim()) user.username = username.trim();
    if (avatar?.trim()) user.avatar = avatar.trim();

    await user.save();

    const updatedToken = generateJWTToken(user); // ensures token has fresh info

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      token: updatedToken,
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};
