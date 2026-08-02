import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-white mt-5 py-3">
      <div className="container">
        <div className="row mb-2">
          {/* Brand Section */}
          <div className="col-md-4 mb-2">
            <h5 className="footer-title">📰 Daily News</h5>
            <p className="footer-description">
              Your trusted source for breaking news, in-depth reporting, and analysis from around the world.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-icon">f</a>
              <a href="#" aria-label="Twitter" className="social-icon">𝕏</a>
              <a href="#" aria-label="LinkedIn" className="social-icon">in</a>
              <a href="#" aria-label="Instagram" className="social-icon">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-2">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/world">World</Link></li>
              <li><Link to="/technology">Technology</Link></li>
              <li><Link to="/business">Business</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-md-2 mb-2">
            <h6 className="footer-title">Categories</h6>
            <ul className="footer-links">
              <li><Link to="/politics">Politics</Link></li>
              <li><Link to="/sports">Sports</Link></li>
              <li><Link to="/entertainment">Entertainment</Link></li>
            </ul>
          </div>

          {/* Info Links */}
          <div className="col-md-2 mb-2">
            <h6 className="footer-title">Information</h6>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-2 mb-2">
            <h6 className="footer-title">Newsletter</h6>
            <p className="small">Get the latest news delivered to your inbox.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email" 
                className="form-control form-control-sm mb-2"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm w-100">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 small">
              &copy; {currentYear} Daily News. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 small">
              Made with ❤️ | Powered by React & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
