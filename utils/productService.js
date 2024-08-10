const pool = require('../db');

const getProductPrice = async (productId) => {
    try {
        const result = await pool.query('SELECT price FROM products WHERE id = $1', [productId]);

        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }

        return result.rows[0].price;
    } catch (err) {
        console.error('Error fetching product proce:', err);
        throw err;
    }
};

module.exports = {
    getProductPrice,
};
