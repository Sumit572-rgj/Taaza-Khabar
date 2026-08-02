import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import './ArticleDetail.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const { fetchArticleById } = useNews();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, fetchArticleById]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mt-5 text-center">
        <h3>Article not found</h3>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isPremiumBlocked = article.isPremium && (!user || user.subscription?.type === 'free');

  return (
    <article className="article-detail">
      <div className="article-header" style={{
        backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="article-header-overlay">
          <div className="container h-100 d-flex align-items-end pb-5">
            <div>
              <div className="mb-3">
                <span className={`badge bg-primary me-2`}>
                  {article.category}
                </span>
                {article.isBreakingNews && (
                  <span className="badge bg-danger me-2">Breaking News</span>
                )}
                {article.isPremium && (
                  <span className="badge bg-warning text-dark">Premium</span>
                )}
              </div>
              <h1 className="article-title mb-3">
                {article.title}
              </h1>
              <div className="article-meta">
                <span className="me-3">👤 By {article.author?.name}</span>
                <span className="me-3">📅 {new Date(article.createdAt).toLocaleDateString()}</span>
                <span>👁️ {article.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container article-body my-5">
        <div className="row">
          <div className="col-lg-8">
            {isPremiumBlocked ? (
              <div className="premium-content-block">
                <div className="premium-icon">💎</div>
                <h3>Premium Content</h3>
                <p>This is premium content available only to subscribers.</p>
                <div className="premium-preview">
                  <p className="text-muted"><strong>Preview:</strong> {article.summary}</p>
                </div>
                <div className="premium-actions">
                  <Link to="/subscriptions" className="btn btn-warning btn-lg">
                    ✨ Upgrade to Premium
                  </Link>
                  <p className="text-muted mt-3">
                    Unlock unlimited access to premium articles and exclusive content.
                  </p>
                </div>
              </div>
            ) : (
              <div className="article-content">
                <div className="article-text">
                  <p>{article.summary}</p>
                  <p>{article.content}</p>
                </div>

                {/* Share buttons */}
                <div className="article-footer mt-5 pt-4 border-top">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="share-buttons">
                      <span className="me-2">Share:</span>
                      <a href="#" className="btn btn-sm btn-outline-primary">Facebook</a>
                      <a href="#" className="btn btn-sm btn-outline-info ms-2">Twitter</a>
                      <a href="#" className="btn btn-sm btn-outline-secondary ms-2">Copy Link</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar-widget">
              <h5>Article Information</h5>
              <ul className="list-unstyled">
                <li><strong>Category:</strong> {article.category}</li>
                <li><strong>Author:</strong> {article.author?.name}</li>
                <li><strong>Published:</strong> {new Date(article.createdAt).toLocaleDateString()}</li>
                <li><strong>Views:</strong> {article.views}</li>
                <li><strong>Type:</strong> {article.isPremium ? 'Premium' : 'Free'}</li>
              </ul>
            </div>

            {!isPremiumBlocked && (
              <div className="sidebar-widget mt-4">
                <h5>About the Author</h5>
                <div className="author-card">
                  <p className="mb-2"><strong>{article.author?.name}</strong></p>
                  <p className="text-muted small">{article.author?.email}</p>
                  <p className="small">Experienced journalist and news correspondent.</p>
                </div>
              </div>
            )}

            {!isPremiumBlocked && article.isPremium && (
              <div className="alert alert-info mt-4">
                <strong>✨ Premium Article</strong>
                <p className="small mb-0 mt-2">You have access to this premium content as a subscriber.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
