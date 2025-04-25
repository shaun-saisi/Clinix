import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const Homepage = () => {
  const [stats, setStats] = useState({ clients: 0, programs: 0 });
  const [recentClients, setRecentClients] = useState([]);
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, programsRes] = await Promise.all([
          api.get('/clients/'),
          api.get('/programs/')
        ]);

        const clients = clientsRes.data;
        const programs = programsRes.data;

        setStats({
          clients: clients.length,
          programs: programs.length
        });

        setRecentClients(clients.slice(-3).reverse());
        setRecentPrograms(programs.slice(-3).reverse());
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <BasePage><div className="loading-state">Loading...</div></BasePage>;
  if (error) return <BasePage><div className="loading-state">{error}</div></BasePage>;

  return (
    <BasePage>
      <div className="container">
        {/* Stats Summary */}
        <div className="stats-grid">
          <div className="card">
            <h3>Total Clients</h3>
            <p className="stat-number">{stats.clients}</p>
          </div>
          <div className="card">
            <h3>Health Programs</h3>
            <p className="stat-number">{stats.programs}</p>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="section">
  <div className="section-header">
    <h2>Recent Clients</h2>
    <Link to="/clients" className="primary-button">View All Clients</Link>
  </div>
  <ul className="cards-list">
    {recentClients.map(client => (
      <li key={client.id} className="client-card card">
        <h3>{client.full_name}</h3>
        <div className="client-details">
          <p>
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{client.date_of_birth}</span>
          </p>
          <p>
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{client.contact}</span>
          </p>
        </div>
        <Link 
          to={`/clients/${client.id}`} 
          className="primary-button"
          style={{ marginTop: '1rem' }}
        >
          View Profile
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Recent Programs */}
        <div className="section">
          <div className="section-header">
            <h2>Recent Programs</h2>
            <Link to="/programs" className="primary-button">View All Programs</Link>
          </div>
          <ul className="cards-list">
            {recentPrograms.map(program => (
              <li key={program.id} className="program-card">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <Link to={`/programs/${program.id}`} className="primary-button">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BasePage>
  );
};

export default Homepage;