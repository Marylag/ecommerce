const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser } = require('../controllers/authController.js');

router.post('/register', registerUser);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
    failureFlash: false
}));

router.get('/success', (req, res) => {
    res.send('Login successful!');
});

router.get('/failure', (req, res) => {
    res.send('Login failed.');
});

module.exports = router;