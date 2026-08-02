import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionsAPI } from '../services/api';
import './Subscriptions.css';

export default function Subscriptions() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // removed unused 'user'
  const [plans, setPlans] = useState(null); // will use this now
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch plans
        const plansResponse = await subscriptionsAPI.getPlans();
        setPlans(plansResponse.data.plans);

        // Fetch current subscription if authenticated
        if (isAuthenticated) {
          const subResponse = await subscriptionsAPI.getMySubscription();
          setCurrentSubscription(subResponse.data.subscription);
        }
      } catch (err) {
        setError('Failed to load subscription data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleUpgrade = async (planType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUpgrading(planType);
    try {
      setError('');
      const response = await subscriptionsAPI.upgrade(planType);
      setCurrentSubscription(response.data.subscription);
    } catch (err) {
      setError(err.response?.data?.error || 'Upgrade failed');
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        setError('');
        await subscriptionsAPI.cancel();
        setCurrentSubscription(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Cancellation failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-hero">
        <div className="container py-5 text-center text-white">
          <h1 className="display-4 mb-3 fw-bold">Choose Your Plan</h1>
          <p className="lead">Get unlimited access to premium news content</p>
        </div>
      </div>

      <div className="container my-5">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {currentSubscription && (
          <div className="alert alert-info mb-4">
            <strong>Current Plan:</strong> {currentSubscription.planType} 
            {currentSubscription.endDate && ` (Expires: ${new Date(currentSubscription.endDate).toLocaleDateString()})`}
          </div>
        )}

        {/* Example usage of plans */}
        {plans && (
          <div className="alert alert-secondary mb-4">
            <strong>Available Plans:</strong> {Object.keys(plans).join(', ')}
          </div>
        )}

        {/* ... keep your plan cards here ... */}
      </div>
    </div>
  );
}
