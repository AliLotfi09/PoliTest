// components/Changelog.jsx
import React, { useState, useEffect } from 'react';
import { useChangelog } from '../data/changelogData';

const Changelog = () => {
  const { data, hasSeenCurrentVersion, markAsSeen } = useChangelog();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeenCurrentVersion()) {
        setIsVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasSeenCurrentVersion]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      markAsSeen();
    }, 300);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'new': return '🆕';
      case 'improved': return '✨';
      case 'fixed': return '🐛';
      default: return '⚡';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`changelog-modal ${isClosing ? 'closing' : ''}`}>
      <div className="changelog-overlay" onClick={handleClose} />
      
      <div className={`changelog-content ${isClosing ? 'slide-out' : 'slide-in'}`}>
        <button 
          className="changelog-close" 
          onClick={handleClose}
          aria-label="بستن تغییرات"
        >
          ✕
        </button>

        <div className="changelog-header">
          <div className="changelog-title-wrapper">
            <h3>🔄 تغییرات جدید</h3>
            <span className="changelog-version">
              نسخه {data.version}
            </span>
          </div>
        </div>

        <div className="changelog-body">
          <div className="changelog-date">
            <span>📅 تاریخ انتشار: {data.releaseDate}</span>
          </div>

          <div className="changelog-list">
            {data.changes.map((change, index) => (
              <div 
                key={index} 
                className={`changelog-item ${change.type}`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <span className="changelog-icon">
                  {getTypeIcon(change.type)}
                </span>
                <span className="changelog-text">{change.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="changelog-footer">
          <button 
            className="changelog-confirm" 
            onClick={handleClose}
          >
            متوجه شدم، بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default Changelog;