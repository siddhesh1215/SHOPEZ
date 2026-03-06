const express = require('express');
const router = express.Router();
const {
    getProducts, getFeaturedProducts, getProductById,
    createProduct, updateProduct, deleteProduct,
    addReview, getMyProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/seller/mine', protect, authorize('seller', 'admin'), getMyProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
