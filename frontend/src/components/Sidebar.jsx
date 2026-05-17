import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Add Website', icon: '➕', path: '/add-website' },
    { name: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🔐 GovWatch</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="version">v1.0</p>
        <p className="copyright">© 2024 GovWatch</p>
      </div>
    </aside>
  );
}

export default Sidebar;
