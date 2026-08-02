import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Articles from './pages/Articles';
import Subscriptions from './pages/Subscriptions';
import './AdminApp.css';

export default function AdminApp() {
  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <div className="admin-content">
        <AdminSidebar />
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
