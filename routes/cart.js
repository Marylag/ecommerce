const express = require('express');
const router = express.Router();
const {
    createCart,
    addItemToCart,
    getCartById,
    updateCartItem,
    removeItemFromCart,
    checkoutCart
} = require('../controllers/cartController');

router.post('/', createCart);
router.post('/:cartId', addItemToCart);
router.get('/:cartId', getCartById);
router.put('/:cartId/items/:itemId', updateCartItem);
router.delete('/:cartId/items/:itemId', removeItemFromCart);
router.post('/:cartId/checkout', checkoutCart);

module.exports = router;
