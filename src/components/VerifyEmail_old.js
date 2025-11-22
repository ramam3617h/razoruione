import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming React Router
//import { authAPI } from '../services/api';
import axios from 'axios';

const API_BASE_URL_VE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL_VE,
  headers: {
    'Content-Type': 'application/json'
  }
});


const VerifyEmail = () => {
  const { token } = useParams(); // Get token from URL params
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response =  fetch(`http://localhost:5000/api/v1/auth/verify-email/${token}`);
      //  const response = apiv.get(`/auth/verify-email?token=${token}`); 
           // const response = await  authApi.verifyEmail(vtoken); 
     //  axios.get(`http://localhost:5000/api/v1/auth/verify-email/${token}`)
     // .then(response => {   console.log('email verified or not ',response.data);     })
     //  .catch(error => { console.error('Error creating post',error );});
           const data = await response.json();
        if (response.ok) {
          alert(data.message); // e.g., "Email verified successfully!"
          navigate('/dashboard'); // Redirect to a protected route
        } else {
          alert(data.error);
          navigate('/login'); // Redirect to login or error page
        }
      } catch (error) {
        console.error('Email verification error:', error);
        alert('An error occurred during email verification.');
        navigate('/login');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  return (
    <div>
      <p>Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
