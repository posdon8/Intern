import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = ({closeLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');  

    try {
     
      const response = await axios.post('http://localhost:5001/login', {
        username,
        password,
      }, { withCredentials: true });

     
      if (response.data.success) {
        Cookies.set('token', response.data.token );
        Cookies.set('role', response.data.role);
        console.log('Token:', response.data.token); 
        console.log('Login successful:', response.data);
      
        localStorage.setItem('token', response.data.token);
        closeLogin();
     
      }
    } catch (err) {

      console.error('Login failed:', err);
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };
 
  

  return (
    <div className="login-overlay">
      <div className="login-form">
        <h2>Đăng nhập</h2>
      
        <form onSubmit={handleLogin}>
          <label>
            Tên đăng nhập:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Đăng nhập</button>
        </form>
        <button onClick={closeLogin} className="close-btn">Đóng</button>
      </div>
    </div>
  );
}
export default Login;
