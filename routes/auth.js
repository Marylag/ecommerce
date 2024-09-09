const express = require('express');
const router = express.Router();
const passport = require('../passportConfig.js');
const jwt = require('jsonwebtoken');
const { registerUser } = require('../controllers/authController.js');
require('dotenv').config();
const pool = require('../db');

router.post('/register', registerUser);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        req.login(user, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Login failed' });
            }

            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/auth/refresh-token',
            });

            return res.status(200).json({ 
                message: 'Login successful',
                token: accessToken
            });
        });
    }) (req, res, next);
});

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.id;

        // Verify refresh token from the database
        const result = await pool.query('SELECT refresh_token FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0 || result.rows[0].refresh_token !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Update refresh token in DB
        await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [newRefreshToken, userId]);

        // Send new tokens
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/refresh-token',
        });

        return res.status(200).json({ token: newAccessToken });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate token after successful authentication
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect to frontend with the token
    res.redirect(`http://localhost:3000/home?token=${token}`);
});


router.get('/logout', async (req, res) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [decoded.id]);
        res.clearCookie('refreshToken');
    }

    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to destroy session' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});

module.exports = router;
