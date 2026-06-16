import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserSidebar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://wordgame-m15v.onrender.com/api/users');
        setUsers(res.data);
        console.log(res.data);
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

  const defaultAvatar = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23111"/><circle cx="25" cy="16" r="12" fill="%2338bdf8"/><path d="M14 39c0-7 5.5-12 11-12s11 5 11 12v1H14v-1z" fill="%23fff"/></svg>';

  const getAvatarSrc = (user) => {
    if (!user.profilePic) {
      return defaultAvatar;
    }

    return user.profilePic.startsWith('http')
      ? user.profilePic
      : `https://wordgame-m15v.onrender.com${user.profilePic}`;
  };

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
                    src={getAvatarSrc(user)}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar"
                    onError={(e) => { console.error('Avatar load failed:', e.target.src); e.target.src = defaultAvatar; }}
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
                    src={getAvatarSrc(user)}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar unplayed-avatar"
                    onError={(e) => { console.error('Avatar load failed:', e.target.src); e.target.src = defaultAvatar; }}
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
