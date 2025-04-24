import React, {useEffect, useState} from 'react';
import api from './api';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClients = async () =>{
            try {
                const response = await api.get('/clients/');
                setClients(response.data);
            } catch (err) {
                setError('Failed to fetch clients');
                console.error(err);
            } finally{
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Clients List</h1>
            <ul>
            {clients.map((client) => (
                <li key={client.id}>
                <h3>{client.full_name}</h3>
                <p>Date of Birth: {client.date_of_birth}</p>
                <p>Contact: {client.contact}</p>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default ClientsList