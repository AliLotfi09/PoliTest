import { useState, useEffect } from 'react';

const defaultSettings = {
  // ظاهر
  theme: 'system',
  fontFamily: 'Estedad, sans-serif',
  fontSize: 'medium',
  highContrast: false,
  
  // زبان
  language: 'fa',
  autoRTL: true,
  
  // صدا و لرزش
  soundEnabled: true,
  soundVolume: 0.7,
  vibrationEnabled: true,
  
  // اطلاع‌رسانی
  notificationsEnabled: true,
  notification_results: true,
  notification_updates: true,
  notification_news: false,
  notification_reminders: true,
  
  // عملکرد
  powerSavingMode: false,
  preloadData: true,
  animationsEnabled: true,
  
  // امنیت
  encryptionEnabled: false,
  autoLogout: false,
  autoLogoutMinutes: 10,
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [theme, setThemeState] = useState('system');

  // بارگذاری تنظیمات از localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        
        if (parsed.theme) {
          setThemeState(parsed.theme);
          applyTheme(parsed.theme);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // اعمال تم
  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    const actualTheme = newTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    html.classList.remove('light', 'dark');
    html.classList.add(actualTheme);
    html.setAttribute('data-theme', actualTheme);
  };

  // تغییر تم
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    updateSetting('theme', newTheme);
  };

  // به‌روزرسانی تنظیم
  const updateSetting = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // ذخیره در localStorage
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      
      // اعمال تغییرات فوری
      if (key === 'fontFamily') {
        document.documentElement.style.setProperty('--font-family', value);
      }
      
      if (key === 'fontSize') {
        const sizeMap = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizeMap[value] || '16px';
      }
      
      if (key === 'highContrast') {
        document.documentElement.setAttribute('data-high-contrast', value);
      }
      
      return newSettings;
    });
  };

  // بازنشانی تنظیمات
  const resetSettings = () => {
    setSettings(defaultSettings);
    setThemeState('system');
    localStorage.removeItem('appSettings');
    applyTheme('system');
    
    // بازنشانی استایل‌ها
    document.documentElement.style.removeProperty('--font-family');
    document.documentElement.style.fontSize = '16px';
    document.documentElement.removeAttribute('data-high-contrast');
  };

  return {
    theme,
    setTheme,
    settings,
    updateSetting,
    resetSettings,
  };
};