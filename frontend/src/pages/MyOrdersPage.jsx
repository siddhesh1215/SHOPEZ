import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/axios';
import './MyOrdersPage.css';

const STATUS_COLORS = { Processing: 'warning', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };
const STATUS_ICONS = { Processing: '⏳', Shipped: '🚚', Delivered: '✅', Cancelled: '❌' };

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders()
            .then((res) => setOrders(res.data.orders))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

    return (
        <div className="my-orders-page">
            <div className="page-header">
                <div className="container">
                    <h1>📦 My Orders</h1>
                    <p>Track and manage your orders</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '4rem' }}>📭</div>
                        <h3>No orders yet</h3>
                        <p>You haven't placed any orders. Start shopping!</p>
                        <Link to="/products"><button className="btn btn-primary btn-lg">Browse Products</button></Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card card animate-in">
                                <div className="order-card-header">
                                    <div>
                                        <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="order-status-wrap">
                                        <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'primary'}`}>
                                            {STATUS_ICONS[order.orderStatus]} {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items-preview">
                                    {order.orderItems.slice(0, 3).map((item, i) => (
                                        <div key={i} className="order-preview-item">
                                            <img
                                                src={item.image || `https://picsum.photos/seed/${item.product}/50/50`}
                                                alt={item.name}
                                                onError={(e) => { e.target.src = `https://picsum.photos/seed/${i}/50/50`; }}
                                            />
                                            <span>{item.name}</span>
                                            <span className="item-qty">×{item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <p className="more-items">+{order.orderItems.length - 3} more items</p>
                                    )}
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-meta">
                                        <span>💳 {order.paymentMethod}</span>
                                        <span className="bullet">•</span>
                                        <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                                        <span className="bullet">•</span>
                                        <span style={{ color: order.shippingPrice === 0 ? 'var(--success)' : '' }}>
                                            Shipping: {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}
                                        </span>
                                    </div>
                                    <div className="order-total-row">
                                        <span className="order-total">₹{order.totalPrice.toLocaleString()}</span>
                                        <Link to={`/order-confirmation/${order._id}`}>
                                            <button className="btn btn-outline btn-sm">View Details</button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Status Timeline */}
                                <div className="order-timeline">
                                    {['Processing', 'Shipped', 'Delivered'].map((s, i) => {
                                        const statuses = ['Processing', 'Shipped', 'Delivered'];
                                        const currentIdx = statuses.indexOf(order.orderStatus);
                                        const isDone = i <= currentIdx && order.orderStatus !== 'Cancelled';
                                        return (
                                            <div key={s} className={`timeline-step ${isDone ? 'done' : ''}`}>
                                                <div className="tl-dot"></div>
                                                {i < 2 && <div className={`tl-line ${isDone && i < currentIdx ? 'done' : ''}`}></div>}
                                                <span>{s}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
