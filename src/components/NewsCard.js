import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

export default function NewsCard({ article }) {
  const getCategoryBadgeColor = (category) => {
    const colors = {
      world: 'primary',
      politics: 'danger',
      sports: 'success',
      entertainment: 'warning',
      technology: 'info',
      business: 'secondary'
    };
    return colors[category] || 'dark';
  };

  return (
    <div className="news-card">
      <div className="card h-100 shadow-sm border-0">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            className="card-img-top news-card-img" 
            alt={article.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=News+Image';
            }}
          />
        )}

        {!article.imageUrl && (
          <div className="card-img-top news-card-placeholder">
            <span>📰</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <span className={`badge bg-${getCategoryBadgeColor(article.category)} me-2`}>
              {article.category}
            </span>
            {article.isPremium && (
              <span className="badge bg-warning text-dark">Premium</span>
            )}
            {article.isBreakingNews && (
              <span className="badge bg-danger">Breaking</span>
            )}
          </div>

          <h5 className="card-title flex-grow-1">
            {article.title}
          </h5>

          <p className="card-text text-muted small">
            {article.summary.substring(0, 100)}...
          </p>

          <div className="card-footer bg-transparent border-top pt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">
                👤 {article.author?.name || 'Unknown'}
              </small>
              <small className="text-muted">
                👁️ {article.views} views
              </small>
            </div>
            <Link 
              to={`/article/${article._id}`} 
              className="btn btn-sm btn-outline-primary w-100"
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
