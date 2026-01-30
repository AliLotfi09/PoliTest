// src/utils/fontManager.js
export class FontManager {
  static fonts = {
    estedad: {
      name: 'Estedad',
      url: '/fonts/fontiran.css',
      className: 'font-estedad',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
    vazir: {
      name: 'Vazirmatn',
      className: 'font-vazir',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
    abar: {
      name: 'AbarMidFaNum',
      url: '/fonts/fontiran.css',
      className: 'font-abar',
      fallback: 'system-ui, -apple-system, sans-serif'
    },
  };

  static async loadFont(fontName) {
    if (!this.fonts[fontName]) {
      throw new Error(`Font ${fontName} not found`);
    }

    if (fontName === 'abar') {
      return this.loadAbarFontInline();
    }

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
        this.applySystemFont();
        resolve(false);
      };
      
      document.head.appendChild(link);
    });
  }

  static async loadAbarFontInline() {
    if (this.isFontLoaded('abar')) {
      return true;
    }

    const style = document.createElement('style');
    style.id = 'font-abar-inline';
    style.textContent = `
      @font-face {
        font-family: 'AbarMidFaNum';
        font-style: normal;
        font-weight: 400;
        src: url('public/fonts/woff/AbarMidFaNum-Regular.woff') format('woff'),
             url('public/fonts/woff2/AbarMidFaNum-Regular.woff2') format('woff2');
        font-display: swap;
      }
      
      @font-face {
        font-family: 'AbarMidFaNum';
        font-style: normal;
        font-weight: 600;
        src: url('/fonts/woff/AbarMidFaNum-SemiBold.woff') format('woff'),
             url('/fonts/woff2/AbarMidFaNum-SemiBold.woff2') format('woff2');
        font-display: swap;
      }
      
      @font-face {
        font-family: 'AbarMidFaNum';
        font-style: normal;
        font-weight: 700;
        src: url('/fonts/woff/AbarMidFaNum-Bold.woff') format('woff'),
             url('/fonts/woff2/AbarMidFaNum-Bold.woff2') format('woff2');
        font-display: swap;
      }
      
      @font-face {
        font-family: 'AbarMidFaNum';
        font-style: normal;
        font-weight: 800;
        src: url('/fonts/woff/AbarMidFaNum-ExtraBold.woff') format('woff'),
             url('/fonts/woff2/AbarMidFaNum-ExtraBold.woff2') format('woff2');
        font-display: swap;
      }
      
      @font-face {
        font-family: 'AbarMidFaNum';
        font-style: normal;
        font-weight: 900;
        src: url('/fonts/woff/AbarMidFaNum-Black.woff') format('woff'),
             url('/fonts/woff2/AbarMidFaNum-Black.woff2') format('woff2');
        font-display: swap;
      }
    `;
    
    document.head.appendChild(style);
    
    await this.preloadAbarFonts();
    
    return true;
  }

  static async preloadAbarFonts() {
    try {
      const fonts = [
        { url: '/fonts/woff2/AbarMidFaNum-Regular.woff2', type: 'font/woff2' },
        { url: '/fonts/woff/AbarMidFaNum-Regular.woff', type: 'font/woff' },
        { url: '/fonts/woff2/AbarMidFaNum-Bold.woff2', type: 'font/woff2' },
        { url: '/fonts/woff/AbarMidFaNum-Bold.woff', type: 'font/woff' },
      ];

      const preloadPromises = fonts.map(font => {
        return new Promise((resolve) => {
          const existingLink = document.querySelector(`link[href="${font.url}"]`);
          if (existingLink) {
            resolve();
            return;
          }

          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = font.type;
          link.href = font.url;
          link.crossOrigin = 'anonymous';
          link.onload = resolve;
          link.onerror = resolve;
          document.head.appendChild(link);
        });
      });

      await Promise.all(preloadPromises);
    } catch (error) {
      console.warn('Failed to preload Abar fonts:', error);
    }
  }

  static isFontLoaded(fontName) {
    if (fontName === 'abar') {
      return document.getElementById('font-abar-inline') !== null;
    }
    return document.getElementById(`font-${fontName}`) !== null;
  }

  static applyFont(fontName) {
    if (!this.fonts[fontName]) {
      this.applySystemFont();
      return;
    }

    Object.values(this.fonts).forEach(font => {
      document.body.classList.remove(font.className);
    });

    document.body.classList.add(this.fonts[fontName].className);
    
    localStorage.setItem('selectedFont', fontName);
    
    document.documentElement.style.setProperty(
      '--font-family',
      `"${this.fonts[fontName].name}", ${this.fonts[fontName].fallback}`
    );
  }

  static applySystemFont() {
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
    
    this.loadFont('estedad').then(() => {
      if (savedFont !== 'estedad') {
        this.loadFont(savedFont).then(success => {
          if (success) {
            this.applyFont(savedFont);
          } else {
            this.applyFont('estedad');
          }
        });
      } else {
        this.applyFont('estedad');
      }
    });
  }
}