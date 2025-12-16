// components/GameBoard.jsx (نسخه ساده برای عیب‌یابی)
import React, { useState, useCallback } from 'react';
import './styles/GameBoard.css';

const GameBoard = ({ 
  player1, 
  player2, 
  currentPlayer, 
  round, 
  countries, 
  onPlayCard, 
  showToast 
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const handleCardSelect = useCallback((card) => {
    const playerCards = currentPlayer === 1 ? player1.cards : player2.cards;
    if (!playerCards.find(c => c.id === card.id)) return;
    
    setSelectedCard(card);
    setSelectedCountry(null);
    showToast(`🎴 کارت ${card.name} انتخاب شد. حالا یک کشور انتخاب کنید.`);
  }, [currentPlayer, player1.cards, player2.cards, showToast]);

  const handleCountrySelect = useCallback((country) => {
    if (!selectedCard) {
      showToast("⚠️ ابتدا یک کارت انتخاب کنید");
      return;
    }
    
    if (country.controller) {
      showToast("🚫 این کشور قبلاً تصرف شده است!");
      return;
    }
    
    const confirmed = window.confirm(
      `🎯 آیا می‌خواهید کارت "${selectedCard.name}" را روی ${country.name} ${country.flag} بازی کنید؟`
    );
    
    if (confirmed) {
      onPlayCard(selectedCard, country);
      setSelectedCard(null);
      setSelectedCountry(null);
    }
  }, [selectedCard, onPlayCard, showToast]);

  // داده‌های نمونه اگر کارت‌ها تعریف نشده باشند
  const defaultCards = [
    { id: 1, name: "کمک نظامی", power: 5, icon: "💣", description: "افزایش نفوذ نظامی" },
    { id: 2, name: "دیپلماسی", power: 3, icon: "🤝", description: "افزایش نفوذ سیاسی" },
    { id: 3, name: "جاسوسی", power: 4, icon: "🕵️", description: "کاهش نفوذ حریف" },
  ];

  const getPlayerCards = () => {
    const player = currentPlayer === 1 ? player1 : player2;
    return player.cards && player.cards.length > 0 ? player.cards : defaultCards.slice(0, 3);
  };

  const getInfluencePercentage = (country) => {
    return Math.min((country.influence / country.threshold) * 100, 100);
  };

  return (
    <div className="game-board-container">
      {/* هدر بازی */}
      <div className="game-header">
        <div className="header-left">
          <div className="round-badge">
            <div className="round-label">دور</div>
            <div className="round-number">{round}</div>
          </div>
          <div>
            <h1 className="game-title">جنگ سرد</h1>
            <p className="game-subtitle">اولین نفری که ۱۰ کشور تصرف کند پیروز می‌شود</p>
          </div>
        </div>
        
        <div className="header-right">
          <div 
            className="current-turn-badge"
            style={{ 
              background: currentPlayer === 1 ? player1.color : player2.color,
              color: 'white'
            }}
          >
            <span className="turn-flag">
              {currentPlayer === 1 ? '🇺🇸' : '🚩'}
            </span>
            <span className="turn-text">
              {currentPlayer === 1 ? 'نوبت آمریکا' : 'نوبت شوروی'}
            </span>
          </div>
        </div>
      </div>

      {/* آمار بازیکنان */}
      <div className="players-stats-grid">
        {/* بازیکن ۱ */}
        <div className="player-stat-card usa-stat">
          <div className="stat-header">
            <div className="player-avatar">
              <span className="avatar-flag">🇺🇸</span>
              <div className="avatar-status" style={{ background: currentPlayer === 1 ? '#10B981' : '#EF4444' }}></div>
            </div>
            <div className="player-info">
              <div className="player-name">{player1.name}</div>
              <div className="player-status">
                {currentPlayer === 1 ? 'در حال بازی' : 'منتظر نوبت'}
              </div>
            </div>
          </div>
          
          <div className="stat-progress">
            <div className="progress-header">
              <span>کشورهای تصرف شده</span>
              <span>{player1.controlledCountries?.length || 0}/۱۰</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((player1.controlledCountries?.length || 0) / 10) * 100}%`,
                  backgroundColor: player1.color 
                }}
              ></div>
            </div>
          </div>
          
          <div className="stat-numbers">
            <div className="stat-number">
              <div className="number-label">امتیاز</div>
              <div className="number-value">{player1.points || 0}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">نفوذ</div>
              <div className="number-value">{player1.influence || 0}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">کارت‌ها</div>
              <div className="number-value">{player1.cards?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* بازیکن ۲ */}
        <div className="player-stat-card ussr-stat">
          <div className="stat-header">
            <div className="player-avatar">
              <span className="avatar-flag">🚩</span>
              <div className="avatar-status" style={{ background: currentPlayer === 2 ? '#10B981' : '#EF4444' }}></div>
            </div>
            <div className="player-info">
              <div className="player-name">{player2.name}</div>
              <div className="player-status">
                {currentPlayer === 2 ? 'در حال بازی' : 'منتظر نوبت'}
              </div>
            </div>
          </div>
          
          <div className="stat-progress">
            <div className="progress-header">
              <span>کشورهای تصرف شده</span>
              <span>{player2.controlledCountries?.length || 0}/۱۰</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((player2.controlledCountries?.length || 0) / 10) * 100}%`,
                  backgroundColor: player2.color 
                }}
              ></div>
            </div>
          </div>
          
          <div className="stat-numbers">
            <div className="stat-number">
              <div className="number-label">امتیاز</div>
              <div className="number-value">{player2.points || 0}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">نفوذ</div>
              <div className="number-value">{player2.influence || 0}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">کارت‌ها</div>
              <div className="number-value">{player2.cards?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش کشورها */}
      <div className="countries-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🗺️</span>
            کشورهای بازی
          </h2>
          <div className="section-subtitle">
            {selectedCard 
              ? `کارت "${selectedCard.name}" انتخاب شده. یک کشور انتخاب کنید.`
              : "ابتدا یک کارت انتخاب کنید."}
          </div>
        </div>
        
        <div className="countries-grid">
          {countries.map(country => {
            const isControlled = country.controller !== null;
            const isSelectable = !isControlled && selectedCard;
            
            return (
              <div
                key={country.id}
                className={`country-card ${isSelectable ? 'clickable' : ''} ${
                  selectedCountry?.id === country.id ? 'selected' : ''
                }`}
                style={{ 
                  borderColor: isControlled 
                    ? (country.controller === 1 ? player1.color : player2.color) 
                    : '#e8e8e8',
                  borderWidth: isControlled ? '3px' : '2px',
                  background: isSelectable ? '#f0f9ff' : 'white'
                }}
                onClick={() => isSelectable && handleCountrySelect(country)}
              >
                <div className="country-header">
                  <div className="country-flag">{country.flag || "🏳️"}</div>
                  <div className="country-name">{country.name}</div>
                  {isControlled && (
                    <div className="country-owner-badge">
                      {country.controller === 1 ? '🇺🇸' : '🚩'}
                    </div>
                  )}
                </div>
                
                <div className="country-stats">
                  <div className="country-stat">
                    <span className="stat-label">امتیاز:</span>
                    <span className="stat-value">{country.points}</span>
                  </div>
                  <div className="country-stat">
                    <span className="stat-label">آستانه:</span>
                    <span className="stat-value">{country.threshold}</span>
                  </div>
                </div>
                
                <div className="country-influence">
                  <div className="influence-info">
                    <span className="influence-label">نفوذ:</span>
                    <span className="influence-value">
                      {country.influence}/{country.threshold}
                    </span>
                  </div>
                  <div className="influence-bar">
                    <div 
                      className="influence-fill"
                      style={{ 
                        width: `${getInfluencePercentage(country)}%`,
                        backgroundColor: isControlled 
                          ? (country.controller === 1 ? player1.color : player2.color)
                          : '#6b7280'
                      }}
                    ></div>
                  </div>
                </div>
                
                {isSelectable && (
                  <div className="selection-indicator">
                    <div className="indicator-dot"></div>
                    <div className="indicator-text">قابل انتخاب</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* بخش کارت‌ها */}
      <div className="cards-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🃏</span>
            {currentPlayer === 1 ? 'کارت‌های آمریکا' : 'کارت‌های شوروی'}
          </h2>
          <div className="cards-count">
            {getPlayerCards().length} کارت
          </div>
        </div>
        
        <div className="cards-grid">
          {getPlayerCards().map(card => (
            <div
              key={card.id}
              className={`game-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
              onClick={() => handleCardSelect(card)}
            >
              <div className="card-icon">{card.icon || "🃏"}</div>
              <div className="card-name">{card.name}</div>
              <div className="card-power">
                <span className="power-badge">{card.power}</span>
              </div>
              <div className="card-desc">{card.description || "کارت تأثیرگذاری"}</div>
            </div>
          ))}
        </div>
        
        {selectedCard && (
          <div className="selected-card-info">
            <div className="selected-card-header">
              <span className="selected-card-label">کارت انتخاب شده:</span>
              <span className="selected-card-name">{selectedCard.name}</span>
            </div>
            <div className="selected-card-instruction">
              ⚡ حالا یک کشور از لیست بالا انتخاب کنید.
            </div>
          </div>
        )}
      </div>

      {/* راهنمای بازی */}
      <div className="game-guide">
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-number">۱</div>
            <div className="step-content">
              <div className="step-title">کارت انتخاب کنید</div>
              <div className="step-desc">یک کارت از دست خود انتخاب کنید</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">۲</div>
            <div className="step-content">
              <div className="step-title">کشور هدف</div>
              <div className="step-desc">روی کشور مورد نظر کلیک کنید</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">۳</div>
            <div className="step-content">
              <div className="step-title">اعمال نفوذ</div>
              <div className="step-desc">نفوذ خود را افزایش دهید</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;