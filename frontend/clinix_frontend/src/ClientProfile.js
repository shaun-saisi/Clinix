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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, programsRes] = await Promise.all([
          api.get(`/clients/${id}/profile/`),
          api.get('/programs/')
        ]);

        setClient(clientRes.data);
        setEnrollments(clientRes.data.programs.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          enrollmentId: program.enrollment_id,
          enrolledOn: program.enrolled_on
        })));
        setLoading(false);
      } catch (err) {
        setError('Failed to load client data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUnenroll = async (enrollmentId) => {
    try {
      await api.delete(`/enrollments/${enrollmentId}/`);
      setEnrollments(enrollments.filter(e => e.enrollmentId !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll from program');
      console.error(err);
    }
  };

  if (loading) return <BasePage><div className="loading-state">Loading...</div></BasePage>;
  if (error) return <BasePage><div className="empty-state">{error}</div></BasePage>;

  return (
    <BasePage>
      <div className="client-profile-container">
        <div className="profile-header">
          <h1 className="profile-title">
            <FaUser /> {client.full_name}'s Profile
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
                <p>{client.full_name}</p>
              </div>
              <div className="info-item">
                <label>Date of Birth</label>
                <p><FaBirthdayCake /> {new Date(client.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Contact Information</label>
                <p><FaPhone /> {client.contact}</p>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="section-header">
              <h2><FaNotesMedical /> Program Enrollments</h2>
              
            </div>

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
          <Link to={`/enroll/${id}`} className="primary-button">
            <FaCalendarPlus /> Enroll in a Program
          </Link>
          <button onClick={() => navigate(-1)} className="secondary-button">
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default ClientProfile;