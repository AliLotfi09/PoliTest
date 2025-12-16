import React from 'react';
import { Link } from 'react-router-dom';

const IntroScreen = ({ onStartTest }) => {
  return (
    <div id="introScreen" className="active">
      <div className="intro-wrapper">
        <div className="intro-header">
          <div className="intro-line"></div>
          <div className="intro-title">تبریک! شما به عنوان رئیس سازمان ملل انتخاب شده اید!</div>
          <div className="intro-subtitle">در ادامه سوالاتی پیش روی شماست، ولی با کمی چاشنی طنز و شاید نتیجه نیز برایتان عجیب و غیرمنتظره باشد.</div>
        </div>

        <div className="intro-benefits">
          <div className="benefit-item">
            <div className="benefit-check">✓</div>
            <div className="benefit-text">15 سوال استراتژیک برای تحلیل شخصیت</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-check">✓</div>
            <div className="benefit-text">الگوریتم پیشرفته برای نتایج دقیق</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-check">✓</div>
            <div className="benefit-text">نتایج ذخیره شده در دستگاه شما</div>
          </div>
        </div>

        <button 
          className="start-btn" 
          onClick={onStartTest}
        >
          شروع آزمون
        </button>
        
        <Link to="/">
          <button className="start-btn secondary">
            برگشت به آزمون اصلی
          </button>
        </Link>
        
        <div className="intro-disclaimer">
          این تست صرفاً برای سرگرمی و بر اساس تحلیل شخصیت است
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;