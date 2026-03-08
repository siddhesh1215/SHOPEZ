import { Link } from 'react-router-dom';
import { addToCart } from '../api/axios';
import { useState } from 'react';
import './ProductCard.css';

/* ── Cart / Check Icons ────────────────────────────── */
const CartPlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        <line x1="12" y1="8" x2="12" y2="14" /><line x1="9" y1="11" x2="15" y2="11" />
    </svg>
);

const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        try {
            await addToCart({ productId: product._id, quantity: 1 });
            setAdded(true);
            setTimeout(() => setAdded(false), 2200);
        } catch (err) {
            alert(err?.response?.data?.message || 'Please log in to add items to your cart.');
        } finally {
            setAdding(false);
        }
    };

    const discount = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const imgSrc = product.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%231e293b"/%3E%3Ctext x="200" y="155" text-anchor="middle" fill="%2364748b" font-size="14" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';

    return (
        <Link to={`/products/${product._id}`} className="product-card">
            {/* Image */}
            <div className="product-img-wrap">
                <img
                    src={imgSrc}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%231e293b"/%3E%3Ctext x="200" y="155" text-anchor="middle" fill="%2364748b" font-size="14" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />
                {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
            </div>

            {/* Info */}
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-rating">
                    <span className="stars">
                        {'★'.repeat(Math.round(product.ratings || 0))}{'☆'.repeat(5 - Math.round(product.ratings || 0))}
                    </span>
                    <span className="rating-count">({product.numReviews || 0})</span>
                </div>

                <div className="product-price-row">
                    <div className="product-price">
                        {product.discountPrice ? (
                            <>
                                <span className="price-current">₹{product.discountPrice.toLocaleString()}</span>
                                <span className="price-original">₹{product.price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="price-current">₹{product.price.toLocaleString()}</span>
                        )}
                    </div>
                    <button
                        className={`add-cart-btn ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        title={added ? 'Added to cart' : 'Add to cart'}
                        aria-label="Add to cart"
                    >
                        {adding ? (
                            <span className="btn-spinner" />
                        ) : added ? (
                            <CheckIcon />
                        ) : (
                            <CartPlusIcon />
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
