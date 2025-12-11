import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5186/api';

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const NewRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/reviewrequests/pending-articles`,
          {
            headers: {
              ...getAuthHeaders(token),
              'Content-Type': 'application/json',
            },
          }
        );
        setRequests(data);
      } catch (err) {
        console.error('Ошибка загрузки статей на рассмотрении:', err);
        setError('Не удалось загрузить статьи на рассмотрении.');
      }
    };

    fetchPendingArticles();
  }, [token]);

  const handleAction = async (articleId, action) => {
    try {
      const endpoint =
        action === 'accept'
          ? `${API_BASE}/reviewrequests/${articleId}/accept`
          : `${API_BASE}/reviewrequests/${articleId}/decline`;

      const { data } = await axios.put(
        endpoint,
        {},
        {
          headers: getAuthHeaders(token),
        }
      );

      alert(data.message || `Статья успешно ${action === 'accept' ? 'принята' : 'отклонена'}.`);
      window.location.reload();
    } catch (err) {
      console.error(`Ошибка ${action === 'accept' ? 'принятия' : 'отклонения'} статьи ${articleId}:`, err);
      setError(err.response?.data?.error || 'Не удалось обновить статус статьи.');
    }
  };

  return (
    <div>
      <h3>Новые запросы на рецензирование</h3>

      {requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <h4>{req.title}</h4>
              <p>Категория: {req.category}</p>
              <p>Статус: {req.status}</p>
              <button onClick={() => handleAction(req.id, 'accept')}>
                Принять
              </button>
              <button onClick={() => handleAction(req.id, 'decline')}>
                Отклонить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет статей, ожидающих рецензирования.</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NewRequestsTab;