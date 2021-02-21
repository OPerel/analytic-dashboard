import React, { useState, useEffect } from 'react';
import Auth from '../../utils/oktaAuth';

interface LoginForm {
  email: string,
  password: string
}

const initialLoginState = {
  email: '',
  password: ''
}

const Login: React.FC = () => {
  
  const [login, setLogin] = useState<LoginForm>(initialLoginState);
  
  const handleLogin = (e?: React.MouseEvent) => {
    e?.preventDefault();
    Auth.login(login.email, login.password);
  }

  useEffect(() => {
    document.getElementById('form')?.addEventListener('keypress', e => {
      if (e.key === 'enter' && login.password && login.email) {
        handleLogin();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <form>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={login.email}
            onChange={e => setLogin({ ...login, email: e.target.value })}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
          />
        </div>

        <button onClick={e => handleLogin(e)}>Login</button>

      </form>
    </div>
  )
}

export default Login;
