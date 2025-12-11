import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const authToken = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${authToken}` };

  const [activeTab, setActiveTab] = useState('users');

  // ПОЛЬЗОВАТЕЛИ
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    specialization: '',
    institution: '',
    bio: '',
    Location: '',
    SocialLinks: ''
  });

  // СТАТЬИ
  const [articles, setArticles] = useState([]);

  // ЗАВЕРШЕННЫЕ РЕЦЕНЗИИ
  const [completedReviews, setCompletedReviews] = useState([]);

  // ЗАПРОС НА РЕЦЕНЗИРОВАНИЕ
  const [reviewRequest, setReviewRequest] = useState({
    articleId: '',
    reviewerId: '',
    dueDate: '',
    expectedTime: '',
    pages: '',
  });

  // ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5186/api/admin/users', { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке пользователей', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5186/api/admin/articles', { headers });
      setArticles(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке статей', err);
    }
  };

  const fetchCompletedReviews = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5186/api/admin/reviews/completed',
        { headers }
      );
      setCompletedReviews(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке завершенных рецензий', err);
    }
  };

  // ДЕЙСТВИЯ CRUD
  const handleCreateUser = async e => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5186/api/admin/users',
        newUser,
        { headers }
      );
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
        specialization: '',
        institution: '',
        bio: '',
        location: '',
        SocialLinks: ''
      });
      fetchUsers();
    } catch (err) {
      console.error('Ошибка при создании пользователя', err);
    }
  };

  const handleDeleteUser = async id => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await axios.delete(`http://localhost:5186/api/admin/users/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      console.error('Ошибка при удалении пользователя', err);
    }
  };

  const handleBlockUser = async id => {
    try {
      await axios.put(`http://localhost:5186/api/admin/users/${id}/block`, {}, { headers });
      fetchUsers();
    } catch (err) {
      console.error('Ошибка при блокировке пользователя', err);
    }
  };

  const handleDeleteArticle = async id => {
    if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) return;
    try {
      await axios.delete(`http://localhost:5186/api/admin/article/${id}`, { headers });
      fetchArticles();
    } catch (err) {
      console.error('Ошибка при удалении статьи', err);
    }
  };

  const handleDeleteReview = async id => {
    if (!window.confirm('Вы уверены, что хотите удалить эту рецензию?')) return;
    try {
      await axios.delete(`http://localhost:5186/api/admin/reviews/${id}`, { headers });
      fetchCompletedReviews();
    } catch (err) {
      console.error('Ошибка при удалении рецензии', err);
    }
  };

  const handleCreateReviewRequest = async e => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5186/api/admin/reviewrequests',
        reviewRequest,
        { headers }
      );
      setReviewRequest({
        articleId: '',
        reviewerId: '',
        dueDate: '',
        expectedTime: '',
        pages: '',
      });
      alert('Запрос на рецензирование создан');
    } catch (err) {
      console.error('Ошибка при создании запроса на рецензирование', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchArticles();
    fetchCompletedReviews();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Панель администратора</h1>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
        <button
          className={activeTab === 'articles' ? 'active' : ''}
          onClick={() => setActiveTab('articles')}
        >
          Статьи
        </button>
        <button
          className={activeTab === 'completedReviews' ? 'active' : ''}
          onClick={() => setActiveTab('completedReviews')}
        >
          Завершенные рецензии
        </button>
        <button
          className={activeTab === 'reviewRequests' ? 'active' : ''}
          onClick={() => setActiveTab('reviewRequests')}
        >
          Новый запрос на рецензию
        </button>
      </div>

      {activeTab === 'users' && (
        <section>
          <h2>Управление пользователями</h2>
          <table className="table">
            <thead>
              <tr>
                {['ID', 'Email', 'Имя', 'Роль', 'Статус', 'Действия'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{`${u.firstName} ${u.lastName}`}</td>
                  <td>{u.role}</td>
                  <td>{u.status || 'Активен'}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ background: '#dc3545', color: '#fff' }}
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => handleBlockUser(u.id)}
                      style={{ background: '#ffc107', color: '#000' }}
                    >
                      Заблокировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

         <h3>Создать нового пользователя</h3>
<form onSubmit={handleCreateUser}>
  {Object.entries(newUser).map(([key, val]) => {
    if (key === 'role') {
      return (
        <div className="form-group" key={key}>
          <label>Роль</label>
          <select
            value={val}
            onChange={e => setNewUser(prev => ({ ...prev, [key]: e.target.value }))}
            required
          >
            <option value="">Выберите роль</option>
            <option value="Author">Автор</option>
            <option value="Reviewer">Рецензент</option>
            <option value="Admin">Администратор</option>
          </select>
        </div>
      );
    }
    
    return (
      <div className="form-group" key={key}>
        <label>
          {key === 'email' && 'Email'}
          {key === 'firstName' && 'Имя'}
          {key === 'lastName' && 'Фамилия'}
          {key === 'password' && 'Пароль'}
          {key === 'specialization' && 'Специализация'}
          {key === 'institution' && 'Учреждение'}
          {key === 'bio' && 'Биография'}
          {key === 'Location' && 'Местоположение'}
          {key === 'SocialLinks' && 'Социальные сети'}
        </label>
        <input
          type={key === 'password' ? 'password' : 'text'}
          value={val}
          onChange={e => setNewUser(prev => ({ ...prev, [key]: e.target.value }))}
          required={key !== 'specialization' && key !== 'institution' && key !== 'bio' && key !== 'Location' && key !== 'SocialLinks'}
        />
      </div>
    );
  })}
  <button
    type="submit"
    style={{ background: '#575757', color: '#fff' }}
  >
    Добавить пользователя
  </button>
</form>
        </section>
      )}

      {activeTab === 'articles' && (
        <section>
          <h2>Управление статьями</h2>
          <table className="table">
            <thead>
              <tr>
                {['ID', 'Название', 'Статус', 'Действия'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title || 'Без названия'}</td>
                  <td>{a.status}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleDeleteArticle(a.id)}
                      style={{ background: '#575757', color: '#fff' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'completedReviews' && (
        <section>
          <h2>Завершенные рецензии</h2>
          <table className="table">
            <thead>
              <tr>
                {[
                  'ID',
                  'Статья',
                  'Рецензент',
                  'Оценка',
                  'Рекомендация',
                  'Статус',
                  'Дата создания'
                ].map(h => (
                  <th key={h}>{h}</th>
                ))}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {completedReviews.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.articleId}</td>
                  <td>{r.reviewerId}</td>
                  <td>{r.rating}</td>
                  <td>{r.recommendation}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      style={{ background: '#dc3545', color: '#fff' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'reviewRequests' && (
        <section>
          <h2>Создать запрос на рецензию</h2>
          <form onSubmit={handleCreateReviewRequest}>
            {Object.entries(reviewRequest).map(([key, val]) => (
              <div className="form-group" key={key}>
                <label>
                  {key === 'articleId' && 'ID статьи'}
                  {key === 'reviewerId' && 'ID рецензента'}
                  {key === 'dueDate' && 'Срок выполнения'}
                  {key === 'expectedTime' && 'Ожидаемое время'}
                  {key === 'pages' && 'Количество страниц'}
                </label>
                <input
                  type={key === 'dueDate' ? 'date' : 'text'}
                  value={val}
                  onChange={e =>
                    setReviewRequest(prev => ({ ...prev, [key]: e.target.value }))
                  }
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              style={{ background: '#575757', color: '#fff' }}
            >
              Отправить запрос
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default AdminPage;