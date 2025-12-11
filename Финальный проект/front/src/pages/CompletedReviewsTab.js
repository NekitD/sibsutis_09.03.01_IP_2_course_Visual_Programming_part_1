import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompletedReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/reviews/completed', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(data);
      } catch {
        setError('Не удалось загрузить завершенные рецензии.');
      }
    })();
  }, [token]);

  return (
    <div>
      <h3>Завершенные рецензии</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!reviews.length ? (
        <p>Нет завершенных рецензий.</p>
      ) : (
        <ul>
          {reviews.map(({ id, articleTitle, authorName, rating, recommendation, createdAt }) => (
            <li key={id}>
              <h4>{articleTitle}</h4>
              <p>Автор: {authorName}</p>
              <p>Оценка: {rating ?? 'Н/Д'}</p>
              <p>Рекомендация: {recommendation}</p>
              <p>Дата создания: {new Date(createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedReviewsTab;