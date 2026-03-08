import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await register(form.name, form.email, form.password, form.role);
            if (data.user.role === 'seller') navigate('/seller/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card animate-in">
                <div className="auth-logo">
                    Shop<span className="gradient-text">EZ</span>
                </div>
                <h1 className="auth-title">Create an account</h1>
                <p className="auth-sub">Join ShopEZ and start shopping or selling today</p>

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button
                        className={`role-btn ${form.role === 'customer' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setForm({ ...form, role: 'customer' })}
                    >
                        Customer
                    </button>
                    <button
                        className={`role-btn ${form.role === 'seller' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setForm({ ...form, role: 'seller' })}
                    >
                        Seller
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            autoComplete="name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        {loading
                            ? 'Creating account...'
                            : `Create ${form.role === 'seller' ? 'Seller' : 'Customer'} Account`}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
