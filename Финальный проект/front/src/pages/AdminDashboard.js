// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './AdminDashboard.css'

const TABS = [
  { key: 'users',    label: 'Пользователи' },
  { key: 'articles', label: 'Статьи' },
  { key: 'reviews',  label: 'Рецензии' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const token = localStorage.getItem('token') || '';
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5186';

  // единый экземпляр axios
  const api = useMemo(() => {
    return axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${token}` }
    });
  }, [baseURL, token]);

  // fetchData: подгружает users/articles/reviews в зависимости от activeTab
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = '';
      switch (activeTab) {
        case 'users':
          url = '/api/admin/users';
          break;
        case 'articles':
          url = '/api/admin/articles';
          break;
        case 'reviews':
          url = '/api/admin/reviews/completed';
          break;
      }
      const resp = await api.get(url);
      setItems(resp.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Не удалось получить данные');
    } finally {
      setLoading(false);
    }
  }, [activeTab, api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === CRUD-хендлеры ===  
  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setItems(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ошибка удаления пользователя');
    }
  }, [api]);

  const handleBlockUser = useCallback(async (userId) => {
    if (!window.confirm('Заблокировать пользователя?')) return;
    try {
      await api.put(`/api/admin/users/${userId}/block`);
      setItems(prev =>
        prev.map(u => u.id === userId ? { ...u, status: 'Blocked' } : u)
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ошибка блокировки пользователя');
    }
  }, [api]);

  const handleDeleteArticle = useCallback(async (articleId) => {
    if (!window.confirm('Удалить статью?')) return;
    try {
      await api.delete(`/api/admin/article/${articleId}`);
      setItems(prev => prev.filter(a => a.id !== articleId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ошибка удаления статьи');
    }
  }, [api]);

  const handleDeleteReview = useCallback(async (reviewId) => {
    if (!window.confirm('Удалить рецензию?')) return;
    try {
      await api.delete(`/api/admin/reviews/${reviewId}`);
      setItems(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ошибка удаления рецензии');
    }
  }, [api]);

  // Рендерим таблицу в зависимости от activeTab
  const renderTable = () => {
    if (loading) return <p>Загрузка...</p>;
    if (error)   return <p className="error">{error}</p>;

    switch (activeTab) {
      case 'users':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status || 'Active'}</td>
                  <td>
                    <button onClick={() => handleBlockUser(user.id)}>Block</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'articles':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(article => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.category}</td>
                  <td>{article.status}</td>
                  <td>
                    <button onClick={() => handleDeleteArticle(article.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'reviews':
        return (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article ID</th>
                <th>Rating</th>
                <th>Recommendation</th>
                <th>Created At</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(review => (
                <tr key={review.id}>
                  <td>{review.articleId}</td>
                  <td>{review.rating}</td>
                  <td>{review.recommendation}</td>
                  <td>{new Date(review.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="admin-dashboard container">
      <h2>Панель администратора</h2>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => {
              setError('');
              setActiveTab(tab.key);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        {renderTable()}
      </div>
    </div>
  );
};

export default AdminDashboard;