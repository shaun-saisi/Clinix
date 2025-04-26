// This page contains the detailed structure to the client profile and all the required functionalities 

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';
import { FaUser, FaBirthdayCake, FaPhone, FaNotesMedical, FaCalendarPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClientProfile = async () => {
    try {
      const response = await api.get(`/api/clients/${id}/profile/`);
      const clientData = response.data;

      setClient(clientData);

      if (Array.isArray(clientData.programs)) {
        const transformed = clientData.programs.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          enrollmentId: program.enrollment_id,
          enrolledOn: program.enrolled_on
        }));
        setEnrollments(transformed);
      } else {
        setEnrollments([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching client profile:', err);
      const detail = err.response?.data?.detail || 'Failed to load client data.';
      setError(detail);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientProfile();
  }, [id]);

  const handleUnenroll = async (enrollmentId) => {
    try {
      await api.delete(`/api/enrollments/${enrollmentId}/`);
      // After unenroll, refresh client profile
      await fetchClientProfile();
    } catch (err) {
      console.error('Failed to unenroll:', err);
      setError('Failed to unenroll from program.');
    }
  };

  const handleEnrollClick = () => {
    navigate(`/enroll/${id}`, { state: { returnToProfile: true } });
  };

  if (loading) return <BasePage><div className="loading-state">Loading...</div></BasePage>;
  if (error) return <BasePage><div className="empty-state">{error}</div></BasePage>;

  return (
    <BasePage>
      <div className="client-profile-container">
        <div className="profile-header">
          <h1 className="profile-title">
            <FaUser /> {client.full_name || 'Unnamed Client'}'s Profile
          </h1>
          <Link to="/clients" className="primary-button">
            <FaArrowLeft /> Back to Clients
          </Link>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h2><FaUser /> Personal Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{client.full_name || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Date of Birth</label>
                <p><FaBirthdayCake /> {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Contact</label>
                <p><FaPhone /> {client.contact || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h2><FaNotesMedical /> Program Enrollments</h2>
            {enrollments.length === 0 ? (
              <div className="empty-state">No active enrollments found</div>
            ) : (
              <div className="enrollments-table">
                <div className="enrollment-row">
                  <div>Program</div>
                  <div>Enrollment Date</div>
                  <div>Actions</div>
                </div>
                {enrollments.map(program => (
                  <div className="enrollment-row" key={program.enrollmentId}>
                    <div>
                      <div className="detail-label">{program.title}</div>
                      <div className="detail-value">{program.description}</div>
                    </div>
                    <div>{new Date(program.enrolledOn).toLocaleDateString()}</div>
                    <div>
                      <button 
                        onClick={() => handleUnenroll(program.enrollmentId)}
                        className="secondary-button"
                      >
                        <FaTrash /> Unenroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleEnrollClick} className="primary-button">
            <FaCalendarPlus /> Enroll in a Program
          </button>
          <button onClick={() => navigate(-1)} className="secondary-button">
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default ClientProfile;
