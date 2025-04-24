import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from './api';
import BasePage from './BasePage';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await api.get(`/programs/${id}/`);
        setProgram(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load program');
        console.error(err);
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

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