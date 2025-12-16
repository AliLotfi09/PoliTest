import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Brain, 
  Users, 
  Download,
  Sparkles,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';
import "../styles/App.css";

const IntroSlides = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const slides = [
    {
      id: 1,
      title: "تست شخصیت سیاسی",
      subtitle: "کشف کنید شبیه کدام رهبر هستید",
      description: "با الگوریتم پیشرفته و بر اساس روانشناسی سیاسی",
      icon: <Crown size={80} />,
      iconColor: "#000"
    },
    {
      id: 2,
      title: "۱۵ سوال هوشمند",
      subtitle: "تحلیل عمیق شخصیت",
      description: "سوالات طراحی شده توسط متخصصان روانشناسی سیاسی",
      icon: <Brain size={80} />,
      iconColor: "#000"
    },
    {
      id: 3,
      title: "تطابق با رهبران بزرگ",
      subtitle: "از کوروش تا ماندلا",
      description: "مقایسه شخصیت شما با رهبران تاریخی و معاصر",
      icon: <Users size={80} />,
      iconColor: "#000"
    },
    {
      id: 4,
      title: "نتایج اختصاصی",
      subtitle: "ذخیره و اشتراک‌گذاری",
      description: "دانلود تصویر و اشتراک نتایج در شبکه‌های اجتماعی",
      icon: <Download size={80} />,
      iconColor: "#000"
    },
    {
      id: 5,
      title: "آماده اید؟",
      subtitle: "شروع آزمون",
      description: "زمان آزمون: حدود ۳ دقیقه",
      icon: <Sparkles size={80} />,
      iconColor: "#000"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setProgress(0);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="intro-slides">
      <div 
        className="slide-background"
        style={{ background: slide.color }}
      >
        <div className="slide-content">
          <div className="slide-header">
            <button 
              className="skip-btn"
              onClick={handleSkip}
            >
              رد کردن
            </button>
            
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setProgress(0);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="slide-main">
            <div 
              className="slide-icon-container"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="slide-icon" style={{ color: slide.iconColor }}>
                {slide.icon}
              </div>
            </div>
            
            <h1 className="slide-title">{slide.title}</h1>
            
            <h2 className="slide-subtitle">{slide.subtitle}</h2>
            
            <p className="slide-description">{slide.description}</p>
          </div>

          <div className="slide-footer">
            <div className="slide-progress">
              <div className="progress-text">
                {currentSlide + 1} / {slides.length}
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="slide-controls">
              <button
                className="nav-btn prev-btn"
                onClick={handlePrev}
                disabled={currentSlide === 0}
              >
                ← قبلی
              </button>
              
              <button 
                className="next-btn"
                onClick={handleNext}
              >
                {currentSlide === slides.length - 1 ? 'شروع آزمون' : 'بعدی →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSlides;