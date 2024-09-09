const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productsController');

router.get('/', getAllProducts);

router.get('/:productId', getProductById);

router.post('/', createProduct);

router.put('/:productId', updateProduct);

router.delete('/:productId', deleteProduct);

module.exports = router;