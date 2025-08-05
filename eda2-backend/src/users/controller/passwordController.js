const Bcrypt = require('bcrypt');
const schemes = require('../models/mongoose');
const { sendOTPEmail } = require('../utils/emails');

const { generate4DigitOTP } = require('../utils/otputils');

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await schemes.User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    // Check if user uses OAuth only
    if (!user.password && user.authProvider !== 'email') {
      return res.status(400).json({
        success: false,
        status: 400,
        message:
          'This account uses social login. Please use Google or Discord to sign in.',
      });
    }

    const otp = generate4DigitOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    user.otpSecret = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    sendOTPEmail({ email, otp });

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Password reset OTP sent to your email',
    });
  } catch (error) {
    console.error('Error during forgot password:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to send reset code',
      error: error.message,
    });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await schemes.User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    // Check if OTP has expired
    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'OTP has expired',
      });
    }
    if (user.otpAttempts >= 3) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    const isValidOtp = user.otp === otp;

    if (!isValidOtp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid OTP',
      });
    }

    user.otpVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'OTP verification failed',
      error: error.message,
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await schemes.User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    if (!user.otpVerified) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'OTP not verified. Please verify your OTP first.',
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid new password. It must be at least 6 characters long.',
      });
    }

    const hashedPassword = Bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.otpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Password reset failed',
      error: error.message,
    });
  }
};

module.exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await schemes.User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    if (user.otpVerified) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'User is already verified',
      });
    }

    const otp = generate4DigitOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    console.error('Error during OTP resend:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to resend OTP',
      error: error.message,
    });
  }
};
