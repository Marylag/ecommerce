const pool = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { username, password, first_name, last_name } = req.body;

    try {
        const userCheckQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const userCheckResult = await pool.query(userCheckQuery, [username, email]);

        if (userCheckResult.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        const insertUserQuery = `
        INSERT INTO users (username, email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, username, email, first_name, last_name
        `;
        const insertUserResult = await pool.query(insertUserQuery, [
            username,
            email,
            hashedPassword,
            first_name,
            last_name,
        ]);

        const newUser = insertUserResult.rows[0];

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error'});
    }
};

module.exports = { registerUser };