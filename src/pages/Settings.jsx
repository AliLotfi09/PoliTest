// Settings.jsx - نسخه ساده و کامل
import React, { useState, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { useSound } from "../hooks/useSound";
import { useVibration } from "../hooks/useVibration";
import AdvancedBottomNavigation from "../components/BottomNavigation";
import { FontManager } from "../utils/fontManager";


import {
  Sun,
  Moon,
  Monitor,
  Volume2,
  Vibrate,
  Check,
  RotateCcw,
  Settings as SettingsIcon,
  Palette,
  AlertTriangle,
  Download,
  Trash2,
  Info,
  ExternalLink,
  DatabaseIcon,
  RefreshCw,
  X,
  FileText,
  Upload,
  HardDrive,
  Bell,
  VolumeX,
  Eye,
  Globe,
} from "lucide-react";
import { changelogData } from "../data/changelogData";

const Settings = () => {
  const { theme, setTheme, settings, updateSetting, resetSettings } =
    useTheme();
  const { playClick, playSelect, playSuccess, playError } = useSound();
  const { clickVibrate } = useVibration();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showFullChangelog, setShowFullChangelog] = useState(false);

  const fileInputRef = React.useRef(null);

  // نمایش toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
        setToastType("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  // توابع اصلی
  const handleSettingChange = async (key, value) => {
  playSelect();
  clickVibrate();

  if (key === "fontFamily") {
    const ok = await FontManager.loadFont(value);
    if (ok) FontManager.applyFont(value);
  }

  updateSetting(key, value);

  const messages = {
    fontFamily: `فونت به ${
      value === "vazir"
        ? "وزیر"
        : value === "estedad"
        ? "استعداد"
        : value === "abar"
        ? "ابر"
        : value
    } تغییر کرد`,
    soundEnabled: `صدا ${value ? "فعال" : "غیرفعال"} شد`,
    vibrationEnabled: `لرزش ${value ? "فعال" : "غیرفعال"} شد`,
    fontSize: `سایز فونت تغییر کرد`,
    language: `زبان تغییر کرد`,
  };

  if (messages[key]) showToast(messages[key]);
};


  const handleThemeChange = (newTheme) => {
    playSelect();
    clickVibrate();
    setTheme(newTheme);

    const themeNames = {
      light: "روشن",
      dark: "تاریک",
      system: "سیستم",
    };
    showToast(`تم به ${themeNames[newTheme]} تغییر کرد`);
  };

  const handleSoundTest = () => {
    if (settings.soundEnabled) {
      playSuccess();
      clickVibrate();
      showToast("صدای تست پخش شد");
    } else {
      showToast("لطفاً اول صدا را فعال کنید", "error");
    }
  };

  const handleVibrationTest = () => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
      playSelect();
      showToast("لرزش تست شد");
    } else {
      showToast("لرزش غیرفعال است یا پشتیبانی نمی‌شود", "error");
    }
  };

  const handleResetAll = () => {
    if (showResetConfirm) {
      resetSettings();
      setShowResetConfirm(false);
      playSuccess();
      showToast("همه تنظیمات بازنشانی شدند");
    } else {
      playClick();
      clickVibrate();
      setShowResetConfirm(true);
    }
  };

  const handleExportSettings = () => {
    try {
      const data = {
        settings: {
          ...settings,
          theme,
        },
        changelog: changelogData,
        exportedAt: new Date().toLocaleString("fa-IR"),
        version: changelogData.version,
        timestamp: Date.now(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `تنظیمات-پُلی-تست-${
        changelogData.version
      }-${Date.now()}.json`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      playSuccess();
      showToast("تنظیمات با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error exporting settings:", error);
      playError();
      showToast("خطا در ذخیره تنظیمات", "error");
    }
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);

        if (importedSettings.settings && importedSettings.version) {
          Object.keys(importedSettings.settings).forEach((key) => {
            if (key !== "theme" && settings.hasOwnProperty(key)) {
              updateSetting(key, importedSettings.settings[key]);
            }
          });

          if (importedSettings.settings.theme) {
            setTheme(importedSettings.settings.theme);
          }

          playSuccess();
          showToast("تنظیمات با موفقیت وارد شد");
          setShowDataManagement(false);
        } else {
          throw new Error("فرمت فایل نامعتبر است");
        }
      } catch (error) {
        console.error("Error importing settings:", error);
        playError();
        showToast("خطا در وارد کردن تنظیمات", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        "آیا مطمئن هستید که می‌خواهید کش برنامه را پاک کنید؟ این عمل قابل بازگشت نیست.",
      )
    ) {
      try {
        localStorage.removeItem("theme");
        localStorage.removeItem("appSettings");
        showToast("کش برنامه پاک شد");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error clearing cache:", error);
        showToast("خطا در پاک کردن کش", "error");
      }
    }
  };

  const handleOpenGitHub = () => {
    window.open(
      changelogData.downloadUrl || "https://github.com/ALILOTFI1379/PoliTest",
      "_blank",
    );
    showToast("صفحه گیت‌هاب باز شد", "info");
  };

  const handleOpenWebsite = () => {
    window.open("https://politest.ir", "_blank");
  };

  // تنظیمات تم
  const themeOptions = [
    { id: "light", icon: <Sun size={18} />, label: "روشن" },
    { id: "dark", icon: <Moon size={18} />, label: "تاریک" },
    { id: "system", icon: <Monitor size={18} />, label: "سیستم" },
  ];

  const fontOptions = [
    { id: "estedad", label: "استعداد" },
    { id: "vazir", label: "وزیر" },
    { id: "abar", label: "ابر" },
  ];

  // const languageOptions = [
  //   { id: "fa", label: "فارسی", flag: "🇮🇷" },
  //   { id: "en", label: "انگلیسی", flag: "🇺🇸" },
  // ];

  // کامپوننت Toast
  const Toast = () => {
    if (!toastMessage) return null;

    return (
      <div className={`toast ${toastType}`}>
        <div className="toast-icon">
          {toastType === "success" ? (
            <Check size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
        </div>
        <div className="toast-message">{toastMessage}</div>
      </div>
    );
  };

  // کامپوننت مودال تغییرات
  const ChangelogModal = () => {
    if (!showFullChangelog) return null;

    const changesToShow = changelogData.changes;

    return (
      <div className="modal-overlay">
        <div className="simple-modal">
          <div className="modal-header">
            <div className="modal-title">
              <RefreshCw size={24} />
              <h3>تغییرات نسخه {changelogData.version}</h3>
            </div>
            <button
              className="close-modal"
              onClick={() => setShowFullChangelog(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="version-info-card">
              <div className="version-badge">
                <span className="version-label">نسخه:</span>
                <span className="version-value">{changelogData.version}</span>
              </div>
              <div className="version-date">
                <span className="date-label">تاریخ انتشار:</span>
                <span className="date-value">{changelogData.releaseDate}</span>
              </div>
            </div>

            <div className="changes-list">
              {changesToShow.map((change, index) => (
                <div key={index} className={`change-item ${change.type}`}>
                  <div className="change-icon">
                    {change.type === "new"
                      ? "🆕"
                      : change.type === "improved"
                        ? "✨"
                        : change.type === "fixed"
                          ? "🐛"
                          : "📝"}
                  </div>
                  <div className="change-content">
                    <span className="change-type">
                      {change.type === "new"
                        ? "جدید"
                        : change.type === "improved"
                          ? "بهبود"
                          : change.type === "fixed"
                            ? "رفع باگ"
                            : "تغییر"}
                    </span>
                    <span className="change-text">{change.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {changelogData.versionHistory && (
              <div className="version-history">
                <h4>تاریخچه نسخه‌ها</h4>
                {changelogData.versionHistory.map((version, index) => (
                  <div key={index} className="history-item">
                    <div className="history-version">
                      <span className="version-number">{version.version}</span>
                      <span className="version-date">{version.date}</span>
                    </div>
                    <div className="history-changes">
                      {version.changes.map((change, idx) => (
                        <div key={idx} className="history-change">
                          • {change}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="primary-button" onClick={handleOpenGitHub}>
              <ExternalLink size={18} />
              مشاهده در گیت‌هاب
            </button>
            <button
              className="secondary-button"
              onClick={() => setShowFullChangelog(false)}
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Toast />
      <ChangelogModal />

      <div className="container">
        <div className="settings-container">
          {/* هدر */}
          <div className="settings-header">
            <div className="header-content">
              <div className="header-icons">
                <SettingsIcon size={28} />
              </div>
              <div>
                <h1 className="settings-title">تنظیمات</h1>
                <p className="settings-subtitle">شخصی‌سازی تجربه کاربری</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="icon-button"
                onClick={() => {
                  setShowDataManagement(!showDataManagement);
                  playClick();
                  clickVibrate();
                }}
                title="مدیریت داده‌ها"
              >
                <DatabaseIcon size={20} />
              </button>
              <button
                className="icon-button"
                onClick={handleExportSettings}
                title="خروجی گرفتن تنظیمات"
              >
                <Download size={20} />
              </button>
              <button
                className="icon-button"
                onClick={handleResetAll}
                title="بازنشانی تنظیمات"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* مدیریت داده‌ها */}
          {showDataManagement && (
            <div className="setting-card warning">
              <div className="setting-card-header">
                <div className="setting-icon warning">
                  <HardDrive size={24} />
                </div>
                <div className="setting-info">
                  <h3 className="setting-title">مدیریت داده‌ها</h3>
                  <p className="setting-description">
                    وارد کردن، خروجی گرفتن و مدیریت داده‌ها
                  </p>
                </div>
              </div>

              <div className="data-management-section">
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">وارد کردن تنظیمات</span>
                    <span className="option-hint">
                      بارگذاری تنظیمات از فایل JSON
                    </span>
                  </div>
                  <div className="file-upload-group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      style={{ display: "none" }}
                    />
                    <button
                      className="file-input-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} />
                      انتخاب فایل
                    </button>
                  </div>
                </div>

                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">خروجی تنظیمات</span>
                    <span className="option-hint">
                      ذخیره تنظیمات فعلی در فایل
                    </span>
                  </div>
                  <button
                    className="file-input-button"
                    onClick={handleExportSettings}
                  >
                    <Download size={16} />
                    دانلود تنظیمات
                  </button>
                </div>

                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">پاک کردن کش</span>
                    <span className="option-hint">
                      حذف تمام داده‌های ذخیره شده محلی
                    </span>
                  </div>
                  <button className="danger-button" onClick={handleClearCache}>
                    <Trash2 size={16} />
                    پاک کردن کش
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* کارت نسخه و تغییرات */}
          <div className="setting-card version-card">
            <div className="setting-card-header">
              <div className="setting-icon primary">
                <RefreshCw size={24} />
              </div>
              <div className="setting-info">
                <h3 className="setting-title">نسخه و تغییرات</h3>
                <p className="setting-description">
                  نسخه فعلی: {changelogData.version} • انتشار:{" "}
                  {changelogData.releaseDate}
                </p>
              </div>
            </div>

            <div className="version-card-content">
              <div className="changelog-preview">
                <div className="preview-header">
                  <h4>تغییرات اخیر</h4>
                </div>
                <div className="preview-items">
                  {changelogData.changes.slice(0, 3).map((change, index) => (
                    <div key={index} className={`preview-item ${change.type}`}>
                      <span className="preview-icon">
                        {change.type === "new"
                          ? "🆕"
                          : change.type === "improved"
                            ? "✨"
                            : "🐛"}
                      </span>
                      <span className="preview-text">{change.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="version-actions">
                <button
                  className="test-button"
                  onClick={() => setShowFullChangelog(true)}
                >
                  <FileText size={18} />
                  مشاهده همه تغییرات
                </button>
                <button className="test-button" onClick={handleOpenGitHub}>
                  <ExternalLink size={18} />
                  گیت‌هاب پروژه
                </button>
              </div>
            </div>
          </div>

          {/* تنظیمات اصلی */}
          <div className="settings-grid">
            {/* تم و ظاهر */}
            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Palette size={24} />
                </div>
                <div className="setting-info">
                  <h3 className="setting-title">ظاهر</h3>
                  <p className="setting-description">تنظیمات ظاهری برنامه</p>
                </div>
              </div>

              <div className="setting-options">
                {/* تم */}
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">تم برنامه</span>
                    <span className="option-hint">
                      انتخاب حالت روشن یا تاریک
                    </span>
                  </div>
                  <div className="theme-options">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`theme-option ${
                          theme === option.id ? "active" : ""
                        }`}
                        onClick={() => handleThemeChange(option.id)}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                        {theme === option.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* فونت */}
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">فونت</span>
                    <span className="option-hint">انتخاب نوع فونت متن</span>
                  </div>
                  <div className="font-options">
                    {fontOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`font-option ${
                          settings.fontFamily === option.id ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSettingChange("fontFamily", option.id)
                        }
                        style={{
                          fontFamily:
                            option.id === "vazir"
                              ? "Vazirmatn, sans-serif"
                              : option.id === "estedad"
                                ? "Estedad, sans-serif"
                                : option.id === "abar"
                                  ? "AbarMidFaNum, sans-serif"
                                  : "Estedad, sans-serif",
                        }}
                      >
                        {option.label}
                        {settings.fontFamily === option.id && (
                          <Check size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* صدا و لرزش */}
                <div className="setting-card">
                  <div className="setting-card-header">
                    <div className="setting-icon">
                      <Volume2 size={24} />
                    </div>
                    <div className="setting-info">
                      <h3 className="setting-title">صدا و لرزش</h3>
                      <p className="setting-description">تنظیمات صوتی و لمسی</p>
                    </div>
                  </div>

                  <div className="setting-options">
                    {/* فعال/غیرفعال صدا */}
                    <div className="setting-option">
                      <div className="option-label">
                        <span className="option-name">صداهای سیستم</span>
                        <span className="option-hint">
                          فعال/غیرفعال کردن صداها
                        </span>
                      </div>
                      <div
                        className={`toggle ${
                          settings.soundEnabled ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSettingChange(
                            "soundEnabled",
                            !settings.soundEnabled,
                          )
                        }
                      >
                        <div className="toggle-handle" />
                      </div>
                    </div>

                    {/* بلندی صدا */}
                    {settings.soundEnabled && (
                      <div className="setting-option">
                        <div className="option-label">
                          <span className="option-name">بلندی صدا</span>
                          <span className="option-hint">
                            تنظیم میزان بلندی صداها
                          </span>
                        </div>
                        <div className="volume-slider">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.soundVolume * 100}
                            onChange={(e) =>
                              handleSettingChange(
                                "soundVolume",
                                parseInt(e.target.value) / 100,
                              )
                            }
                            className="slider"
                          />
                          <div className="volume-value">
                            {Math.round(settings.soundVolume * 100)}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* تست صدا */}
                    <div className="setting-option">
                      <button
                        className="test-button"
                        onClick={handleSoundTest}
                        disabled={!settings.soundEnabled}
                      >
                        {settings.soundEnabled ? (
                          <>
                            <Volume2 size={16} />
                            تست صدا
                          </>
                        ) : (
                          <>
                            <VolumeX size={16} />
                            صدا غیرفعال است
                          </>
                        )}
                      </button>
                    </div>

                    {/* فعال/غیرفعال لرزش */}
                    <div className="setting-option">
                      <div className="option-label">
                        <span className="option-name">لرزش</span>
                        <span className="option-hint">
                          فیدبک لمسی هنگام تعامل
                        </span>
                      </div>
                      <div
                        className={`toggle ${
                          settings.vibrationEnabled ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSettingChange(
                            "vibrationEnabled",
                            !settings.vibrationEnabled,
                          )
                        }
                      >
                        <div className="toggle-handle" />
                      </div>
                    </div>

                    {/* تست لرزش */}
                    <div className="setting-option">
                      <button
                        className="test-button"
                        onClick={handleVibrationTest}
                        disabled={!settings.vibrationEnabled}
                      >
                        {settings.vibrationEnabled ? (
                          <>
                            <Vibrate size={16} />
                            تست لرزش
                          </>
                        ) : (
                          "لرزش غیرفعال است"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* زبان و دسترسی
            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Globe size={24} />
                </div>
                <div className="setting-info">
                  <h3 className="setting-title">زبان و دسترسی</h3>
                  <p className="setting-description">
                    تنظیمات زبان و قابلیت‌های دسترسی
                  </p>
                </div>
              </div>

              <div className="setting-options">
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">زبان برنامه</span>
                    <span className="option-hint">انتخاب زبان رابط کاربری</span>
                  </div>
                  <div className="language-options">
                    {languageOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`language-option ${
                          settings.language === option.id ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSettingChange("language", option.id)
                        }
                      >
                        <span className="language-flag">{option.flag}</span>
                        <span className="language-name">{option.label}</span>
                        {settings.language === option.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">کاهش حرکت</span>
                    <span className="option-hint">
                      کاهش انیمیشن‌ها برای دسترسی بهتر
                    </span>
                  </div>
                  <div
                    className={`toggle ${
                      settings.reduceMotion ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSettingChange(
                        "reduceMotion",
                        !settings.reduceMotion
                      )
                    }
                  >
                    <div className="toggle-handle" />
                  </div>
                </div>

                {/* کنتراست بالا 
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">کنتراست بالا</span>
                    <span className="option-hint">
                      افزایش کنتراست برای دید بهتر
                    </span>
                  </div>
                  <div
                    className={`toggle ${
                      settings.highContrast ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSettingChange(
                        "highContrast",
                        !settings.highContrast
                      )
                    }
                  >
                    <div className="toggle-handle" />
                  </div>
                </div>
              </div>
            </div> */}

                {/* درباره برنامه */}
                <div className="setting-card">
                  <div className="setting-card-header">
                    <div className="setting-icon">
                      <Info size={24} />
                    </div>
                    <div className="setting-info">
                      <h3 className="setting-title">درباره برنامه</h3>
                      <p className="setting-description">
                        اطلاعات برنامه و توسعه‌دهنده
                      </p>
                    </div>
                  </div>

                  <div className="app-info-section">
                    <div className="app-info-grid">
                      <div className="info-item">
                        <span className="info-label">سازنده</span>
                        <span className="info-value">علی لطفی</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">لایسنس</span>
                        <span className="info-value">MIT Open Source</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">وب‌سایت</span>
                        <button
                          className="info-value link"
                          onClick={handleOpenWebsite}
                        >
                          پُلی تست
                          <ExternalLink size={18} />
                        </button>
                      </div>
                      <div className="info-item">
                        <span className="info-label">گیت‌هاب</span>
                        <button
                          className="info-value link"
                          onClick={handleOpenGitHub}
                        >
                          مخزن کد
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="app-description">
                      <p>
                        <strong>پُلی تست</strong> یک ابزار تحلیلی برای شناسایی
                        گرایش‌های سیاسی و شخصیتی بر اساس نظریه‌های روانشناسی
                        سیاسی است.
                      </p>
                      <p className="app-version">
                        نسخه {changelogData.version} • انتشار{" "}
                        {changelogData.releaseDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* بخش بازنشانی */}
                {showResetConfirm && (
                  <div className="setting-card warning">
                    <div className="setting-card-header">
                      <div className="setting-icon warning">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="setting-info">
                        <h3 className="setting-title">تأیید بازنشانی</h3>
                        <p className="setting-description">
                          همه تنظیمات به حالت اولیه باز می‌گردند
                        </p>
                      </div>
                    </div>

                    <div className="confirmation-buttons">
                      <button
                        className="confirm-button danger"
                        onClick={handleResetAll}
                      >
                        <RotateCcw size={16} />
                        بله، بازنشانی کن
                      </button>
                      <button
                        className="confirm-button"
                        onClick={() => {
                          setShowResetConfirm(false);
                          playClick();
                          clickVibrate();
                        }}
                      >
                        لغو
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <AdvancedBottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Settings;
