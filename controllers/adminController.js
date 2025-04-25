const User = require('../models/User');
const Product = require('../models/Product');

exports.getAllUsers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const users = await User.find()
        .select('-password')
        .skip((page - 1) * limit)
        .limit(limit);
      const totalUsers = await User.countDocuments();
  
      res.status(200).json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page
      });
    } catch (err) {
      res.status(500).json({ message: 'Error  in Get Users ', error: err.message });
    }
  };

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User has delete ' });
    } catch (err) {
        res.status(500).json({ message: ' Fail to delete ', error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const products = await Product.find()
        .populate('seller', 'username')
        .skip((page - 1) * limit)
        .limit(limit);
      const totalProducts = await Product.countDocuments();
  
      res.status(200).json({
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
      });
    } catch (err) {
      res.status(500).json({ message: ' Error in get prouducts  ', error: err.message });
    }
  };

// حذف منتج
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Produst deleted' });
    } catch (err) {
        res.status(500).json({ message: ' fail in delete prouduct ', error: err.message });
    }
};
