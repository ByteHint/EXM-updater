function renderOTPEmail(otp, email) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          color: #333;
        }
        .container {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #007BFF;
          letter-spacing: 5px;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>OTP Verification</h2>
        <p>Hello <strong>${email}</strong>,</p>
        <p>Your OTP code is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for <strong>5 minutes</strong>. Do not share this with anyone.</p>
        <p class="footer">If you didn’t request this, you can ignore this email.</p>
        <p class="footer">— EXM Team</p>
      </div>
    </body>
  </html>
  `;
}

module.exports = renderOTPEmail;
