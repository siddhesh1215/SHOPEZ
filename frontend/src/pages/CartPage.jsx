import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../api/axios';
import './CartPage.css';

const EmptyCartIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" fill="%231e293b"/%3E%3C/svg%3E';

export default function CartPage() {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = () => {
        getCart()
            .then((res) => setCart(res.data.cart || { items: [], totalPrice: 0 }))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCart(); }, []);

    const handleQtyChange = async (productId, qty) => {
        try { await updateCartItem(productId, { quantity: qty }); fetchCart(); }
        catch (err) { console.error(err); }
    };

    const handleRemove = async (productId) => {
        try { await removeFromCart(productId); fetchCart(); }
        catch (err) { console.error(err); }
    };

    const shipping = cart.totalPrice > 500 ? 0 : 50;
    const total = cart.totalPrice + shipping;

    if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

    return (
        <div className="cart-page">
            <div className="page-header">
                <div className="container">
                    <h1>Shopping Cart</h1>
                    <p>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {cart.items.length === 0 ? (
                    <div className="empty-state">
                        <EmptyCartIcon />
                        <h3>Your cart is empty</h3>
                        <p>Browse our products and add something you like</p>
                        <Link to="/products">
                            <button className="btn btn-primary btn-lg">Browse Products</button>
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Items */}
                        <div className="cart-items">
                            {cart.items.map((item) => {
                                const prod = item.product;
                                if (!prod) return null;
                                return (
                                    <div key={item._id} className="cart-item card animate-in">
                                        <img
                                            src={prod.images?.[0] || fallback}
                                            alt={prod.name}
                                            className="cart-item-img"
                                            onError={(e) => { e.target.src = fallback; }}
                                        />
                                        <div className="cart-item-info">
                                            <Link to={`/products/${prod._id}`}>
                                                <h3 className="cart-item-name">{prod.name}</h3>
                                            </Link>
                                            <p className="cart-item-price">₹{item.price.toLocaleString()} each</p>
                                        </div>
                                        <div className="cart-item-qty">
                                            <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity + 1)} disabled={item.quantity >= prod.stock}>+</button>
                                        </div>
                                        <div className="cart-item-subtotal">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(prod._id)}
                                            title="Remove item"
                                            aria-label="Remove item"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="cart-summary card">
                            <h3>Order Summary</h3>
                            <div className="divider" />
                            <div className="summary-row">
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span>₹{cart.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'free-ship' : ''}>
                                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                                </span>
                            </div>
                            {shipping === 0 && (
                                <p className="ship-note success-note">You qualify for free shipping.</p>
                            )}
                            {shipping > 0 && (
                                <p className="ship-note">Add ₹{500 - cart.totalPrice} more for free shipping</p>
                            )}
                            <div className="divider" />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="total-amt">₹{total.toLocaleString()}</span>
                            </div>
                            <button
                                className="btn btn-primary btn-full btn-lg"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                            <Link to="/products">
                                <button className="btn btn-ghost btn-full" style={{ marginTop: '0.6rem' }}>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
