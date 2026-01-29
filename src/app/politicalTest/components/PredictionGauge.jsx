import React, { useMemo } from 'react';
import { calculateSimilarity, calculateUserTraits } from '../utils/calculations';
import { questions } from '../data';
import AdlyBanner from '@/components/AdlyBanner';

const PredictionGauge = ({ answers, leaders }) => {
  const answeredCount = answers.filter(a => a !== null).length;
  
  if (answeredCount < 3) {
    return (
      <div className="prediction-gauge">
        <div className="gauge-header">
          <span className="gauge-icon">🎯</span>
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

  const userTraits = calculateUserTraits(answers, questions);
  
  const predictions = leaders
    .map(leader => ({
      leader,
      similarity: calculateSimilarity(userTraits, leader.traits)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return (

    <div className="prediction-gauge">
      <div className="gauge-header">
        <span className="gauge-icon">🎯</span>
        <span className="gauge-label">پیش‌بینی فعلی</span>
      </div>
      <div className="gauge-content">
        <div className="gauge-predictions">
          {predictions.map((pred, index) => {
            const percentage = Math.round(pred.similarity * 100);
            return (
              <div key={pred.leader.name} className="prediction-item">
                <div className="prediction-rank">{index + 1}</div>
                <div className="prediction-info">
                  <div className="prediction-name">{pred.leader.name}</div>
                  <div className="prediction-title">{pred.leader.title}</div>
                </div>
                <div className="prediction-bar-container">
                  <div 
                    className="prediction-bar" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="prediction-percent">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PredictionGauge;