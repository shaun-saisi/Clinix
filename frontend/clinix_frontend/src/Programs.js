// The structure to visualize my program cards is handled here

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [newProgram, setNewProgram] = useState({ title: '', description: '' });
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current doctor first
                const doctorRes = await api.get('/api/doctor/me/');
                setDoctorId(doctorRes.data.id);
                
                // Fetch doctor-specific programs
                const programsRes = await api.get(`/api/programs/?doctor=${doctorRes.data.id}`);
                setPrograms(programsRes.data);
            } catch (err) {
                setError('Failed to fetch programs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const programData = {
                ...newProgram,
                doctor: doctorId
            };
            
            await api.post('/api/programs/', programData);
            const response = await api.get(`/api/programs/?doctor=${doctorId}`);
            setPrograms(response.data);
            setNewProgram({ title: '', description: '' });
            setShowForm(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create program');
            console.error(err);
        }
    };

    const filteredPrograms = programs.filter((program) =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const styles = {
        container: {
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        programList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
        },
        programCard: {
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            position: 'relative'
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            margin: '0.5rem 0',
            borderRadius: '4px'
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '1rem'
        }
    };

    if (loading) return <BasePage><div className="loading-state">Loading programs...</div></BasePage>;
    if (error) return <BasePage><div className="loading-state">{error}</div></BasePage>;

    return (
        <BasePage>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Health Programs</h1>
                    <button onClick={() => setShowForm(true)} className="primary-button">
                        Create New Program
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Search for a Program"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Programs Grid */}
                <div style={styles.programList}>
                    {filteredPrograms.length === 0 ? (
                        <div className="empty-state">
                            <p>No programs found. Create your first health program.</p>
                        </div>
                    ) : (
                        filteredPrograms.map((program) => (
                            <div key={program.id} style={styles.programCard} className="card">
                                <Link to={`/programs/${program.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3>{program.title}</h3>
                                    <p>{program.description}</p>
                                    <div className="meta">
                                        Created: {new Date(program.created_at).toLocaleDateString()}
                                    </div>
                                </Link>
                                <Link to={`/programs/${program.id}`} className="primary-button" style={{ marginTop: '1rem' }}>
                                    View Details
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
                        <div
                            style={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Create New Program</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Program Title"
                                    value={newProgram.title}
                                    onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    style={{ ...styles.input, minHeight: '100px' }}
                                    placeholder="Program Description"
                                    value={newProgram.description}
                                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                                    required
                                />
                                <div style={styles.buttonGroup}>
                                    <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="primary-button">
                                        Submit
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

export default Programs;