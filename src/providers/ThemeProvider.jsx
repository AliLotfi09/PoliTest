import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  const [settings, setSettings] = useState({
    fontFamily: 'estedad',
    soundEnabled: true,
    vibrationEnabled: true,
    soundVolume: 0.7,
  });

  // تابع تشخیص تم از کلاینت تلگرام یا ایتا
  const getClientTheme = () => {
    const ua = navigator.userAgent.toLowerCase();
    
    // چک کردن تلگرام
    if (window.Telegram?.WebApp?.colorScheme) {
      return window.Telegram.WebApp.colorScheme;
    }
    
    // چک کردن ایتا (فرض میکنیم ایتا هم مشابه تلگرام داره)
    if (window.Eitaa?.WebApp?.colorScheme) {
      return window.Eitaa.WebApp.colorScheme;
    }
    
    // اگر کلاینت نیست، تم سیستم رو بگیر
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  // تابع تشخیص اینکه کاربر از کلاینت وارد شده یا نه
  const isFromClient = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (window.Telegram?.WebApp || window.Eitaa?.WebApp) return true;
    if (ua.includes("telegram") || ua.includes("eitaa") || ua.includes("eitaaw")) return true;
    return false;
  };

  // بارگذاری تنظیمات از localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedSettings = localStorage.getItem('appSettings');
    
    // بارگذاری تنظیمات
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setTimeout(() => applySettings(parsed), 100);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    // بارگذاری تم
    if (savedTheme && savedTheme !== 'system') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // اگر تم سیستم هست یا ذخیره نشده
      const initialTheme = isFromClient() ? getClientTheme() : 'light';
      setTheme('system');
      applyTheme(initialTheme);
      localStorage.setItem('theme', 'system');
    }
  }, []);

  // اعمال تم به کل صفحه
  const applyTheme = (themeToApply) => {
    const html = document.documentElement;
    
    html.classList.remove('light', 'dark');
    
    if (themeToApply === 'system') {
      const finalTheme = isFromClient() ? getClientTheme() : 'light';
      html.classList.add(finalTheme);
    } else {
      html.classList.add(themeToApply);
    }
  };

  // گوش دادن به تغییر تم در کلاینت (برای تلگرام)
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // گوش دادن به تغییر تم در تلگرام
      const handleThemeChange = () => {
        if (theme === 'system') {
          applyTheme('system');
        }
      };
      
      // تلگرام event مشخصی برای تغییر تم نداره، 
      // اما میتونیم روی onEvent کلی گوش بدیم
      tg.onEvent('themeChanged', handleThemeChange);
      
      // یا هر 2 ثانیه چک کنیم
      const checkInterval = setInterval(() => {
        if (theme === 'system') {
          applyTheme('system');
        }
      }, 2000);
      
      return () => {
        clearInterval(checkInterval);
        tg.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, [theme]);

  // لود فونت وزیر وقتی نیازه
  const loadVazirFont = () => {
    if (!document.getElementById('vazir-font')) {
      const link = document.createElement('link');
      link.id = 'vazir-font';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@latest/fonts.css';
      document.head.appendChild(link);
    }
  };

  // اعمال تنظیمات - فقط فونت
  const applySettings = (newSettings) => {
    const body = document.body;
    
    body.classList.remove('font-estedad', 'font-vazir');
    
    if (newSettings.fontFamily === 'vazir') {
      loadVazirFont();
      setTimeout(() => {
        body.classList.add('font-vazir');
        applyFontToAllElements('vazir');
      }, 100);
    } else {
      body.classList.add('font-estedad');
      applyFontToAllElements('estedad');
    }
  };

  // اعمال فونت به همه المان‌ها
  const applyFontToAllElements = (fontType) => {
    setTimeout(() => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.style.fontFamily) {
          element.style.fontFamily = '';
        }
      });
      
      const importantElements = document.querySelectorAll(
        '.app-container, .container, .intro-wrapper, .question-block, ' +
        '.result-wrapper, .settings-container, .setting-card, ' +
        '.intro-title, .intro-subtitle, .question-text, .option, ' +
        '.btn, .start-btn, .action-btn, .result-name, .settings-title, ' +
        '.setting-title, .option-name, .nav-item, .toast, h1, h2, h3, h4, h5, h6, ' +
        'p, span, div, button, input, textarea, select'
      );
      
      importantElements.forEach(element => {
        element.classList.remove('font-estedad', 'font-vazir');
        element.classList.add(`font-${fontType}`);
      });
    }, 200);
  };

  // تغییر تم
  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // تغییر تنظیمات
  const updateSetting = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      
      if (key === 'fontFamily') {
        applySettings(newSettings);
      }
      
      return newSettings;
    });
  };

  // بازنشانی
  const resetSettings = () => {
    const defaultSettings = {
      fontFamily: 'estedad',
      soundEnabled: true,
      vibrationEnabled: true,
      soundVolume: 0.7,
    };
    
    setSettings(defaultSettings);
    setTheme('system');
    
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    localStorage.setItem('theme', 'system');
    
    applyTheme('system');
    setTimeout(() => applySettings(defaultSettings), 100);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: handleSetTheme,
      settings,
      updateSetting,
      resetSettings,
      isFromClient: isFromClient() // اضافه کردیم برای استفاده خارجی
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};