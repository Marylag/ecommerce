const pool = require('../db');

const getAllOrders = async (req, res) => {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const ordersResult = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        if (ordersResult.rows.length === 0) {
            return res.status(404).json({ error: 'No orders found'});
        }

        res.json(ordersResult.rows);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    try {
        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderItemsResult = await pool.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [orderId]
        );

        res.json({
            order: orderResult.rows[0],
            items: orderItemsResult.rows
        });
    } catch (err) {
        console.error('Error retrieving order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllOrders,
    getOrderById
};