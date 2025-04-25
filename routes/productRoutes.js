const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  protect,
  allowRoles('seller', 'admin'),
  upload.single('image'),
  productController.addProduct
);

router.put(
  '/:id',
  protect,
  allowRoles('seller', 'admin'),
  upload.single('image'),
  productController.updateProduct
);

router.delete(
  '/:id',
  protect,
  allowRoles('seller', 'admin'),
  productController.deleteProduct
);

module.exports = router;