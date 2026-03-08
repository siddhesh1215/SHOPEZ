import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/axios';
import './MyOrdersPage.css';

const STATUS_BADGE = {
    Processing: 'badge-warning',
    Shipped: 'badge-primary',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
};

const EmptyOrdersIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Crect width="50" height="50" fill="%231e293b"/%3E%3C/svg%3E';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders()
            .then((res) => setOrders(res.data.orders))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

    return (
        <div className="my-orders-page">
            <div className="page-header">
                <div className="container">
                    <h1>My Orders</h1>
                    <p>Track and manage your order history</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <EmptyOrdersIcon />
                        <h3>No orders yet</h3>
                        <p>You haven&apos;t placed any orders. Start shopping to see them here.</p>
                        <Link to="/products">
                            <button className="btn btn-primary btn-lg">Browse Products</button>
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const statuses = ['Processing', 'Shipped', 'Delivered'];
                            const currentIdx = statuses.indexOf(order.orderStatus);
                            return (
                                <div key={order._id} className="order-card card animate-in">
                                    {/* Header */}
                                    <div className="order-card-header">
                                        <div>
                                            <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span className={`badge ${STATUS_BADGE[order.orderStatus] || 'badge-neutral'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="order-items-preview">
                                        {order.orderItems.slice(0, 3).map((item, i) => (
                                            <div key={i} className="order-preview-item">
                                                <img
                                                    src={item.image || fallback}
                                                    alt={item.name}
                                                    onError={(e) => { e.target.src = fallback; }}
                                                />
                                                <span className="preview-name">{item.name}</span>
                                                <span className="item-qty">×{item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <p className="more-items">+{order.orderItems.length - 3} more items</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="order-card-footer">
                                        <div className="order-meta">
                                            <span>{order.paymentMethod}</span>
                                            <span className="bullet">·</span>
                                            <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                                            <span className="bullet">·</span>
                                            <span>
                                                Shipping: {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}
                                            </span>
                                        </div>
                                        <div className="order-total-row">
                                            <span className="order-total">₹{order.totalPrice.toLocaleString()}</span>
                                            <Link to={`/order-confirmation/${order._id}`}>
                                                <button className="btn btn-ghost btn-sm">View Details</button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    {order.orderStatus !== 'Cancelled' && (
                                        <div className="order-timeline">
                                            {statuses.map((s, i) => {
                                                const isDone = i <= currentIdx;
                                                return (
                                                    <div key={s} className={`timeline-step ${isDone ? 'done' : ''}`}>
                                                        <div className="tl-dot" />
                                                        {i < 2 && (
                                                            <div className={`tl-line ${isDone && i < currentIdx ? 'done' : ''}`} />
                                                        )}
                                                        <span>{s}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
