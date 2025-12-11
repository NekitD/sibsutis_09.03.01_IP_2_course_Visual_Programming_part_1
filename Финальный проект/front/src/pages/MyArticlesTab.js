import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5186/api';

const getStatusColor = (status) => {
  switch (status) {
    case 'На рассмотрении':
      return 'orange';
    case 'В процессе рецензирования':
      return 'gray';
    case 'Опубликовано':
      return 'blue';
    case 'Отклонено':
      return 'red';
    default:
      return 'gray';
  }
};

const normalizeStatus = (status) => {
  if (status === 'Черновик') return 'На рассмотрении';
  return status || 'На рассмотрении';
};

const MyArticlesTab = () => {
  const [articles, setArticles] = useState([]);
  const [expandedArticleId, setExpandedArticleId] = useState(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data: rawArticles } = await axios.get(
          `${API_BASE}/articles/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const articlesWithStatus = rawArticles.map((a) => ({
          ...a,
          status: normalizeStatus(a.status),
        }));

        const articlesWithReviews = await Promise.all(
          articlesWithStatus.map(async (article) => {
            if (article.status !== 'Опубликовано') {
              return article;
            }

            try {
              const { data: reviewData } = await axios.get(
                `${API_BASE}/reviews/${article.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log(`Получены рецензии для статьи ${article.id}:`, reviewData);

              const reviews = Array.isArray(reviewData) ? reviewData : [reviewData];
              return { ...article, reviews };
            } catch (err) {
              console.error(`Ошибка загрузки рецензий для статьи ${article.id}:`, err);
              return { ...article, reviews: [] };
            }
          })
        );

        console.log('Статьи с рецензиями:', articlesWithReviews);
        setArticles(articlesWithReviews);
      } catch (err) {
        console.error('Ошибка загрузки статей:', err);
      }
    };

    fetchArticles();
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h3>Мои статьи</h3>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <button onClick={() => toggleExpand(article.id)}>
              {article.title}{' '}
              <span style={{ color: getStatusColor(article.status) }}>
                - {article.status}
              </span>
            </button>

            {expandedArticleId === article.id && (
              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: 'red' }}>{article.category}</p>
                <p>{article.content}</p>

                {article.status === 'Опубликовано' && (
                  <div>
                    <h4>Рецензии:</h4>
                    {article.reviews && article.reviews.length > 0 ? (
                      article.reviews.map((review) => (
                        <div key={review.id} style={{ marginBottom: '10px' }}>
                          <p><strong>Оценка:</strong> {review.rating}</p>
                          <p><strong>Рекомендация:</strong> {review.recommendation}</p>
                          <p><strong>Техническое качество:</strong> {review.technicalMerit}</p>
                          <p><strong>Оригинальность:</strong> {review.originality}</p>
                          <p><strong>Качество изложения:</strong> {review.presentationQuality}</p>
                          <p><strong>Комментарии авторам:</strong> {review.commentsToAuthors}</p>
                          <p><strong>Конфиденциальные комментарии:</strong> {review.confidentialComments}</p>
                          <p><strong>Статус:</strong> {review.status}</p>
                          <p><strong>Дата создания:</strong> {new Date(review.createdAt).toLocaleString()}</p>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>Нет доступных рецензий.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyArticlesTab;