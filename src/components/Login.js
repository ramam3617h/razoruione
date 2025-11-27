
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const Login = ({onSwitchToResetPassword,onSwitchToPolicyPages,onSwitchToRegister,onSwitchToForgetPassword, onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center"> Vrksa Tech Welcomes you</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-yellow-600 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Forget Password?{' '}
            <button
               onClick={onSwitchToForgetPassword}
              className="text-yellow-600 font-semibold hover:underline"
            >
               ForgetPassword
            </button>
          </p>
        </div>
	<div className="mt-6 text-center">
          <p className="text-gray-600">
            Password Reset?{' '}
            <button
               onClick={onSwitchToResetPassword}
              className="text-yellow-600 font-semibold hover:underline"
            >
                Password Reset
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Terms and condition and Policy{' '}
            <button
              onClick={onSwitchToPolicyPages}
              className="text-yellow-600 font-semibold hover:underline"
            >
	      PolicyPage
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
