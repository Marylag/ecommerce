const express = require('express');
const router = express.Router();
const passport = require('../passportConfig.js');
const jwt = require('jsonwebtoken');
const { registerUser } = require('../controllers/authController.js');

router.post('/register', registerUser);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Login failed' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ 
                message: 'Login successful',
                token: token
            });
        });
    }) (req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/home?token=${token}`);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }

        req.session = null;
        res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = router;
