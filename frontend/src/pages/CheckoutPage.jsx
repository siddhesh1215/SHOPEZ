import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [address, setAddress] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: 'India',
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [step, setStep] = useState(1); // 1: address, 2: payment, 3: review

    useEffect(() => {
        getCart()
            .then((res) => setCart(res.data.cart || { items: [], totalPrice: 0 }))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const shipping = cart.totalPrice > 500 ? 0 : 50;
    const total = cart.totalPrice + shipping;

    const handlePlaceOrder = async () => {
        setPlacing(true);
        setError('');
        try {
            const res = await createOrder({ shippingAddress: address, paymentMethod });
            navigate(`/order-confirmation/${res.data.order._id}`);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
    if (cart.items.length === 0) { navigate('/cart'); return null; }

    return (
        <div className="checkout-page">
            <div className="page-header">
                <div className="container">
                    <h1>Checkout</h1>
                    <p>Complete your order</p>
                </div>
            </div>

            <div className="container">
                {/* Stepper */}
                <div className="stepper">
                    {['Shipping', 'Payment', 'Review'].map((s, i) => (
                        <div key={s} className={`step-item ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
                            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
                            <span>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="checkout-grid">
                    <div className="checkout-form card">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="animate-in">
                                <h3>Shipping Address</h3>
                                <div className="divider"></div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input className="form-control" placeholder="123 Main Street, Apt 4" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input className="form-control" placeholder="Mumbai" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input className="form-control" placeholder="Maharashtra" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input className="form-control" placeholder="400001" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input className="form-control" value={address.country} readOnly />
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-full" onClick={() => { if (!address.street || !address.city || !address.state || !address.pincode) { setError('Please fill all address fields'); return; } setError(''); setStep(2); }}>
                                    Continue to Payment →
                                </button>
                                {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="animate-in">
                                <h3>Payment Method</h3>
                                <div className="divider"></div>
                                <div className="payment-options">
                                    <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                                        <div className="payment-icon cod-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                        </div>
                                        <div>
                                            <strong>Cash on Delivery</strong>
                                            <p>Pay when your order arrives</p>
                                        </div>
                                        <div className={`radio-dot ${paymentMethod === 'COD' ? 'active' : ''}`} />
                                    </div>
                                    <div className={`payment-option ${paymentMethod === 'Online' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Online')}>
                                        <div className="payment-icon online-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 4v16" /></svg>
                                        </div>
                                        <div>
                                            <strong>Online Payment</strong>
                                            <p>UPI / Card / Net Banking</p>
                                        </div>
                                        <div className={`radio-dot ${paymentMethod === 'Online' ? 'active' : ''}`} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Review Order →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="animate-in">
                                <h3>Review Your Order</h3>
                                <div className="divider"></div>
                                <div className="review-section">
                                    <p className="review-label">Shipping to:</p>
                                    <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                                </div>
                                <div className="review-section">
                                    <p className="review-label">Payment:</p>
                                    <p>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                                </div>
                                <div className="review-section">
                                    <p className="review-label">Items ({cart.items.length}):</p>
                                    {cart.items.map((item) => item.product && (
                                        <div key={item._id} className="review-item">
                                            <span>{item.product.name}</span>
                                            <span>×{item.quantity}</span>
                                            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                {error && <div className="alert alert-error">{error}</div>}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={placing}>
                                        {placing ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary card">
                        <h3>Order Summary</h3>
                        <div className="divider"></div>
                        {cart.items.map((item) => item.product && (
                            <div key={item._id} className="co-item">
                                <img src={item.product.images?.[0] || ''} alt={item.product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                <span className="co-name">{item.product.name}</span>
                                <span>×{item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="divider"></div>
                        <div className="summary-row"><span>Subtotal</span><span>₹{cart.totalPrice.toLocaleString()}</span></div>
                        <div className="summary-row"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                        <div className="divider"></div>
                        <div className="summary-row total"><span>Total</span><span className="total-amt">₹{total.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
