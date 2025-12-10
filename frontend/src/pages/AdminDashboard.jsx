import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users on load
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await api.delete(`/users/${userId}`);
        alert("User Deleted!");
        fetchUsers(); // Refresh the list
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'red' }}>🛡️ Admin Dashboard</h1>
      <h3>Manage Accounts</h3>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Username</th>
            <th style={{ padding: '10px' }}>Role</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  background: user.role === 'admin' ? 'red' : (user.role === 'teacher' ? 'green' : 'blue'),
                  color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.9em' 
                }}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                {user.role !== 'admin' && ( // Don't let admin delete themselves
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;