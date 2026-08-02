import React, { useEffect, useState } from 'react';
import { usersAPI, articlesAPI, subscriptionsAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, articles: 0, subs: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const userRes = await usersAPI.getAll();
      const articleRes = await articlesAPI.getAll();
      const subsRes = await subscriptionsAPI.getAll();
      setStats({
        users: userRes.data.users.length,
        articles: articleRes.data.articles.length,
        subs: subsRes.data.length
      });
    };
    loadStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">Users: {stats.users}</div>
        <div className="stat-card">Articles: {stats.articles}</div>
        <div className="stat-card">Subscriptions: {stats.subs}</div>
      </div>
    </div>
  );
}
