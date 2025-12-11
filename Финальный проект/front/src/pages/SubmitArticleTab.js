// src/components/SubmitArticleForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5186/api';
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const SubmitArticleForm = () => {
  const token = localStorage.getItem('token') || '';
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags]         = useState('');
  const [file, setFile]         = useState(null);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !category.trim() || !file) {
      setError('Пожалуйста, заполните заголовок, категорию и выберите PDF-файл.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Category', category);
      tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)
        .forEach(t => formData.append('Tags', t));
      formData.append('File', file);

      const resp = await axios.post(
        `${API_BASE}/articles`,
        formData,
        {
          headers: {
            ...getAuthHeaders(token)
            // Content-Type не указываем, браузер сам выставит multipart/form-data
          }
        }
      );

      setSuccess(`Статья успешно создана, id=${resp.data.id}`);
      setTitle('');
      setCategory('');
      setTags('');
      setFile(null);

    } catch (err) {
      console.error('Ошибка отправки:', err);
      setError(
        err.response?.data ||
        err.message ||
        'Произошла ошибка при создании статьи.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Отправить новую статью</h2>
      <div>
        <label>Заголовок</label><br />
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Категория</label><br />
        <input value={category} onChange={e => setCategory(e.target.value)} required />
      </div>
      <div>
        <label>Теги (через запятую)</label><br />
        <input value={tags} onChange={e => setTags(e.target.value)} />
      </div>
      <div>
        <label>Загрузить PDF</label><br />
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
      </div>
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit">Отправить</button>
    </form>
  );
};

export default SubmitArticleForm;
