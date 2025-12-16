// components/ResultScreen.jsx
import React from 'react';

const ResultScreen = ({ winner, player1, player2, onRestart }) => {
  const loser = winner.name === player1.name ? player2 : player1;

  return (
    <div className="result-wrapper">
      <div className="result-header">
        <div className="winner-badge" style={{ background: winner.color }}>
          {winner.name === 'آمریکا' ? '🇺🇸' : '🚩'}
        </div>
        <div className="result-name">🎉 {winner.name} برنده شد! 🎉</div>
        <div className="result-title">پیروزی در جنگ سرد</div>
      </div>

      <div className="match-container">
        <div className="match-score">{winner.controlledCountries.length}</div>
        <div className="match-label">کشور تصرف شده</div>
      </div>

      <div className="result-description">
        🏆 {winner.name} با تصرف {winner.controlledCountries.length} کشور و کسب {winner.points} امتیاز، 
        جنگ سرد را به نفع خود تمام کرد! نفوذ کل {winner.name} به {winner.influence} واحد رسید و 
        توانست برتری خود را در صحنه جهانی اثبات کند.
      </div>

      <div className="victory-stats">
        <div className="victory-stat-item">
          <div className="stat-icon">🏆</div>
          <div className="stat-label">تفاوت کشورها</div>
          <div className="stat-value">
            {Math.abs(winner.controlledCountries.length - loser.controlledCountries.length)} کشور
          </div>
        </div>
        <div className="victory-stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">تفاوت امتیاز</div>
          <div className="stat-value">
            {Math.abs(winner.points - loser.points)} امتیاز
          </div>
        </div>
        <div className="victory-stat-item">
          <div className="stat-icon">💪</div>
          <div className="stat-label">تفاوت نفوذ</div>
          <div className="stat-value">
            {Math.abs(winner.influence - loser.influence)} واحد
          </div>
        </div>
      </div>

      <div className="final-stats">
        <div 
          className="final-stat-card" 
          style={{ 
            borderColor: player1.color,
            background: player1.name === winner.name ? '#f0fdf4' : '#fff'
          }}
        >
          <div className="stat-player-name">
            <span>🇺🇸</span> {player1.name}
            {player1.name === winner.name && <span className="winner-badge-small">👑</span>}
          </div>
          <div className="stat-row">
            <span>کشورهای تصرف شده:</span>
            <span className="stat-bold">{player1.controlledCountries.length}/15</span>
          </div>
          <div className="stat-row">
            <span>امتیاز کسب شده:</span>
            <span className="stat-bold">{player1.points}</span>
          </div>
          <div className="stat-row">
            <span>نفوذ کل:</span>
            <span className="stat-bold">{player1.influence}</span>
          </div>
        </div>

        <div 
          className="final-stat-card" 
          style={{ 
            borderColor: player2.color,
            background: player2.name === winner.name ? '#fef2f2' : '#fff'
          }}
        >
          <div className="stat-player-name">
            <span>🚩</span> {player2.name}
            {player2.name === winner.name && <span className="winner-badge-small">👑</span>}
          </div>
          <div className="stat-row">
            <span>کشورهای تصرف شده:</span>
            <span className="stat-bold">{player2.controlledCountries.length}/15</span>
          </div>
          <div className="stat-row">
            <span>امتیاز کسب شده:</span>
            <span className="stat-bold">{player2.points}</span>
          </div>
          <div className="stat-row">
            <span>نفوذ کل:</span>
            <span className="stat-bold">{player2.influence}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={onRestart}>
          🎮 بازی جدید
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;