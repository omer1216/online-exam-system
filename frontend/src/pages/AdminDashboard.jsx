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
    <div className="dashboard-layout">
      <div className="card">
        <h1 style={{ color: 'var(--error-color)' }}>🛡️ Admin Dashboard</h1>
        <h3>Manage Accounts</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.9em',
                    background: user.role === 'admin' ? '#ef4444' : (user.role === 'teacher' ? '#10b981' : '#3b82f6'),
                    color: 'white'
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  {user.role !== 'admin' && ( 
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{ background: 'var(--error-color)', width: 'auto', padding: '5px 10px', fontSize: '0.9rem' }}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;