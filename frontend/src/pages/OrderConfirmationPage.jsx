import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/axios';
import './OrderConfirmationPage.css';

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

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
    if (!order) return <div className="container" style={{ padding: '4rem' }}><h2>Order not found</h2></div>;

    const statusColors = { Processing: 'warning', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };

    return (
        <div className="confirmation-page">
            <div className="container">
                <div className="confirmation-card card animate-in">
                    <div className="confirmation-icon">✅</div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="confirmation-sub">Thank you for your purchase. Your order is confirmed.</p>

                    <div className="order-id-box">
                        <span>Order ID</span>
                        <code>{order._id}</code>
                    </div>

                    <div className="confirmation-details">
                        <div className="cd-row">
                            <span>Status</span>
                            <span className={`badge badge-${statusColors[order.orderStatus] || 'primary'}`}>{order.orderStatus}</span>
                        </div>
                        <div className="cd-row">
                            <span>Payment</span>
                            <span>{order.paymentMethod} — <span className={`badge badge-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span></span>
                        </div>
                        <div className="cd-row">
                            <span>Delivering to</span>
                            <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
                        </div>
                        <div className="cd-row">
                            <span>Order Date</span>
                            <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="ordered-items">
                        <h3>Items Ordered</h3>
                        <div className="divider"></div>
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="oi-row">
                                <img src={item.image || `https://picsum.photos/seed/${item.product}/60/60`} alt={item.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${i}/60/60`; }} />
                                <span className="oi-name">{item.name}</span>
                                <span className="oi-qty">×{item.quantity}</span>
                                <span className="oi-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="divider"></div>
                        <div className="oi-row total-row">
                            <span style={{ flex: 1 }}>Shipping</span>
                            <span style={{ color: order.shippingPrice === 0 ? 'var(--success)' : '' }}>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                        </div>
                        <div className="oi-row total-row">
                            <span style={{ flex: 1, fontWeight: 700 }}>Total Paid</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-light)' }}>₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <Link to="/my-orders"><button className="btn btn-outline">View All Orders</button></Link>
                        <Link to="/products"><button className="btn btn-primary">Continue Shopping</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
