export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// miniAppDetector.js (updated)
export function detectMiniAppHost() {
  try {
    const ua = navigator.userAgent.toLowerCase();

    // اول Telegram رو چک کنید
    if (window.TelegramWebviewProxy || ua.includes("telegram"))
      return "telegram";

    // سپس Eitaa رو با دقت بیشتری چک کنید
    if (
      window.Eitaa?.WebApp ||
      window.Eitaa ||
      ua.includes("eitaa") ||
      ua.includes("eitaaw")
    ) {
      console.log("📱 Eitaa detected via:", {
        hasEitaaObject: !!window.Eitaa,
        hasEitaaWebApp: !!window.Eitaa?.WebApp,
        userAgentMatches: ua.includes("eitaa") || ua.includes("eitaaw"),
      });
      return "eitaa";
    }

    return "unknown";
  } catch (error) {
    console.warn("Error detecting mini-app host:", error);
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

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.enableClosingConfirmation();

        if (window.Telegram.WebApp.setHeaderColor) {
          window.Telegram.WebApp.setHeaderColor("#f5f5f5");
        }

        if (window.Telegram.WebApp.setBackgroundColor) {
          window.Telegram.WebApp.setBackgroundColor("#f5f5f5");
        }

        return {
          host,
          initialized: true,
          webApp: window.Telegram.WebApp,
        };
      }
    } else if (host === "eitaa") {
      await loadScript("https://developer.eitaa.com/eitaa-web-app.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (window.Eitaa?.WebApp) {
        if (typeof window.Eitaa.WebApp.expand === "function") {
          window.Eitaa.WebApp.expand();
        }

        if (typeof window.Eitaa.WebApp.setBackgroundColor === "function") {
          window.Eitaa.WebApp.setBackgroundColor("#f5f5f5");
        }

        return {
          host,
          initialized: true,
          webApp: window.Eitaa.WebApp,
        };
      }
    }

    return { host, initialized: false, webApp: null };
  } catch (err) {
    console.error(err);
    return { host, initialized: false, webApp: null };
  }
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
    };
  }

  return {
    host,
    isInitialized: false,
    webApp: null,
  };
}

export function expandMiniApp() {
  const host = detectMiniAppHost();

  if (host === "telegram" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    return true;
  }

  if (
    host === "eitaa" &&
    window.Eitaa?.WebApp &&
    typeof window.Eitaa.WebApp.expand === "function"
  ) {
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
