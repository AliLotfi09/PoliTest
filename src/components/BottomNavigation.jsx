// components/AdvancedBottomNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdvancedBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [ripples, setRipples] = useState([]);

  const navItems = [
    { 
      id: 'home', 
      label: 'خانه', 
      path: '/' 
    },
    { 
      id: 'about', 
      label: 'درباره', 
      path: '/about' 
    },
    { 
      id: 'settings', 
      label: 'تنظیمات', 
      path: '/settings' 
    },
  ];

  const createRipple = (x, y, id) => {
    const newRipple = {
      id: Date.now(),
      x: x,
      y: y,
      tabId: id,
    };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleNavigation = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y, item.id);
    setActiveTab(item.id);
    
    setTimeout(() => {
      if (item.path) {
        navigate(item.path);
      }
    }, 200);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname]);

  const getIcon = (id, isActive) => {
    const color = isActive ? '#ffffff' : '#000000';
    
    switch(id) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="9 22 9 12 15 12 15 22" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'test':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="8" y="2" width="8" height="4" rx="1" ry="1" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <line 
              x1="9" y1="9" x2="15" y2="9" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <line 
              x1="9" y1="13" x2="15" y2="13" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <line 
              x1="9" y1="17" x2="13" y2="17" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
      case 'results':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <line 
              x1="18" y1="20" x2="18" y2="10" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <line 
              x1="12" y1="20" x2="12" y2="4" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <line 
              x1="6" y1="20" x2="6" y2="14" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
      case 'about':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle 
              cx="12" cy="12" r="10" 
              stroke={color} 
              strokeWidth="2"
            />
            <line 
              x1="12" y1="16" x2="12" y2="12" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <circle 
              cx="12" cy="8" r="1" 
              fill={color}
            />
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle 
              cx="12" cy="12" r="3" 
              stroke={color} 
              strokeWidth="2"
            />
            <path 
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="advanced-bottom-navigation">
      <div className="nav-container">
        <div className="nav-backdrop" />
        
        <div className="nav-items">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavigation(item, e)}
                aria-label={item.label}
              >
                {ripples
                  .filter((ripple) => ripple.tabId === item.id)
                  .map((ripple) => (
                    <span
                      key={ripple.id}
                      className="ripple"
                      style={{
                        left: ripple.x + 'px',
                        top: ripple.y + 'px',
                      }}
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