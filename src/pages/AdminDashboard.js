import React, { useEffect, useState } from 'react';
import { usersAPI, articlesAPI, subscriptionsAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'world',
    isPremium: false,
    isBreakingNews: false
  });
  const [editArticle, setEditArticle] = useState(null);

  useEffect(() => {
    loadUsers();
    loadArticles();
    loadSubscriptions();
  }, []);

  // USERS
  const loadUsers = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteUser = async (id) => {
    await usersAPI.delete(id);
    loadUsers();
  };
  const handleAssignRole = async (id, role) => {
    await usersAPI.assignRole(id, role);
    loadUsers();
  };

  // ARTICLES
  const loadArticles = async () => {
    try {
      const res = await articlesAPI.getAll();
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreateArticle = async (e) => {
    e.preventDefault();
    await articlesAPI.create(newArticle);
    setNewArticle({ title: '', summary: '', content: '', category: 'world', isPremium: false, isBreakingNews: false });
    loadArticles();
  };
  const handleDeleteArticle = async (id) => {
    await articlesAPI.delete(id);
    loadArticles();
  };
  const handleUpdateArticle = async (id, updated) => {
    await articlesAPI.update(id, updated);
    setEditArticle(null);
    loadArticles();
  };

  // SUBSCRIPTIONS
  const loadSubscriptions = async () => {
    try {
      const res = await subscriptionsAPI.getAll();
      setSubscriptions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* USERS */}
      <section className="dashboard-section">
        <h3 className="section-title">Manage Users</h3>
        {users.map(u => (
          <div key={u._id} className="card-item">
            <div className="card-content">
              <p><strong>{u.name}</strong> ({u.email})</p>
              <span className={`role-badge role-${u.role}`}>{u.role}</span>
            </div>
            <select defaultValue={u.role} onChange={(e) => handleAssignRole(u._id, e.target.value)}>
              <option value="guest">Guest</option>
              <option value="subscriber">Subscriber</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-danger" onClick={() => handleDeleteUser(u._id)}>Delete</button>
          </div>
        ))}
      </section>

      {/* ARTICLES */}
      <section className="dashboard-section">
        <h3 className="section-title">Manage Articles</h3>

        {/* Create Article Form */}
        <form className="article-form" onSubmit={handleCreateArticle}>
          <input type="text" placeholder="Title" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} required />
          <input type="text" placeholder="Summary" value={newArticle.summary} onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })} required />
          <textarea placeholder="Content" value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} required />
          <select value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}>
            <option value="world">World</option>
            <option value="politics">Politics</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
          </select>
          <label><input type="checkbox" checked={newArticle.isPremium} onChange={(e) => setNewArticle({ ...newArticle, isPremium: e.target.checked })} /> Premium</label>
          <label><input type="checkbox" checked={newArticle.isBreakingNews} onChange={(e) => setNewArticle({ ...newArticle, isBreakingNews: e.target.checked })} /> Breaking News</label>
          <button type="submit" className="btn btn-primary">Create Article</button>
        </form>

        {/* Article List */}
        {articles.map(a => (
          <div key={a._id} className="card-item">
            {editArticle === a._id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateArticle(a._id, { ...a, content: e.target.content.value }); }}>
                <input name="title" defaultValue={a.title} />
                <textarea name="content" defaultValue={a.content} />
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditArticle(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="card-content">
                  <p><strong>{a.title}</strong></p>
                  <p className="category">{a.category}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setEditArticle(a._id)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteArticle(a._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* SUBSCRIPTIONS */}
      <section className="dashboard-section">
        <h3 className="section-title">Customer Subscriptions</h3>
        {subscriptions.map(s => (
          <div key={s._id} className="card-item">
            <p>User: {s.userId?.name || s.userId} | Plan: {s.planType} | Status: {s.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
