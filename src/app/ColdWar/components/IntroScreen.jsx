import React from 'react';

const IntroScreen = ({ onStartGame }) => {
  return (
    <div className="intro-wrapper">
      <div className="intro-header">
        <div className="intro-line"></div>
        <h1 className="intro-title">جنگ سرد</h1>
        <p className="intro-subtitle">رقابت برای نفوذ جهانی</p>
      </div>

      <div className="players-preview">
        <div className="player-card usa">
          <div className="player-flag">🇺🇸</div>
          <div className="player-name">آمریکا</div>
          <p className="player-desc">استراتژی: سرمایه‌داری و دموکراسی</p>
        </div>

        <div className="vs-divider">⚔️</div>

        <div className="player-card ussr">
          <div className="player-flag">🚩</div>
          <div className="player-name">شوروی</div>
          <p className="player-desc">استراتژی: کمونیسم و برابری</p>
        </div>
      </div>

      <div className="intro-benefits">
        <div className="benefit-item">
          <div className="benefit-check">1</div>
          <div className="benefit-text">هر بازیکن ۳ کارت دارد</div>
        </div>
        <div className="benefit-item">
          <div className="benefit-check">2</div>
          <div className="benefit-text">با کارت‌ها نفوذ خود را افزایش دهید</div>
        </div>
        <div className="benefit-item">
          <div className="benefit-check">3</div>
          <div className="benefit-text">اولین نفری که ۳ کشور تصرف کند برنده است</div>
        </div>
      </div>

      <button className="start-btn" onClick={onStartGame}>
        شروع بازی
      </button>

      <p className="intro-disclaimer">
        بازی استراتژیک دو نفره بر اساس رقابت تاریخی جنگ سرد
      </p>
    </div>
  );
};

export default IntroScreen;