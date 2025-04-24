import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import BasePage from './BasePage';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
        full_name: '',
        date_of_birth: '',
        contact: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients/');
                setClients(response.data);
            } catch (err) {
                setError('Failed to fetch clients');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/clients/', newClient);
            setClients([...clients, response.data]);
            setNewClient({ full_name: '', date_of_birth: '', contact: '' });
            setError('');
        } catch (err) {
            setError('Failed to create client');
            console.error(err);
        }
    };

    if (loading) return <BasePage><div>Loading...</div></BasePage>;
    if (error) return <BasePage><div>{error}</div></BasePage>;

    return (
        <BasePage>
            <div className="container">
                <h1>Clients Management</h1>


                {/* Clients List */}
                <div className="clients-list">
                    <h2>All Clients</h2>
                    <ul className="cards-list">
                        {clients.map((client) => (
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
                </div>
                
                {/* Create Client Form */}
                <form onSubmit={handleCreateClient} className="card form-card">
                    <h2>Register New Client</h2>
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            value={newClient.full_name}
                            onChange={(e) => setNewClient({...newClient, full_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            value={newClient.date_of_birth}
                            onChange={(e) => setNewClient({...newClient, date_of_birth: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Info:</label>
                        <input
                            type="text"
                            value={newClient.contact}
                            onChange={(e) => setNewClient({...newClient, contact: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="primary-button">
                        Register Client
                    </button>
                </form>

                
            </div>
        </BasePage>
    );
};

export default ClientsList;