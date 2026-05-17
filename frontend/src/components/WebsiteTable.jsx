import React, { useState } from 'react';
import { deleteWebsite } from '../services/apiService';
import { updateWebsite } from '../services/apiService';
import '../styles/components.css';

function WebsiteTable({ websites, onDelete,onUpdate }) {
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this website?')) {
      return;
    }

    setDeleting(id);
    const result = await deleteWebsite(id);

    if (result.success) {
      onDelete();
    } else {
      alert('Failed to delete website');
    }

    setDeleting(null);
  };

const handleToggleActive = async (id, newStatus) => {
    setUpdating(id);
    const result = await updateWebsite(id, newStatus);
    setUpdating(null);

    if (result.success) {
      onUpdate?.();
    } else {
      alert('Failed to update website');
    }
  };


  const formatDate = (pastDateString) => {
  const past = new Date(pastDateString);
  const now = new Date();
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  
  const elapsed = past - now; // Negative value representing the past

  // Initialize the native standard formatter (defaults to system language, e.g., 'en')
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  if (Math.abs(elapsed) < msPerMinute) {
     return 'just now';
  } else if (Math.abs(elapsed) < msPerHour) {
     return rtf.format(Math.round(elapsed / msPerMinute), 'minute');
  } else if (Math.abs(elapsed) < msPerDay) {
     return rtf.format(Math.round(elapsed / msPerHour), 'hour');
  } else {
     return rtf.format(Math.round(elapsed / msPerDay), 'day');
  }
}

  return (
    <div className="table-container">
      <table className="websites-table">
        <thead>
          <tr>
            <th>Website Name</th>
            <th>URL</th>
            <th>Status</th>
            <th>Frequency</th>
            <th>Last Checked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {websites.map((website) => (
            <tr key={website._id}>
              <td className="website-name">{website.name}</td>
              <td>
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="url-link">
                  {new URL(website.url).hostname } 
                </a>
              </td>
              <td>
                <span className={`status-badge status-${website.status}`}>
                  {website.isActive?  '✅ Active' : '❌ Inactive'}
                </span>
              </td>
              <td className="frequency">{website.frequency}</td>
              <td>{formatDate(website.updatedAt)}</td>
              <td className="actions">
                <button className="btn-action btn-edit"
                onClick={()=>handleToggleActive(website._id,!website.isActive)}
                >{!website.isActive?"✅":"❌"}</button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(website._id)}
                  disabled={deleting === website._id}
                >
                  {deleting === website._id ? '⏳' : '🗑️'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WebsiteTable;
