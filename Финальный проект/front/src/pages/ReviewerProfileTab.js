import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5186/api';
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const ReviewerProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/reviewer/profile`,
          { headers: getAuthHeaders(token) }
        );
        setProfile(data);
      } catch (err) {
        console.error('Не удалось получить профиль рецензента:', err);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div>
      <h3>Панель рецензента</h3>
      <p>Статус: Активный рецензент</p>

      <section>
        <h4>Личная информация</h4>
        <div>
          <label>ФИО:</label>
          <input value={profile?.fullName || ''} readOnly />
        </div>
        <div>
          <label>Электронная почта:</label>
          <input value={profile?.email || ''} readOnly />
        </div>
        <div>
          <label>Учреждение:</label>
          <input value={profile?.institution || ''} readOnly />
        </div>
        <div>
          <label>Область экспертизы:</label>
          <input value={profile?.fieldOfExpertise || ''} readOnly />
        </div>
      </section>

      <section>
        <h4>Статистика рецензирования</h4>
        <div>
          <p>Всего рецензий: {profile?.totalReviews ?? 0}</p>
          <p>В процессе: {profile?.inProgressReviews ?? 0}</p>
          <p>Завершено: {profile?.completedReviews ?? 0}</p>
        </div>
      </section>

      <section>
        <h4>Настройки рецензирования</h4>
        <div>
          <label>
            <input
              type="checkbox"
              checked={profile?.availableForReviews || false}
              disabled
            />{' '}
            Готов к новым рецензиям
          </label>
        </div>
        <div>
          <label>Максимальное количество одновременных рецензий:</label>
          <input
            type="number"
            value={profile?.maxConcurrentReviews ?? 0}
            readOnly
          />
        </div>
      </section>
    </div>
  );
};

export default ReviewerProfileTab;
