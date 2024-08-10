const pool = require('../db');
const { getProductById } = require('./productsController');
const { getProductPrice } = require('../utils/productService');

const createCart = async (req, res) => {
    const { user_id } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
            [user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addItemToCart = async (req, res) => {
    const { cartId } = req.params;
    const { product_id, quantity } = req.body;

    try {
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cartId, product_id]
        );

        if (existingItem.rows.length > 0) {
            const updatedItem = await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1, updated_at = NOW() WHERE cart_id = $2 AND product_id = $3 RETURNING *',
                [quantity, cartId, product_id]
            );
            return res.json(updatedItem.rows[0]);
        }

        const result = await pool.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [cartId, product_id, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCartById = async (req, res) => {
    const { cartId } = req.params;

    try {
        const cartResult = await pool.query('SELECT * FROM cart WHERE id = $1', [cartId]);
        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);

        res.json({
            cart: cartResult.rows[0],
            items: itemsResult.rows
        });
    } catch (err) {
        console.error('Error retrieving cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateCartItem = async (req, res) => {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    try {
        console.log(`Updating item in cart. cartId: ${cartId}, itemId: ${itemId}, quantity: ${quantity}`);

        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE cart_id = $2 AND id = $3 RETURNING *',
            [quantity, cartId, itemId]
        );

        if (result.rows.length === 0) {
            console.error(`Item not found in cart. cartId: ${cartId}, itemId: ${itemId}`);
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const removeItemFromCart = async (req, res) => {
    const { cartId, itemId } = req.params;

    try {
        console.log(`Removing item from cart. cartId: ${cartId}, itemId: ${itemId}`);

        const result = await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND id = $2 RETURNING *',
            [cartId, itemId]
        );

        if (result.rows.length === 0) {
            console.error(`Item not found in cart. cartId: ${cartId}, itemId: ${itemId}`);
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart', item: result.rows[0] });
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkoutCart = async (req, res) => {
    const { cartId } = req.params;
    const { user_id, payment_method } = req.body;

    try {
        // Validate the cart
        const cartResult = await pool.query('SELECT * FROM cart WHERE id = $1', [cartId]);
        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Retrieve cart items
        const itemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
        if (itemsResult.rows.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Simulate payment
        const paymentSuccess = false;
        if (!paymentSuccess) {
            return res.status(402).json({ error: 'Payment failed' });
        }

        // Calculate the total price and prepare order items
        let totalPrice = 0;
        const orderItems = [];

        for (let item of itemsResult.rows) {
            const price = await getProductPrice(item.product_id);
            totalPrice += item.quantity * price;
            orderItems.push({ product_id: item.product_id, quantity: item.quantity, price });
        }

        // Create the order
        const orderResult = await pool.query(
            'INSERT INTO orders (user_id, total_price, status, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [user_id, totalPrice, 'completed']
        );
        const order = orderResult.rows[0];

        // Insert order items
        for (let item of orderItems) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        // Clear the cart
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

        // Respond with the order details
        res.json({
            message: 'Checkout successful',
            order: order,
            items: orderItems
        });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createCart,
    addItemToCart,
    getCartById,
    updateCartItem,
    removeItemFromCart,
    checkoutCart
};
