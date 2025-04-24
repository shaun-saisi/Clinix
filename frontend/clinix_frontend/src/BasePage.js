import React from 'react';
import { Link } from 'react-router-dom';

const BasePage = ({ children }) => {
  // Theme configuration
  const theme = {
    primaryColor: '#1A3E6F',
    secondaryColor: '#FFFFFF',
    accentColor: '#4A90E2',
  };

  const styles = {
    header: {
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nav: {
      display: 'flex',
      gap: '2rem',
    },
    navLink: {
      color: theme.secondaryColor,
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    mainContent: {
      minHeight: 'calc(100vh - 160px)',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footer: {
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '1rem',
      textAlign: 'center',
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h1>Clinix </h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/clients" style={styles.navLink}>Clients</Link>
          <Link to="/programs" style={styles.navLink}>Programs</Link>
        </nav>
      </header>

      <main style={styles.mainContent}>
        {children}
      </main>

      <footer style={styles.footer}>
        <p>© 2025 Clinix Health Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BasePage;