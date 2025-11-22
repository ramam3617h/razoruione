
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { plansAPI, subscriptionsAPI, paymentsAPI } from '../services/api';
import RazorpayPayment from './RazorpayPayment';
import Toast from './Toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subsRes, historyRes] = await Promise.allSettled([
        plansAPI.getAll(),
        subscriptionsAPI.getActive(),
        paymentsAPI.getHistory({ page: 1, limit: 10 })
      ]);

      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data);
      if (subsRes.status === 'fulfilled') setActiveSubscription(subsRes.value.data);
      if (historyRes.status === 'fulfilled') setPaymentHistory(historyRes.value.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    fetchData();
    showToast('Payment successful! Subscription activated.', 'success');
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;
    
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      await subscriptionsAPI.cancel(activeSubscription.id, 'User requested cancellation');
      showToast('Subscription cancelled successfully', 'success');
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Cancellation failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-
