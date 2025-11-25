
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PolicyPages from './components/PolicyPages';

const AppContent = () => {
  const [view, setView] = useState('login');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setView('dashboard');
      } else {
        setView('login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-centre">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return(
    <>
      {view === 'login' && ( <Login
          onSwitchToRegister={() => setView('register')}
          onLoginSuccess={() => setView('dashboard')}
          onSwitchToPolicyPages={() => setView('policypages') }
        />
      )}
 
      {view === 'register' && (
        <Register
          onSwitchToLogin={() => setView('login')}
          onRegisterSuccess={() => {
            setView('login');
            alert('Registration successful! Please check your email to verify your account before logging i');
          }}
        />
       )}
      
     { view === 'policypages' && (<PolicyPages /> )}

      {view === 'dashboard' && user && <Dashboard />}
      
   </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

