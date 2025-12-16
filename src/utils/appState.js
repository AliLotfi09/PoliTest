// utils/appState.js
import cacheManager from './cacheManager';

class AppState {
  constructor() {
    this.state = {
      user: null,
      quiz: null,
      settings: {},
      notifications: [],
      lastActivity: Date.now()
    };
    
    this.subscribers = new Set();
    this.initialize();
  }

  initialize() {
    // بارگذاری state از کش
    this.loadFromCache();
    
    // ذخیره خودکار هنگام بسته شدن صفحه
    window.addEventListener('beforeunload', () => this.saveToCache());
    
    // ردیابی فعالیت کاربر
    this.trackActivity();
  }

  // ==================== مدیریت کاربر ====================

  async setUser(userData, fromMiniApp = false) {
    const enhancedUser = {
      ...userData,
      id: userData.id || userData.userId || `guest_${Date.now()}`,
      platform: userData.platform || 'web',
      joinedAt: userData.joinedAt || Date.now(),
      fromMiniApp,
      lastActive: Date.now()
    };

    // ذخیره در کش
    const userKey = cacheManager.saveUser(enhancedUser);
    
    // به‌روزرسانی state
    this.state.user = {
      ...enhancedUser,
      cacheKey: userKey
    };

    // اطلاع‌رسانی
    this.notify('user', this.state.user);
    return this.state.user;
  }

  getUser() {
    return this.state.user;
  }

  clearUser() {
    this.state.user = null;
    cacheManager.remove('current_user');
    this.notify('user', null);
  }

  // ==================== مدیریت آزمون ====================

  setQuizResult(quizResult) {
    const enhancedResult = {
      ...quizResult,
      timestamp: Date.now(),
      userId: this.state.user?.id,
      device: cacheManager.getDeviceInfo()
    };

    // ذخیره در کش
    const quizKey = cacheManager.saveQuizResult(
      enhancedResult, 
      this.state.user?.id
    );

    // به‌روزرسانی state
    this.state.quiz = {
      ...enhancedResult,
      cacheKey: quizKey
    };

    this.notify('quiz', this.state.quiz);
    return this.state.quiz;
  }

  getQuizResult() {
    return this.state.quiz;
  }

  getQuizHistory() {
    if (this.state.user?.id) {
      return cacheManager.getUserQuizResults(this.state.user.id);
    }
    return [];
  }

  // ==================== تنظیمات ====================

  setSettings(settings) {
    this.state.settings = {
      ...this.state.settings,
      ...settings,
      updatedAt: Date.now()
    };

    cacheManager.set('app_settings', this.state.settings);
    this.notify('settings', this.state.settings);
  }

  getSettings() {
    return this.state.settings;
  }

  // ==================== نوتیفیکیشن ====================

  addNotification(notification) {
    const newNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    this.state.notifications.unshift(newNotification);
    
    // محدود کردن به 50 نوتیفیکیشن
    if (this.state.notifications.length > 50) {
      this.state.notifications.pop();
    }

    cacheManager.set('notifications', this.state.notifications);
    this.notify('notifications', this.state.notifications);
    
    return newNotification;
  }

  markNotificationAsRead(notificationId) {
    const notification = this.state.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      cacheManager.set('notifications', this.state.notifications);
      this.notify('notifications', this.state.notifications);
    }
  }

  clearNotifications() {
    this.state.notifications = [];
    cacheManager.remove('notifications');
    this.notify('notifications', []);
  }

  // ==================== کش ====================

  loadFromCache() {
    // کاربر
    const cachedUser = cacheManager.getCurrentUser();
    if (cachedUser) {
      this.state.user = cachedUser;
    }

    // تنظیمات
    const cachedSettings = cacheManager.get('app_settings');
    if (cachedSettings) {
      this.state.settings = cachedSettings;
    }

    // نوتیفیکیشن‌ها
    const cachedNotifications = cacheManager.get('notifications');
    if (cachedNotifications) {
      this.state.notifications = cachedNotifications;
    }

    console.log('App state loaded from cache');
  }

  saveToCache() {
    // ذخیره state جاری
    if (this.state.user) {
      cacheManager.saveUser(this.state.user);
    }
    
    if (this.state.quiz) {
      cacheManager.saveQuizResult(this.state.quiz, this.state.user?.id);
    }

    console.log('App state saved to cache');
  }

  clearCache() {
    cacheManager.clearAll();
    this.state = {
      user: null,
      quiz: null,
      settings: {},
      notifications: [],
      lastActivity: Date.now()
    };
    
    this.notify('clear', null);
    console.log('App cache cleared');
  }

  getCacheStats() {
    return cacheManager.getStats();
  }

  // ==================== سرویس‌ها ====================

  trackActivity() {
    // به‌روزرسانی فعالیت هر 30 ثانیه
    setInterval(() => {
      if (this.state.user) {
        this.state.lastActivity = Date.now();
        cacheManager.renewUserSession(this.state.user.cacheKey);
      }
    }, 30000);

    // ردیابی کلیک‌ها و حرکت‌ها
    ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
      window.addEventListener(event, () => {
        this.state.lastActivity = Date.now();
      });
    });
  }

  // ==================== Observer Pattern ====================

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(key, value) {
    this.subscribers.forEach(callback => {
      try {
        callback(key, value);
      } catch (error) {
        console.error('Subscriber error:', error);
      }
    });
  }

  // ==================== Utility ====================

  isOnline() {
    return navigator.onLine;
  }

  getSessionAge() {
    return Date.now() - this.state.lastActivity;
  }

  shouldRefreshSession() {
    return this.getSessionAge() > 30 * 60 * 1000; // 30 دقیقه
  }

  getAppInfo() {
    return {
      version: process.env.REACT_APP_VERSION || '1.0.0',
      build: process.env.REACT_APP_BUILD_DATE || Date.now(),
      environment: process.env.NODE_ENV,
      user: this.state.user ? {
        id: this.state.user.id,
        platform: this.state.user.platform,
        activeFor: Date.now() - (this.state.user.joinedAt || Date.now())
      } : null
    };
  }
}

// ایجاد Singleton
const appState = new AppState();
export default appState;