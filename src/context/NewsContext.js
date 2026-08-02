import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { articlesAPI } from '../services/api';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all articles
  const fetchArticles = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getAll(params);
      setArticles(response.data.articles);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch articles';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch breaking news
  const fetchBreakingNews = useCallback(async () => {
    try {
      const response = await articlesAPI.getBreaking();
      setBreakingNews(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch breaking news:', err);
      setBreakingNews([]); // Set empty array on error
    }
  }, []);

  // Fetch single article
  const fetchArticleById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await articlesAPI.getById(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch article';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create article
  const createArticle = async (data) => {
    try {
      setError(null);
      const response = await articlesAPI.create(data);
      setArticles([response.data.article, ...articles]);
      return response.data.article;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create article';
      setError(errorMessage);
      throw err;
    }
  };

  // Update article
  const updateArticle = async (id, data) => {
    try {
      setError(null);
      const response = await articlesAPI.update(id, data);
      setArticles(articles.map(a => a._id === id ? response.data.article : a));
      return response.data.article;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update article';
      setError(errorMessage);
      throw err;
    }
  };

  // Delete article
  const deleteArticle = async (id) => {
    try {
      setError(null);
      await articlesAPI.delete(id);
      setArticles(articles.filter(a => a._id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete article';
      setError(errorMessage);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBreakingNews();
        await fetchArticles({ page: 1, limit: 12 });
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };
    loadData();
  }, [fetchArticles, fetchBreakingNews]);

  const value = {
    articles,
    breakingNews,
    loading,
    error,
    fetchArticles,
    fetchBreakingNews,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
};
