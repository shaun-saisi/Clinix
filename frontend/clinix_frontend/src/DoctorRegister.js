// DoctorRegister.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    specialization: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/', formData);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" className="primary-button">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default DoctorRegister;