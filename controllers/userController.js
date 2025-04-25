const User = require('../models/User');
const Product = require('../models/Product');

exports.getUsers = (req, res) => {
  res.send('List of users');
};

exports.followSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const user = await User.findById(req.user.id);
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (seller.role !== 'seller') {
      return res.status(400).json({ message: 'You can only follow sellers' });
    }

    if (!user.following.some(id => id.toString() === sellerId)) {
      user.following.push(sellerId);
      await user.save();
    }

    res.status(200).json({ message: 'Seller followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while following the seller', error });
  }
};

exports.unfollowSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const user = await User.findById(req.user.id);

    user.following = user.following.filter(id => id.toString() !== sellerId);
    await user.save();

    res.status(200).json({ message: 'Seller unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while unfollowing the seller', error });
  }
};

exports.getFollowingProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following');

    if (user.following.length === 0) {
      return res.status(200).json({ message: 'You are not following any sellers', products: [] });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({ seller: { $in: user.following } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalProducts = await Product.countDocuments({ seller: { $in: user.following } });

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving products', error });
  }
};