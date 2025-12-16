// src/components/ClickSound.jsx
'use client';

import { useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { useSettings } from '../hooks/useSettings';

export const ClickSound = () => {
  const { playClick } = useSound();
  const { settings } = useSettings();

  useEffect(() => {
    const handleClick = (e) => {
      // Don't play sound for specific elements
      const tagName = e.target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isButton = tagName === 'button';
      
      if (settings.soundEnabled && !isInput) {
        playClick();
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [settings.soundEnabled, playClick]);

  return null;
};