import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');  // Clear any previous errors

    try {
      // Gửi yêu cầu login tới backend
      const response = await axios.post('http://localhost:5001/login', {
        username,
        password,
      }, { withCredentials: true });

      // Nếu login thành công, bạn có thể lưu token vào localStorage hoặc sessionStorage nếu cần
      if (response.data.success) {
        console.log('Login successful:', response.data);
        // Ví dụ lưu token vào localStorage
        localStorage.setItem('token', response.data.token);

        // Điều hướng người dùng đến trang khác (ví dụ: dashboard)
        // window.location.href = '/dashboard'; // hoặc sử dụng react-router
      }
    } catch (err) {
      // Xử lý lỗi nếu login không thành công
      console.error('Login failed:', err);
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
