import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './utils/oktaAuth';
import './AllAppStyles.css';

const App: React.FC = () => {

  const [isAuth, setIsAuth] = useState<boolean | undefined>(false);

  useEffect(() => {
    Auth.isAuth().then(isAuth => setIsAuth(isAuth));
    Auth.getAuthState(auth => {
      setIsAuth(auth.isAuthenticated)
    });

    return () => Auth.unsubscribe();
  }, [isAuth]);
  
  return !isAuth ? (
    <Login />
  ) : (
    <Dashboard />
  );
}

export default App;
