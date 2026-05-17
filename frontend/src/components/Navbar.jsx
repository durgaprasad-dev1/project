import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAvatar, getAvatar } from '../services/avatarService';
import '../styles/components.css';
import {API_URL} from '../services/apiService';
function Navbar({ user }) {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      fetchAvatar();
    }
  }, [user]);

  const fetchAvatar = async () => {
    const result = await getAvatar();
    if (result.success && result.data?.imageUrl) {
      setAvatarUrl(API_URL + result.data.imageUrl);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const result = await uploadAvatar(file);
    if (result.success) {
      setAvatarUrl(result.imageUrl);
      alert('Avatar uploaded successfully');
    } else {
      alert(result.message || 'Failed to upload avatar');
    }

    event.target.value = null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>Welcome, {user?.name || 'User'}!</h3>
      </div>

      <div className="navbar-right">
        <div className="navbar-icons">
          <button className="icon-btn notification-btn">
            <span>🔔</span>
            <span className="badge">3</span>
          </button>
          <button className="icon-btn">⚙️</button>
        </div>

        <div className="user-profile">
          <div className="user-avatar" onClick={updateAvatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="avatar-image" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="user-info">
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-danger btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
