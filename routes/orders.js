const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById } = require('../controllers/ordersController');

router.get('/', getAllOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
