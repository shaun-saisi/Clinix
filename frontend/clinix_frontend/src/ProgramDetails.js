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
          api.get(`/programs/${id}/`),
          api.get('/clients/'),
          api.get('/enrollments/')
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
    .filter(e => e.program == id)
    .map(e => clients.find(c => c.id == e.client))
    .filter(c => c);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/programs/${id}/`, editData);
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
        await api.delete(`/programs/${id}/`);
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
      await api.post('/enrollments/', {
        client: selectedClient,
        program: id
      });

      const response = await api.get('/enrollments/');
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
      await api.delete(`/enrollments/${enrollmentId}/`);
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll client');
      console.error(err);
    }
  };

  if (loading) return <BasePage><div>Loading program...</div></BasePage>;
  if (error) return <BasePage><div>{error}</div></BasePage>;
  if (!program) return <BasePage><div>Program not found</div></BasePage>;

  return (
    <BasePage>
      <div className="container">
        <div className="profile-header">
          <h1>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              program.title
            )}
          </h1>
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

        <div className="card">
          <h2>Program Details</h2>
          <div className="info-grid">
            <div>
              <label>Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="edit-input"
                  rows="4"
                />
              ) : (
                <p>{program.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Enroll New Client</h2>
          <div className="enroll-section">
            <select 
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="form-input"
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
              disabled={!selectedClient}
            >
              Enroll Client
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Enrolled Clients ({enrolledClients.length})</h2>
          {enrolledClients.length > 0 ? (
            <ul className="cards-list">
              {enrolledClients.map(client => {
                const enrollment = enrollments.find(e => 
                  e.client === client.id && e.program == id
                );

                return (
                  <li key={client.id} className="client-card">
                    <div className="client-info">
                      <h3>{client.full_name}</h3>
                      <p>Contact: {client.contact}</p>
                      <p>Date of Birth: {client.date_of_birth}</p>
                    </div>
                    <button
                      onClick={() => handleUnenroll(enrollment.id)}
                      className="danger-button"
                    >
                      Unenroll
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No clients enrolled in this program</p>
          )}
        </div>

        <div className="action-buttons">
          <Link to="/programs" className="nav-button">
            Back to Programs
          </Link>
        </div>
      </div>
    </BasePage>
  );
};

export default ProgramDetails;