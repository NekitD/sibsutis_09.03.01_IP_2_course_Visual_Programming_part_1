import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loadingError, setLoadingError] = useState('');

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5186/api/auth/profile', {
          headers: { 
            Authorization: `Bearer ${authToken}` 
          },
        });
        setUserData(data);
      } catch (err) {
        console.error('Profile loading error:', err);
        setLoadingError('Could not load profile data. Please refresh the page.');
      }
    };

    getUserProfile();
  }, []);

  const renderProfileField = (label, value) => (
    <div className="profile-field">
      <label>{label}:</label>
      <input 
        type="text" 
        value={value || ''} 
        readOnly 
        className="profile-input"
      />
    </div>
  );

  if (loadingError) {
    return <div className="error-message">{loadingError}</div>;
  }

  if (!userData) {
    return <div className="loading-message">Loading profile information...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-header">User Profile</h2>
      
      {renderProfileField('Full Name', `${userData.firstName} ${userData.lastName}`)}
      {renderProfileField('Email', userData.email)}
      {renderProfileField('Specialization', userData.specialization)}
      
      <div className="profile-field">
        <label>Bio:</label>
        <textarea 
          value={userData.bio || ''} 
          readOnly 
          className="profile-textarea"
        />
      </div>

      {renderProfileField('Location', userData.location)}
      {renderProfileField('Institution', userData.institution)}
      {renderProfileField('Social Links', userData.socialLinks)}
    </div>
  );
};

export default UserProfile;