import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMiniAppState } from '../utils/miniAppDetector';
import { User } from 'lucide-react';

const AdvancedBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');
  const [ripples, setRipples] = useState([]);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    setIsMiniApp(getMiniAppState().isInitialized);
  }, []);

  const baseNavItems = [
    { id: 'home', label: 'خانه', path: '/' },
    { id: 'about', label: 'درباره', path: '/about' },
    { id: 'settings', label: 'تنظیمات', path: '/settings' },
  ];

  const profileNavItem = {
    id: 'profile',
    label: 'پروفایل',
    path: '/profile',
  };

  const navItems = isMiniApp
    ? [...baseNavItems, profileNavItem]
    : baseNavItems;

  useEffect(() => {
    const currentItem = navItems.find(i => i.path === location.pathname);
    if (currentItem) setActiveTab(currentItem.id);
  }, [location.pathname]);

  const createRipple = (x, y, tabId) => {
    const id = Date.now();
    setRipples(r => [...r, { id, x, y, tabId }]);
    setTimeout(() => {
      setRipples(r => r.filter(i => i.id !== id));
    }, 600);
  };

  const handleNavigation = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    createRipple(e.clientX - rect.left, e.clientY - rect.top, item.id);
    setActiveTab(item.id);
    setTimeout(() => navigate(item.path), 200);
  };

  const getIcon = (id, isActive) => {
    const color = isActive ? '#ffffff' : '#000000';

    switch (id) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" />
            <path d="M9 22V12h6v10" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'about':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" />
            <circle cx="12" cy="8" r="1" fill={color} />
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3.09 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6V4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'profile':
        return <User size={20} color={color} />;
      default:
        return null;
    }
  };

  return (
    <nav className="advanced-bottom-navigation">
      <div className="nav-container">
        <div className="nav-backdrop" />
        <div className="nav-items">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={e => handleNavigation(item, e)}
                aria-label={item.label}
              >
                {ripples
                  .filter(r => r.tabId === item.id)
                  .map(r => (
                    <span
                      key={r.id}
                      className="ripple"
                      style={{ left: r.x, top: r.y }}
                    />
                  ))}
                <span className="nav-icon-wrapper">
                  <span className="nav-icon">
                    {getIcon(item.id, isActive)}
                  </span>
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AdvancedBottomNavigation;
