import React, { useEffect, useState } from 'react';
import axios from 'axios';

const cardStyle = {
  flex: '1',
  margin: '0 10px',
  padding: '20px',
  borderRadius: '8px',
  background: '#575757',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const dashboardContainer = {
  maxWidth: '1000px',
  margin: '40px auto',
  padding: '0 20px',
};

const dashboardHeader = {
  textAlign: 'center',
  marginBottom: '30px',
};

const cardsWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
};

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [completedReviewsCount, setCompletedReviewsCount] = useState(0);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const fetchCounts = async () => {
      try {
        const [usersRes, artsRes, revsRes] = await Promise.all([
          axios.get('http://localhost:5186/api/admin/users', { headers }),
          axios.get('http://localhost:5186/api/admin/articles', { headers }),
          axios.get('http://localhost:5186/api/admin/reviews/completed', { headers }),
        ]);
        setUserCount(usersRes.data.length);
        setArticleCount(artsRes.data.length);
        setCompletedReviewsCount(revsRes.data.length);
      } catch (err) {
        console.error('Не удалось загрузить данные для панели управления', err);
      }
    };
    fetchCounts();
  }, [authToken]);

  return (
    <div style={dashboardContainer}>
      <header style={dashboardHeader}>
        <h1>Панель администратора</h1>
        <p>С возвращением, Администратор!</p>
      </header>
      <div style={cardsWrapper}>
        <div style={cardStyle}>
          <h2>Пользователи</h2>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{userCount}</p>
        </div>
        <div style={cardStyle}>
          <h2>Статьи</h2>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{articleCount}</p>
        </div>
        <div style={cardStyle}>
          <h2>Завершенные рецензии</h2>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{completedReviewsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;