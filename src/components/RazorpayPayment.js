
import React, { useState } from 'react';
import { paymentsAPI } from '../services/api';

const RazorpayPayment = ({ plan, onClose, onSuccess, onError }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Step 1: Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder({
        plan_id: plan.id
      });

      const { order_id, amount, currency, key_id, payment_id, user } = orderResponse.data;

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'Service Platform',
        description: `${plan.name} Plan Subscription`,
        order_id: order_id,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#DC2626'
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              payment_id: payment_id
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
            onError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setProcessing(false);
      onError(error.response?.data?.error || 'Failed to initiate payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Razorpay Payment</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm opacity-90">Secure payment gateway</p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Plan Selected:</span>
              <span className="font-semibold text-gray-900">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount to Pay:</span>
              <span className="text-2xl font-bold text-blue-600">₹{plan.price}</span>
            </div>
          </div>

          {/* Payment Features */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Credit/Debit Cards accepted
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              UPI (PhonePe, GPay, Paytm)
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Net Banking
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Wallets (Paytm, PhonePe, etc.)
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Pay with Razorpay ₹{plan.price}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;

