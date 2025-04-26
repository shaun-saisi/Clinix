import React from 'react';
import { Link } from 'react-router-dom';
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&display=swap" rel="stylesheet"></link>

const BasePage = ({ children }) => {
  // Enhanced theme configuration with modern healthcare colors
  const theme = {
    primaryColor: '#1A3E6F',      // Deep professional blue
    secondaryColor: '#FFFFFF',    // Clean white
    accentColor: '#2ABFAF',       // Modern teal for highlights
    background: '#F8FAFC',        // Soft background
    textPrimary: '#2D3748',       // Dark gray for text
    textSecondary: '#718096',     // Medium gray
    hoverColor: '#2B529C',        // Interactive blue
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.background,

      
    },
    header: {
      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, #2B529C 100%)`,
      color: theme.secondaryColor,
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '1.9rem',
      fontWeight: '800',
      letterSpacing: '-0.8px',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: 'linear-gradient(45deg, #FFFFFF 0%, #A8D0FF 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      textTransform: 'uppercase',
      fontFamily: "'Poppins', sans-serif",
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    nav: {
      display: 'flex',
      gap: '2.5rem',
      alignItems: 'center',
    },
    navLink: {
      color: theme.secondaryColor,
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      padding: '0.5rem 0',
      borderBottom: '2px solid transparent',
      '&:hover': {
        color: theme.accentColor,
        borderColor: theme.accentColor,
      },
    },
    mainContent: {
      flex: 1,
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    footer: {
      background: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '1.5rem 2rem',
      marginTop: 'auto',
      borderTop: `1px solid ${theme.accentColor}`,
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
      <div style={styles.headerContent}>
          <Link to="/" style={styles.logo}>
            
            Clinix
          </Link>
          <nav style={styles.nav}>
            
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/clients" style={styles.navLink}>Clients</Link>
            <Link to="/programs" style={styles.navLink}>Health Programs</Link>
            <Link to="/" style={styles.navLink}>Logout</Link>
          </nav>
        </div>
      </header>

      <main style={styles.mainContent}>
        {children}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© 2025 Clinix Health Management. Empowering healthcare professionals worldwide.</p>
          
        </div>
      </footer>
    </div>
  );
};

export default BasePage;