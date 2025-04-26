// DoctorLogin.js  Still not using this page As I have implemented modal login forms 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

const DoctorLogin = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/token/', credentials);
      localStorage.setItem('access_token', response.data.access);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleLogin}>
        {/* Login fields */}
        <button type="submit" className="primary-button">Login</button>
        <p>New user? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default DoctorLogin;