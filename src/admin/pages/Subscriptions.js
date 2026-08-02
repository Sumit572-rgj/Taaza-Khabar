import React, { useState, useEffect } from 'react';
import { subscriptionsAPI } from '../../services/api';

export default function SubscriptionsAdmin() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingSub, setEditingSub] = useState(null);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await subscriptionsAPI.getAll();
        setSubscriptions(res.data.subscriptions || []);
      } catch (err) {
        console.error('Fetch subscriptions error:', err.response?.data || err.message);
      }
    };
    fetchSubs();
  }, []);

  const handleEdit = (sub) => {
    setEditingSub({ ...sub });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingSub(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyChanges = async () => {
    if (!editingSub) return;
    try {
      await subscriptionsAPI.update(editingSub._id, editingSub);
      setSubscriptions(prev =>
        prev.map(s => (s._id === editingSub._id ? editingSub : s))
      );
      setEditingSub(null);
      alert('Subscription updated successfully');
    } catch (err) {
      console.error('Update subscription error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to update subscription');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await subscriptionsAPI.delete(id);
      setSubscriptions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete subscription error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to delete subscription');
    }
  };

  return (
    <div className="subscriptions-admin-page">
      <h2>Manage Subscriptions</h2>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub._id}>
            <strong>User:</strong> {sub.userId?.email || 'Unknown'} — 
            <strong> Plan:</strong> {sub.planType} — 
            <strong> Status:</strong> {sub.status}
            <button onClick={() => handleEdit(sub)} style={{ marginLeft: '10px' }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(sub._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingSub && (
        <div className="edit-sub-form">
          <h3>Edit Subscription</h3>
          <select
            name="planType"
            value={editingSub.planType}
            onChange={handleChange}
          >
            <option value="free">Free</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            name="status"
            value={editingSub.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <input
            type="number"
            name="price"
            value={editingSub.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <button onClick={handleApplyChanges} style={{ marginTop: '10px' }}>
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}
