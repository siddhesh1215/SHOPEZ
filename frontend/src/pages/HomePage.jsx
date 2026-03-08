import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../api/axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

/* ── Category SVG Icons ────────────────────────────────────── */
const ElectronicsIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
);
const FashionIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
    </svg>
);
const KitchenIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2l1.5 15h15L21 2" /><line x1="3" y1="7" x2="21" y2="7" />
        <path d="M12 22v-5" /><path d="M8 22h8" />
    </svg>
);
const BeautyIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CATEGORIES = [
    { name: 'Electronics', icon: <ElectronicsIcon />, color: '#2563eb' },
    { name: 'Fashion', icon: <FashionIcon />, color: '#7c3aed' },
    { name: 'Home & Kitchen', icon: <KitchenIcon />, color: '#0891b2' },
    { name: 'Beauty', icon: <BeautyIcon />, color: '#db2777' },
];

/* ── Trust Badges ──────────────────────────────────────────── */
const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const TruckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);
const RefreshIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
);
const HeadsetIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
);

const TRUST_BADGES = [
    { icon: <ShieldIcon />, title: 'Secure Payments', sub: '256-bit SSL encryption' },
    { icon: <TruckIcon />, title: 'Fast Delivery', sub: 'Orders shipped within 24h' },
    { icon: <RefreshIcon />, title: 'Easy Returns', sub: '30-day return policy' },
    { icon: <HeadsetIcon />, title: '24/7 Support', sub: 'Dedicated customer care' },
];

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [newest, setNewest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getFeaturedProducts(),
            getProducts({ limit: 8, sort: 'newest' }),
        ])
            .then(([feat, all]) => {
                setFeatured(feat.data.products);
                setNewest(all.data.products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="home">

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-content container animate-in">
                    <div className="hero-eyebrow">New Arrivals Every Week</div>
                    <h1 className="hero-title">
                        The Smarter Way<br />
                        to <span className="gradient-text">Shop Online</span>
                    </h1>
                    <p className="hero-sub">
                        Curated products from trusted sellers. Premium quality,
                        competitive pricing, and hassle-free delivery.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products">
                            <button className="btn btn-primary btn-lg">Browse Products</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn btn-outline btn-lg">Become a Seller</button>
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-num">10K+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-num">5K+</span>
                            <span className="stat-label">Verified Sellers</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-num">50K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories ───────────────────────────────────── */}
            <section className="section">
                <div className="container">
                    <div className="section-header centered">
                        <h2>Shop by <span className="gradient-text">Category</span></h2>
                        <p>Browse our curated collections</p>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                className="cat-card"
                                style={{ '--cat-color': cat.color }}
                            >
                                <span className="cat-icon">{cat.icon}</span>
                                <span className="cat-name">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Products ─────────────────────────────────────── */}
            {loading ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
            ) : (
                <>
                    {featured.length > 0 && (
                        <section className="section" style={{ paddingTop: 0 }}>
                            <div className="container">
                                <div className="section-header centered">
                                    <h2>Featured <span className="gradient-text">Products</span></h2>
                                    <p>Hand-picked by our team</p>
                                </div>
                                <div className="grid grid-4">
                                    {featured.map((p) => <ProductCard key={p._id} product={p} />)}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="section" style={{ paddingTop: 0 }}>
                        <div className="container">
                            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2>New <span className="gradient-text">Arrivals</span></h2>
                                    <p>Just added to our catalogue</p>
                                </div>
                                <Link to="/products">
                                    <button className="btn btn-ghost btn-sm">View All</button>
                                </Link>
                            </div>
                            <div className="grid grid-4">
                                {newest.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* ── Trust Badges ─────────────────────────────────── */}
            <section className="section trust-section">
                <div className="container">
                    <div className="trust-grid">
                        {TRUST_BADGES.map((b) => (
                            <div key={b.title} className="trust-card">
                                <span className="trust-icon">{b.icon}</span>
                                <div>
                                    <p className="trust-title">{b.title}</p>
                                    <p className="trust-sub">{b.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-text">
                            <h2>Start Selling on ShopEZ</h2>
                            <p>Join thousands of sellers and grow your business with our platform</p>
                        </div>
                        <Link to="/register">
                            <button className="btn btn-primary btn-lg">Open Your Store</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────── */}
            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <span className="footer-logo">Shop<span className="gradient-text">EZ</span></span>
                        <p>Your one-stop online shopping destination</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/products">Products</Link>
                        <Link to="/register">Sell on ShopEZ</Link>
                        <Link to="/login">Sign In</Link>
                    </div>
                    <p className="footer-copy">&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
