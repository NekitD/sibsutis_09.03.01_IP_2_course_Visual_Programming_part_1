import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';

const API_BASE = 'http://localhost:5186/api';
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

const steps = [
  { id: 1, title: 'Личные данные' },
  { id: 2, title: 'Данные аккаунта' },
  { id: 3, title: 'Профиль' },
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Author',
    bio: '',
    location: '',
    institution: '',
    socialLinks: '',
    specialization: '',
  });
  const [error, setError] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Пожалуйста, заполните имя и фамилию.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Пожалуйста, укажите email и пароль.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        `${API_BASE}/auth/register`,
        formData,
        { headers: getAuthHeaders() }
      );
      alert('Регистрация прошла успешно');
      window.location.href = '/';
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError(
        err.response?.data?.title ||
        'Ошибка регистрации. Проверьте введённые данные.'
      );
    }
  };

  const renderStepFields = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Имя"
              required
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Фамилия"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Пароль"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Author">Автор</option>
              <option value="Reviewer">Рецензент</option>
              <option value="Admin">Администратор</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Биография"
              rows={3}
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Местоположение"
            />
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Учреждение"
            />
            <input
              name="socialLinks"
              value={formData.socialLinks}
              onChange={handleChange}
              placeholder="Социальные сети"
            />
            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Специализация"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2>Регистрация</h2>
      <div className="steps">
        {steps.map(s => (
          <div
            key={s.id}
            className={`step ${s.id === step ? 'active' : ''}`}
          >
            {s.title}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStepFields()}

        {error && <p className="error">{error}</p>}

        <div className="buttons">
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Назад
            </button>
          )}
          {step < steps.length && (
            <button type="button" onClick={nextStep}>
              Далее
            </button>
          )}
          {step === steps.length && (
            <button type="submit">
              Зарегистрироваться
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;