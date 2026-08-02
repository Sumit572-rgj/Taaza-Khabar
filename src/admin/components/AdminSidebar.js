import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <ul>
        <li><NavLink to="/admin" end>Dashboard</NavLink></li>
        <li><NavLink to="/admin/users">Users</NavLink></li>
        <li><NavLink to="/admin/articles">Articles</NavLink></li>
        <li><NavLink to="/admin/subscriptions">Subscriptions</NavLink></li>
      </ul>
    </aside>
  );
}
