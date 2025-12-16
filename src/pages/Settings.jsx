// Settings.jsx - نسخه کامل با سیستم آپدیت
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useSound } from '../hooks/useSound';
import { useVibration } from '../hooks/useVibration';
import AdvancedBottomNavigation from '../components/BottomNavigation';
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
  Save,
  Download,
  Shield,
  Trash2,
  Bell,
  Globe,
  Zap,
  Info,
  ExternalLink,
  DatabaseIcon,
  RefreshCw,
  X,
  Clock,
  FileText,
  Upload,
  Server,
  Cloud,
  GitBranch,
  GitPullRequest,
  HardDrive
} from 'lucide-react';
import { changelogData, useChangelog } from '../data/changelogData';

const Settings = () => {
  const { theme, setTheme, settings, updateSetting, resetSettings } = useTheme();
  const { playClick, playSelect, playSuccess, playError } = useSound();
  const { clickVibrate } = useVibration();
  
  const { 
    currentVersion, 
    checkForUpdate, 
    shouldForceUpdate, 
    compareVersions,
    hasSeenCurrentVersion,
    markAsSeen
  } = useChangelog();
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // stateهای آپدیت
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLogs, setUpdateLogs] = useState([]);
  const [updateHistory, setUpdateHistory] = useState([]);
  const [showFullChangelog, setShowFullChangelog] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  
  const fileInputRef = useRef(null);

  // بارگیری تاریخچه بررسی‌ها
  useEffect(() => {
    const storedHistory = localStorage.getItem('updateCheckHistory');
    if (storedHistory) {
      setUpdateHistory(JSON.parse(storedHistory));
    }
    
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    if (lastCheck) {
      setLastChecked(new Date(lastCheck));
    }
    
    // بررسی اولیه برای آپدیت اجباری
    if (shouldForceUpdate()) {
      setUpdateAvailable(true);
      setShowUpdateModal(true);
      addLog('آپدیت اجباری مورد نیاز است');
    }
    
    // بررسی اگر نسخه جدید دیده نشده
    if (!hasSeenCurrentVersion()) {
      setShowUpdateModal(true);
      markAsSeen();
    }
  }, []);

  const addLog = (message) => {
    setUpdateLogs(prev => [
      ...prev,
      { 
        id: Date.now(),
        time: new Date().toLocaleTimeString('fa-IR'), 
        message,
        type: 'info'
      }
    ]);
  };

  const addErrorLog = (message) => {
    setUpdateLogs(prev => [
      ...prev,
      { 
        id: Date.now(),
        time: new Date().toLocaleTimeString('fa-IR'), 
        message,
        type: 'error'
      }
    ]);
  };

  // نمایش toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
        setToastType('success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    playClick();
  };

  // تابع بررسی آپدیت
  const handleCheckForUpdates = async (manual = true) => {
    try {
      setCheckingUpdate(true);
      setUpdateStatus('checking');
      addLog('در حال بررسی آپدیت...');
      
      if (manual) {
        playClick();
        clickVibrate();
      }

      const result = await checkForUpdate();
      
      // ذخیره تاریخچه بررسی
      const checkRecord = {
        timestamp: new Date().toISOString(),
        hasUpdate: result.hasUpdate,
        currentVersion,
        latestVersion: result.latestVersion,
        success: !result.error
      };
      
      const newHistory = [checkRecord, ...updateHistory.slice(0, 9)];
      setUpdateHistory(newHistory);
      localStorage.setItem('updateCheckHistory', JSON.stringify(newHistory));
      localStorage.setItem('lastUpdateCheck', new Date().toISOString());
      setLastChecked(new Date());
      
      if (result.error) {
        showToast('خطا در اتصال به سرور', 'error');
        addErrorLog('خطا در اتصال به سرور');
        return;
      }

      if (result.hasUpdate) {
        setUpdateAvailable(true);
        setUpdateInfo(result.data);
        if (manual) {
          setShowUpdateModal(true);
          addLog(`نسخه جدید ${result.latestVersion} یافت شد`);
          showToast(`نسخه جدید ${result.latestVersion} موجود است`, 'info');
        }
      } else if (manual) {
        showToast('برنامه به‌روز است! ✅', 'success');
        addLog('برنامه به‌روز است');
      }

    } catch (error) {
      console.error('Error checking update:', error);
      showToast('خطا در بررسی آپدیت', 'error');
      addErrorLog(`خطا: ${error.message}`);
    } finally {
      setCheckingUpdate(false);
      setUpdateStatus('idle');
    }
  };

  // شبیه‌سازی فرآیند دانلود و نصب
  const simulateUpdate = () => {
    setUpdateStatus('downloading');
    setUpdateProgress(0);
    addLog('شروع دانلود آپدیت...');

    const downloadInterval = setInterval(() => {
      setUpdateProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress >= 100) {
          clearInterval(downloadInterval);
          setUpdateProgress(100);
          addLog('دانلود کامل شد');
          
          // شروع نصب
          setTimeout(() => {
            setUpdateStatus('installing');
            addLog('در حال نصب آپدیت...');
            
            setTimeout(() => {
              setUpdateStatus('done');
              addLog('نصب با موفقیت انجام شد');
              
              // به‌روزرسانی نسخه در localStorage
              localStorage.setItem('appVersion', updateInfo?.version || changelogData.version);
              
              // ریلود بعد از 3 ثانیه
              setTimeout(() => {
                window.location.reload();
              }, 3000);
              
            }, 2000);
          }, 1000);
          
          return 100;
        }
        
        // اضافه کردن لاگ‌های پیشرفت
        if (newProgress >= 25 && newProgress < 30) {
          addLog('در حال دانلود فایل‌های اصلی...');
        } else if (newProgress >= 50 && newProgress < 55) {
          addLog('در حال دریافت داده‌ها...');
        } else if (newProgress >= 75 && newProgress < 80) {
          addLog('در حال بررسی یکپارچگی فایل‌ها...');
        }
        
        return newProgress;
      });
    }, 300);
  };

  // تابع اصلی برای شروع آپدیت
  const handleUpdateNow = () => {
    playSelect();
    clickVibrate();
    
    if (updateInfo?.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_blank');
      showToast('صفحه دانلود باز شد', 'info');
    } else {
      simulateUpdate();
    }
  };

  // تابع برای آپدیت مستقیم از گیت‌هاب
  const handleGitHubUpdate = () => {
    window.open('https://github.com/your-username/your-repo/releases', '_blank');
    showToast('صفحه ریلیزهای گیت‌هاب باز شد', 'info');
  };

  const handleSettingChange = (key, value) => {
    playSelect();
    clickVibrate();
    updateSetting(key, value);
    
    if (key === 'fontFamily') {
      showToast(`فونت به ${value === 'vazir' ? 'وزیر' : 'استعداد'} تغییر کرد`);
    } else if (key === 'soundEnabled') {
      showToast(`صدا ${value ? 'فعال' : 'غیرفعال'} شد`);
    } else if (key === 'vibrationEnabled') {
      showToast(`لرزش ${value ? 'فعال' : 'غیرفعال'} شد`);
    }
  };

  const handleThemeChange = (newTheme) => {
    playSelect();
    clickVibrate();
    setTheme(newTheme);
    
    const themeNames = {
      light: 'روشن',
      dark: 'تاریک',
      system: 'سیستم'
    };
    showToast(`تم به ${themeNames[newTheme]} تغییر کرد`);
  };

  const handleSoundTest = () => {
    if (settings.soundEnabled) {
      playSuccess();
      clickVibrate();
      showToast('صدای تست پخش شد');
    } else {
      showToast('لطفاً اول صدا را فعال کنید', 'error');
    }
  };

  const handleVibrationTest = () => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
      playSelect();
      showToast('لرزش تست شد');
    } else {
      showToast('لرزش غیرفعال است یا پشتیبانی نمی‌شود', 'error');
    }
  };

  const handleResetAll = () => {
    if (showResetConfirm) {
      resetSettings();
      setShowResetConfirm(false);
      playSuccess();
      showToast('همه تنظیمات بازنشانی شدند');
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
          theme
        },
        changelog: changelogData,
        exportedAt: new Date().toLocaleString('fa-IR'),
        version: changelogData.version,
        timestamp: Date.now(),
        updateHistory,
        lastChecked: lastChecked?.toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تنظیمات-آزمون-سیاسی-${changelogData.version}-${Date.now()}.json`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      playSuccess();
      showToast('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Error exporting settings:', error);
      playError();
      showToast('خطا در ذخیره تنظیمات', 'error');
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
          Object.keys(importedSettings.settings).forEach(key => {
            if (key !== 'theme' && settings.hasOwnProperty(key)) {
              updateSetting(key, importedSettings.settings[key]);
            }
          });
          
          if (importedSettings.settings.theme) {
            setTheme(importedSettings.settings.theme);
          }
          
          playSuccess();
          showToast('تنظیمات با موفقیت وارد شد');
          setShowDataManagement(false);
        } else {
          throw new Error('فرمت فایل نامعتبر است');
        }
      } catch (error) {
        console.error('Error importing settings:', error);
        playError();
        showToast('خطا در وارد کردن تنظیمات', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearCache = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید کش برنامه را پاک کنید؟ این عمل قابل بازگشت نیست.')) {
      try {
        localStorage.removeItem('theme');
        localStorage.removeItem('appSettings');
        localStorage.removeItem('updateCheckHistory');
        localStorage.removeItem('lastUpdateCheck');
        localStorage.removeItem('lastSeenChangelogVersion');
        showToast('کش برنامه پاک شد');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error clearing cache:', error);
        showToast('خطا در پاک کردن کش', 'error');
      }
    }
  };

  const handleClearUpdateLogs = () => {
    setUpdateLogs([]);
    showToast('لاگ‌های آپدیت پاک شدند');
  };

  const handleSaveChanges = () => {
    playSuccess();
    clickVibrate();
    showToast('تغییرات ذخیره شدند');
  };

  // کامپوننت وضعیت آپدیت
  const UpdateStatusCard = () => (
    <div className="setting-card update-status">
      <div className="setting-card-header">
        <div className="setting-icon primary">
          <Cloud size={24} />
        </div>
        <div className="setting-info">
          <h3 className="setting-title">مدیریت آپدیت</h3>
          <p className="setting-description">بررسی و نصب نسخه‌های جدید</p>
        </div>
      </div>
      
      <div className="update-status-content">
        <div className="version-info-grid">
          <div className="version-item">
            <span className="version-label">نسخه فعلی:</span>
            <span className="version-value current">{currentVersion}</span>
          </div>
          
          {updateInfo && (
            <div className="version-item">
              <span className="version-label">آخرین نسخه:</span>
              <span className="version-value latest">{updateInfo.version}</span>
            </div>
          )}
          
          {lastChecked && (
            <div className="version-item">
              <span className="version-label">آخرین بررسی:</span>
              <span className="version-value date">
                {new Date(lastChecked).toLocaleDateString('fa-IR')}
              </span>
            </div>
          )}
        </div>
        
        <div className="update-controls">
          <button 
            className={`check-update-btn ${checkingUpdate ? 'loading' : ''} ${updateAvailable ? 'has-update' : ''}`}
            onClick={() => handleCheckForUpdates(true)}
            disabled={checkingUpdate}
          >
            {checkingUpdate ? (
              <>
                <div className="spinner"></div>
                در حال بررسی...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                {updateAvailable ? 'بررسی مجدد' : 'بررسی آپدیت'}
              </>
            )}
          </button>
          
          {updateAvailable && (
            <button 
              className="view-update-btn"
              onClick={() => setShowUpdateModal(true)}
            >
              <GitPullRequest size={18} />
              مشاهده آپدیت
            </button>
          )}
          
          <button 
            className="github-btn"
            onClick={handleGitHubUpdate}
            title="مشاهده در گیت‌هاب"
          >
            <GitBranch size={18} />
            گیت‌هاب
          </button>
        </div>
        
        {updateHistory.length > 0 && (
          <div className="update-history">
            <div className="history-header">
              <Clock size={16} />
              <span>تاریخچه بررسی‌ها</span>
            </div>
            <div className="history-list">
              {updateHistory.slice(0, 3).map((record, index) => (
                <div key={index} className={`history-item ${record.success ? 'success' : 'error'}`}>
                  <span className="history-date">
                    {new Date(record.timestamp).toLocaleDateString('fa-IR')}
                  </span>
                  <span className="history-status">
                    {record.hasUpdate ? 'آپدیت موجود' : 'به‌روز'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // مودال آپدیت
  const UpdateModal = () => {
    if (!showUpdateModal) return null;

    const isForceUpdate = shouldForceUpdate();
    const updateData = updateInfo || changelogData;
    const changesToShow = showFullChangelog ? 
      updateData.changes : 
      updateData.changes.slice(0, 5);

    return (
      <div className="modal-overlay">
        <div className="update-modal">
          <div className="modal-header">
            <div className="modal-title">
              <div className="title-icon">
                {isForceUpdate ? '⚠️' : '🔄'}
              </div>
              <div>
                <h3>{isForceUpdate ? 'آپدیت اجباری' : 'آپدیت جدید'}</h3>
                <p className="modal-subtitle">
                  نسخه {updateData.version} • انتشار: {updateData.releaseDate}
                </p>
              </div>
            </div>
            {!isForceUpdate && (
              <button 
                className="close-modal"
                onClick={() => {
                  setShowUpdateModal(false);
                  playClick();
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>
          
          <div className="modal-body">
            <div className="version-comparison">
              <div className="version-comparison-item">
                <div className="version-label">فعلی</div>
                <div className="version-badge old">{currentVersion}</div>
              </div>
              <div className="version-arrow">
                <span>→</span>
              </div>
              <div className="version-comparison-item">
                <div className="version-label">جدید</div>
                <div className="version-badge new">{updateData.version}</div>
              </div>
            </div>
            
            <div className="update-details">
              {isForceUpdate && (
                <div className="force-update-warning">
                  <AlertTriangle size={20} />
                  <span>این آپدیت برای ادامه کار با برنامه ضروری است.</span>
                </div>
              )}
              
              <div className="changelog-section">
                <div className="section-header">
                  <h4>تغییرات</h4>
                  {updateData.changes.length > 5 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowFullChangelog(!showFullChangelog)}
                    >
                      {showFullChangelog ? 'نمایش کمتر' : 'نمایش همه'}
                    </button>
                  )}
                </div>
                
                <div className="changelog-list">
                  {changesToShow.map((change, index) => (
                    <div key={index} className={`changelog-item ${change.type}`}>
                      <div className="changelog-icon">
                        {change.type === 'new' ? '🆕' : 
                         change.type === 'improved' ? '✨' : 
                         change.type === 'fixed' ? '🐛' : '📝'}
                      </div>
                      <div className="changelog-text">{change.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {updateStatus !== 'idle' && (
                <div className="update-progress-section">
                  <div className="progress-header">
                    <span>
                      {updateStatus === 'checking' ? 'در حال بررسی...' :
                       updateStatus === 'downloading' ? 'در حال دانلود...' :
                       updateStatus === 'installing' ? 'در حال نصب...' :
                       updateStatus === 'done' ? 'تکمیل شد!' : 'در حال پردازش...'}
                    </span>
                    <span className="progress-percent">{Math.round(updateProgress)}%</span>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${updateProgress}%` }}
                    ></div>
                  </div>
                  
                  {updateLogs.length > 0 && (
                    <div className="update-logs">
                      <div className="logs-header">
                        <span>لاگ آپدیت</span>
                        <button 
                          className="clear-logs-btn"
                          onClick={handleClearUpdateLogs}
                        >
                          پاک کردن
                        </button>
                      </div>
                      <div className="logs-container">
                        {updateLogs.slice(-5).map((log) => (
                          <div key={log.id} className={`log-entry ${log.type}`}>
                            <span className="log-time">[{log.time}]</span>
                            <span className="log-message">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            {updateStatus === 'idle' ? (
              <div className="update-actions">
                <button 
                  className="primary-button update-now-btn"
                  onClick={handleUpdateNow}
                >
                  <Download size={18} />
                  {isForceUpdate ? 'آپدیت اجباری' : 'آپدیت کن'}
                </button>
                
                {updateData.downloadUrl && (
                  <button 
                    className="secondary-button"
                    onClick={() => window.open(updateData.downloadUrl, '_blank')}
                  >
                    <ExternalLink size={18} />
                    دانلود مستقیم
                  </button>
                )}
                
                {!isForceUpdate && (
                  <button 
                    className="tertiary-button"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    بعداً
                  </button>
                )}
              </div>
            ) : updateStatus === 'done' ? (
              <div className="update-success-message">
                <Check size={24} />
                <div>
                  <div className="success-title">آپدیت با موفقیت نصب شد!</div>
                  <div className="success-subtitle">برنامه در حال ریلود است...</div>
                </div>
              </div>
            ) : (
              <div className="updating-message">
                <div className="spinner"></div>
                <span>
                  {updateStatus === 'downloading' ? 'در حال دانلود آپدیت...' :
                   updateStatus === 'installing' ? 'در حال نصب آپدیت...' :
                   'در حال پردازش...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // کامپوننت Toast
  const Toast = () => {
    if (!toastMessage) return null;
    
    return (
      <div className={`toast ${toastType}`}>
        <div className="toast-icon">
          {toastType === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
        </div>
        <div className="toast-message">{toastMessage}</div>
      </div>
    );
  };

  // تنظیمات تم
  const themeOptions = [
    { id: 'light', icon: <Sun size={18} />, label: 'روشن' },
    { id: 'dark', icon: <Moon size={18} />, label: 'تاریک' },
    { id: 'system', icon: <Monitor size={18} />, label: 'سیستم' },
  ];

  const fontOptions = [
    { id: 'estedad', label: 'استعداد' },
    { id: 'vazir', label: 'وزیر' },
  ];

  return (
    <div className="app-container">
      <Toast />
      <UpdateModal />

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
              {updateAvailable && (
                <button 
                  className="icon-button update-notification"
                  onClick={() => setShowUpdateModal(true)}
                  title="آپدیت جدید"
                >
                  <AlertTriangle size={20} />
                  <span className="notification-badge"></span>
                </button>
              )}
              
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

          {/* کارت وضعیت آپدیت */}
          <UpdateStatusCard />

          {/* مدیریت داده‌ها */}
          {showDataManagement && (
            <div className="setting-card warning">
              <div className="setting-card-header">
                <div className="setting-icon warning">
                  <HardDrive size={24} />
                </div>
                <div className="setting-info">
                  <h3 className="setting-title">مدیریت داده‌ها</h3>
                  <p className="setting-description">وارد کردن، خروجی گرفتن و مدیریت داده‌ها</p>
                </div>
              </div>
              
              <div className="data-management-section">
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">وارد کردن تنظیمات</span>
                    <span className="option-hint">بارگذاری تنظیمات از فایل JSON</span>
                  </div>
                  <div className="file-upload-group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      style={{ display: 'none' }}
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
                    <span className="option-hint">ذخیره تنظیمات فعلی در فایل</span>
                  </div>
                  <button 
                    className="secondary-button"
                    onClick={handleExportSettings}
                  >
                    <Download size={16} />
                    دانلود تنظیمات
                  </button>
                </div>

                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">پاک کردن کش</span>
                    <span className="option-hint">حذف تمام داده‌های ذخیره شده محلی</span>
                  </div>
                  <button 
                    className="danger-button"
                    onClick={handleClearCache}
                  >
                    <Trash2 size={16} />
                    پاک کردن کش
                  </button>
                </div>

                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">پاک کردن لاگ‌ها</span>
                    <span className="option-hint">حذف تاریخچه لاگ‌های آپدیت</span>
                  </div>
                  <button 
                    className="tertiary-button"
                    onClick={handleClearUpdateLogs}
                  >
                    <FileText size={16} />
                    پاک کردن لاگ‌ها
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    <span className="option-hint">انتخاب حالت روشن یا تاریک</span>
                  </div>
                  <div className="theme-options">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`theme-option ${theme === option.id ? 'active' : ''}`}
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
                        className={`font-option ${settings.fontFamily === option.id ? 'active' : ''}`}
                        onClick={() => handleSettingChange('fontFamily', option.id)}
                        style={{
                          fontFamily: option.id === 'vazir' ? 'Vazirmatn, sans-serif' : 'Estedad, sans-serif'
                        }}
                      >
                        {option.label}
                        {settings.fontFamily === option.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
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
                    <span className="option-hint">فعال/غیرفعال کردن صداها</span>
                  </div>
                  <div 
                    className={`toggle ${settings.soundEnabled ? 'active' : ''}`}
                    onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                  >
                    <div className="toggle-handle" />
                  </div>
                </div>

                {/* بلندی صدا */}
                {settings.soundEnabled && (
                  <div className="setting-option">
                    <div className="option-label">
                      <span className="option-name">بلندی صدا</span>
                      <span className="option-hint">تنظیم میزان بلندی صداها</span>
                    </div>
                    <div className="volume-slider">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.soundVolume * 100}
                        onChange={(e) => handleSettingChange('soundVolume', parseInt(e.target.value) / 100)}
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
                    {settings.soundEnabled ? 'تست صدا 🔊' : 'صدا غیرفعال است 🔇'}
                  </button>
                </div>

                {/* فعال/غیرفعال لرزش */}
                <div className="setting-option">
                  <div className="option-label">
                    <span className="option-name">لرزش</span>
                    <span className="option-hint">فیدبک لمسی هنگام تعامل</span>
                  </div>
                  <div 
                    className={`toggle ${settings.vibrationEnabled ? 'active' : ''}`}
                    onClick={() => handleSettingChange('vibrationEnabled', !settings.vibrationEnabled)}
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
                    {settings.vibrationEnabled ? 'تست لرزش 📱' : 'لرزش غیرفعال است'}
                  </button>
                </div>
              </div>
            </div>

            {/* درباره برنامه */}
            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Info size={24} />
                </div>
                <div className="setting-info">
                  <h3 className="setting-title">درباره برنامه</h3>
                  <p className="setting-description">اطلاعات نسخه و تغییرات</p>
                </div>
              </div>
              
              <div className="app-info-section">
                <div className="version-info">
                  <div className="version-header">
                    <span className="version-label">نسخه فعلی</span>
                    <span className="version-badge">{changelogData.version}</span>
                  </div>
                  <div className="version-date">
                    <span className="date-label">تاریخ انتشار</span>
                    <span className="date-value">{changelogData.releaseDate}</span>
                  </div>
                </div>

                <div className="changelog-preview">
                  <div className="preview-header">
                    <h4>تغییرات اخیر</h4>
                    <button 
                      className="view-all-btn"
                      onClick={() => setShowFullChangelog(true)}
                    >
                      مشاهده همه
                    </button>
                  </div>
                  <div className="changelog-list">
                    {changelogData.changes.slice(0, 3).map((change, index) => (
                      <div key={index} className={`changelog-item ${change.type}`}>
                        <span className="changelog-type">
                          {change.type === 'new' ? '🆕' : 
                           change.type === 'improved' ? '✨' : '🐛'}
                        </span>
                        <span className="changelog-text">{change.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-info-grid">
                  <div className="info-item">
                    <span className="info-label">سازنده</span>
                    <span className="info-value">تیم پُلی تست</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">لایسنس</span>
                    <span className="info-value">MIT Open Source</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">وب‌سایت</span>
                    <button 
                      className="info-value link"
                      onClick={() => {
                        playClick();
                        clickVibrate();
                        window.open('https://politest.ir', '_blank');
                      }}
                    >
                      پُلی تست
                      <ExternalLink size={18} />
                    </button>
                  </div>
                  <div className="info-item">
                    <span className="info-label">گیت‌هاب</span>
                    <button 
                      className="info-value link"
                      onClick={() => {
                        playClick();
                        clickVibrate();
                        window.open('https://github.com/your-repo', '_blank');
                      }}
                    >
                      مخزن کد
                      <ExternalLink size={18} />
                    </button>
                  </div>
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
                    <p className="setting-description">همه تنظیمات به حالت اولیه باز می‌گردند</p>
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
  );
};

export default Settings;