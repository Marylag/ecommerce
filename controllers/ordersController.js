const pool = require('../db');

const getAllOrders = async (req, res) => {
    const userId = req.user.id;
    console.log('Fetching orders for user ID:', userId);
    try {
        const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        res.status(200).json(orders.rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    try {
        const orderData = await pool.query(
            `SELECT o.*, oi.*
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.id = $1 AND o.user_id = $2`, [orderId, userId]
        );

        if (orderData.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(orderData.rows);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllOrders,
    getOrderById
};