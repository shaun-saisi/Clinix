import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [editData, setEditData] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, enrollmentsRes, programsRes] = await Promise.all([
          api.get(`/clients/${id}/profile/`),
          api.get(`/enrollments/?client=${id}`),
          api.get('/programs/')
        ]);
        
        setClient(clientRes.data);
        setEditData(clientRes.data);
        setEnrollments(enrollmentsRes.data);
        setPrograms(programsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load client data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = async () => {
    try {
      const response = await api.put(`/clients/${id}/`, editData);
      setClient(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update client');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/clients/${id}/`);
        navigate('/clients');
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      }
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      await api.delete(`/enrollments/${enrollmentId}/`);
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll from program');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const enrolledPrograms = enrollments.map(enrollment => ({
    ...programs.find(p => p.id === enrollment.program),
    enrollmentId: enrollment.id,
    enrolledOn: enrollment.enrolled_on
  }));

  if (loading) return <BasePage><div>Loading client profile...</div></BasePage>;
  if (error) return <BasePage><div>{error}</div></BasePage>;
  if (!client) return <BasePage><div>Client not found</div></BasePage>;

  return (
    <BasePage>
      <div className="container">
        <div className="profile-header">
          <h1>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={editData.full_name}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              client.full_name
            )}
          </h1>
          
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button onClick={handleEdit} className="primary-button">
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
                  Edit Profile
                </button>
                <button 
                  onClick={handleDelete} 
                  className="danger-button"
                >
                  Delete Client
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div>
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={editData.date_of_birth}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{new Date(client.date_of_birth).toLocaleDateString()}</p>
              )}
            </div>
            <div>
              <label>Contact Information</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={editData.contact}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{client.contact}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Enrolled Programs</h2>
          {enrolledPrograms.length > 0 ? (
            <ul className="program-list">
              {enrolledPrograms.map(program => (
                <li key={program.enrollmentId} className="program-item">
                  <div className="program-info">
                    <h3>
                      <Link to={`/programs/${program.id}`}>{program.title}</Link>
                    </h3>
                    <p>{program.description}</p>
                    <small>
                      Enrolled on: {new Date(program.enrolledOn).toLocaleDateString()}
                    </small>
                  </div>
                  <button
                    onClick={() => handleUnenroll(program.enrollmentId)}
                    className="danger-button"
                  >
                    Unenroll
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active program enrollments</p>
          )}
        </div>

        <div className="action-buttons">
          <Link to="/clients" className="nav-button">
            Back to Clients List
          </Link>
        </div>
      </div>
    </BasePage>
  );
};

export default ClientProfile;
