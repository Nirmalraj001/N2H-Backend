const express = require('express');
const { register, login, forgotPassword, getCurrentUser,
    changePassword, } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, changePassword);

module.exports = router;

