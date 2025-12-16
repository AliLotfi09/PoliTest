// components/Toast.jsx (نسخه ساده)
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600';
      case 'error': return 'bg-red-500 border-red-600';
      case 'warning': return 'bg-yellow-500 border-yellow-600';
      case 'info': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-medium shadow-lg ${getTypeStyles()} transition-all duration-300 animate-fade-in`}>
      {message}
    </div>
  );
};

export default Toast;