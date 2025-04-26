import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; 
import { useNavigate, } from 'react-router-dom';
import api from './api';

const MockPrograms = () => {

    const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    specialization: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added authentication state
  const navigate = useNavigate();

  const theme = {
    primaryColor: '#1A3E6F',
    secondaryColor: '#FFFFFF',
    accentColor: '#2ABFAF',
    background: '#F8FAFC',
    textPrimary: '#2D3748',
    textSecondary: '#718096',
    hoverColor: '#2B529C',
  };

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('doctor');
    setIsAuthenticated(false);
    navigate('/');
  };

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
      await api.post('/api/doctor/register/', JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' }
      });
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
      const { data } = await api.post('/api/token/', JSON.stringify({
        username: formData.username,
        password: formData.password
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      const { data: doctor } = await api.get('/api/doctor/me/', {
        headers: { Authorization: `Bearer ${data.access}` }
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

    /*Sample data */
  const staticPrograms = [
    { id: 1, title: "Weight Management", description: "Weight loss and maintenance program", created_at: "2024-01-01" },
    { id: 2, title: "Diabetes Care", description: "Blood sugar management program", created_at: "2024-02-15" },
    { id: 3, title: "Cardiac Health", description: "Heart disease prevention and care program", created_at: "2024-03-10" },
{ id: 4, title: "Maternal Health", description: "Prenatal and postnatal care program", created_at: "2024-04-05" },
{ id: 5, title: "Mental Wellness", description: "Mental health support and counseling program", created_at: "2024-05-20" },
{ id: 6, title: "Nutrition Support", description: "Healthy eating and dietary planning program", created_at: "2024-06-12" },
{ id: 7, title: "Child Immunization", description: "Vaccination and child health tracking program", created_at: "2024-07-08" },
{ id: 8, title: "Elderly Care", description: "Healthcare services for senior citizens", created_at: "2024-08-01" },

  ];

  return (
        <div>
            {/* NAVBAR */}
                  <header style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.hoverColor} 100%)`, color: theme.secondaryColor, padding: '1rem 2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', fontWeight: '800', fontSize: '1.9rem', background: 'linear-gradient(45deg, #FFFFFF 0%, #A8D0FF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {/* SVG remains unchanged */}
                        Clinix
                      </Link>
                      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                      <a href="/" style={navLinkStyle(theme)}>Home</a>
                        <a href="/mockclients" style={navLinkStyle(theme)}>Clients</a>
                        <a href="/mockprograms" style={navLinkStyle(theme)}>Health Programs</a>
                        
                        {/* Updated authentication-based buttons */}
                        {isAuthenticated ? (
                          <button onClick={handleLogout} style={navButtonStyle(theme)}>Logout</button>
                        ) : (
                          <>
                            <button onClick={() => { resetForm(); setShowLogin(true); }} style={navButtonStyle(theme)}>Login</button>
                            <button onClick={() => { resetForm(); setShowRegister(true); }} style={{ ...navButtonStyle(theme), backgroundColor: theme.accentColor, color: theme.secondaryColor }}>Register</button>
                          </>
                        )}
                      </nav>
                    </div>
                  </header>
                  
    
      <div className="container">
        <div className="section-header">
          <h1>Health Programs Available</h1>
          <Link to="/mockdashboard" className="primary-button">Back to Dashboard</Link>
        </div>

        <div className="programs-grid">
          <div className="cards-list">
            {staticPrograms.map((program) => (
              <div key={program.id} className="program-card card">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <div className="program-meta">
                  <span>Created: {new Date(program.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* LOGIN MODAL */}
       {showLogin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Doctor Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <input type="text" placeholder="Username" value={formData.username} required onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={styles.input} />
              <input type="password" placeholder="Password" value={formData.password} required onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
              {error && <div style={styles.errorText}>{error}</div>}
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton}>Login</button>
                <button type="button" onClick={() => setShowLogin(false)} style={styles.secondaryButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Doctor Registration</h2>
            <form onSubmit={handleRegister} style={styles.form}>
              <input type="text" placeholder="Username" value={formData.username} required onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={styles.input} />
              <input type="password" placeholder="Password" value={formData.password} required onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
              <input type="text" placeholder="Specialization" value={formData.specialization} required onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} style={styles.input} />
              <input type="tel" placeholder="Phone (+1234567890)" pattern="\+[0-9]+" title="Include country code (e.g. +1234567890)" value={formData.phone} required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} />
              {error && <div style={styles.errorText}>{error}</div>}
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton}>Register</button>
                <button type="button" onClick={() => setShowRegister(false)} style={styles.secondaryButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: theme.primaryColor, color: theme.secondaryColor, padding: '1.5rem 2rem', marginTop: 'auto', borderTop: `1px solid ${theme.accentColor}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>© 2025 Clinix Health Management. Empowering healthcare professionals worldwide.</p>
        </div>
      </footer>
    </div>
    
  );
};

const navLinkStyle = (theme) => ({
    color: theme.secondaryColor,
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.5rem 0',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
  });
  
  const navButtonStyle = (theme) => ({
    backgroundColor: theme.secondaryColor,
    color: theme.primaryColor,
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  });
  
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0px 5px 15px rgba(0,0,0,0.3)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    input: {
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: '5px',
      border: '1px solid #ccc'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    },
    primaryButton: {
      backgroundColor: '#1A3E6F',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '0.6rem 1.2rem',
      fontWeight: '600',
      cursor: 'pointer'
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '0.6rem 1.2rem',
      fontWeight: '600',
      cursor: 'pointer'
    },
    errorText: {
      color: 'red',
      fontSize: '0.9rem',
      textAlign: 'center'
    }
  };

export default MockPrograms;