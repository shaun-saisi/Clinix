import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    specialization: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      specialization: '',
      phone: ''
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/doctor/register/', 
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      resetForm();
      setShowRegister(false);
      alert('Registration successful! Please login.');
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] || 
        err.response?.data?.password?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'Registration failed. Please check your details.'
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/token/', 
        JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Fetch doctor details
      const { data: doctor } = await api.get('/api/doctor/me/', {
        headers: {
          Authorization: `Bearer ${data.access}`
        }
      });
      
      localStorage.setItem('doctor', JSON.stringify(doctor));
      navigate('/dashboard');
      
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Clinix HMS</h1>
        <div className="auth-buttons">
          <button onClick={() => { resetForm(); setShowRegister(true); }} className="cta-button">
            Doctor Registration
          </button>
          <button onClick={() => { resetForm(); setShowLogin(true); }} className="cta-button">
            Doctor Login
          </button>
        </div>
      </header>

      {/* Registration Modal */}
      {showRegister && (
        <div className="auth-modal">
          <div className="auth-content">
            <h2>Doctor Registration</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                required
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                required
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (+1234567890)"
                value={formData.phone}
                pattern="\+[0-9]+"
                title="Include country code (e.g., +1234567890)"
                required
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="primary-button">Register</button>
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={() => setShowRegister(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="auth-modal">
          <div className="auth-content">
            <h2>Doctor Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                required
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="primary-button">Login</button>
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;