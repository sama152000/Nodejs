const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware'); // ✅ استدعاء دالة الحماية
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);

router.post('/follow/:sellerId', protect, userController.followSeller);
router.post('/unfollow/:sellerId', protect, userController.unfollowSeller);
router.get('/following-products', protect, userController.getFollowingProducts);

module.exports = router;
