const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
        if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity, price: product.price }],
            });
        } else {
            const existingItem = cart.items.find((i) => i.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity, price: product.price });
            }
            await cart.save();
        }
        await cart.populate('items.product', 'name price images stock');
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find((i) => i.product.toString() === req.params.productId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });
        if (quantity <= 0) {
            cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
        } else {
            item.quantity = quantity;
        }
        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
