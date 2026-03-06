import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(form.email, form.password);
            if (data.user.role === 'seller' || data.user.role === 'admin') {
                navigate('/seller/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card animate-in">
                <div className="auth-logo">🛒 Shop<span className="gradient-text">EZ</span></div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-sub">Sign in to your account to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one</Link>
                </p>

                <div className="auth-demo">
                    <p>Demo Accounts:</p>
                    <button className="demo-btn" onClick={() => setForm({ email: 'customer@demo.com', password: 'demo123' })}>Customer Demo</button>
                    <button className="demo-btn" onClick={() => setForm({ email: 'seller@demo.com', password: 'demo123' })}>Seller Demo</button>
                </div>
            </div>
        </div>
    );
}
