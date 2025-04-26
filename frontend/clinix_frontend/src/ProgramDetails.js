import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [editData, setEditData] = useState({});
  const [clients, setClients] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programRes, clientsRes, enrollmentsRes] = await Promise.all([
          api.get(`/api/programs/${id}/`),
          api.get('/api/clients/'),
          api.get('/api/enrollments/')
        ]);

        setProgram(programRes.data);
        setEditData(programRes.data);
        setClients(clientsRes.data);
        setEnrollments(enrollmentsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const enrolledClients = enrollments
    .filter(e => String(e.program) === id)
    .map(e => clients.find(c => c.id === e.client))
    .filter(c => c);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/programs/${id}/`, editData);
      setProgram(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update program');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/api/programs/${id}/`);
        navigate('/programs');
      } catch (err) {
        setError('Failed to delete program');
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnrollClient = async () => {
    if (!selectedClient) return;

    try {
      await api.post('/api/enrollments/', {
        client: selectedClient,
        program: id
      });

      const response = await api.get('/api/enrollments/');
      setEnrollments(response.data);
      setSelectedClient('');
      setError('');
    } catch (err) {
      setError('Failed to enroll client');
      console.error(err);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      await api.delete(`/api/enrollments/${enrollmentId}/`);
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll client');
      console.error(err);
    }
  };

  if (loading) return <BasePage><div className="loading-state">Loading program...</div></BasePage>;
  if (error) return <BasePage><div className="error-state">{error}</div></BasePage>;
  if (!program) return <BasePage><div className="error-state">Program not found</div></BasePage>;

  return (
    <BasePage>
      <div className="container">
        {/* Program Header */}
        <div className="section-header">
          <div className="header-content">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="form-input large-input"
              />
            ) : (
              <h1>{program.title}</h1>
            )}
          </div>
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button onClick={handleUpdate} className="primary-button">
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="secondary-button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="primary-button"
                >
                  Edit Program
                </button>
                <button 
                  onClick={handleDelete} 
                  className="danger-button"
                >
                  Delete Program
                </button>
              </>
            )}
          </div>
        </div>

        {/* Program Details Card */}
        <div className="card">
          <h2>Program Details</h2>
          <div className="form-group">
            <label>Description</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
              />
            ) : (
              <p className="program-description">{program.description}</p>
            )}
          </div>
        </div>

        {/* Enroll Client Section */}
        <div className="card">
          <div className="section-header">
            <h2>Enroll New Client</h2>
            <div className="enroll-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="form-input"
                style={{ flex: '1', minWidth: '200px' }}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleEnrollClient}
                className="primary-button"
                style={{ padding: '10px 20px' }}
                disabled={!selectedClient}
              >
                Enroll Client
              </button>
            </div>
          </div>
        </div>

        {/* Enrolled Clients Section */}
        <div className="card">
          <div className="section-header">
            <h2>Enrolled Clients ({enrolledClients.length})</h2>
          </div>

          {enrolledClients.length > 0 ? (
            <ul className="cards-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0', margin: '0', listStyleType: 'none' }}>
              {enrolledClients.map(client => {
                const enrollment = enrollments.find(
                  e => e.client === client.id && String(e.program) === id
                );

                return (
                  <li
                    key={client.id}
                    className="client-card"
                    style={{
                      flex: '0 1 calc(50% - 16px)',
                      boxSizing: 'border-box',
                      padding: '15px',
                      marginBottom: '16px',
                      background: '#f9f9f9',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="client-info">
                      <h3 style={{ marginBottom: '10px' }}>{client.full_name}</h3>
                      <div className="client-details">
                        <p>
                          <span className="detail-label">Contact:</span> {client.contact}
                        </p>
                        <p>
                          <span className="detail-label">Date of Birth:</span> {client.date_of_birth}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Link
                        to={`/clients/${client.id}`}
                        className="primary-button small-button"
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          textDecoration: 'none'
                        }}
                      >
                        View Profile
                      </Link>
                      {enrollment && (
                        <button
                          onClick={() => handleUnenroll(enrollment.id)}
                          className="danger-button small-button"
                          style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            background: '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Unenroll
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty-state" style={{ marginTop: '20px', textAlign: 'center' }}>
              <p>No clients enrolled in this program</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="action-buttons center">
          <Link to="/programs" className="secondary-button">
            ← Back to Programs
          </Link>
        </div>
      </div>
    </BasePage>
  );
};

export default ProgramDetails;
