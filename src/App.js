import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ArticleDetail from './pages/ArticleDetail';
import Subscriptions from './pages/Subscriptions';

// Admin & Editor dashboards
import AdminDashboard from './admin/AdminApp';
import EditorDashboard from './editor/pages/EditorDashboard';

// Optional: Profile page if you want
// import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NewsProvider>
            <div className="app-wrapper">
              <Navbar title="Daily News" />
              <main className="app-main">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />

                  {/* Category Routes */}
                  <Route path="/world" element={<Home />} />
                  <Route path="/politics" element={<Home />} />
                  <Route path="/sports" element={<Home />} />
                  <Route path="/entertainment" element={<Home />} />
                  <Route path="/technology" element={<Home />} />
                  <Route path="/business" element={<Home />} />

                  {/* Editor Routes */}
                  <Route
                    path="/editor/*"
                    element={
                      <ProtectedRoute requiredRole="editor">
                        <EditorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Profile Example */}
                  {/* <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  /> */}

                  {/* Fallback Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NewsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1>404 - Page Not Found</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </div>
  );
}

export default App;
