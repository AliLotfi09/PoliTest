import React, { useEffect, useState } from 'react';

const Toast = ({ message, show, duration = 2200, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, message, duration, onClose]);

  if (!show || !message) return null;

  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;