import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct, getSellerOrders, updateOrderStatus } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './SellerDashboard.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys', 'Other'];
const EMPTY_FORM = { name: '', description: '', price: '', discountPrice: '', category: 'Electronics', stock: '', brand: '', images: '', isFeatured: false };

export default function SellerDashboard() {
    const { user } = useAuth();
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchProducts = () => getMyProducts().then((r) => setProducts(r.data.products));
    const fetchOrders = () => getSellerOrders().then((r) => setOrders(r.data.orders));

    useEffect(() => {
        Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                discountPrice: Number(form.discountPrice) || 0,
                stock: Number(form.stock),
                images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
            };
            if (editingId) { await updateProduct(editingId, payload); setMsg('✅ Product updated!'); }
            else { await createProduct(payload); setMsg('✅ Product created!'); }
            await fetchProducts();
            setShowForm(false);
            setEditingId(null);
            setForm(EMPTY_FORM);
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Error saving product');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (p) => {
        setForm({ ...p, price: String(p.price), discountPrice: String(p.discountPrice || ''), stock: String(p.stock), images: (p.images || []).join(', '), isFeatured: p.isFeatured || false });
        setEditingId(p._id);
        setShowForm(true);
        setMsg('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) { alert(err?.response?.data?.message || 'Error deleting'); }
    };

    const handleStatusUpdate = async (orderId, orderStatus) => {
        try {
            await updateOrderStatus(orderId, { orderStatus });
            await fetchOrders();
        } catch (err) { alert('Error updating status'); }
    };

    const totalRevenue = orders.filter((o) => o.orderStatus !== 'Cancelled').reduce((s, o) => s + o.totalPrice, 0);

    if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

    return (
        <div className="dashboard">
            <div className="page-header">
                <div className="container">
                    <h1>📊 Seller Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="container">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon">📦</div>
                        <div><p className="stat-value">{products.length}</p><p className="stat-label">Products</p></div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon">🛒</div>
                        <div><p className="stat-value">{orders.length}</p><p className="stat-label">Total Orders</p></div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon">⏳</div>
                        <div><p className="stat-value">{orders.filter((o) => o.orderStatus === 'Processing').length}</p><p className="stat-label">Pending</p></div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon">💰</div>
                        <div><p className="stat-value">₹{totalRevenue.toLocaleString()}</p><p className="stat-label">Revenue</p></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dash-tabs">
                    <button className={`dash-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>📦 My Products</button>
                    <button className={`dash-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>🛒 Orders</button>
                </div>

                {/* Products Tab */}
                {tab === 'products' && (
                    <div>
                        <div className="section-toolbar">
                            <h2>My Products ({products.length})</h2>
                            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY_FORM); setMsg(''); }}>
                                {showForm ? 'Cancel' : '+ Add Product'}
                            </button>
                        </div>

                        {showForm && (
                            <form className="product-form card animate-in" onSubmit={handleSave}>
                                <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                                <div className="divider"></div>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input className="form-control" placeholder="iPhone 15 Pro" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Price (₹) *</label>
                                        <input type="number" className="form-control" placeholder="999" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Price (₹)</label>
                                        <input type="number" className="form-control" placeholder="799 (optional)" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input type="number" className="form-control" placeholder="100" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Brand</label>
                                        <input className="form-control" placeholder="Apple" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea className="form-control" rows={3} placeholder="Describe your product..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Image URLs (comma separated)</label>
                                    <input className="form-control" placeholder="https://example.com/img1.jpg, https://..." value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                                        <span>Mark as Featured Product</span>
                                    </label>
                                </div>
                                {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}</button>
                                    <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}>Cancel</button>
                                </div>
                            </form>
                        )}

                        {products.length === 0 ? (
                            <div className="empty-state"><div style={{ fontSize: '3rem' }}>📦</div><h3>No products yet</h3><p>Click "Add Product" to get started</p></div>
                        ) : (
                            <div className="products-table card" style={{ padding: 0, overflow: 'hidden' }}>
                                <table>
                                    <thead>
                                        <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr key={p._id}>
                                                <td>
                                                    <div className="table-product">
                                                        <img src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/40/40`} alt={p.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${p._id}/40/40`; }} />
                                                        <div>
                                                            <p className="tp-name">{p.name}</p>
                                                            {p.isFeatured && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>⭐ Featured</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="badge badge-primary">{p.category}</span></td>
                                                <td>
                                                    <span style={{ fontWeight: 700 }}>₹{p.discountPrice || p.price}</span>
                                                    {p.discountPrice > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginLeft: '4px' }}>₹{p.price}</span>}
                                                </td>
                                                <td><span className={p.stock < 5 ? 'low-stock' : ''}>{p.stock}</span></td>
                                                <td><span className="stars" style={{ fontSize: '0.85rem' }}>★</span> {p.ratings?.toFixed(1) || '—'} ({p.numReviews})</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Customer Orders ({orders.length})</h2>
                        {orders.length === 0 ? (
                            <div className="empty-state"><div style={{ fontSize: '3rem' }}>🛒</div><h3>No orders yet</h3><p>Orders from customers will appear here</p></div>
                        ) : (
                            <div className="orders-table card" style={{ padding: 0, overflow: 'hidden' }}>
                                <table>
                                    <thead>
                                        <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o._id}>
                                                <td><code style={{ fontSize: '0.78rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                                                <td>{o.user?.name || 'Customer'}</td>
                                                <td>{o.orderItems.length} item{o.orderItems.length !== 1 ? 's' : ''}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>₹{o.totalPrice.toLocaleString()}</td>
                                                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <span className={`badge badge-${o.orderStatus === 'Delivered' ? 'success' :
                                                            o.orderStatus === 'Shipped' ? 'primary' :
                                                                o.orderStatus === 'Cancelled' ? 'danger' : 'warning'
                                                        }`}>{o.orderStatus}</span>
                                                </td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={o.orderStatus}
                                                        onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                                        disabled={o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled'}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
