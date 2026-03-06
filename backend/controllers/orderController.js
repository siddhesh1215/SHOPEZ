const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.images[0] || '',
            price: item.price,
            quantity: item.quantity,
        }));

        const itemsPrice = cart.totalPrice;
        const shippingPrice = itemsPrice > 500 ? 0 : 50;
        const totalPrice = itemsPrice + shippingPrice;

        // Decrease stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        // Clear cart after order placed
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(201).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (seller/admin)
// @route   PUT /api/orders/:id/status
// @access  Private (seller/admin)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.orderStatus = orderStatus;
        if (orderStatus === 'Delivered') order.deliveredAt = Date.now();
        await order.save();
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private (admin)
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get orders for seller's products
// @route   GET /api/orders/seller
// @access  Private (seller)
const getSellerOrders = async (req, res, next) => {
    try {
        const products = await Product.find({ seller: req.user._id }).select('_id');
        const productIds = products.map((p) => p._id.toString());
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        }).populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, getSellerOrders };
