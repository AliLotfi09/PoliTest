// // pages/Settings.jsx
// import React, { useState } from 'react';
// import AdvancedBottomNavigation from '../components/BottomNavigation';
// import "../styles/App.css"
// import { changelogData } from '../data/changelogData';


// const Settings = () => {
//   const [settings, setSettings] = useState({
//     darkMode: false,
//     fontSize: 'medium',
//   });

//   const handleSettingChange = (key, value) => {
//     setSettings(prev => ({ ...prev, [key]: value }));
//   };

//   const handleReset = () => {
//     if (window.confirm('آیا مطمئن هستید؟ همه تنظیمات به حالت اولیه باز می‌گردند.')) {
//       setSettings({
//         darkMode: false,
//         fontSize: 'medium',
//       });
//     }
//   };

//   const handleExport = () => {
//     const data = {
//       settings,
//       exportedAt: new Date().toLocaleString('fa-IR'),
//       version: changelogData.version
//     };
    
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `تنظیمات-آزمون-سیاسی-${changelogData.version}.json`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
    
//     alert('تنظیمات با موفقیت ذخیره شدند.');
//   };

//   return (
//     <div className="app-container">
//       <div className="container">
//         <div className="settings-container">
//           {/* هدر */}
//           <div className="settings-header">
//             <div className="header-content">
//               <h1 className="settings-title">تنظیمات</h1>
//               <p className="settings-subtitle">تجربه خود را شخصی‌سازی کنید</p>
//             </div>
//             <div className="header-actions">
//               <button className="icon-button" onClick={handleExport} title="خروجی گرفتن">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </button>
//               <button className="icon-button" onClick={handleReset} title="بازنشانی">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* تنظیمات اصلی */}
//           <div className="settings-grid">
//             {/* تنظیمات نمایش */}
//             <div className="setting-card">
//               <div className="setting-card-header">
//                 <div className="setting-icon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </div>
//                 <div className="setting-info">
//                   <h3 className="setting-title">ظاهر</h3>
//                   <p className="setting-description">تنظیمات ظاهری برنامه</p>
//                 </div>
//               </div>
              
//               <div className="setting-options">
//                 <div className="setting-option">
//                   <div className="option-label">
//                     <span className="option-name">حالت تاریک</span>
//                     <span className="option-hint">برای استفاده در محیط‌های کم نور</span>
//                   </div>
//                   <div className={`toggle ${settings.darkMode ? 'active' : ''}`} 
//                        onClick={() => {
//                          handleSettingChange('darkMode', !settings.darkMode);
//                          if (!settings.darkMode) {
//                            document.documentElement.setAttribute('data-theme', 'dark');
//                          } else {
//                            document.documentElement.removeAttribute('data-theme');
//                          }
//                        }}>
//                     <div className="toggle-handle" />
//                   </div>
//                 </div>

//                 <div className="setting-option">
//                   <div className="option-label">
//                     <span className="option-name">اندازه قلم</span>
//                     <span className="option-hint">خوانایی متن را تنظیم کنید</span>
//                   </div>
//                   <div className="size-options">
//                     {[
//                       { value: 'small', label: 'کوچک' },
//                       { value: 'medium', label: 'متوسط' },
//                       { value: 'large', label: 'بزرگ' }
//                     ].map(size => (
//                       <button
//                         key={size.value}
//                         className={`size-option ${settings.fontSize === size.value ? 'active' : ''}`}
//                         onClick={() => handleSettingChange('fontSize', size.value)}
//                       >
//                         {size.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="setting-option">
//                   <div className="option-label">
//                     <span className="option-name">ترتیب نمایش</span>
//                     <span className="option-hint">چینش المان‌های صفحه</span>
//                   </div>
//                   <div className="layout-options">
//                     <button className="layout-option active">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                         <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
//                         <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
//                         <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
//                         <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
//                       </svg>
//                       <span>شبکه‌ای</span>
//                     </button>
//                     <button className="layout-option">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                         <rect x="3" y="3" width="18" height="7" stroke="currentColor" strokeWidth="2"/>
//                         <rect x="3" y="14" width="18" height="7" stroke="currentColor" strokeWidth="2"/>
//                       </svg>
//                       <span>لیستی</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* تنظیمات زبان */}
//             <div className="setting-card">
//               <div className="setting-card-header">
//                 <div className="setting-icon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//                     <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 </div>
//                 <div className="setting-info">
//                   <h3 className="setting-title">زبان</h3>
//                   <p className="setting-description">انتخاب زبان برنامه</p>
//                 </div>
//               </div>
              
//               <div className="language-disabled">
//                 <div className="disabled-overlay">
//                   <div className="disabled-icon">
//                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//                       <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
//                       <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                   </div>
//                   <h4>در دست طراحی</h4>
//                   <p>این بخش در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
//                 </div>
                
//                 {/* نمایش نمونه زبان‌ها (غیرفعال) */}
//                 <div className="language-preview">
//                   {[
//                     { code: 'fa', name: 'فارسی', native: 'پارسی', disabled: true },
//                     { code: 'en', name: 'English', native: 'English', disabled: true },
//                   ].map(lang => (
//                     <div key={lang.code} className={`language-preview-item ${lang.disabled ? 'disabled' : ''}`}>
//                       <div className="language-preview-content">
//                         <span className="language-preview-name">{lang.name}</span>
//                         <span className="language-preview-native">{lang.native}</span>
//                       </div>
//                       <div className="language-preview-badge">
//                         به زودی
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* تنظیمات صدا */}
//             <div className="setting-card">
//               <div className="setting-card-header">
//                 <div className="setting-icon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </div>
//                 <div className="setting-info">
//                   <h3 className="setting-title">صدا</h3>
//                   <p className="setting-description">تنظیمات صوتی برنامه</p>
//                 </div>
//               </div>
              
//               <div className="sound-disabled">
//                 <div className="disabled-overlay">
//                   <div className="disabled-icon">
//                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//                       <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
//                   <h4>نیاز به بررسی</h4>
//                   <p>برای پیاده‌سازی این بخش به پکیج‌های صوتی نیاز است.</p>
                  
//                   <div className="package-suggestions">
//                     <h5>پیشنهادات پکیج:</h5>
//                     <ul>
//                       <li>howler.js - برای مدیریت صداها</li>
//                       <li>react-sound - کامپوننت‌های صوتی React</li>
//                       <li>wavesurfer.js - برای ویجت‌های صوتی</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* اطلاعات برنامه */}
//             <div className="setting-card">
//               <div className="setting-card-header">
//                 <div className="setting-icon">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//                     <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 </div>
//                 <div className="setting-info">
//                   <h3 className="setting-title">درباره برنامه</h3>
//                   <p className="setting-description">اطلاعات نسخه و تغییرات</p>
//                 </div>
//               </div>
              
//               <div className="app-info-section">
//                 <div className="version-info">
//                   <div className="version-header">
//                     <span className="version-label">نسخه فعلی</span>
//                     <span className="version-badge">{changelogData.version}</span>
//                   </div>
//                   <div className="version-date">
//                     <span className="date-label">تاریخ انتشار</span>
//                     <span className="date-value">{changelogData.releaseDate}</span>
//                   </div>
//                 </div>

//                 <div className="changelog-preview">
//                   <h4>تغییرات اخیر:</h4>
//                   <div className="changelog-list">
//                     {changelogData.changes.map((change, index) => (
//                       <div key={index} className="changelog-item">
//                         <span className={`changelog-type ${change.type}`}>
//                           {change.type === 'new' ? '🆕' : 
//                            change.type === 'improved' ? '✨' : '🐛'}
//                         </span>
//                         <span className="changelog-text">{change.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="app-links">
//                   <button className="app-link-button">
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                       <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                       <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                       <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                     مشاهده تمام تغییرات
//                   </button>
//                   <button className="app-link-button">
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                       <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                       <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                       <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                     پشتیبانی
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* دکمه ذخیره */}
//           <div className="save-button-container">
//             <button className="save-button" onClick={() => alert('تنظیمات ذخیره شدند.')}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <line x1="7" y1="3" x2="7" y2="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               ذخیره تنظیمات
//             </button>
//           </div>
//         </div>
//       </div>
//       <AdvancedBottomNavigation />
//     </div>
//   );
// };

// export default Settings;


// pages/Settings.jsx
import React from 'react';
import AdvancedBottomNavigation from '../components/BottomNavigation';
import "../styles/App.css"

const Settings = () => {
  return (
    <div className="app-container">
      <div className="container">
        <div className="settings-container">
          {/* هدر */}
          <div className="settings-header">
            <div className="header-content">
              <h1 className="settings-title">تنظیمات</h1>
              <p className="settings-subtitle">به زودی در دسترس خواهد بود</p>
            </div>
          </div>

          {/* محتوای اصلی - حالت در دست توسعه */}
          <div className="development-mode">
            <div className="development-content">
              <div className="development-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                    stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              
              <h2 className="development-title">در دست توسعه</h2>
              
              <p className="development-message">
                صفحه تنظیمات در حال توسعه است و به زودی با ویژگی‌های جدید در دسترس قرار خواهد گرفت.
              </p>
              
              <div className="coming-features">
                <h3>ویژگی‌های در حال توسعه:</h3>
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon">⚙️</div>
                    <div className="feature-text">
                      <strong>تنظیمات ظاهر</strong>
                      <span>حالت تاریک، اندازه قلم و چیدمان</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🌐</div>
                    <div className="feature-text">
                      <strong>زبان‌های مختلف</strong>
                      <span>پشتیبانی از چندین زبان</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔊</div>
                    <div className="feature-text">
                      <strong>تنظیمات صدا</strong>
                      <span>صداهای سیستم و نوتیفیکیشن</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <div className="feature-text">
                      <strong>مدیریت داده</strong>
                      <span>خروجی گرفتن و پشتیبان‌گیری</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-info">
                  <span className="progress-label">پیشرفت توسعه</span>
                  <span className="progress-percent">۶۰٪</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="estimated-time">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>تخمین زمان انتشار: ۲ هفته دیگر</span>
              </div>

              {/* <button 
                className="notification-button"
                onClick={() => alert('وقتی تنظیمات منتشر شد به شما اطلاع می‌دهیم.')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                اطلاع‌رسانی به من
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <AdvancedBottomNavigation />
    </div>
  );
};

export default Settings;