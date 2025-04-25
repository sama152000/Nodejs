const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); 
const { allowRoles } = require('../middlewares/roleMiddleware'); 

router.post('/register', register);

router.post('/login', login);

router.post(
  '/some-protected-route',
  protect,
  allowRoles('admin'), 
  (req, res) => {
    res.json({ message: 'Welcome Admin' });
  }
);

module.exports = router;