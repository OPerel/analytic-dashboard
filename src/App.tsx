import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

import Auth from './utils/oktaAuth';

import './App.css';

const App: React.FC = () => {

  const [isAuth, setIsAuth] = useState<boolean | undefined>(false);

  useEffect(() => {
    Auth.isAuth().then(isAuth => setIsAuth(isAuth));
    Auth.getAuthState(auth => {
      setIsAuth(auth.isAuthenticated)
    })
  }, [isAuth]);

  // console.log('App isAuth: ', isAuth)
  
  return isAuth ? (
    <Login />
  ) : (
    <Dashboard />
  );
}

export default App;
