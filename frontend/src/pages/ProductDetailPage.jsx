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
    const [selectedImg, setSelectedImg] = useState(0);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMsg, setReviewMsg] = useState('');

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
            setAddedMsg('✅ Added to cart!');
            setTimeout(() => setAddedMsg(''), 3000);
        } catch (err) {
            setAddedMsg(err?.response?.data?.message || 'Error adding to cart');
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
            setReviewMsg('✅ Review submitted!');
            const res = await getProductById(id);
            setProduct(res.data.product);
            setReview({ rating: 5, comment: '' });
        } catch (err) {
            setReviewMsg(err?.response?.data?.message || 'Error submitting review');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
    if (!product) return <div className="container" style={{ padding: '4rem' }}><h2>Product not found</h2></div>;

    const images = product.images?.length ? product.images : [`https://picsum.photos/seed/${id}/600/400`];

    return (
        <div className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <p className="breadcrumb">
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    {' › '}
                    <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Products</span>
                    {' › '}
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </p>

                <div className="detail-grid">
                    {/* Images */}
                    <div className="detail-images">
                        <div className="main-img-wrap">
                            <img
                                src={images[selectedImg]}
                                alt={product.name}
                                className="main-img"
                                onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}/600/400`; }}
                            />
                        </div>
                        <div className="thumb-strip">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    className={`thumb ${selectedImg === i ? 'active' : ''}`}
                                    onClick={() => setSelectedImg(i)}
                                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${id + i}/80/80`; }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <span className="badge badge-primary">{product.category}</span>
                        <h1 className="detail-name">{product.name}</h1>
                        {product.brand && <p className="detail-brand">by <strong>{product.brand}</strong></p>}
                        <div className="detail-rating">
                            <span className="stars">{'★'.repeat(Math.round(product.ratings || 0))}{'☆'.repeat(5 - Math.round(product.ratings || 0))}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.ratings?.toFixed(1)} · {product.numReviews} reviews</span>
                        </div>
                        <div className="detail-price">
                            {product.discountPrice ? (
                                <>
                                    <span className="price-big">₹{product.discountPrice}</span>
                                    <span className="price-old">₹{product.price}</span>
                                    <span className="badge badge-danger">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                    </span>
                                </>
                            ) : (
                                <span className="price-big">₹{product.price}</span>
                            )}
                        </div>

                        <p className="stock-info">
                            {product.stock > 0 ? (
                                <span style={{ color: 'var(--success)' }}>✓ In Stock ({product.stock} available)</span>
                            ) : (
                                <span style={{ color: 'var(--danger)' }}>✗ Out of Stock</span>
                            )}
                        </p>

                        <p className="detail-desc">{product.description}</p>

                        <div className="qty-row">
                            <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                            <span className="qty-val">{qty}</span>
                            <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                        </div>

                        {addedMsg && <div className={`alert ${addedMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{addedMsg}</div>}

                        <div className="detail-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={adding || product.stock === 0}
                                style={{ flex: 1 }}
                            >
                                {adding ? 'Adding...' : '🛒 Add to Cart'}
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
                            <p>🏪 Sold by: <strong>{product.seller?.name || 'ShopEZ Seller'}</strong></p>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>
                    <div className="divider"></div>
                    {product.reviews?.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p>}
                    <div className="reviews-list">
                        {product.reviews?.map((r, i) => (
                            <div key={i} className="review-card">
                                <div className="review-header">
                                    <span className="review-avatar">{r.user?.name?.charAt(0) || 'U'}</span>
                                    <div>
                                        <p className="review-author">{r.user?.name || 'User'}</p>
                                        <span className="stars" style={{ fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    </div>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: 'auto' }}>
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add Review */}
                    {user && (
                        <form className="add-review-form card" onSubmit={handleReview}>
                            <h3>Write a Review</h3>
                            <div className="form-group">
                                <label>Rating</label>
                                <select className="form-control" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea className="form-control" rows={3} placeholder="Share your experience..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
                            </div>
                            {reviewMsg && <div className={`alert ${reviewMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{reviewMsg}</div>}
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
