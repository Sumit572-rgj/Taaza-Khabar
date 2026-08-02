import React from 'react';

export default function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2>Admin Panel</h2>
      <div className="admin-actions">
        <button className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
}
