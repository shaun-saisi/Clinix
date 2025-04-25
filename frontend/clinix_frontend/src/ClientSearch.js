import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const ClientSearch = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients/');
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (err) {
        setError('Failed to load clients.');
        console.error(err);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = clients.filter(client =>
      client.full_name.toLowerCase().includes(value)
    );
    setFilteredClients(filtered);
  };

  return (
    <BasePage>
      <div className="container">
        <h2>Search Clients</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          className="search-input"
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <ul className="client-list">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <li key={client.id} className="client-item">
                <Link to={`/clients/${client.id}`}>
                  {client.full_name} — {client.contact}
                </Link>
              </li>
            ))
          ) : (
            <p>No clients found.</p>
          )}
        </ul>
      </div>
    </BasePage>
  );
};

export default ClientSearch;
