import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setRole(localStorage.getItem('role'));
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setRole('');
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav style={{ padding: '15px', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{margin:0}}>Online Exam System</h2>
        {isLoggedIn && <button onClick={handleLogout} style={{background:'#e74c3c', color:'white', border:'none', padding:'8px 15px', borderRadius:'4px', cursor:'pointer'}}>Logout</button>}
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ marginTop: '20px' }}>
        {!isLoggedIn ? (
          // IF NOT LOGGED IN: SHOW LOGIN OR REGISTER
          showRegister ? (
            <Register onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <div>
              <Login onLogin={handleLogin} />
              <p style={{textAlign:'center', marginTop:'10px'}}>
                Don't have an account? <button onClick={() => setShowRegister(true)} style={{background:'none', border:'none', color:'blue', textDecoration:'underline', cursor:'pointer'}}>Register here</button>
              </p>
            </div>
          )
        ) : (
          role === 'admin' ? (
            <AdminDashboard />
          ) : role === 'teacher' ? (
            <TeacherDashboard />
          ) : (
            <StudentDashboard />
          )
        )}
      </div>
    </div>
  );
}

export default App;