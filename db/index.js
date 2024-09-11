const { Pool } = require('pg');

const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'dev.env')
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


(async () => {
    const client = await pool.connect();
    try {
        const {rows} = await client.query('SELECT current_user');
        const currentUser = rows[0]['current_user']
        console.log(currentUser);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
})();

module.exports = pool;