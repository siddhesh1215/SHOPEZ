import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, addReview } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addedMsg, setAddedMsg] = useState('');
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMsg, setReviewMsg] = useState({ text: '', ok: false });

    useEffect(() => {
        getProductById(id)
            .then((res) => { setProduct(res.data.product); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) return navigate('/login');
        setAdding(true);
        try {
            await addToCart({ productId: product._id, quantity: qty });
            setAddedMsg('Item added to your cart.');
            setAddedSuccess(true);
            setTimeout(() => setAddedMsg(''), 3000);
        } catch (err) {
            setAddedMsg(err?.response?.data?.message || 'Could not add to cart. Please try again.');
            setAddedSuccess(false);
        } finally {
            setAdding(false);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        setReviewLoading(true);
        try {
            await addReview(id, review);
            setReviewMsg({ text: 'Review submitted successfully.', ok: true });
            const res = await getProductById(id);
            setProduct(res.data.product);
            setReview({ rating: 5, comment: '' });
        } catch (err) {
            setReviewMsg({ text: err?.response?.data?.message || 'Could not submit review.', ok: false });
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
    if (!product) return <div className="container" style={{ padding: '4rem' }}><h2>Product not found.</h2></div>;

    const fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%231e293b"/%3E%3Ctext x="300" y="205" text-anchor="middle" fill="%2364748b" font-size="16" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
    const images = product.images?.length ? product.images : [fallback];
    const discount = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <span className="bc-link" onClick={() => navigate('/')}>Home</span>
                    <span className="bc-sep">/</span>
                    <span className="bc-link" onClick={() => navigate('/products')}>Products</span>
                    <span className="bc-sep">/</span>
                    <span className="bc-current">{product.name}</span>
                </nav>

                {/* Detail Grid */}
                <div className="detail-grid">
                    {/* Images */}
                    <div className="detail-images">
                        <div className="main-img-wrap">
                            <img
                                src={images[selectedImg]}
                                alt={product.name}
                                className="main-img"
                                onError={(e) => { e.target.src = fallback; }}
                            />
                            {discount > 0 && (
                                <span className="detail-discount-badge">-{discount}% OFF</span>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="thumb-strip">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt=""
                                        className={`thumb ${selectedImg === i ? 'active' : ''}`}
                                        onClick={() => setSelectedImg(i)}
                                        onError={(e) => { e.target.src = fallback; }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <span className="badge badge-neutral">{product.category}</span>
                        <h1 className="detail-name">{product.name}</h1>
                        {product.brand && (
                            <p className="detail-brand">by <strong>{product.brand}</strong></p>
                        )}

                        <div className="detail-rating">
                            <span className="stars">
                                {'★'.repeat(Math.round(product.ratings || 0))}{'☆'.repeat(5 - Math.round(product.ratings || 0))}
                            </span>
                            <span className="rating-text">
                                {product.ratings?.toFixed(1)} &middot; {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                            </span>
                        </div>

                        <div className="detail-price">
                            {product.discountPrice ? (
                                <>
                                    <span className="price-big">₹{product.discountPrice.toLocaleString()}</span>
                                    <span className="price-old">₹{product.price.toLocaleString()}</span>
                                    <span className="badge badge-danger">{discount}% OFF</span>
                                </>
                            ) : (
                                <span className="price-big">₹{product.price.toLocaleString()}</span>
                            )}
                        </div>

                        <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {product.stock > 0
                                ? `In Stock — ${product.stock} units available`
                                : 'Out of Stock'}
                        </div>

                        <p className="detail-desc">{product.description}</p>

                        {/* Qty */}
                        {product.stock > 0 && (
                            <div className="qty-row">
                                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                                <span className="qty-val">{qty}</span>
                                <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                            </div>
                        )}

                        {addedMsg && (
                            <div className={`alert ${addedSuccess ? 'alert-success' : 'alert-error'}`}>
                                {addedMsg}
                            </div>
                        )}

                        <div className="detail-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={adding || product.stock === 0}
                                style={{ flex: 1 }}
                            >
                                {adding ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={async () => { await handleAddToCart(); navigate('/cart'); }}
                                disabled={product.stock === 0}
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="seller-info">
                            <p>Sold by: <strong>{product.seller?.name || 'ShopEZ Verified Seller'}</strong></p>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>
                    <div className="divider" />

                    {product.reviews?.length === 0 && (
                        <p className="no-reviews">No reviews yet. Be the first to leave one.</p>
                    )}

                    <div className="reviews-list">
                        {product.reviews?.map((r, i) => (
                            <div key={i} className="review-card">
                                <div className="review-header">
                                    <span className="review-avatar">{r.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    <div>
                                        <p className="review-author">{r.user?.name || 'Verified Buyer'}</p>
                                        <span className="stars" style={{ fontSize: '0.8rem' }}>
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                        </span>
                                    </div>
                                    <span className="review-date">
                                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                            </div>
                        ))}
                    </div>

                    {user && (
                        <form className="add-review-form card" onSubmit={handleReview}>
                            <h3>Write a Review</h3>
                            <div className="form-group">
                                <label>Rating</label>
                                <select
                                    className="form-control"
                                    value={review.rating}
                                    onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <option key={r} value={r}>{r} Stars</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Share your experience with this product..."
                                    value={review.comment}
                                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                    required
                                />
                            </div>
                            {reviewMsg.text && (
                                <div className={`alert ${reviewMsg.ok ? 'alert-success' : 'alert-error'}`}>
                                    {reviewMsg.text}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
