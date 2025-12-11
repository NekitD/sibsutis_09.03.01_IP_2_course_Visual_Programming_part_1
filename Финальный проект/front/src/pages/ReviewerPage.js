import React, { useState, useEffect } from 'react'

/**
 * Вспомогательная функция для получения JWT
 */
function authHeaders() {
  const token = localStorage.getItem('token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

/**
 * ВКЛАДКА НОВЫХ ЗАПРОСОВ
 */
export function NewRequestsTab() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = () => {
    setLoading(true)
    fetch('/api/reviewrequests/my', { headers: authHeaders() })
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(data => {
        setRequests(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Не удалось загрузить приглашения.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = (id, action) => {
    fetch(`/api/reviewrequests/${id}/${action}`, {
      method: 'PUT',
      headers: authHeaders(),
    })
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(() => fetchData())
      .catch(() => alert('Операция не выполнена'))
  }

  if (loading) return <p>Загрузка...</p>
  if (error) return <p className="error">{error}</p>
  if (requests.length === 0) return <p>Нет новых запросов.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Статья</th>
          <th>Срок выполнения</th>
          <th>Примерное время</th>
          <th>Страниц</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(r => (
          <tr key={r.id}>
            <td>{r.articleTitle}</td>
            <td>{new Date(r.dueDate).toLocaleDateString()}</td>
            <td>{r.expectedTime}</td>
            <td>{r.pages}</td>
            <td>
              <button onClick={() => handleAction(r.id, 'accept')}>
                Принять
              </button>{' '}
              <button onClick={() => handleAction(r.id, 'decline')}>
                Отклонить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/**
 * ВКЛАДКА В ПРОЦЕССЕ (форма рецензирования)
 */
export function InProgressReviewsTab() {
  const [invites, setInvites] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    rating: '',
    recommendation: '',
    technicalMerit: '',
    originality: '',
    presentationQuality: '',
    commentsToAuthors: '',
    confidentialComments: '',
  })
  const [loading, setLoading] = useState(true)

  const fetchInvites = () => {
    setLoading(true)
    fetch('/api/reviewrequests/accepted', { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        setInvites(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const startEdit = id => {
    setEditingId(id)
    setForm({
      rating: '',
      recommendation: '',
      technicalMerit: '',
      originality: '',
      presentationQuality: '',
      commentsToAuthors: '',
      confidentialComments: '',
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!editingId) return
    const payload = {
      articleId: editingId,
      rating: parseInt(form.rating, 10) || 0,
      recommendation: form.recommendation,
      technicalMerit: form.technicalMerit,
      originality: form.originality,
      presentationQuality: form.presentationQuality,
      commentsToAuthors: form.commentsToAuthors,
      confidentialComments: form.confidentialComments,
    }
    fetch('/api/reviews', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) throw new Error('ошибка отправки')
        return r.json()
      })
      .then(() => {
        alert('Рецензия создана!')
        setEditingId(null)
        fetchInvites()
      })
      .catch(e => {
        console.error(e)
        alert('Не удалось отправить рецензию.')
      })
  }

  if (loading) return <p>Загрузка...</p>
  if (invites.length === 0) return <p>Нет принятых запросов.</p>

  return (
    <div className="inprogress">
      {invites.map(inv => (
        <div key={inv.id} className="invite-block">
          <h4>{inv.articleTitle}</h4>
          <p>
            Срок: {new Date(inv.dueDate).toLocaleDateString()} | Время:{' '}
            {inv.expectedTime} | Страниц: {inv.pages}
          </p>
          {editingId === inv.articleId ? (
            <form onSubmit={handleSubmit} className="review-form">
              <div>
                <label>Оценка (1–5)</label>
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  min="1"
                  max="5"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Рекомендация</label>
                <select
                  name="recommendation"
                  value={form.recommendation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выбрать...</option>
                  <option value="Accept">Принять</option>
                  <option value="AcceptWithMinorRevisions">
                    Незначительные исправления
                  </option>
                  <option value="AcceptWithMajorRevisions">
                    Существенные исправления
                  </option>
                  <option value="Reject">Отклонить</option>
                </select>
              </div>
              <div>
                <label>Техническое качество</label>
                <textarea
                  name="technicalMerit"
                  value={form.technicalMerit}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Оригинальность</label>
                <textarea
                  name="originality"
                  value={form.originality}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Качество изложения</label>
                <textarea
                  name="presentationQuality"
                  value={form.presentationQuality}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Комментарии авторам</label>
                <textarea
                  name="commentsToAuthors"
                  value={form.commentsToAuthors}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Конфиденциальные комментарии</label>
                <textarea
                  name="confidentialComments"
                  value={form.confidentialComments}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Отправить рецензию</button>{' '}
              <button type="button" onClick={() => setEditingId(null)}>
                Отмена
              </button>
            </form>
          ) : (
            <button onClick={() => startEdit(inv.articleId)}>Рецензировать</button>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * ВКЛАДКА ЗАВЕРШЕННЫХ РЕЦЕНЗИЙ
 */
export function CompletedReviewsTab() {
  const [revs, setRevs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews/completed', { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        setRevs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (revs.length === 0) return <p>Пока нет завершенных рецензий.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Статья</th>
          <th>Автор</th>
          <th>Оценка</th>
          <th>Рекомендация</th>
          <th>Статус</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        {revs.map(r => (
          <tr key={r.id}>
            <td>{r.articleTitle}</td>
            <td>{r.authorName}</td>
            <td>{r.rating}</td>
            <td>{r.recommendation}</td>
            <td>{r.status}</td>
            <td>{new Date(r.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}