import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show a loading spinner while auth state is being resolved
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user?.role)) {
      // If user is authenticated but not authorized
      return (
        <div className="container mt-5 text-center">
          <h2 className="text-danger">Access Denied</h2>
          <p className="text-muted">You don’t have permission to access this page.</p>
          <a href="/" className="btn btn-primary">Back to Home</a>
        </div>
      );
    }
  }

  // Render the protected content
  return children;
}
