import React, { useState, useEffect } from 'react';
import { articlesAPI } from '../../services/api';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'world',
    imageUrl: '',
    isPremium: false,
    isBreakingNews: false
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articlesAPI.getAll();
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error('Fetch articles error:', err.response?.data || err.message);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newArticle };
      await articlesAPI.create(payload);

      // Reset form
      setNewArticle({
        title: '',
        summary: '',
        content: '',
        category: 'world',
        imageUrl: '',
        isPremium: false,
        isBreakingNews: false
      });

      // Refresh list
      const res = await articlesAPI.getAll();
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error('Create article error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to create article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await articlesAPI.delete(id);
      setArticles(prev => prev.filter(article => article._id !== id));
    } catch (err) {
      console.error('Delete article error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to delete article');
    }
  };

  return (
    <div className="articles-page">
      <h2>Manage Articles</h2>

      <form onSubmit={handleCreate} className="article-form">
        <input
          type="text"
          name="title"
          placeholder="Title (min 5 chars)"
          value={newArticle.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="summary"
          placeholder="Summary (min 10 chars)"
          value={newArticle.summary}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content (min 20 chars)"
          value={newArticle.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newArticle.imageUrl}
          onChange={handleChange}
        />
        <select
          name="category"
          value={newArticle.category}
          onChange={handleChange}
          required
        >
          <option value="world">World</option>
          <option value="politics">Politics</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
        </select>
        <label>
          <input
            type="checkbox"
            name="isPremium"
            checked={newArticle.isPremium}
            onChange={handleChange}
          />
          Premium Article
        </label>
        <label>
          <input
            type="checkbox"
            name="isBreakingNews"
            checked={newArticle.isBreakingNews}
            onChange={handleChange}
          />
          Breaking News
        </label>
        <button type="submit">Create Article</button>
      </form>

      <h3>Existing Articles</h3>
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <strong>{article.title}</strong> ({article.category})
            {article.isPremium && <span> 🔒 Premium</span>}
            {article.isBreakingNews && <span> ⚡ Breaking</span>}
            <button
              onClick={() => handleDelete(article._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
