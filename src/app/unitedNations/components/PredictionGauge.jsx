import React from 'react';

const PredictionGauge = ({ data }) => {
  const typeLabels = {
    diplomatic: "دیپلمات",
    charismatic: "کاریزماتیک",
    strategic: "استراتژیک",
    authoritarian: "اقتدارگرا",
    logical: "تحلیل‌گر"
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="prediction-gauge">
        <div className="gauge-header">
          <span className="gauge-label">پیش‌بینی فعلی</span>
        </div>
        <div className="gauge-content">
          <div className="gauge-placeholder">
            <span>پس از پاسخ به چند سوال، پیش‌بینی نمایش داده می‌شود</span>
          </div>
        </div>
      </div>
    );
  }

  const sortedPredictions = Object.entries(data)
    .map(([type, percent]) => ({ type, percent }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  return (
    <div className="prediction-gauge">
      <div className="gauge-header">
        <span className="gauge-label">پیش‌بینی فعلی</span>
      </div>
      <div className="gauge-content">
        <div className="gauge-predictions">
          {sortedPredictions.map((prediction, index) => (
            <div key={prediction.type} className="prediction-item">
              <div className="prediction-rank">{index + 1}</div>
              <div className="prediction-info">
                <div className="prediction-name">{typeLabels[prediction.type]}</div>
                <div className="prediction-title">{prediction.percent}% از انتخاب‌ها</div>
              </div>
              <div className="prediction-bar-container">
                <div 
                  className="prediction-bar" 
                  style={{ width: `${prediction.percent}%` }}
                ></div>
              </div>
              <div className="prediction-percent">{prediction.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionGauge;