import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const Homepage = () => {
  const [stats, setStats] = useState({ clients: 0, programs: 0 });
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Content-specific styles (layout only)
  const styles = {
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '8px',
    },
    statCard: {
      textAlign: 'center',
      padding: '1rem',
      borderRadius: '8px',
    },
    recentClients: {
      marginTop: '2rem',
      padding: '1rem',
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, programsRes] = await Promise.all([
          api.get('/clients/'),
          api.get('/programs/')
        ]);

        setStats({
          clients: clientsRes.data.count || clientsRes.data.length,
          programs: programsRes.data.count || programsRes.data.length
        });

        setRecentClients(clientsRes.data.slice(-5));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <BasePage><div>Loading...</div></BasePage>;
  if (error) return <BasePage><div>{error}</div></BasePage>;

  return (
    <BasePage>
      <div style={styles.statsContainer} className="stats-grid">
        <div style={styles.statCard} className="card">
          <h3>Total Clients</h3>
          <p className="stat-number">{stats.clients}</p>
        </div>
        <div style={styles.statCard} className="card">
          <h3>Health Programs</h3>
          <p className="stat-number">{stats.programs}</p>
        </div>
      </div>

      <div style={styles.recentClients}>
        <h2>Recent Clients</h2>
        <ul className="cards-list">
          {recentClients.map(client => (
            <li key={client.id} className="card">
              <h3>{client.full_name}</h3>
              <p>Date of Birth: {client.date_of_birth}</p>
              <p>Contact: {client.contact}</p>
              <Link to={`/clients/${client.id}`} className="primary-button">
                View Profile
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/clients" className="nav-button">
          View All Clients
        </Link>
      </div>
    </BasePage>
  );
};

export default Homepage;