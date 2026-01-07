// src/utils/appState.js
import cacheManager from './cacheManager';
import supabaseHelper from './supabaseHelper';
import { initMiniApp } from './miniAppDetector';

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

  async initialize() {
    this.loadFromCache();
    window.addEventListener('beforeunload', () => this.saveToCache());
    this.trackActivity();
    
    // فقط چک کن اگه از Eitaa اومده
    await this.checkEitaaUser();
  }

  async checkEitaaUser() {
    try {
      const miniAppResult = await initMiniApp();
      
      // فقط اگه از Eitaa باشه
      if (miniAppResult.initialized && miniAppResult.host === 'eitaa') {
        console.log('✅ Eitaa detected');
        
        const eitaaUser = miniAppResult.webApp?.initDataUnsafe?.user;
        
        if (eitaaUser) {
          console.log('👤 Eitaa user:', eitaaUser);
          
          // ذخیره در Supabase
          const result = await supabaseHelper.saveEitaaUser(eitaaUser);
          
          if (result.success) {
            console.log('✅ User saved to Supabase');
          }
        }
      } else {
        console.log('ℹ️ Not from Eitaa - skipping Supabase');
      }
    } catch (error) {
      console.error('❌ Eitaa check error:', error);
    }
  }

  // ==================== بقیه متدها بدون تغییر ====================

  async setUser(userData, fromMiniApp = false) {
    const enhancedUser = {
      ...userData,
      id: userData.id || userData.userId || `guest_${Date.now()}`,
      platform: userData.platform || 'web',
      joinedAt: userData.joinedAt || Date.now(),
      fromMiniApp,
      lastActive: Date.now()
    };

    const userKey = cacheManager.saveUser(enhancedUser);
    
    this.state.user = {
      ...enhancedUser,
      cacheKey: userKey
    };

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

  async setQuizResult(quizResult) {
    const enhancedResult = {
      ...quizResult,
      timestamp: Date.now(),
      userId: this.state.user?.id,
      device: cacheManager.getDeviceInfo()
    };

    const quizKey = cacheManager.saveQuizResult(
      enhancedResult, 
      this.state.user?.id
    );

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

  addNotification(notification) {
    const newNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    this.state.notifications.unshift(newNotification);
    
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

  loadFromCache() {
    const cachedUser = cacheManager.getCurrentUser();
    if (cachedUser) this.state.user = cachedUser;

    const cachedSettings = cacheManager.get('app_settings');
    if (cachedSettings) this.state.settings = cachedSettings;

    const cachedNotifications = cacheManager.get('notifications');
    if (cachedNotifications) this.state.notifications = cachedNotifications;

    console.log('App state loaded from cache');
  }

  saveToCache() {
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

  trackActivity() {
    setInterval(() => {
      if (this.state.user) {
        this.state.lastActivity = Date.now();
        cacheManager.renewUserSession(this.state.user.cacheKey);
      }
    }, 30000);

    ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
      window.addEventListener(event, () => {
        this.state.lastActivity = Date.now();
      });
    });
  }

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

  isOnline() {
    return navigator.onLine;
  }

  getSessionAge() {
    return Date.now() - this.state.lastActivity;
  }

  shouldRefreshSession() {
    return this.getSessionAge() > 30 * 60 * 1000;
  }

  getAppInfo() {
    return {
      version: '1.0.0',
      environment: import.meta.env.MODE,
      user: this.state.user ? {
        id: this.state.user.id,
        platform: this.state.user.platform
      } : null
    };
  }
}

const appState = new AppState();
export default appState;