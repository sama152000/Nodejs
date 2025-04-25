const Product = require('../models/Product');
const User = require('../models/User');
const Joi = require('joi');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    const { name, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
        category: Joi.string().required(),
        image: Joi.string().allow(null),
    });
    const { error } = schema.validate({ name, description, category, image });
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const product = new Product({
            name,
            description,
            category,
            seller: req.user.id,
            image,
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during product creation', error });
    }
};

exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, category } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to update this product' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        let oldImage = null;
        if (req.file) {
            oldImage = product.image;
            product.image = `/uploads/${req.file.filename}`;
        }

        await product.save();

        if (oldImage && fs.existsSync(oldImage)) {
            fs.unlinkSync(oldImage);
        }

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during product update', error });
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this product' });
        }

        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during product deletion', error });
    }
};

exports.getProducts = async (req, res) => {
    const { search, category, page, limit } = req.query;
    let filter = {};

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
        filter.category = category;
    }

    try {
        let products;
        if (page && limit) {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            products = await Product.find(filter)
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);
            const totalProducts = await Product.countDocuments(filter);
            return res.status(200).json({
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limitNum),
                currentPage: pageNum,
            });
        } else {
            products = await Product.find(filter)
                .sort({ createdAt: -1 })
                .populate('seller', 'username');
            return res.status(200).json({ products });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving products', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate('seller', 'username');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving the product', error });
    }
};