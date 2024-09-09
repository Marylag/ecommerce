const pool = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getCurrentCart = async (req, res) => {
    const userId = req.user.id;
    try {
        console.log('Fetching cart for user:', userId);
        const cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND completed = FALSE', [userId]);

        if (cart.rows.length > 0) {
            const cartId = cart.rows[0].id;
            console.log('Cart found with ID:', cartId);

            const items = await pool.query(`
                SELECT 
                    ci.id, 
                    ci.quantity, 
                    p.id AS product_id, 
                    p.name AS product_name, 
                    p.price, 
                    p.image_url 
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = $1
            `, [cartId]);
            console.log('Cart items:', items.rows);
            
            if (items.rows.length > 0) {
                res.json(items.rows);
            } else {
                res.json([]);
            }
        } else {
            console.log('No active cart found for user:', userId);
            res.json([]);
        }
    } catch (err) {
        console.error('Error retrieving cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addItemToCart = async (req, res) => {
    console.log(req.user);

    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND completed = FALSE', [userId]);

        if (cart.rows.length === 0) {
            cart = await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId]);
        }

        const cartId = cart.rows[0].id;

        const cartItem = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);

        if (cartItem.rows.length > 0) {
            await pool.query('UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3', [quantity, cartId, productId]);
        } else {
            await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
                [cartId, productId, quantity]);
        }

        res.json({ message: 'Item added to cart' });
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const removeItemFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    try {
        const cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND completed = FALSE', [userId]);

        if (cart.rows.length > 0) {
            const cartId = cart.rows[0].id;
            const item = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND id = $2', [cartId, itemId]);

            if (item.rows.length === 0) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            await pool.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
            res.json({ message: 'Item removed from cart' });
        } else {
            res.status(400).json({ message: 'No active cart found' });
        }
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkout = async (req, res) => {
    const userId = req.user.id;
    const { cartItems } = req.body;

    try {
        // Calculate the total amount in cents
        let totalAmount = cartItems.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);

        totalAmount = Math.round(totalAmount * 100);

        // Create the payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        // Send clientSecret to the frontend for Stripe confirmation
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const completeOrder = async (req, res) => {
    const userId = req.user.id;
    const { paymentIntentId, cartItems } = req.body;

    try {
        // Verify the payment intent status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment not completed' });
        }

        // Get the user's active cart
        const cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND completed = FALSE', [userId]);
        if (cart.rows.length === 0) {
            return res.status(400).json({ message: 'No active cart found' });
        }

        const cartId = cart.rows[0].id;

        // Create a new order
        const orderResult = await pool.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *', 
            [userId, paymentIntent.amount / 100, 'completed']
        );
        const orderId = orderResult.rows[0].id;

        // Transfer cart items to the order
        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', 
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Mark the cart as completed and clear cart items
        await pool.query('UPDATE cart SET completed = TRUE WHERE id = $1', [cartId]);
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

        res.status(200).json({ message: 'Order completed successfully', orderId });
    } catch (err) {
        console.error('Error completing order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    checkout,
    addItemToCart,
    getCurrentCart,
    removeItemFromCart,
    completeOrder
};
