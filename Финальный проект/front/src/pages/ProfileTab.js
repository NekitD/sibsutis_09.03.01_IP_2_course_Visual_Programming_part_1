import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5186/api';
const getAuthHeaders = (token) => ({ Authorization: `Bearer ${token}` });
const formButtonStyle = { marginRight: '8px' };

const ProfileTab = ({ profile }) => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!profile) {
    return <div>Загрузка профиля…</div>;
  }

  const token = localStorage.getItem('token') || '';
  localStorage.setItem('fname', profile.firstName);
  localStorage.setItem('lname', profile.lastName);
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${API_BASE}/auth/profile`,
        formData,
        { headers: getAuthHeaders(token) }
      );
      alert('Профиль успешно обновлен!');
      setIsEditing(false);

    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  return (
    <div>
      <h3>
        {profile.firstName} {profile.lastName}
      </h3>
      <p>Email: {profile.email}</p>
      <p>Роль: {profile.role}</p>
      <p>Специализация: {profile.specialization}</p>
      <p>Учреждение: {profile.institution}</p>
      <p>Биография: {profile.bio}</p>
      <p>Местоположение: {profile.location}</p>
      <p>Социальные сети: {profile.socialLinks}</p>

      <button onClick={() => setIsEditing(true)}>Редактировать профиль</button>

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label>Имя:</label>
            <input
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Фамилия:</label>
            <input
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Специализация:</label>
            <input
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Учреждение:</label>
            <input
              name="institution"
              value={formData.institution || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Биография:</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Местоположение:</label>
            <input
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Социальные сети:</label>
            <input
              name="socialLinks"
              value={formData.socialLinks || ''}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={formButtonStyle}>
            Сохранить изменения
          </button>
          <button
            type="button"
            style={formButtonStyle}
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileTab;