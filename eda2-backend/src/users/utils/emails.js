const { Resend } = require('resend');
const { render } = require('@react-email/render');
const OtpEmail = require('../emails/otpEmail'); // Ensure this is the correct path
const config = require('../../../config');

if (!config.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in config');
}

const resend = new Resend(config.RESEND_API_KEY);

const sendOTPEmail = async ({ email, otp }) => {
  const html = render(OtpEmail({ otp, email }));

  return await resend.emails.send({
    from: 'YourApp <no-reply@yourdomain.com>',
    to: email,
    subject: 'Your OTP for registration',
    html,
    text: `Your OTP is ${otp}. This code will expire in 5 minutes.`,
  });
};

module.exports = { sendOTPEmail };
