import React, { useState, useEffect } from 'react';
// Assuming authAPI is defined and has a verifyEmail function
// import { authAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext';
// Mock authAPI for demonstration purposes
// const authAPI = {
  //verifyEmail: async (token) => {
  //  console.log("Mock API call with token:", token);
    // Simulate API response. In a real app, this makes an actual HTTP call.
    // Replace this with your actual API logic.
   // if (token === "valid-token") {
    //  return { data: { message: "Email verified successfully!" } };
   // } else {
    //  throw new Error("Invalid or expired token.");
   // }
 // }
//};
//

const VerifyEmail = ({ onVerificationSuccess, onBackToLogin }) => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
   
  const { verifyemail } = useAuth();
  useEffect(() => {

    const verifyEmail = async () => {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const vtoken = urlParams.get('token');
        console.log(urlParams);
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token found.');
        return;
      }

      try {
          await verifyemail(vtoken);
        //const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');

        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          onVerificationSuccess();
        }, 3000);
      } catch (error) {
        setStatus('error');
        // Safely access nested error messages
        setMessage(error.response?.data?.error || error.message || 'Email verification failed. Token may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [onVerificationSuccess]);

  // --- Render Logic ---
  return (
    <div className="verify-email-container">
      {status === 'verifying' && (
        <div>
          <h2>Verifying Email...</h2>
          <p>Please wait while we confirm your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="success-message">
          <h2>Verification Successful!</h2>
          <p>{message}</p>
          <p>Redirecting to login page in 3 seconds...</p>
          {/* Optional: Add a manual link just in case the redirect fails */}
          <button onClick={onVerificationSuccess}>
            Go to Login
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="error-message">
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <button onClick={onBackToLogin}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
