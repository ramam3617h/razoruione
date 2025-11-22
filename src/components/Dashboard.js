
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { plansAPI, subscriptionsAPI, paymentsAPI } from '../services/api';
import PaymentModal from './PaymentModal';
 //import RazorpayPayment from './RazorpayPayment';
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

      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data || []);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900"> Hiring a   Developer from VRKSA TECHNOLOGY </h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-500 hover:text-gray-900 font-medium"
            >
              Payment History
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{user?.first_name}</span>
              <button
                onClick={logout}
                className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Subscription */}
        {activeSubscription && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Active Subscription</h3>
                <p className="text-green-700">
                  <strong>{activeSubscription.name}</strong>  โน{activeSubscription.price}/{activeSubscription.billing_period}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Valid until: {new Date(activeSubscription.end_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                className="text-sm text-violet-600 hover:text-red-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ร
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {paymentHistory.length === 0 ? (
                  <p className="text-center text-gray-500">No payment history yet</p>
                ) : (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{payment.plan_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.created_at).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-violet-100 text-violet-700'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">ID: {payment.transaction_id}</span>
                          <span className="font-bold text-gray-900">น{payment.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plans Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your  Developer and DevOps Engineer</h2>
          <p className="text-xl text-gray-700">Hourly  pricing plan - MNCs  can choose their associates</p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          { plans.map((plan) => {
         {/*    const features = JSON.parse(plan.features);  */}
            const isPopular = plan.is_popular;
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${
                  isPopular ? 'ring-4 ring-violet-500' : 'ring-4 ring-yellow-500'
                }`}
              >
                {isPopular && (
                  <div className="bg-violet-600 text-white text-center py-2 px-4 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">โน{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.billing_period}</span>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={activeSubscription?.plan_id === plan.id}
                    className={`w-full font-semibold py-3 rounded-lg transition-colors mb-6 ${
                      activeSubscription?.plan_id === plan.id
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700'
                    }`}
                  >
                    {activeSubscription?.plan_id === plan.id ? 'Current Plan' : 'Get Started'}
                  </button>

                  <div className="space-y-3">
                 {/*  {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="text-green-600 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Razorpay Payment Modal */}
   {/*   {showPayment && selectedPlan && (
        <RazorpayPayment
          plan={selectedPlan}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          onError={(msg) => showToast(msg, 'error')}
        />
      )} */}
       {showPayment && selectedPlan && (
  <PaymentModal
    plan={selectedPlan}
    user={user}  // Add this line
    onClose={() => setShowPayment(false)}
    onSuccess={handlePaymentSuccess}
    onError={(msg) => showToast(msg, 'error')}
  />
)}
    </div>
  );
};

export default Dashboard;
