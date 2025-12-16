// src/hooks/useFont.js
import { useState, useEffect, useCallback } from 'react';
import { FontManager } from '../utils/fontManager';

export const useFont = () => {
  const [currentFont, setCurrentFont] = useState(FontManager.getCurrentFont());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // مقداردهی اولیه فونت
    FontManager.initialize();
  }, []);

  const changeFont = useCallback(async (fontName) => {
    if (fontName === currentFont || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await FontManager.loadFont(fontName);
      FontManager.applyFont(fontName);
      setCurrentFont(fontName);
      
      return true;
    } catch (error) {
      console.error('Error changing font:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentFont, isLoading]);

  return {
    currentFont,
    changeFont,
    isLoading,
    fonts: Object.keys(FontManager.fonts).map(key => ({
      id: key,
      name: FontManager.fonts[key].name,
      className: FontManager.fonts[key].className
    }))
  };
};