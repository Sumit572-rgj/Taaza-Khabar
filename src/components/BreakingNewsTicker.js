import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BreakingNewsTicker.css';

export default function BreakingNewsTicker({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) {
    return null;
  }

  const current = articles[currentIndex];

  return (
    <div className="breaking-news-ticker">
      <div className="ticker-container">
        <div className="ticker-badge">
          <span className="badge-text">🔴 BREAKING NEWS</span>
        </div>

        <div className="ticker-content">
          <Link to={`/article/${current._id}`} className="ticker-link">
            <span className="ticker-text">{current.title}</span>
          </Link>
        </div>

        <div className="ticker-nav">
          {articles.length > 1 && (
            <>
              <button 
                className="nav-btn prev-btn"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)}
              >
                ←
              </button>
              <span className="nav-indicator">
                {currentIndex + 1} / {articles.length}
              </span>
              <button 
                className="nav-btn next-btn"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % articles.length)}
              >
                →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ticker dots indicator */}
      {articles.length > 1 && (
        <div className="ticker-dots">
          {articles.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
