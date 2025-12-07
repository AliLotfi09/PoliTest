import React, { useEffect, useState } from 'react';
import "../styles/App.css";

const Toast = ({ message, duration = 2500, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
};

export default Toast;