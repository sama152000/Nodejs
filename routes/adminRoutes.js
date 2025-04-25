const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware'); 
const { allowRoles } = require('../middlewares/roleMiddleware'); 

router.use(protect, allowRoles('admin')); 

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

router.get('/products', adminController.getAllProducts);
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;