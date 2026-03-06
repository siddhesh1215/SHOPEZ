const Product = require('../models/Product');

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
        const query = {};

        if (keyword) query.name = { $regex: keyword, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { ratings: -1 };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('seller', 'name email')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            count: products.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isFeatured: true }).limit(8).populate('seller', 'name');
        res.json({ success: true, products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product (seller)
// @route   POST /api/products
// @access  Private (seller/admin)
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, discountPrice, category, stock, images, brand, isFeatured } = req.body;
        const product = await Product.create({
            name, description, price, discountPrice, category, stock,
            images: images || ['https://via.placeholder.com/400x400?text=Product'],
            brand, isFeatured,
            seller: req.user._id,
        });
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (seller/admin)
const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (seller/admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await product.deleteOne();
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }
        product.reviews.push({ user: req.user._id, rating: Number(rating), comment });
        product.numReviews = product.reviews.length;
        product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ success: true, message: 'Review added' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get seller's own products
// @route   GET /api/products/seller/mine
// @access  Private (seller)
const getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ seller: req.user._id });
        res.json({ success: true, products });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, getMyProducts };
