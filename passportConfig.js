const passport = require('passport');
require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const bcrypt = require('bcrypt');

passport.use(
    new LocalStrategy(
        { usernameField: 'username' },
        async (username, password, done) => {
            try {
                const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

                if (userResult.rows.length === 0) {
                    return done(null, false, { message: 'Incorrect username.'});
                }

                const user = userResult.rows[0];

                const isMatch = await bcrypt.compare(password, user.password_hash);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const userResult = await pool.query('SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2', ['google', profile.id]);

            if (userResult.rows.length > 0) {
                return done(null, userResult.rows[0]);
            } else {
                const newUserResult = await pool.query(`
                    INSERT INTO users (username, email, oauth_provider, oauth_id, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, NOW(), NOW())
                    RETURNING *`, [profile.displayName, profile.emails[0].value, 'google', profile.id]);

                return done(null, newUserResult.rows[0]);
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return done(null, false);
        }
        return done(null, userResult.rows[0]);
    } catch (err) {
        return done(err);
    }
});

module.exports = passport;