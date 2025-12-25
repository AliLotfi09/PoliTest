// pages/About.jsx
import React from "react";
import AdvancedBottomNavigation from "../components/BottomNavigation";
import "../styles/App.css";
import TermsPage from "./Terms";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: "🎯",
      title: "تحلیل دقیق",
      description:
        "با استفاده از الگوریتم‌های پیشرفته، گرایش سیاسی شما را با دقت بالا تحلیل می‌کنیم.",
    },
    {
      icon: "📊",
      title: "نتایج جامع",
      description:
        "گزارش کامل از ویژگی‌های شخصیتی سیاسی شما همراه با نمودارهای تعاملی.",
    },
    {
      icon: "🔒",
      title: "حریم خصوصی",
      description:
        "تمامی اطلاعات شما به صورت امن در دستگاه خود شما فقط ذخیره شده و با هیچ کس به اشتراک گذاشته نمی‌شود.",
    },
    {
      icon: "🔄",
      title: "بروزرسانی مستمر",
      description:
        "سوالات و الگوریتم‌ها به طور مداوم به‌روزرسانی می‌شوند تا دقیق‌ترین نتایج را ارائه دهیم.",
    },
  ];

  // const teamMembers = [
  //   {
  //     name: "دکتر مهدی لطفی",
  //     role: "متخصص علوم سیاسی",
  //     description: "طراح سوالات و تحلیل‌گر",
  //   },
  //   {
  //     name: "علی لطفی",
  //     role: "طراح وب و طراح رابط کاربری",
  //     description: "ایده پردازی و طراحی وبسایت",
  //   },
  // ];

  return (
    <div className="app-container">
      <div className="container">
        <div className="about-container">
          {/* هدر */}
          <div className="about-header">
            <div className="header-content">
              <h1 className="about-title">درباره ما</h1>
              <p className="about-subtitle">شناخت بهتر، انتخاب آگاهانه‌تر</p>
            </div>
          </div>

          {/* خلاصه */}
          <div className="about-hero">
            <div className="hero-content">
              <div className="hero-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="hero-text">
                <h2>هدف ما چیست؟</h2>
                <p>
                  ما معتقدیم خودشناسی سیاسی اولین گام برای مشارکت آگاهانه در
                  جامعه است. با ارائه ابزارهای تحلیلی پیشرفته، به شما کمک
                  می‌کنیم تا دیدگاه‌های سیاسی خود را بهتر بشناسید و درک عمیق‌تری
                  از ایدئولوژی‌های مختلف پیدا کنید.
                </p>
              </div>
            </div>
          </div>

          {/* ویژگی‌ها */}
          <div className="features-section">
            <h3 className="section-title">چه چیزی ما را متمایز می‌کند؟</h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div
                    className="feature-icon"
                    dangerouslySetInnerHTML={{
                      __html: parseEmoji(feature.icon),
                    }}
                  />
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* تیم */}
          {/* <div className="team-section">
            <h3 className="section-title">تیم ما</h3>
            <p className="section-description">
              تیمی متشکل از متخصصان حوزه‌های مختلف برای ارائه بهترین تجربه
            </p>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="#000"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">{member.name}</h4>
                    <span className="team-role">{member.role}</span>
                    <p className="team-description">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* آمار */}
          <div className="stats-section">
            <div className="stats-card">
              <h3 className="stats-title">در یک نگاه</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">۱۵,۰۰۰+</span>
                  <span className="stat-label">کاربر فعال</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">۹۸.۵٪</span>
                  <span className="stat-label">رضایت کاربران</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">۲۴</span>
                  <span className="stat-label">ساعت پشتیبانی</span>
                </div>
              </div>
            </div>
          </div>

          {/* تماس */}
          <div className="contact-section">
            <h3 className="section-title">در تماس باشید</h3>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="contact-info">
                  <h4>ایمیل</h4>
                  <p><a href="mailto:me.alidev@gmail.com">me.alidev@gmail.com</a></p>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 01 4.11 2h3a2 2 0 01 2 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 00 6 6l1.27-1.27a2 2 0 01 2.11-.45 12.84 12.84 0 00 2.81.7A2 2 0 01 22 16.92z"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="contact-info">
                  <h4>تلفن</h4>
                  <p>بزودی</p>
                </div>
              </div>
            </div>
          </div>

          {/* فوتر */}
          <div className="about-footer">
            <p>© 1404 - تمامی حقوق برای پُلی تستt محفوظ است</p>
            <div className="footer-links">
              <Link to="/terms">
              <button className="footer-link">قوانین و مقررات</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <AdvancedBottomNavigation />
    </div>
  );
};

export default About;

// import React from 'react';
// import AdvancedBottomNavigation from '../components/BottomNavigation';
// import "../styles/App.css"

// const Settings = () => {
//   return (
//     <div className="app-container">
//       <div className="container">
//         <div className="settings-container">
//           {/* هدر */}
//           <div className="settings-header">
//             <div className="header-content">
//               <h1 className="settings-title">درباره</h1>
//               <p className="settings-subtitle">به زودی در دسترس خواهد بود</p>
//             </div>
//           </div>

//           <div className="development-mode">
//             <div className="development-content">
//               <div className="development-icon">
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
//                     stroke="currentColor" strokeWidth="2"/>
//                   <path d="M12 8v4M12 16h.01"
//                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </div>

//               <h2 className="development-title">در دست توسعه</h2>

//               <p className="development-message">
//                 صفحه درباره اپ در حال توسعه است و به زودی با ویژگی‌های جدید در دسترس قرار خواهد گرفت.
//               </p>

//               <div className="progress-container">
//                 <div className="progress-info">
//                   <span className="progress-label">پیشرفت توسعه</span>
//                   <span className="progress-percent">۶۰٪</span>
//                 </div>
//                 <div className="progress-bar">
//                   <div className="progress-fill" style={{ width: '60%' }} />
//                 </div>
//               </div>

//               <div className="estimated-time">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//                   <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//                 <span>تخمین زمان انتشار: ۲ هفته دیگر</span>
//               </div>

//               {/* <button
//                 className="notification-button"
//                 onClick={() => alert('وقتی تنظیمات منتشر شد به شما اطلاع می‌دهیم.')}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                   <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//                 اطلاع‌رسانی به من
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <AdvancedBottomNavigation />
//     </div>
//   );
// };

// export default Settings;
