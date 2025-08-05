const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const schemes = require('../models/mongoose');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await schemes.User.findOne({
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });

        if (user) {
            // Update existing user with Google info if not already set
            if (!user.googleId) {
                user.googleId = profile.id;
                user.authProvider = user.authProvider ? `${user.authProvider},google` : 'google';
                await user.save();
            }
            return done(null, user);
        }

        // Create new user
        user = new schemes.User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value,
            isOtpVerified: true, // OAuth users are pre-verified
            authProvider: 'google',
            profile: {
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                locale: profile._json.locale,
                verified_email: profile._json.verified_email
            }
        });

        await user.save();
        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// Configure Discord OAuth Strategy
passport.use(new DiscordStrategy({
    clientID: config.DISCORD_CLIENT_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: config.DISCORD_REDIRECT_URI,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await schemes.User.findOne({
            $or: [
                { discordId: profile.id },
                { email: profile.email }
            ]
        });

        if (user) {
            // Update existing user with Discord info if not already set
            if (!user.discordId) {
                user.discordId = profile.id;
                user.authProvider = user.authProvider ? `${user.authProvider},discord` : 'discord';
                await user.save();
            }
            return done(null, user);
        }

        // Create new user
        user = new schemes.User({
            discordId: profile.id,
            email: profile.email,
            name: profile.username,
            avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            isOtpVerified: true, // OAuth users are pre-verified
            authProvider: 'discord',
            profile: {
                discriminator: profile.discriminator,
                verified: profile.verified,
                locale: profile.locale,
                mfa_enabled: profile.mfa_enabled
            }
        });

        await user.save();
        return done(null, user);
    } catch (error) {
        console.error('Discord OAuth error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await schemes.User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Generate JWT token for user
const generateJWTToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            authProvider: user.authProvider,
            name: user.name
        },
        config.API_KEY_JWT,
        { expiresIn: config.TOKEN_EXPIRES_IN || '7d' }
    );
};

// OAuth success handler
const handleOAuthSuccess = (req, res) => {
    try {
        const token = generateJWTToken(req.user);

        // For web applications, you might want to redirect to your frontend
        // with the token as a query parameter or set it as a cookie
        const frontendUrl = config.FRONTEND_URL || 'http://localhost:3000';

        // Option 1: Redirect with token in query (less secure but simple)
        // res.redirect(`${frontendUrl}/auth/callback?token=${token}`);

        // Option 2: Set secure cookie and redirect (more secure)
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect(`${frontendUrl}/auth/success`);
    } catch (error) {
        console.error('OAuth success handler error:', error);
        const frontendUrl = config.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
    }
};

// OAuth failure handler
const handleOAuthFailure = (req, res) => {
    const frontendUrl = config.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
};

module.exports = {
    passport,
    generateJWTToken,
    handleOAuthSuccess,
    handleOAuthFailure
};
