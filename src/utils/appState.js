// src/utils/appState.js
import cacheManager from './cacheManager';
import supabaseHelper from './supabaseHelper';
import { initMiniApp, getMiniAppState } from './miniAppDetector';

class AppState {
  constructor() {
    this.state = {
      user: null,
      quiz: null,
      settings: {},
      notifications: [],
      lastActivity: Date.now(),
      miniAppData: null
    };
    
    this.subscribers = new Set();
    this.initialize();
  }

  async initialize() {
    this.loadFromCache();
    window.addEventListener('beforeunload', () => this.saveToCache());
    this.trackActivity();
    
    // چک کردن کاربر مینی‌اپ
    await this.checkMiniAppUser();
  }

  async checkMiniAppUser() {
    try {
      const initResult = await initMiniApp();
      
      if (initResult.initialized && initResult.webApp) {
        console.log(`✅ ${initResult.host} detected and initialized`);
        
        const { host, webApp } = initResult;
        
        // لاگ کردن داده‌های WebApp (اختیاری)
        await supabaseHelper.logWebAppData(host, webApp);
        
        // ذخیره کاربر در Supabase
        const saveResult = await supabaseHelper.saveMiniAppUser(host, webApp);
        
        if (saveResult.success) {
          console.log(`✅ ${host} user saved to Supabase:`, saveResult.data.id);
          
          // ذخیره در state
          this.state.miniAppData = {
            host: host,
            user: saveResult.data,
            webApp: webApp,
            isNewUser: saveResult.isNewUser,
            timestamp: Date.now()
          };
          
          // ایجاد کاربر در state اپلیکیشن
          await this.setUserFromMiniApp(saveResult.data, host);
          
          // اطلاع‌رسانی به subscribers
          this.notify('miniApp', this.state.miniAppData);
        } else {
          console.error(`❌ Failed to save ${host} user:`, saveResult.error);
        }
      } else {
        console.log('ℹ️ Not in mini app environment or initialization failed');
      }
    } catch (error) {
      console.error('❌ Mini app check error:', error);
    }
  }

  async setUserFromMiniApp(userData, platform) {
    const enhancedUser = {
      ...userData,
      id: userData.id,
      platform: platform,
      joinedAt: userData.created_at || Date.now(),
      fromMiniApp: true,
      lastActive: Date.now(),
      // اطلاعات اضافی از Supabase
      supabaseData: userData
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

  getMiniAppData() {
    return this.state.miniAppData;
  }

  // گرفتن وضعیت فعلی مینی‌اپ
  getCurrentMiniAppState() {
    return getMiniAppState();
  }

  // بقیه متدها بدون تغییر...

  // ==================== متدهای جدید برای مینی‌اپ ====================

  expandMiniApp() {
    const state = this.getCurrentMiniAppState();
    if (state.isInitialized && state.webApp) {
      if (typeof state.webApp.expand === 'function') {
        state.webApp.expand();
        return true;
      }
    }
    return false;
  }

  closeMiniApp() {
    const state = this.getCurrentMiniAppState();
    if (state.isInitialized && state.webApp) {
      if (typeof state.webApp.close === 'function') {
        state.webApp.close();
        return true;
      }
    }
    return false;
  }

  sendDataToMiniApp(data) {
    const state = this.getCurrentMiniAppState();
    if (state.isInitialized && state.webApp) {
      if (typeof state.webApp.sendData === 'function') {
        state.webApp.sendData(JSON.stringify(data));
        return true;
      }
    }
    return false;
  }

  // بقیه متدها...
}

const appState = new AppState();
export default appState;