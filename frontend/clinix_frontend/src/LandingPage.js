import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, Link } from 'react-router-dom';
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

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: theme.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR */}
      <header style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.hoverColor} 100%)`, color: theme.secondaryColor, padding: '1rem 2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', fontWeight: '800', fontSize: '1.9rem', background: 'linear-gradient(45deg, #FFFFFF 0%, #A8D0FF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {/* SVG remains unchanged */}
            Clinix
          </Link>
          <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <a href="/mockclients" style={navLinkStyle(theme)}>Clients</a>
            <a href="/mockprograms" style={navLinkStyle(theme)}>Health Programs</a>
            
            {/* Updated authentication-based buttons */}
            {isAuthenticated ? (
              <button onClick={handleLogout} style={navButtonStyle(theme)}> Confirm Logout</button>
            ) : (
              <>
                <button onClick={() => { resetForm(); setShowLogin(true); }} style={navButtonStyle(theme)}>Login</button>
                <button onClick={() => { resetForm(); setShowRegister(true); }} style={{ ...navButtonStyle(theme), backgroundColor: theme.accentColor, color: theme.secondaryColor }}>Register</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <section id="home" style={{
  textAlign: 'center',
  marginBottom: '5rem',
  padding: '4rem 2rem',
  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.hoverColor} 100%)`,
  color: theme.secondaryColor,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
}}>
  <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
    Empowering Healthcare Professionals
  </h1>
  <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
    Streamline patient management, monitor health programs, and enhance care delivery with Clinix HMS.
  </p>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
    
  </div>
</section>


        {/* ABOUT SECTION */}
        <section id="about" style={{
  textAlign: 'center',
  padding: '4rem 2rem',
  backgroundColor: theme.background,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
}}>
  <h2 style={{ fontSize: '2.5rem', color: theme.primaryColor, marginBottom: '1rem' }}>
    Why Choose Clinix HMS?
  </h2>
  <p style={{ fontSize: '1.1rem', color: theme.textSecondary, maxWidth: '800px', margin: '0 auto 3rem' }}>
    Clinix HMS is designed to simplify healthcare management, offering tools that allow you to:
  </p>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  }}>
    {[
      {
        title: 'Register Clients',
        description: 'Easily add and manage patient information with our intuitive interface.'
      },
      {
        title: 'View Client Profiles',
        description: 'Access comprehensive patient histories and treatment plans at a glance.'
      },
      {
        title: 'Create Health Programs',
        description: 'Develop and assign personalized health programs to cater to individual needs.'
      },
      
    ].map((feature, index) => (
      <div key={index} style={{
        backgroundColor: theme.secondaryColor,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        textAlign: 'left'
      }}>
        <h3 style={{ color: theme.primaryColor, marginBottom: '0.5rem' }}>{feature.title}</h3>
        <p style={{ color: theme.textSecondary }}>{feature.description}</p>
      </div>
    ))}
  </div>
</section>

{/* Other section */}

<section id="action" style={{
  textAlign: 'center',
  padding: '4rem 2rem',
  marginTop: '5rem',
  background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.background} 100%)`,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
}}>
  <h2 style={{
    fontSize: '2.5rem',
    color: theme.primaryColor,
    marginBottom: '1rem'
  }}>
    Get Started in Minutes
  </h2>
  <p style={{
    fontSize: '1.2rem',
    color: theme.textSecondary,
    maxWidth: '700px',
    margin: '0 auto 3rem'
  }}>
    Register or log in to seamlessly create, update, and delete client profiles and health programs — all in one place!
  </p>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
    <button onClick={() => { resetForm(); setShowRegister(true); }} style={{
      backgroundColor: theme.accentColor,
      color: theme.secondaryColor,
      border: 'none',
      borderRadius: '5px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600'
    }}>
      Register Now
    </button>
    <button onClick={() => { resetForm(); setShowLogin(true); }} style={{
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      border: 'none',
      borderRadius: '5px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600'
    }}>
      Login
    </button>
  </div>
</section>


      </main>

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

export default LandingPage;
