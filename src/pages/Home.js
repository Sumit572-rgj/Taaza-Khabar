import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import BreakingNewsTicker from '../components/BreakingNewsTicker';
import { useNews } from '../context/NewsContext';
import './Home.css';

export default function Home() {
  const { articles, breakingNews, loading, fetchArticles } = useNews();
  const [searchParams] = useSearchParams();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const category = searchParams.get('category');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        if (category) {
          await fetchArticles({ category, page: 1, limit: 12 });
          setSelectedCategory(category);
        } else {
          await fetchArticles({ page: 1, limit: 12 });
          setSelectedCategory('');
        }
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to load articles:', err);
      }
    };
    loadArticles();
  }, [category]);

  useEffect(() => {
    setFilteredArticles(articles);
  }, [articles]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    fetchArticles({ category: cat, page: 1, limit: 12 });
  };

  return (
    <div className="home-page">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <BreakingNewsTicker articles={breakingNews} />
      )}

      {/* Category Filter */}
      <div className="category-filter-section">
        <div className="container py-4">
          <h6 className="mb-3">BROWSE BY CATEGORY</h6>
          <div className="category-buttons">
            <button 
              className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('')}
            >
              All News
            </button>
            {['world', 'politics', 'sports', 'entertainment', 'technology', 'business'].map(cat => (
              <button 
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {filteredArticles.length > 0 ? (
              <>
                {/* Hero Article */}
                {filteredArticles.length > 0 && (
                  <div className="hero-article mb-5">
                    <div className="row g-4 align-items-center">
                      <div className="col-lg-7">
                        {filteredArticles[0].imageUrl && (
                          <img 
                            src={filteredArticles[0].imageUrl} 
                            alt={filteredArticles[0].title}
                            className="img-fluid hero-image rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/600x400';
                            }}
                          />
                        )}
                      </div>
                      <div className="col-lg-5">
                        <h2 className="hero-title mb-3">
                          {filteredArticles[0].title}
                        </h2>
                        <p className="hero-summary mb-3">
                          {filteredArticles[0].summary}
                        </p>
                        <div className="mb-3">
                          <span className="badge bg-danger me-2">Featured</span>
                          <span className="badge bg-secondary">
                            {filteredArticles[0].category}
                          </span>
                        </div>
                        <a 
                          href={`/article/${filteredArticles[0]._id}`}
                          className="btn btn-primary"
                        >
                          Read Full Story →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* News Grid */}
                <h3 className="mb-4">Latest News</h3>
                <div className="row g-4">
                  {filteredArticles.slice(1).map(article => (
                    <div key={article._id} className="col-md-6 col-lg-4">
                      <NewsCard article={article} />
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-5">
                  <button className="btn btn-outline-primary btn-lg">
                    Load More Articles
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <h3>No articles found</h3>
                <p className="text-muted">Try selecting a different category or check back later.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
