import { Route, Routes, Navigate } from 'react-router-dom';
import AuthorPage from './AuthorPage';
import { useNavigate } from 'react-router-dom';
import ReviewerPage from './ReviewerDashboard';
import AdminPage from './AdminPage';
import NotFound from './NotFound';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const firstName = localStorage.getItem('fname');
  const lastName = localStorage.getItem('lname');
  const roleMap = {
    Author: 'author',
    Reviewer: 'reviewer',
    Admin: 'admin',
  };
  const subpath = roleMap[role];

  return (
    <div style={{ display: 'flex' }}>
      {/* Основной контент */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              subpath ? (
                <Navigate to={`/dashboard/${subpath}`} />
              ) : (
                <NotFound
                  message={`Роль не найдена. Текущая роль: ${role}. Возможно, вам нужно войти в систему?`}
                />
              )
            }
          />
          <Route path="author" element={<AuthorPage />} />
          <Route path="reviewer" element={<ReviewerPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Боковая панель с именем и кнопкой */}
      <div style={{
        width: '250px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderLeft: '3px solid #ccc'
      }}>
        <h2 style={{ marginBottom: '20px' }}>
          {firstName} {lastName}
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#8b0000',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Выход из профиля
        </button>
      </div>
    </div>
  );
};

export default Dashboard;