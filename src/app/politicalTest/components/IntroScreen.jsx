import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen">
      <div className="intro-wrapper">
        <div className="intro-header">
          <div className="intro-line"></div>
          <div className="intro-title">
            <h1>تست شخصیت سیاسی</h1>
          </div>
          <div className="intro-subtitle">
            کشف کنید شما شبیه کدام رهبر تاریخی یا معاصر هستید
          </div>
        </div>

        <div className="intro-benefits">
          <div className="benefit-item">
            <div className="benefit-check">✓</div>
            <div className="benefit-text">
              ۱۵ سوال استراتژیک برای تحلیل شخصیت
            </div>
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

        <button className="start-btn" onClick={onStart}>
          شروع آزمون
        </button>
        {/* <Link to="/un">
          <button className="start-btn">سازمان ملل</button>
        </Link> */}
        <div className="intro-disclaimer">
          این تست صرفاً برای سرگرمی و نتایج آن واقعی نیست
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
