import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { addWebsite } from '../services/apiService';
import '../styles/forms.css';

function AddWebsite() {
  const navigate = useNavigate();
  const [websiteName, setWebsiteName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    if (!token || !userInfo) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userInfo));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Validation
    if (!websiteName || !websiteURL) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(websiteURL);
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      setLoading(false);
      return;
    }

    // Call API
    const result = await addWebsite(websiteName, websiteURL, frequency, keyword, user._id);

    if (result.success) {
      setSuccess('Website added successfully!');
      setWebsiteName('');
      setWebsiteURL('');
      setFrequency('daily');
      setKeyword('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.message || 'Failed to add website');
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={user} />

        <div className="dashboard-main">
          <div className="form-container">
            <div className="form-header">
              <h1>Add Website to Monitor</h1>
              <p>Add government websites you want to monitor for updates</p>
            </div>

            <form onSubmit={handleSubmit} className="add-website-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label htmlFor="websiteName">Website Name *</label>
                <input
                  type="text"
                  id="websiteName"
                  placeholder="e.g., SSC Official Website"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="websiteURL">Website URL *</label>
                <input
                  type="url"
                  id="websiteURL"
                  placeholder="e.g., https://ssc.nic.in"
                  value={websiteURL}
                  onChange={(e) => setWebsiteURL(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="keyword">What to Monitor</label>
                <input
                  id="keyword"
                  placeholder="like notifications, results,etc"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frequency">Monitoring Frequency *</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="hourly">Every minute</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding Website...' : 'Add Website'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Popular Government Websites */}
            <div className="popular-websites">
              <h3>Popular Government Websites</h3>
              <div className="website-suggestions">
                <div className="suggestion-item">
                  <strong>SSC</strong>
                  <p>https://ssc.nic.in</p>
                </div>
                <div className="suggestion-item">
                  <strong>UPSC</strong>
                  <p>https://upsc.gov.in</p>
                </div>
                <div className="suggestion-item">
                  <strong>Railway</strong>
                  <p>https://www.indianrailways.gov.in</p>
                </div>
                <div className="suggestion-item">
                  <strong>SBTET</strong>
                  <p>https://sbtet.telangana.gov.in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWebsite;
