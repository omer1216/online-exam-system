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
      setMsg('Username already exists or Error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Create an Account</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
            placeholder="Username (e.g. Omer)" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ padding: '10px' }} 
        />
        <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: '10px' }} 
        />
        
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '10px' }}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Register</button>
      </form>
      <p>
        Already have an account? <button onClick={onSwitchToLogin} style={{background:'none', border:'none', color:'blue', textDecoration:'underline', cursor:'pointer'}}>Login here</button>
      </p>
    </div>
  );
};

export default Register;