import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      await api.post('/doctor/register/', formData);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration error');
    }
  };

  return (
    <div className="auth-container">
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <button type="submit" className="primary-button">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegister;
