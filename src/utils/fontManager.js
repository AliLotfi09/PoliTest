// src/utils/fontManager.js
export class FontManager {
  static fonts = {
    estedad: {
      name: 'Estedad',
      url: 'https://cdn.jsdelivr.net/gh/rastikerdar/estedad-font@latest/fonts/font-face.css',
      className: 'font-estedad',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
    vazir: {
      name: 'Vazirmatn',
      url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@latest/dist/font-face.css',
      className: 'font-vazir',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
    sahel: {
      name: 'Sahel',
      url: 'https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@latest/dist/font-face.css',
      className: 'font-sahel',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
    shabnam: {
      name: 'Shabnam',
      url: 'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@latest/dist/font-face.css',
      className: 'font-shabnam',
      fallback: 'system-ui, -apple-system, sans-serif'
    }
  };

  static async loadFont(fontName) {
    if (!this.fonts[fontName]) {
      throw new Error(`Font ${fontName} not found`);
    }

    // اگر فونت قبلاً لود شده، دیگه لود نکن
    if (this.isFontLoaded(fontName)) {
      return true;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.id = `font-${fontName}`;
      link.rel = 'stylesheet';
      link.href = this.fonts[fontName].url;
      link.onload = () => {
        console.log(`Font ${fontName} loaded successfully`);
        resolve(true);
      };
      link.onerror = () => {
        console.error(`Failed to load font: ${fontName}`);
        // اگر فونت لود نشد، از فونت سیستمی استفاده کن
        this.applySystemFont();
        resolve(false);
      };
      
      document.head.appendChild(link);
    });
  }

  static isFontLoaded(fontName) {
    return document.getElementById(`font-${fontName}`) !== null;
  }

  static applyFont(fontName) {
    if (!this.fonts[fontName]) {
      console.warn(`Font ${fontName} not found, using system font`);
      this.applySystemFont();
      return;
    }

    // حذف کلاس‌های فونت قبلی
    Object.values(this.fonts).forEach(font => {
      document.body.classList.remove(font.className);
    });

    // اضافه کردن کلاس فونت جدید
    document.body.classList.add(this.fonts[fontName].className);
    
    // ذخیره در localStorage
    localStorage.setItem('selectedFont', fontName);
    
    // تنظیم متغیر CSS
    document.documentElement.style.setProperty(
      '--font-family',
      `"${this.fonts[fontName].name}", ${this.fonts[fontName].fallback}`
    );
    
    console.log(`Font changed to: ${fontName}`);
  }

  static applySystemFont() {
    // حذف همه کلاس‌های فونت
    Object.values(this.fonts).forEach(font => {
      document.body.classList.remove(font.className);
    });
    
    document.documentElement.style.setProperty(
      '--font-family',
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    );
  }

  static getCurrentFont() {
    return localStorage.getItem('selectedFont') || 'estedad';
  }

  static initialize() {
    const savedFont = this.getCurrentFont();
    
    // ابتدا فونت پیش‌فرض را لود کن
    this.loadFont('estedad').then(() => {
      // سپس فونت ذخیره شده کاربر را اعمال کن
      this.loadFont(savedFont).then(success => {
        if (success) {
          this.applyFont(savedFont);
        } else {
          this.applyFont('estedad');
        }
      });
    });
  }
}