// components/AdvancedBottomNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css'
import AdlyBanner from '@/components/AdlyBanner';


const AdvancedBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [ripples, setRipples] = useState([]);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'خانه', path: '/' },
    { id: 'test', icon: '📊', label: 'آزمون', path: '/test' },
    { id: 'results', icon: '📈', label: 'نتایج', path: '/results' },
    { id: 'about', icon: 'ℹ️', label: 'درباره', path: '/about' },
    { id: 'settings', icon: '⚙️', label: 'تنظیمات', path: '/settings' },
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
    
    // تأخیر کوچک برای دیده شدن انیمیشن
    setTimeout(() => {
      if (item.path) {
        navigate(item.path);
      }
    }, 200);
  };

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname]);

  return (
    <>
    <AdlyBanner />
    <nav className="advanced-bottom-navigation">
      <div className="nav-container">
        <div className="nav-backdrop" />
        
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => handleNavigation(item, e)}
              aria-label={item.label}
            >
              {/* Ripple effects */}
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
                <span className="nav-icon">{item.icon}</span>
                {activeTab === item.id && (
                  <span className="active-indicator" />
                )}
              </span>
              
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
</>
  );
};

export default AdvancedBottomNavigation;