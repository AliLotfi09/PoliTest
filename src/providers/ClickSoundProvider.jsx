import React, { createContext, useContext, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider"; // تغییر به useTheme

const ClickSoundContext = createContext();

export const ClickSoundProvider = ({ children }) => {
  // استفاده از useTheme به جای useSettings
  const { settings } = useTheme();

  // صدای کلیک
  const playClickSound = () => {
    if (!settings.soundEnabled) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      // استفاده از soundVolume از تنظیمات ThemeProvider
      gainNode.gain.setValueAtTime(
        settings.soundVolume || 0.5,
        audioContext.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      setTimeout(() => {
        try {
          audioContext.close();
        } catch (e) {
          console.log("Audio context already closed");
        }
      }, 200);
    } catch (error) {
      console.log("Sound not supported:", error);
    }
  };

  // اعمال روی کلیه المان‌های کلیک پذیر
  useEffect(() => {
    // اگر صدا غیرفعال است، event listener اضافه نکن
    if (!settings.soundEnabled) return;

    const handleClick = (event) => {
      // چک کن که المان کلیک شده دکمه یا لینک باشه
      const element = event.target;
      const isInteractive =
        element.tagName === "BUTTON" ||
        element.tagName === "A" ||
        element.closest("button") ||
        element.closest("a") ||
        element.closest('[role="button"]') ||
        element.hasAttribute("onclick") ||
        element.classList.contains("clickable") ||
        element.classList.contains("option") ||
        element.classList.contains("btn") ||
        element.classList.contains("start-btn") ||
        element.classList.contains("action-btn") ||
        element.classList.contains("nav-item") ||
        element.classList.contains("toggle") ||
        element.classList.contains("theme-option") ||
        element.classList.contains("font-option") ||
        element.classList.contains("size-option") ||
        element.classList.contains("test-button") ||
        element.classList.contains("confirm-button") ||
        element.classList.contains("save-button") ||
        element.classList.contains("icon-button") ||
        element.classList.contains("question-info-btn");

      if (isInteractive) {
        // از کلیک روی المان‌های صدا و تنظیمات صدا جلوگیری کن
        if (
          element.classList.contains("toggle") &&
          (element
            .closest(".setting-option")
            ?.querySelector(".option-name")
            ?.textContent.includes("صدا") ||
            element
              .closest(".setting-option")
              ?.querySelector(".option-name")
              ?.textContent.includes("لرزش"))
        ) {
          return; // صدا برای toggle‌های صدا و لرزش نده
        }

        if (
          element.classList.contains("test-button") &&
          element.textContent.includes("صدا")
        ) {
          return; // صدا برای دکمه تست صدا نده
        }

        playClickSound();
      }
    };

    // اضافه کردن event listener به کل document
    document.addEventListener("click", handleClick, true);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [settings.soundEnabled, settings.soundVolume, playClickSound]);

  return (
    <ClickSoundContext.Provider value={{ playClickSound }}>
      {children}
    </ClickSoundContext.Provider>
  );
};

export const useClickSound = () => {
  const context = useContext(ClickSoundContext);
  if (!context) {
    throw new Error("useClickSound must be used within ClickSoundProvider");
  }
  return context;
};
