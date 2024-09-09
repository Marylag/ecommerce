const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById } = require('../controllers/ordersController');
const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);

router.get('/', getAllOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
