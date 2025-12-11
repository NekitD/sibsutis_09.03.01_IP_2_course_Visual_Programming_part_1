import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError('Неверные учетные данные');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', marginTop: 250, padding: 20 }}>
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>
          Войти
        </button>
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <p>Нет учетной записи?</p>
        <button onClick={() => navigate('/register')}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default LoginPage;