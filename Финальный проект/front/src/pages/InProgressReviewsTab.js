import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InProgressReviewsTab = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: null,
    recommendation: '',
    technicalMerit: '',
    originality: '',
    presentationQuality: '',
    commentsToAuthors: '',
    confidentialComments: '',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          '/api/reviewrequests/inprogress',
          { headers }
        );
        setRequests(data);
      } catch {
        setError('Не удалось загрузить статьи для рецензирования.');
      }
    })();
  }, [token]);

  const handleInputChange = ({ target: { name, value } }) =>
    setReviewData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArticleId) {
      setError('Статья не выбрана.');
      return;
    }
    try {
      await axios.post(
        '/api/reviews',
        { articleId: selectedArticleId, ...reviewData },
        { headers }
      );
      alert('Рецензия успешно создана!');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось создать рецензию.');
    }
  };

  const handleUpdate = async (reviewId) => {
    try {
      await axios.put(
        `/api/reviews/${reviewId}`,
        { articleId: selectedArticleId, ...reviewData },
        { headers }
      );
      alert('Рецензия успешно обновлена!');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось обновить рецензию.');
    }
  };

  const handleDownload = async (articleId) => {
    try {
      const { data } = await axios.get(
        `/api/articles/${articleId}/download`,
        { headers, responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `article-${articleId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось скачать статью.');
    }
  };

  const textAreas = [
    'technicalMerit',
    'originality',
    'presentationQuality',
    'commentsToAuthors',
    'confidentialComments',
  ];

  return (
    <div>
      <h3>Текущие рецензии</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {requests.length ? (
        <ul>
          {requests.map(({ id, title, category }) => (
            <li key={id}>
              <h4>{title}</h4>
              <p>Категория: {category}</p>
              <button onClick={() => setSelectedArticleId(id)}>
                Выбрать статью
              </button>
              <button onClick={() => handleDownload(id)}>
                Скачать PDF
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет статей для рецензирования.</p>
      )}

      {selectedArticleId && (
        <form onSubmit={handleSubmit}>
          <h3>Рецензия для статьи #{selectedArticleId}</h3>

          <label>
            Оценка:
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={reviewData.rating || ''}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Рекомендация:
            <select
              name="recommendation"
              value={reviewData.recommendation}
              onChange={handleInputChange}
            >
              <option value="">--Выберите--</option>
              {[
                'Принять',
                'Принять с незначительными исправлениями',
                'Принять с существенными исправлениями',
                'Отклонить',
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          {textAreas.map((field) => (
            <label key={field}>
              {field === 'technicalMerit' && 'Техническое качество'}
              {field === 'originality' && 'Оригинальность'}
              {field === 'presentationQuality' && 'Качество изложения'}
              {field === 'commentsToAuthors' && 'Комментарии авторам'}
              {field === 'confidentialComments' && 'Конфиденциальные комментарии'}
              :
              <textarea
                name={field}
                value={reviewData[field]}
                onChange={handleInputChange}
              />
            </label>
          ))}

          <button type="submit">Сохранить рецензию</button>
        </form>
      )}
    </div>
  );
};

export default InProgressReviewsTab;