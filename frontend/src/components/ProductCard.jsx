import { Link } from 'react-router-dom';
import { addToCart } from '../api/axios';
import { useState } from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await addToCart({ productId: product._id, quantity: 1 });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (err) {
            alert(err?.response?.data?.message || 'Login to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const discount = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <Link to={`/products/${product._id}`} className="product-card">
            <div className="product-img-wrap">
                <img
                    src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/400/300`; }}
                />
                {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.round(product.ratings || 0))}{'☆'.repeat(5 - Math.round(product.ratings || 0))}</span>
                    <span className="rating-count">({product.numReviews || 0})</span>
                </div>
                <div className="product-price-row">
                    <div className="product-price">
                        {product.discountPrice ? (
                            <>
                                <span className="price-current">₹{product.discountPrice}</span>
                                <span className="price-original">₹{product.price}</span>
                            </>
                        ) : (
                            <span className="price-current">₹{product.price}</span>
                        )}
                    </div>
                    <button
                        className={`btn btn-primary btn-sm add-cart-btn ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                    >
                        {adding ? '...' : added ? '✓' : '🛒'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
