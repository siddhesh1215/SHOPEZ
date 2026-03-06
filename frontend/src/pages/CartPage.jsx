import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../api/axios';
import './CartPage.css';

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
        try {
            await updateCartItem(productId, { quantity: qty });
            fetchCart();
        } catch (err) { console.error(err); }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
            fetchCart();
        } catch (err) { console.error(err); }
    };

    const shipping = cart.totalPrice > 500 ? 0 : 50;
    const total = cart.totalPrice + shipping;

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

    return (
        <div className="cart-page">
            <div className="page-header">
                <div className="container">
                    <h1>🛍️ Shopping Cart</h1>
                    <p>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
                </div>
            </div>

            <div className="container">
                {cart.items.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '5rem' }}>🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added anything yet</p>
                        <Link to="/products"><button className="btn btn-primary btn-lg">Start Shopping</button></Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cart.items.map((item) => {
                                const prod = item.product;
                                if (!prod) return null;
                                return (
                                    <div key={item._id} className="cart-item card animate-in">
                                        <img
                                            src={prod.images?.[0] || `https://picsum.photos/seed/${prod._id}/120/120`}
                                            alt={prod.name}
                                            className="cart-item-img"
                                            onError={(e) => { e.target.src = `https://picsum.photos/seed/${prod._id}/120/120`; }}
                                        />
                                        <div className="cart-item-info">
                                            <Link to={`/products/${prod._id}`}>
                                                <h3 className="cart-item-name">{prod.name}</h3>
                                            </Link>
                                            <p className="cart-item-price">₹{item.price} each</p>
                                        </div>
                                        <div className="cart-item-qty">
                                            <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                                            <span className="qty-val">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity + 1)} disabled={item.quantity >= prod.stock}>+</button>
                                        </div>
                                        <div className="cart-item-subtotal">
                                            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                        <button className="remove-btn" onClick={() => handleRemove(prod._id)} title="Remove">✕</button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary card">
                            <h3>Order Summary</h3>
                            <div className="divider"></div>
                            <div className="summary-row">
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span>₹{cart.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'free-ship' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                            </div>
                            {shipping === 0 && <p className="ship-note">🎉 You qualify for free shipping!</p>}
                            {shipping > 0 && <p className="ship-note">Add ₹{500 - cart.totalPrice} more for free shipping</p>}
                            <div className="divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="total-amt">₹{total.toLocaleString()}</span>
                            </div>
                            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout →
                            </button>
                            <Link to="/products">
                                <button className="btn btn-outline btn-full" style={{ marginTop: '0.8rem' }}>Continue Shopping</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
