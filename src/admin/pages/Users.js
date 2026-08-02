import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersAPI.getAll();
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Fetch users error:', err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyChanges = async () => {
    if (!editingUser) return;
    try {
      await usersAPI.update(editingUser._id, editingUser);
      setUsers(prev =>
        prev.map(u => (u._id === editingUser._id ? editingUser : u))
      );
      setEditingUser(null);
      alert('User updated successfully');
    } catch (err) {
      console.error('Update user error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Delete user error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="users-page">
      <h2>Manage Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <strong>{user.name}</strong> ({user.email}) — Role: {user.role}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingUser && (
        <div className="edit-user-form">
          <h3>Edit User</h3>
          <input
            type="text"
            name="name"
            value={editingUser.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={editingUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <select
            name="role"
            value={editingUser.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="subscriber">Subscriber</option>
          </select>
          <button onClick={handleApplyChanges} style={{ marginTop: '10px' }}>
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}
