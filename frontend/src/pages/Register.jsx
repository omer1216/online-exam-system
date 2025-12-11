import React, { useState } from 'react';
import api from '../api';

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [msg, setMsg] = useState('');

  // Helper to Capitalize First Letter (omer -> Omer)
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Clean the username before sending
    const cleanUsername = capitalize(username);

    try {
      await api.post('/register', {
        username: cleanUsername,
        password: password,
        role: role
      });
      alert(`Registration Successful! Welcome, ${cleanUsername}. Please Login.`);
      onSwitchToLogin();
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setMsg(error.response.data.detail);
      } else {
        setMsg('Username already exists or Error occurred');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Create an Account</h2>
        {msg && <p className="error-msg">{msg}</p>}
        <form onSubmit={handleRegister} className="form-group">
          <input
            placeholder="Username (e.g. Omer)"
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

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit">Register</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <button onClick={onSwitchToLogin} className="secondary">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default Register;