const express = require('express');
const router = express.Router();
const {
    addItemToCart,
    getCurrentCart,
    removeItemFromCart,
    checkout,
    completeOrder
} = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);
router.get('/', getCurrentCart);
router.post('/items', addItemToCart);
router.delete('/items/:itemId', removeItemFromCart);
router.post('/checkout', checkout);
router.post('/order', completeOrder);

module.exports = router;