// src/utils/cacheManager.js

const CACHE_CONFIG = {
  VERSION: "2.0.0",
  PREFIX: "pt_",
  USER_TTL: 30 * 24 * 60 * 60 * 1000,
  GUEST_TTL: 24 * 60 * 60 * 1000,
  QUIZ_TTL: 7 * 24 * 60 * 60 * 1000,
  SESSION_TTL: 60 * 60 * 1000,
};

class CacheManager {
  constructor() {
    this.version = CACHE_CONFIG.VERSION;
    this.prefix = CACHE_CONFIG.PREFIX;
    this.initialize();
  }

  initialize() {
    const currentVersion = localStorage.getItem(`${this.prefix}version`);
    if (currentVersion !== this.version) {
      this.migrateCache(currentVersion);
      localStorage.setItem(`${this.prefix}version`, this.version);
    }
    this.autoCleanup();
  }

  migrateCache(oldVersion) {
    this.clearAll();
    console.log(`Cache migrated from ${oldVersion} to ${this.version}`);
  }

  set(key, data, ttl = null) {
    try {
      const fullKey = this.prefix + key;
      
      let actualTTL = ttl;
      if (ttl === null) {
        if (key.includes('user_')) actualTTL = CACHE_CONFIG.USER_TTL;
        else if (key.includes('quiz_')) actualTTL = CACHE_CONFIG.QUIZ_TTL;
        else if (key.includes('session_')) actualTTL = CACHE_CONFIG.SESSION_TTL;
        else actualTTL = CACHE_CONFIG.GUEST_TTL;
      }

      const cacheItem = {
        data: data,
        expires: Date.now() + actualTTL,
        created: Date.now(),
        version: this.version,
        ttl: actualTTL
      };

      localStorage.setItem(fullKey, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.error("Cache set failed:", error);
      this.handleStorageFull();
      return false;
    }
  }

  get(key) {
    const fullKey = this.prefix + key;
    try {
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const cacheItem = JSON.parse(item);
      
      if (Date.now() > cacheItem.expires) {
        localStorage.removeItem(fullKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      localStorage.removeItem(fullKey);
      return null;
    }
  }

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  saveUser(userData) {
    const userId = userData.id || userData.userId || `guest_${Date.now()}`;
    const platform = userData.platform || 'web';
    const userKey = `user_${platform}_${userId}`;
    
    const enhancedData = {
      ...userData,
      lastSeen: Date.now(),
      sessionId: this.generateSessionId(),
      device: this.getDeviceInfo()
    };

    this.set(userKey, enhancedData);
    this.set(`current_user`, { userId, platform, userKey });
    
    return userKey;
  }

  getCurrentUser() {
    const current = this.get('current_user');
    if (!current) return null;
    
    return this.get(current.userKey);
  }

  renewUserSession(userKey) {
    const user = this.get(userKey);
    if (user) {
      user.lastSeen = Date.now();
      this.set(userKey, user);
      return true;
    }
    return false;
  }

  saveQuizResult(quizData, userId = null) {
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quizKey = userId ? `quiz_${userId}_${quizId}` : `guest_quiz_${quizId}`;
    
    const enhancedQuiz = {
      ...quizData,
      id: quizId,
      timestamp: Date.now(),
      userId: userId,
      completed: true
    };

    this.set(quizKey, enhancedQuiz);
    
    if (userId) {
      this.addToUserHistory(userId, quizId, quizKey);
    }

    return quizKey;
  }

  getUserQuizResults(userId) {
    const history = this.get(`user_history_${userId}`) || [];
    return history
      .map(item => this.get(item.quizKey))
      .filter(result => result !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  autoCleanup() {
    const now = Date.now();
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item && now > item.expires) {
            keysToRemove.push(key);
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length;
  }

  clearAll() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length;
  }

  handleStorageFull() {
    const cacheItems = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item) {
            cacheItems.push({
              key,
              expires: item.expires,
              size: JSON.stringify(item).length
            });
          }
        } catch {}
      }
    }

    cacheItems.sort((a, b) => a.expires - b.expires);
    
    const itemsToRemove = Math.ceil(cacheItems.length * 0.2);
    cacheItems.slice(0, itemsToRemove).forEach(item => {
      localStorage.removeItem(item.key);
    });
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      online: navigator.onLine
    };
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats() {
    const stats = {
      total: 0,
      users: 0,
      quizzes: 0,
      sessions: 0,
      size: 0,
      expired: 0
    };

    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        stats.total++;
        stats.size += key.length;
        
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item) {
            stats.size += JSON.stringify(item.data).length;
            
            if (now > item.expires) stats.expired++;
            if (key.includes('user_')) stats.users++;
            if (key.includes('quiz_')) stats.quizzes++;
            if (key.includes('session_')) stats.sessions++;
          }
        } catch {}
      }
    }

    stats.sizeKB = Math.round(stats.size / 1024);
    return stats;
  }

  addToUserHistory(userId, quizId, quizKey) {
    const historyKey = `user_history_${userId}`;
    const history = this.get(historyKey) || [];
    
    history.unshift({
      id: quizId,
      quizKey: quizKey,
      timestamp: Date.now()
    });

    if (history.length > 50) {
      history.pop();
    }

    this.set(historyKey, history, CACHE_CONFIG.USER_TTL);
  }
}

const cacheManager = new CacheManager();
export default cacheManager;