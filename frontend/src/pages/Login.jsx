import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Create Form Data (FastAPI expects this format, not JSON)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await api.post('/token', formData);

      // SAVE CRITICAL DATA
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);       // Save "teacher" or "student"
      localStorage.setItem('user_id', response.data.user_id); // Save ID (e.g., 1)

      onLogin();
    } catch (err) {
      // ... rest of the code is same
      console.error(err);
      setError('Invalid username or password!');
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Exam System Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;