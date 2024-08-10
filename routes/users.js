const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUserById
} = require('../controllers/usersController');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);

module.exports = router;