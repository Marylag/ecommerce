const pool = require('../db');

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, first_name, last_name, created_at FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query('SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserById = async (req, res) => {
    const { userId } = req.params;
    const { username, email, first_name, last_name } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, updated_at = NOW() WHERE id = $5 RETURNING id, username, email, first_name, last_name',
            [username, email, first_name, last_name, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserById
};
