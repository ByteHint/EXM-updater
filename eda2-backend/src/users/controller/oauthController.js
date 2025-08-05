const axios = require('axios');
const config = require('../../../config');
const { User } = require('../models/mongoose');
const crypto = require('crypto');
const { generateJWTToken } = require('../utils/otputils');

const tempStore = new Map();

module.exports.googleAuth = async (req, res) => {
  // const { hardwareId } = req.body;

  // if (!hardwareId) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Hardware ID is required',
  //   });
  // }

  try {
    const state = crypto.randomBytes(16).toString('hex');

    // Store the hardwareId temporarily mapped to state
    // tempStore.set(state, hardwareId);

    const googleAuthUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );
    googleAuthUrl.searchParams.append('client_id', config.GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append(
      'redirect_uri',
      config.GOOGLE_REDIRECT_URI
    );
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    googleAuthUrl.searchParams.append('state', state); // this carries the hardwareId indirectly

    return res.status(200).json({
      success: true,
      authUrl: googleAuthUrl.toString(),
      state,
    });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Google auth URL',
      error: error.message,
    });
  }
};
// your_backend/controllers/authController.js

module.exports.handleGoogleCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    // For errors, you can also redirect to a failure page if you want,
    // but sending JSON is okay for the error case.
    return res.status(400).json({
      success: false,
      message: 'Authorization code and state are required',
    });
  }

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.GOOGLE_REDIRECT_URI,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = userResponse.data;

    let user = await User.findOne({
      $or: [
        { oauthProvider: 'google', oauthId: userInfo.id },
        { email: userInfo.email },
      ],
    });

    if (user) {
      user.oauthProvider = 'google';
      user.oauthId = user.oauthId || userInfo.id;
      user.avatar = user.avatar || userInfo.picture;
      user.username = user.username || userInfo.name;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = new User({
        oauthProvider: 'google',
        oauthId: userInfo.id,
        email: userInfo.email,
        username: userInfo.name,
        avatar: userInfo.picture,
        otpVerified: true,
        isVerified: true,
        lastLogin: new Date(),
      });
      await user.save();
    }

    const token = generateJWTToken(user);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        oauthProvider: user.oauthProvider,
      },
    });
  } catch (error) {
    console.error('Error during Google auth callback:', error);
    return res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message,
    });
  }
};

module.exports.discordAuth = async (req, res) => {
  const { hardwareId } = req.body;

  if (!hardwareId) {
    return res.status(400).json({
      success: false,
      message: 'Hardware ID is required',
    });
  }

  try {
    const state = Math.random().toString(36).substring(2, 15);
    tempStore.set(state, hardwareId);

    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');

    discordAuthUrl.searchParams.append('client_id', config.DISCORD_CLIENT_ID);
    discordAuthUrl.searchParams.append(
      'redirect_uri',
      config.DISCORD_REDIRECT_URI
    );
    discordAuthUrl.searchParams.append('response_type', 'code');
    discordAuthUrl.searchParams.append('scope', 'identify email');
    discordAuthUrl.searchParams.append('state', state);

    return res.status(200).json({
      success: true,
      authUrl: discordAuthUrl.toString(),
      state, // Optional: save to DB/session to verify later
    });
  } catch (error) {
    console.error('Error generating Discord auth URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Discord auth URL',
      error: error.message,
    });
  }
};

module.exports.handleDiscordCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code is required',
    });
  }

  const sessionData = tempStore.get(state);
  tempStore.delete(state);

  if (!sessionData) {
    return res.status(400).json({
      success: false,
      message: 'Hardware ID not found for this session',
    });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: config.DISCORD_CLIENT_ID,
        client_secret: config.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.DISCORD_REDIRECT_URI,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = tokenRes.data;

    // Step 2: Fetch user info from Discord
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userRes.data;

    // Step 3: Upsert user in DB
    let user = await User.findOne({
      $or: [
        { oauthProvider: 'discord', oauthId: userInfo.id },
        { email: userInfo.email },
      ],
    });

    const avatarUrl = userInfo.avatar
      ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
      : null;

    if (user) {
      user.oauthId = user.oauthId || userInfo.id;
      user.oauthProvider = 'discord';
      user.avatar = user.avatar || avatarUrl;
      user.email = user.email || userInfo.email;
      user.username =
        user.username || userInfo.global_name || userInfo.username;
      user.hardwareId = user.hardwareId || sessionData;
      user.password = null;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        oauthId: userInfo.id,
        oauthProvider: 'discord',
        email: userInfo.email,
        password: null,
        username: userInfo.global_name || userInfo.username,
        avatar: avatarUrl,
        isVerified: true,
        hardwareId: sessionData,
        lastLogin: new Date(),
      });
    }

    // Step 4: Generate token and respond
    const token = generateJWTToken(user);

    return res.status(200).json({
      success: true,
      message: 'Discord authentication successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error(
      'Error during Discord auth callback:',
      error?.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: 'Discord authentication failed',
      error: error.message,
    });
  }
};
