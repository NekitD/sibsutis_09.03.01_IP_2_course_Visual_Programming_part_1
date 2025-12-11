// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewerDashboard from './pages/ReviewerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import AuthorDashboard from "./pages/AuthorDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Группируем dashboard-роуты для лучшей читаемости */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="reviewer" element={<ReviewerDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
          <Route path="author" element={<AuthorDashboard/>} />
      </Route>
    </Routes>
  );
}

export default App;