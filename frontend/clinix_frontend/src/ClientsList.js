//Here we have the layout and organization of the clients

import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import BasePage from './BasePage';
import { motion } from 'framer-motion';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [newClient, setNewClient] = useState({
        full_name: '',
        date_of_birth: '',
        contact: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current doctor first
                const doctorRes = await api.get('/api/doctor/me/');
                setDoctorId(doctorRes.data.id);
                
                // Fetch doctor-specific clients
                const clientsRes = await api.get(`/api/clients/?doctor=${doctorRes.data.id}`);
                setClients(clientsRes.data);
                setFilteredClients(clientsRes.data);
            } catch (err) {
                setError('Failed to fetch clients');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const clientData = {
                ...newClient,
                doctor: doctorId
            };
            
            const response = await api.post('/api/clients/', clientData);
            const updatedClients = [...clients, response.data];
            setClients(updatedClients);
            setFilteredClients(updatedClients);
            setNewClient({ full_name: '', date_of_birth: '', contact: '' });
            setShowForm(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create client');
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = clients.filter(client =>
            client.full_name.toLowerCase().includes(term)
        );
        setFilteredClients(filtered);
    };

    if (loading) return <BasePage><div className="loading-state">Loading clients...</div></BasePage>;
    if (error) return <BasePage><div className="loading-state">{error}</div></BasePage>;

    return (
        <BasePage>
            <div className="container">
                <div className="section-header">
                    <h1>Client Management</h1>
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="primary-button"
                    >
                        + Add New Client
                    </button>
                </div>

                {/* Search Input */}
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search clients by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                {/* Clients Grid */}
                <div className="clients-grid">
                    {filteredClients.length > 0 ? (
                        <div className="cards-list">
                            {filteredClients.slice(0, 6).map((client, index) => (
                                <motion.div
                                    key={client.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="client-card card"
                                >
                                    <h3>{client.full_name}</h3>
                                    <div className="client-details">
                                        <p>
                                            <span className="detail-label">Date of Birth:</span>
                                            <span className="detail-value">
                                                {new Date(client.date_of_birth).toLocaleDateString()}
                                            </span>
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
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No clients found matching your search.</p>
                        </div>
                    )}
                </div>

                {/* Create Client Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Register New Client</h2>
                            <form onSubmit={handleCreateClient} className="client-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={newClient.full_name}
                                        onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={newClient.date_of_birth}
                                        onChange={(e) => setNewClient({ ...newClient, date_of_birth: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Information</label>
                                    <input
                                        type="text"
                                        value={newClient.contact}
                                        onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="primary-button">
                                        Create Client
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </BasePage>
    );
};

export default ClientsList;