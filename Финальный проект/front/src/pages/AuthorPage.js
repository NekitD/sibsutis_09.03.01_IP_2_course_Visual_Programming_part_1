import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileTab from './ProfileTab'; 
import MyArticlesTab from './MyArticlesTab'; 
import SubmitArticleTab from './SubmitArticleTab'; 

const AuthorPage = () => {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [profile, setProfile] = useState(null); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5186/api/auth/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="container">
      <h2>Личный кабинет автора</h2>
      <div className="tabs">
        <button
          onClick={() => setActiveTab('profile')}
          className={activeTab === 'profile' ? 'active' : ''}
        >
          Профиль
        </button>
        <button
          onClick={() => setActiveTab('my-articles')}
          className={activeTab === 'my-articles' ? 'active' : ''}
        >
          Мои статьи
        </button>
        <button
          onClick={() => setActiveTab('submit-article')}
          className={activeTab === 'submit-article' ? 'active' : ''}
        >
          Отправить статью на рецензирование
        </button>
      </div>

      {activeTab === 'profile' && <ProfileTab profile={profile} />}
      {activeTab === 'my-articles' && <MyArticlesTab />}
      {activeTab === 'submit-article' && <SubmitArticleTab />}
    </div>
  );
};

export default AuthorPage;