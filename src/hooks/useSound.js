import { useTheme } from '../providers/ThemeProvider';

// صداهای ساده با Web Audio API
const playBeep = (frequency = 800, duration = 0.1, volume = 0.5) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    // Cleanup
    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
  } catch (error) {
    console.log('Sound not supported:', error);
  }
};

export const useSound = () => {
  const { settings } = useTheme();

  const playClick = () => {
    if (settings.soundEnabled) {
      playBeep(800, 0.1, settings.soundVolume || 0.5);
    }
  };

  const playSelect = () => {
    if (settings.soundEnabled) {
      playBeep(1200, 0.15, settings.soundVolume || 0.5);
    }
  };

  const playSuccess = () => {
    if (settings.soundEnabled) {
      playBeep(1500, 0.2, settings.soundVolume || 0.5);
    }
  };

  const playError = () => {
    if (settings.soundEnabled) {
      playBeep(400, 0.3, settings.soundVolume || 0.5);
    }
  };

  return {
    playClick,
    playSelect,
    playSuccess,
    playError,
  };
};