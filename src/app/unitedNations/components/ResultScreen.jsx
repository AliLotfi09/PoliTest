import React, { useRef, useEffect } from 'react';
import { typeMeta } from '../data/questions';
import { Link } from 'react-router-dom';

const ResultScreen = ({
  primaryType,
  percentages,
  matchPercentage,
  onDownloadImage,
  onShareResult,
  onRestartTest
}) => {
  const chartRef = useRef(null);
  const shareableContentRef = useRef(null);
  const chartInstance = useRef(null);

  const leaderInfo = typeMeta[primaryType] || typeMeta.strategic;

  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return;

      try {
        const Chart = (await import('chart.js/auto')).default;
        
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const labels = ["دیپلمات", "کاریزماتیک", "استراتژیک", "اقتدارگرا", "تحلیل‌گر"];
        const data = [
          allPercentages.diplomatic,
          allPercentages.charismatic,
          allPercentages.strategic,
          allPercentages.authoritarian,
          allPercentages.logical
        ];

        chartInstance.current = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "درصدهای شما",
              data: data,
              backgroundColor: '#3498db',
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            }
          }
        });
      } catch (error) {
        console.error('خطا در بارگذاری نمودار:', error);
      }
    };

    loadChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [percentages]);

  const allPercentages = {
    diplomatic: percentages.diplomatic || 0,
    charismatic: percentages.charismatic || 0,
    strategic: percentages.strategic || 0,
    authoritarian: percentages.authoritarian || 0,
    logical: percentages.logical || 0
  };

  const typeLabel = (key) => {
    switch (key) {
      case "diplomatic": return "دیپلمات";
      case "charismatic": return "کاریزماتیک";
      case "strategic": return "استراتژیک";
      case "authoritarian": return "اقتدارگرا";
      case "logical": return "تحلیل‌گر";
      default: return key;
    }
  };

  return (
    <div className="result-wrapper">
      <div id="shareableContent" ref={shareableContentRef}>
        <div className="result-header">
          <img className="result-image" src={leaderInfo.img} alt={leaderInfo.name} />
          <div className="result-name">{leaderInfo.name}</div>
          <div className="result-title">{leaderInfo.title}</div>
        </div>

        <div className="match-container">
          <div className="match-score">{matchPercentage}%</div>
          <div className="match-label">درصد تطابق</div>
        </div>

        <div className="result-description">{leaderInfo.desc}</div>

        <div className="traits-grid">
          {['diplomatic', 'charismatic', 'strategic', 'authoritarian']
            .map(key => (
              <div key={key} className="trait-item">
                <div className="trait-name">{typeLabel(key)}</div>
                <div className="trait-bar">
                  <div 
                    className="trait-fill" 
                    style={{ width: `${allPercentages[key]}%` }}
                  ></div>
                </div>
                <div className="trait-score">{allPercentages[key]}%</div>
              </div>
            ))}
        </div>
      </div>

      <div className="personality-chart-container">
        <h3 className="chart-title">نمودار شخصیتی شما</h3>
        <div className="chart-wrapper">
          <canvas ref={chartRef} id="personalityChart"></canvas>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={onDownloadImage}>
          دانلود به صورت تصویر
        </button>
        <button className="action-btn" onClick={onShareResult}>
          کپی نتیجه
        </button>
        <button className="action-btn secondary" onClick={onRestartTest}>
          آزمون دوباره
        </button>
        <Link to="/">
          <button className="action-btn secondary">
            برگشت به صفحه اصلی
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResultScreen;