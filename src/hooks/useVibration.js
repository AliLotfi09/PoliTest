import { useTheme } from '../providers/ThemeProvider';

export const useVibration = () => {
  const { settings } = useTheme();

  const vibrate = (pattern) => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.log('Vibration not supported:', error);
      }
    }
  };

  return {
    clickVibrate: () => vibrate(50),
    selectVibrate: () => vibrate([50, 30, 50]),
    successVibrate: () => vibrate([100, 50, 100]),
    errorVibrate: () => vibrate([200, 100, 200, 100, 200]),
  };
};