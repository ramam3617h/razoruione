
// ============================================
// FILE: frontend/src/components/PaymentModal.js (COMPLETE REWRITE)
// ============================================
import React, { useState } from 'react';
import { paymentsAPI } from '../services/api';

const PaymentModal = ({ plan, user, onClose, onSuccess, onError }) => {
  const [processing, setProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Step 1: Create order on backend
      const orderResponse = await paymentsAPI.createOrder({
        plan_id: plan.id
      });

      const { order_id, amount, currency, key_id } = orderResponse.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'Vrksa Technology Service Platform',
        description: `${plan.name} Plan Subscription`,
        order_id: order_id,
        prefill: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        },
        theme: {
          color: '#DC2626'
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              onSuccess();
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            onError(error.response?.data?.error || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            onError('Payment cancelled by user');
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      onError(error.message || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="bg-white rounded-2xl max-w-md w-full h-.8 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 text-white">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold">Razorpay Payment</h2>
            <button
              onClick={onClose}
              disabled={processing}
              className="text-white hover:text-gray-200 text-2xl"
            > x
            </button>
          </div>
          <p className="text-sm opacity-90">Complete your payment securely</p>
        </div>

        <div className="p-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-1 mb-1">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name} Plan</h3>
              <p className="text-gray-600 mb-1">{plan.description}</p>
              <div className="mb-1">
                <span className="text-5xl font-bold text-blue-600">  {plan.price}</span>
                <span className="text-gray-600 ml-2">/{plan.billing_period}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-1 mb-1">
            <h4 className="font-semibold text-gray-900 mb-1">Payment Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-medium text-gray-900">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-900">Included</span>
              </div>
              <div className="border-t pt-1 mt-1 flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">  {plan.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay with Razorpay
              </>
            )}
          </button>

          <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Payment powered by Razorpay
          </div>

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
