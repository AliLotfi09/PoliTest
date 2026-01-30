export default function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function detectMiniAppHost() {
  try {
    const ua = navigator.userAgent.toLowerCase();
    
    if (window.TelegramWebviewProxy || window.Telegram?.WebApp || ua.includes("telegram")) {
      return "telegram";
    }
    
    if (window.EitaaDesktop || (ua.includes("eitaa") && (ua.includes("electron") || ua.includes("desktop"))) || 
        window.Eitaa?.WebApp || window.external?.invoke || ua.includes("eitaa") || ua.includes("eitaaw")) {
      return "eitaa";
    }
    
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function initMiniApp() {
  const host = detectMiniAppHost();
  
  if (host === "unknown") {
    return { host, initialized: false, webApp: null };
  }
  
  try {
    if (host === "telegram") {
      await loadScript("/telegram-web-app.js");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.enableClosingConfirmation();
        
        if (window.Telegram.WebApp.setHeaderColor) {
          window.Telegram.WebApp.setHeaderColor("#f5f5f5");
        }
        
        if (window.Telegram.WebApp.setBackgroundColor) {
          window.Telegram.WebApp.setBackgroundColor("#f5f5f5");
        }
        
        return { host, initialized: true, webApp: window.Telegram.WebApp };
      }
    } 
    else if (host === "eitaa") {
      if (!window.Eitaa?.WebApp) {
        try {
          await loadScript("https://developer.eitaa.com/eitaa-web-app.js");
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.warn("Could not load Eitaa SDK");
          return initEitaaFallback();
        }
      }
      
      if (window.Eitaa?.WebApp) {
        const webApp = window.Eitaa.WebApp;
        
        if (typeof webApp.expand === "function") webApp.expand();
        if (typeof webApp.setBackgroundColor === "function") webApp.setBackgroundColor("#f5f5f5");
        if (typeof webApp.ready === "function") webApp.ready();
        
        return { host, initialized: true, webApp };
      }
      
      return initEitaaFallback();
    }
    
    return { host, initialized: false, webApp: null };
  } catch (err) {
    console.error(err);
    return { host, initialized: false, webApp: null };
  }
}

function initEitaaFallback() {
  const mockWebApp = {
    platform: "desktop",
    version: "1.0",
    isExpanded: false,
    expand: function() { this.isExpanded = true; },
    setBackgroundColor: function(color) {},
    ready: function() {},
    close: function() { if (window.EitaaDesktop) window.EitaaDesktop.close(); }
  };
  
  if (!window.Eitaa) window.Eitaa = {};
  window.Eitaa.WebApp = mockWebApp;
  
  return { host: "eitaa", initialized: true, webApp: mockWebApp };
}

export function getMiniAppState() {
  const host = detectMiniAppHost();
  
  if (host === "telegram" && window.Telegram?.WebApp) {
    return {
      host,
      isInitialized: true,
      webApp: window.Telegram.WebApp,
      isExpanded: window.Telegram.WebApp.isExpanded,
    };
  }
  
  if (host === "eitaa" && window.Eitaa?.WebApp) {
    return {
      host,
      isInitialized: true,
      webApp: window.Eitaa.WebApp,
      isExpanded: window.Eitaa.WebApp.isExpanded || false,
    };
  }
  
  return { host, isInitialized: false, webApp: null };
}

export function expandMiniApp() {
  const host = detectMiniAppHost();
  
  if (host === "telegram" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    return true;
  }
  
  if (host === "eitaa" && window.Eitaa?.WebApp && typeof window.Eitaa.WebApp.expand === "function") {
    window.Eitaa.WebApp.expand();
    return true;
  }
  
  return false;
}

export function closeMiniApp() {
  const host = detectMiniAppHost();
  
  if (host === "telegram" && window.Telegram?.WebApp?.close) {
    window.Telegram.WebApp.close();
    return true;
  }
  
  if (host === "eitaa" && window.Eitaa?.WebApp?.close) {
    window.Eitaa.WebApp.close();
    return true;
  }
  
  return false;
}