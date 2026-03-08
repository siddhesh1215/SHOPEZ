import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/axios';
import './OrderConfirmationPage.css';

const CheckCircleIcon = () => (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const STATUS_BADGE = {
    Processing: 'badge-warning',
    Shipped: 'badge-primary',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
};

const fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Crect width="60" height="60" fill="%231e293b"/%3E%3C/svg%3E';

export default function OrderConfirmationPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderById(id)
            .then((res) => setOrder(res.data.order))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
    if (!order) return <div className="container" style={{ padding: '4rem' }}><h2>Order not found.</h2></div>;

    return (
        <div className="confirmation-page">
            <div className="container">
                <div className="confirmation-card card animate-in">
                    {/* Success Header */}
                    <div className="confirmation-header">
                        <div className="confirmation-icon">
                            <CheckCircleIcon />
                        </div>
                        <h1>Order Confirmed</h1>
                        <p className="confirmation-sub">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                    </div>

                    {/* Order ID */}
                    <div className="order-id-box">
                        <span className="oid-label">Order Reference</span>
                        <code className="oid-value">{order._id.toUpperCase()}</code>
                    </div>

                    {/* Details */}
                    <div className="confirmation-details">
                        <div className="cd-row">
                            <span>Order Status</span>
                            <span className={`badge ${STATUS_BADGE[order.orderStatus] || 'badge-neutral'}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                        <div className="cd-row">
                            <span>Payment</span>
                            <span>
                                {order.paymentMethod}
                                {' — '}
                                <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                    {order.paymentStatus}
                                </span>
                            </span>
                        </div>
                        <div className="cd-row">
                            <span>Delivering to</span>
                            <span>
                                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                                {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </span>
                        </div>
                        <div className="cd-row">
                            <span>Order Date</span>
                            <span>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="ordered-items">
                        <h3>Items Ordered</h3>
                        <div className="divider" />
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="oi-row">
                                <img
                                    src={item.image || fallback}
                                    alt={item.name}
                                    onError={(e) => { e.target.src = fallback; }}
                                />
                                <span className="oi-name">{item.name}</span>
                                <span className="oi-qty">×{item.quantity}</span>
                                <span className="oi-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="divider" />
                        <div className="oi-row summary-row-conf">
                            <span>Shipping</span>
                            <span className={order.shippingPrice === 0 ? 'free-chip' : ''}>
                                {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}
                            </span>
                        </div>
                        <div className="oi-row summary-row-conf total-conf">
                            <span>Total Paid</span>
                            <span>₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="confirmation-actions">
                        <Link to="/my-orders">
                            <button className="btn btn-ghost">View All Orders</button>
                        </Link>
                        <Link to="/products">
                            <button className="btn btn-primary">Continue Shopping</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
