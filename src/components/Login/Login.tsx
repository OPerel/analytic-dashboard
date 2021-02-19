import React, { useState } from 'react'

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
  
  const handleLogin = () => {}

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

        <button onClick={handleLogin}>Login</button>

      </form>
    </div>
  )
}

export default Login;
