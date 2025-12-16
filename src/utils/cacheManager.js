// utils/cacheManager.js

// تنظیمات پیش‌فرض
const CACHE_CONFIG = {
  VERSION: "2.0.0",
  PREFIX: "pt_", // political test
  USER_TTL: 30 * 24 * 60 * 60 * 1000, // 30 روز برای کاربران
  GUEST_TTL: 24 * 60 * 60 * 1000, // 24 ساعت برای مهمان
  QUIZ_TTL: 7 * 24 * 60 * 60 * 1000, // 7 روز برای نتایج
  SESSION_TTL: 60 * 60 * 1000, // 1 ساعت برای نشست
};

class CacheManager {
  constructor() {
    this.version = CACHE_CONFIG.VERSION;
    this.prefix = CACHE_CONFIG.PREFIX;
    this.initialize();
  }

  initialize() {
    // بررسی نسخه
    const currentVersion = localStorage.getItem(`${this.prefix}version`);
    if (currentVersion !== this.version) {
      this.migrateCache(currentVersion);
      localStorage.setItem(`${this.prefix}version`, this.version);
    }

    // پاکسازی خودکار
    this.autoCleanup();
  }

  migrateCache(oldVersion) {
    // پاک کردن کش قدیمی هنگام آپدیت
    this.clearAll();
    console.log(`Cache migrated from ${oldVersion} to ${this.version}`);
  }

  // ==================== ذخیره سازی هوشمند ====================

  // ذخیره با TTL هوشمند
  set(key, data, ttl = null) {
    try {
      const fullKey = this.prefix + key;
      
      // انتخاب TTL مناسب
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

  // دریافت هوشمند
  get(key) {
    const fullKey = this.prefix + key;
    try {
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const cacheItem = JSON.parse(item);
      
      // بررسی انقضا
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

  // حذف
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  // بررسی وجود
  has(key) {
    return this.get(key) !== null;
  }

  // ==================== مدیریت کاربران ====================

  // ذخیره کاربر
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

    // ذخیره در دو سطح
    this.set(userKey, enhancedData);
    this.set(`current_user`, { userId, platform, userKey });
    
    return userKey;
  }

  // دریافت کاربر فعلی
  getCurrentUser() {
    const current = this.get('current_user');
    if (!current) return null;
    
    return this.get(current.userKey);
  }

  // تمدید نشست کاربر
  renewUserSession(userKey) {
    const user = this.get(userKey);
    if (user) {
      user.lastSeen = Date.now();
      this.set(userKey, user);
      return true;
    }
    return false;
  }

  // ==================== مدیریت آزمون ====================

  // ذخیره نتیجه آزمون
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
    
    // ذخیره در لیست نتایج کاربر
    if (userId) {
      this.addToUserHistory(userId, quizId, quizKey);
    }

    return quizKey;
  }

  // دریافت نتایج کاربر
  getUserQuizResults(userId) {
    const history = this.get(`user_history_${userId}`) || [];
    return history
      .map(item => this.get(item.quizKey))
      .filter(result => result !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // ==================== سرویس‌های کمکی ====================

  // پاکسازی خودکار
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

  // پاکسازی کامل
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

  // مدیریت حافظه پر
  handleStorageFull() {
    // حذف قدیمی‌ترین آیتم‌ها
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

    // مرتب سازی بر اساس زمان انقضا
    cacheItems.sort((a, b) => a.expires - b.expires);
    
    // حذف 20% قدیمی‌ترین آیتم‌ها
    const itemsToRemove = Math.ceil(cacheItems.length * 0.2);
    cacheItems.slice(0, itemsToRemove).forEach(item => {
      localStorage.removeItem(item.key);
    });
  }

  // ==================== ابزارها ====================

  // اطلاعات دستگاه
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      online: navigator.onLine
    };
  }

  // تولید ID نشست
  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // آمار کش
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

  // ==================== متدهای خصوصی ====================

  addToUserHistory(userId, quizId, quizKey) {
    const historyKey = `user_history_${userId}`;
    const history = this.get(historyKey) || [];
    
    history.unshift({
      id: quizId,
      quizKey: quizKey,
      timestamp: Date.now()
    });

    // محدود کردن تاریخچه به 50 آیتم
    if (history.length > 50) {
      history.pop();
    }

    this.set(historyKey, history, CACHE_CONFIG.USER_TTL);
  }
}

// ایجاد Singleton
const cacheManager = new CacheManager();
export default cacheManager;