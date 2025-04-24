import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      gap: '1rem'
    },
    programCard: {
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
      marginBottom: '2rem',
      padding: '1rem',
      borderRadius: '8px'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      margin: '0.5rem 0',
      borderRadius: '4px'
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get('/programs/');
        setPrograms(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch programs');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/programs/', newProgram);
      const response = await api.get('/programs/');
      setPrograms(response.data);
      setNewProgram({ title: '', description: '' });
    } catch (err) {
      setError('Failed to create program');
      console.error(err);
    }
  };

  return (
    <BasePage>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Health Programs</h1>
          <Link to="/" className="nav-button">Back to Dashboard</Link>
        </div>

        

        <div style={styles.programList}>
          {programs.map(program => (
            <div key={program.id} style={styles.programCard} className="card">
              <Link to={`/programs/${program.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <div className="meta">
                  Program ID: {program.id}
                </div>
              </Link>
              <Link to={`/programs/${program.id}`} className="primary-button" style={{ marginTop: '1rem' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>


        <form style={styles.form} onSubmit={handleSubmit}>
          <h2>Create New Program</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="Program Title"
            value={newProgram.title}
            onChange={(e) => setNewProgram({...newProgram, title: e.target.value})}
            required
          />
          <textarea
            style={{...styles.input, minHeight: '100px'}}
            placeholder="Program Description"
            value={newProgram.description}
            onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
            required
          />
          <button type="submit" className="primary-button">
            Create Program
          </button>
        </form>
        
      </div>
    </BasePage>
  );
};

export default Programs;