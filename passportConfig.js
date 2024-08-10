const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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