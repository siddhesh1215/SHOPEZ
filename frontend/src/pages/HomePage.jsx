import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../api/axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys'];
const CAT_ICONS = { Electronics: '💻', Fashion: '👗', 'Home & Kitchen': '🏠', Sports: '⚽', Books: '📚', Beauty: '💄', Toys: '🧸' };

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [newest, setNewest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getFeaturedProducts(), getProducts({ limit: 8, sort: 'newest' })])
            .then(([feat, all]) => {
                setFeatured(feat.data.products);
                setNewest(all.data.products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container hero-content animate-in">
                    <div className="hero-badge">🎉 New Arrivals Every Week</div>
                    <h1 className="hero-title">
                        Shop <span className="gradient-text">Smarter</span>,<br />
                        Live <span className="gradient-text">Better</span>
                    </h1>
                    <p className="hero-sub">Discover thousands of products from trusted sellers. Fast delivery, easy returns.</p>
                    <div className="hero-actions">
                        <Link to="/products"><button className="btn btn-primary btn-lg">🛍️ Shop Now</button></Link>
                        <Link to="/register"><button className="btn btn-outline btn-lg">Become a Seller</button></Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><span className="stat-num">10K+</span><span>Products</span></div>
                        <div className="stat"><span className="stat-num">5K+</span><span>Sellers</span></div>
                        <div className="stat"><span className="stat-num">50K+</span><span>Happy Customers</span></div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by <span className="gradient-text">Category</span></h2>
                        <p>Browse our curated collections</p>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map((cat) => (
                            <Link key={cat} to={`/products?category=${cat}`} className="cat-card">
                                <span className="cat-icon">{CAT_ICONS[cat]}</span>
                                <span className="cat-name">{cat}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {loading ? (
                <div className="spinner-wrap"><div className="spinner"></div></div>
            ) : (
                <>
                    {featured.length > 0 && (
                        <section className="section" style={{ paddingTop: 0 }}>
                            <div className="container">
                                <div className="section-header">
                                    <h2>⭐ <span className="gradient-text">Featured</span> Products</h2>
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
                            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2>🆕 <span className="gradient-text">New</span> Arrivals</h2>
                                    <p>Just landed in our store</p>
                                </div>
                                <Link to="/products"><button className="btn btn-outline">View All →</button></Link>
                            </div>
                            <div className="grid grid-4">
                                {newest.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div>
                            <h2>Ready to start selling?</h2>
                            <p>Join thousands of sellers on ShopEZ and grow your business</p>
                        </div>
                        <Link to="/register"><button className="btn btn-primary btn-lg">Start Selling Today</button></Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        🛒 Shop<span className="gradient-text">EZ</span>
                        <p>Your one-stop online shopping destination</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/products">Products</Link>
                        <Link to="/register">Sell on ShopEZ</Link>
                        <Link to="/login">Login</Link>
                    </div>
                    <p className="footer-copy">© 2024 ShopEZ. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
