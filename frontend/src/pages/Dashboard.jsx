import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatisticsCard from '../components/StatisticsCard';
import WebsiteTable from '../components/WebsiteTable';
import { getWebsites, getDashboardStats } from '../services/apiService';
import '../styles/dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [stats, setStats] = useState({
    totalWebsites: 0,
    activeWebsites: 0,
    notifications: 0,
    updatestoday: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    if (!token || !userInfo) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userInfo));
    fetchData(true);

    const refreshInterval = setInterval(() => {
      fetchData(false);
    }, 15000);

    return () => clearInterval(refreshInterval);
  }, [navigate]);

  const fetchData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    // Fetch websites
    const websitesResult = await getWebsites();
    if (websitesResult.success) {
      setWebsites(websitesResult.data || []);
      console.log(websitesResult.data);
    }

    // Fetch statistics
    const statsResult = await getDashboardStats();
    if (statsResult.success) {
      console.log(statsResult.data);
      setStats(statsResult.data);
    }

    if (showLoading) {
      setLoading(false);
    }
  };

  
  const handleWebsiteDeleted = () => {
    fetchData();
  };
  const handleWebsiteUpdate = () => {
    fetchData();
  };


  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={user} />
        
        <div className="dashboard-main">
          {/* Statistics Cards */}
          <div className="statistics-section">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <StatisticsCard
                title="Total Websites"
                value={stats.totalWebsites}
                icon="🌐"
                color="blue"
              />
              <StatisticsCard
                title="Active Sites"
                value={stats.activeWebsites}
                icon="✅"
                color="green"
              />
                <StatisticsCard
                  title="Updates Today"
                  value={stats.inactiveWebsites}
                  icon="❌"
                  color="purple"
                />
              <StatisticsCard
                title="Notifications"
                value={stats.Notifications}
                icon="🔔"
                color="orange"
              />
            </div>
          </div>

          {/* Monitored Websites Table */}
          <div className="websites-section">
            <div className="section-header">
              <h2>Monitored Websites</h2>
              <button className="btn btn-primary btn-sm">
                <a href="/add-website" style={{ color: 'white' }}>+ Add Website</a>
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading websites...</div>
            ) : websites.length === 0 ? (
              <div className="empty-state">
                <p>No websites monitored yet</p>
                <a href="/add-website" className="btn btn-primary">Add Your First Website</a>
              </div>
            ) : (
              <WebsiteTable websites={websites} onDelete={handleWebsiteDeleted} onUpdate={handleWebsiteUpdate}/>
            )}
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">📌</span>
                <div className="activity-content">
                  <p className="activity-title">Website Added</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🔄</span>
                <div className="activity-content">
                  <p className="activity-title">Site Update Detected</p>
                  <p className="activity-time">4 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">✅</span>
                <div className="activity-content">
                  <p className="activity-title">All Sites Operational</p>
                  <p className="activity-time">Today at 10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
