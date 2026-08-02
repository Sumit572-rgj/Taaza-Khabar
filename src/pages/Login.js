import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthPages.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      switch (result?.role) {
        case 'admin': navigate('/admin'); break;
        case 'editor': navigate('/editor'); break;
        default: navigate('/'); break;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const toggleDemo = () => {
    if (!showDemo && code !== '98152@@Aba') {
      alert('Enter the correct code to view demo credentials');
      return;
    }
    setShowDemo(!showDemo);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="mb-0">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-section mt-4">
            <small className="text-muted d-block mb-2">Demo Credentials:</small>

            {!showDemo && (
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="form-control mb-2"
              />
            )}

            <button
              type="button"
              onClick={toggleDemo}
              className="btn btn-sm btn-outline-secondary"
            >
              {showDemo ? <FaEyeSlash /> : <FaEye />} {showDemo ? 'Hide' : 'Show'}
            </button>

            {showDemo && (
              <div className="mt-3">
                <div className="demo-box">
                  <small><strong>Admin:</strong> admin@news.com / password123</small>
                </div>
                <div className="demo-box">
                  <small><strong>Editor:</strong> editor@news.com / password123</small>
                </div>
                <div className="demo-box">
                  <small><strong>User:</strong> user@news.com / password123</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
