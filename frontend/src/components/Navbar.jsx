import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🛒</span>
                    <span>Shop<span className="gradient-text">EZ</span></span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                    {user ? (
                        <>
                            <Link to="/cart" onClick={() => setMenuOpen(false)}>🛍️ Cart</Link>
                            <Link to="/my-orders" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                            {(user.role === 'seller' || user.role === 'admin') && (
                                <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                            )}
                            <div className="navbar-user">
                                <span className="user-avatar">{user.name?.charAt(0)}</span>
                                <span className="user-name">{user.name}</span>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}>
                                <button className="btn btn-outline btn-sm">Login</button>
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>
                                <button className="btn btn-primary btn-sm">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
