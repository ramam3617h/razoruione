
// ============================================
// 1. VerifyEmail Component - frontend/src/components/VerifyEmail.js
// ============================================

import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

//const VerifyEmail = ({ onVerificationSuccess, onBackToLogin }) => {
 // const [status, setStatus] = useState('verifying');

const VerifyEmail = ({ onVerificationSuccess, onBackToLogin }) => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token found.');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          onVerificationSuccess();
        }, 3000);
      } catch (error) {
         setStatus('error');
        setMessage(error.response?.data?.error || 'Email verification failed. Token may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [onVerificationSuccess]);

   return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>

		<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600"> email address verfied...</p>

         {/*   <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8
          /*}
       )}
   

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-10 w-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 1>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={onBackToLogin}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition->
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default verifyEmail;
