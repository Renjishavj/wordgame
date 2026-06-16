import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserSidebar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://wordgame-1-nmd1.onrender.com/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const today = new Date().toDateString();

  // Separate users who played today and others
  const playedToday = users.filter(u => u.lastPlayedDate === today && u.dailyScore !== null);
  const others = users.filter(u => u.lastPlayedDate !== today || u.dailyScore === null);

  // Sort played today by score ascending
  playedToday.sort((a, b) => a.dailyScore - b.dailyScore);

  // Removed getRankBadge since we are using inline avatar badges now

  return (
    <div className="user-sidebar game-container">
      <h2 className="game-title sidebar-title">TODAY'S RANKINGS</h2>
      <div className="user-list">
        {loading ? (
          <p className="loading-text">Loading network...</p>
        ) : users.length === 0 ? (
          <p className="loading-text">No players found.</p>
        ) : (
          <>
            {playedToday.map((user, index) => (
              <div key={user.name} className="user-card ranked">
                <div className={`avatar-wrapper rank-border-${index}`}>
                  <img
                    src={user.profilePic ? `https://wordgame-1-nmd1.onrender.com${user.profilePic}` : 'https://via.placeholder.com/50'}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar"
                  />
                  {index < 3 && <span className={`avatar-badge rank-badge-${index}`}>{index + 1}</span>}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-score">{user.dailyScore}/6 ATTEMPTS</span>
                </div>
                {index >= 3 && <span className="rank-other">#{index + 1}</span>}
              </div>
            ))}

            {others.length > 0 && <h3 className="sidebar-subtitle">YET TO PLAY</h3>}

            {others.map((user) => (
              <div key={user.name} className="user-card">
                <div className="avatar-wrapper">
                  <img
                    src={user.profilePic ? `https://wordgame-1-nmd1.onrender.com${user.profilePic}` : 'https://via.placeholder.com/50'}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar unplayed-avatar"
                  />
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-score unplayed">-</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
