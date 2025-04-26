//Here a registered client is enrolled into a program together with all editing and unrolling capabilities

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';
import { FaUser, FaClipboardCheck, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EnrollClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientInfo, setClientInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, clientRes] = await Promise.all([
          api.get('/api/programs/'),
          api.get(`/api/clients/${id}/`)
        ]);
        setPrograms(programsRes.data);
        setClientInfo(clientRes.data);
      } catch (err) {
        setError('Failed to load required data');
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await api.post('/api/enrollments/', {
        client: parseInt(id),
        program: parseInt(selectedProgram)
      });
      setSuccess('Enrollment successful! Redirecting...');
      setTimeout(() => navigate(`/clients/${id}`), 1500);
    } catch (err) {
      const errorMessage = err.response?.status === 400 
        ? 'Client already enrolled in this program' 
        : 'Enrollment failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BasePage>
      <div className="enrollment-container">
        <div className="enrollment-header">
          <Link to={`/clients/${id}`} className="back-link">
            <FaArrowLeft /> Back to Client
          </Link>
          <h1><FaClipboardCheck /> Program Enrollment</h1>
        </div>

        {clientInfo && (
          <div className="client-summary-card">
            <div className="client-badge">
              <FaUser className="user-icon" />
              <div>
                <h3>{clientInfo.full_name}</h3>
                <p>Client ID: {id}</p>
              </div>
            </div>
            <div className="client-details">
              <p><strong>DOB:</strong> {new Date(clientInfo.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {clientInfo.contact}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleEnroll} className="enrollment-form">
          <div className="form-section">
            <h2><FaClipboardCheck /> Select Treatment Program</h2>
            <p className="form-instruction">Choose from available care programs below:</p>
            
            <div className="program-grid">
              {programs.map((program) => (
                <div 
                  key={program.id}
                  className={`program-card ${selectedProgram === program.id.toString() ? 'selected' : ''}`}
                  onClick={() => setSelectedProgram(program.id.toString())}
                >
                  <div className="program-icon">
                    <FaClipboardCheck />
                  </div>
                  <div className="program-info">
                    <h3>{program.title}</h3>
                    <p className="program-description">{program.description}</p>
                    
                  </div>
                  <div className="checkmark">
                    {selectedProgram === program.id.toString() && <FaCheckCircle />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-button"
              disabled={!selectedProgram || isSubmitting}
            >
              {isSubmitting ? 'Enrolling...' : 'Confirm Enrollment'}
            </button>
            <Link to={`/clients/${id}`} className="secondary-button">
              Cancel Enrollment
            </Link>
          </div>
        </form>

        {error && (
          <div className="alert error">
            <FaTimesCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <FaCheckCircle />
            <span>{success}</span>
          </div>
        )}
      </div>
    </BasePage>
  );
};

export default EnrollClient;