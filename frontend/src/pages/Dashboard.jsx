import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WordGame from '../components/WordGame';
import UserSidebar from '../components/UserSidebar';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'PLAYER');

  useEffect(() => {
    if (userName === 'PLAYER') {
      const fetchName = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          const res = await axios.get('https://wordgame-m15v.onrender.com/api/users/me', {
            headers: { 'x-auth-token': token }
          });
          if (res.data && res.data.name) {
            setUserName(res.data.name);
            localStorage.setItem('userName', res.data.name);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchName();
    }
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="greeting-text">
            HELLO <span>{userName.toUpperCase()}</span>, CRACK YOUR WORD TODAY!
          </h1>
          <button className="btn-secondary" onClick={handleLogout}>EXIT SYSTEM</button>
        </div>
        <WordGame />
      </div>
      <div className="dashboard-sidebar">
        <UserSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
