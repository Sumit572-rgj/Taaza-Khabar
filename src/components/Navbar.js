import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar(props) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout()
      navigate('/')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          📰 {props.title || "Daily News"}
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNews"
          aria-controls="navbarNews"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links + right corner */}
        <div className="collapse navbar-collapse" id="navbarNews">
          {/* Left side nav links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/world">World</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/politics">Politics</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/technology">Technology</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/business">Business</Link></li>
          </ul>

          {/* Right corner container */}
          <div className="navbar-right d-flex align-items-center flex-wrap gap-2">
            <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Search news..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-success btn-sm ms-2" type="submit">Search</button>
            </form>

            {isAuthenticated ? (
              <div className="navbar-auth-group d-flex align-items-center gap-2">
                <Link className="btn btn-primary btn-sm" to="/subscriptions">💎 Subscription</Link>
                <span className="text-light">👤 {user?.name}</span>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-auth-group d-flex gap-2">
                <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
                <Link className="btn btn-success btn-sm" to="/signup">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
