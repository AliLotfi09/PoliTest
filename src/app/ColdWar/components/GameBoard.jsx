// components/GameBoard.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import '../styles/GameBoard.css';

// فایل topojson برای نقشه جهان
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// مختصات کشورها
const countryCoordinates = {
  'ایران': [53.6880, 32.4279],
  'آلمان': [10.4515, 51.1657],
  'کره': [127.7669, 35.9078],
  'کوبا': [-77.7812, 21.5218],
  'ویتنام': [108.2772, 14.0583],
  'مصر': [30.8025, 26.8206],
  'هند': [78.9629, 20.5937],
  'ترکیه': [35.2433, 38.9637],
  'برزیل': [-51.9253, -14.2350],
  'افغانستان': [67.7099, 33.9391],
  'لهستان': [19.1451, 51.9194],
  'اندونزی': [113.9213, -0.7893],
  'عراق': [43.6793, 33.2232],
  'آرژانتین': [-63.6167, -38.4161],
  'یونان': [21.8243, 39.0742]
};

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
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const handleCardSelect = useCallback((card) => {
    const playerCards = currentPlayer === 1 ? player1.cards : player2.cards;
    if (!playerCards.find(c => c.id === card.id)) return;
    
    setSelectedCard(card);
    setSelectedCountry(null);
    showToast(`🎴 کارت ${card.name} انتخاب شد. حالا روی نقشه کلیک کنید.`);
  }, [currentPlayer, player1.cards, player2.cards, showToast]);

  const handleMapClick = (geo, event) => {
    if (!selectedCard) {
      showToast("⚠️ ابتدا یک کارت انتخاب کنید");
      return;
    }

    const countryName = geo.properties.name;
    const country = countries.find(c => c.name === countryName);
    
    if (!country) {
      showToast("این کشور در بازی موجود نیست");
      return;
    }
    
    if (country.controller) {
      showToast("🚫 این کشور قبلاً تصرف شده است!");
      return;
    }
    
    setSelectedCountry(country);
    
    const confirmed = window.confirm(
      `🎯 آیا می‌خواهید کارت "${selectedCard.name}" را روی ${country.name} ${country.flag} بازی کنید؟`
    );
    
    if (confirmed) {
      onPlayCard(selectedCard, country);
      setSelectedCard(null);
      setSelectedCountry(null);
    }
  };

  const handleMarkerClick = (country) => {
    if (!selectedCard) {
      showToast("⚠️ ابتدا یک کارت انتخاب کنید");
      return;
    }
    
    if (country.controller) {
      showToast("🚫 این کشور قبلاً تصرف شده است!");
      return;
    }
    
    setSelectedCountry(country);
    
    const confirmed = window.confirm(
      `🎯 آیا می‌خواهید کارت "${selectedCard.name}" را روی ${country.name} ${country.flag} بازی کنید؟`
    );
    
    if (confirmed) {
      onPlayCard(selectedCard, country);
      setSelectedCard(null);
      setSelectedCountry(null);
    }
  };

  const getCountryColor = (country) => {
    if (!country) return "#E2E8F0";
    
    if (country.controller === 1) return player1.color;
    if (country.controller === 2) return player2.color;
    if (selectedCountry?.id === country.id) return "#FBBF24";
    
    return selectedCard ? "#93C5FD" : "#E2E8F0";
  };

  const getCountryOpacity = (country) => {
    if (country.controller) return 0.9;
    if (selectedCard) return 0.8;
    return 0.6;
  };

  const getInfluenceRadius = (country) => {
    const scale = scaleLinear()
      .domain([0, country.threshold])
      .range([0, 30]);
    return scale(country.influence);
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
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
          <h1 className="game-title">جنگ سرد</h1>
          <p className="game-subtitle">اولین نفری که ۱۰ کشور تصرف کند پیروز می‌شود</p>
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
              <span>{player1.controlledCountries.length}/۱۰</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(player1.controlledCountries.length / 10) * 100}%`,
                  backgroundColor: player1.color 
                }}
              ></div>
            </div>
          </div>
          
          <div className="stat-numbers">
            <div className="stat-number">
              <div className="number-label">امتیاز</div>
              <div className="number-value">{player1.points}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">نفوذ</div>
              <div className="number-value">{player1.influence}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">کارت‌ها</div>
              <div className="number-value">{player1.cards.length}</div>
            </div>
          </div>
        </div>

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
              <span>{player2.controlledCountries.length}/۱۰</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(player2.controlledCountries.length / 10) * 100}%`,
                  backgroundColor: player2.color 
                }}
              ></div>
            </div>
          </div>
          
          <div className="stat-numbers">
            <div className="stat-number">
              <div className="number-label">امتیاز</div>
              <div className="number-value">{player2.points}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">نفوذ</div>
              <div className="number-value">{player2.influence}</div>
            </div>
            <div className="stat-number">
              <div className="number-label">کارت‌ها</div>
              <div className="number-value">{player2.cards.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش اصلی - نقشه و کارت‌ها */}
      <div className="game-main-section">
        {/* نقشه جهان */}
        <div className="map-section">
          <div className="section-header">
            <div className="section-title">
              <span className="title-icon">🗺️</span>
              نقشه جهان
            </div>
            <div className="map-controls">
              <button onClick={handleZoomIn} className="map-control-btn" title="بزرگنمایی">
                <span className="control-icon">➕</span>
              </button>
              <button onClick={handleZoomOut} className="map-control-btn" title="کوچکنمایی">
                <span className="control-icon">➖</span>
              </button>
              <button onClick={handleReset} className="map-control-btn" title="بازنشانی">
                <span className="control-icon">🔄</span>
              </button>
            </div>
          </div>
          
          <div className="map-container">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 100,
                center: [60, 30]
              }}
              style={{ width: "100%", height: "500px" }}
            >
              <ZoomableGroup
                center={position.coordinates}
                zoom={position.zoom}
                onMoveEnd={setPosition}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const country = countries.find(c => c.name === geo.properties.name);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            if (country) {
                              setTooltip({
                                show: true,
                                content: `${country.name} ${country.flag}`,
                                x: event.clientX,
                                y: event.clientY
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            setTooltip({ show: false, content: '', x: 0, y: 0 });
                          }}
                          onClick={(event) => handleMapClick(geo, event)}
                          style={{
                            default: {
                              fill: getCountryColor(country),
                              stroke: "#FFFFFF",
                              strokeWidth: 0.5,
                              outline: "none",
                              opacity: getCountryOpacity(country)
                            },
                            hover: {
                              fill: selectedCard ? "#3B82F6" : "#CBD5E1",
                              stroke: "#FFFFFF",
                              strokeWidth: 1,
                              outline: "none",
                              cursor: selectedCard ? "pointer" : "default"
                            },
                            pressed: {
                              fill: "#F59E0B",
                              stroke: "#FFFFFF",
                              strokeWidth: 1,
                              outline: "none"
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* مارکرهای کشورهای بازی */}
                {countries.map((country) => {
                  const coords = countryCoordinates[country.name];
                  if (!coords) return null;
                  
                  return (
                    <Marker
                      key={country.id}
                      coordinates={coords}
                      onClick={() => handleMarkerClick(country)}
                    >
                      <circle
                        r={getInfluenceRadius(country)}
                        fill={getCountryColor(country)}
                        stroke={country.controller ? "#FFFFFF" : "#64748B"}
                        strokeWidth="2"
                        style={{
                          cursor: selectedCard ? "pointer" : "default",
                          filter: selectedCountry?.id === country.id ? "drop-shadow(0 0 8px #F59E0B)" : "none",
                          transition: "all 0.3s ease"
                        }}
                      />
                      <text
                        textAnchor="middle"
                        y={-getInfluenceRadius(country) - 5}
                        style={{
                          fontFamily: "Vazirmatn, sans-serif",
                          fontSize: "10px",
                          fill: "#1F2937",
                          fontWeight: "bold",
                          pointerEvents: "none"
                        }}
                      >
                        {country.flag}
                      </text>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {tooltip.show && (
              <div 
                className="map-tooltip"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                {tooltip.content}
              </div>
            )}
          </div>

          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color usa-color"></div>
              <span>آمریکا</span>
            </div>
            <div className="legend-item">
              <div className="legend-color ussr-color"></div>
              <span>شوروی</span>
            </div>
            <div className="legend-item">
              <div className="legend-color available-color"></div>
              <span>آزاد</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected-color"></div>
              <span>انتخاب شده</span>
            </div>
          </div>
        </div>

        {/* دست کارت‌ها */}
        <div className="cards-section">
          <div className="section-header">
            <div className="section-title">
              <span className="title-icon">🃏</span>
              {currentPlayer === 1 ? 'کارت‌های آمریکا' : 'کارت‌های شوروی'}
            </div>
            <div className="cards-count">
              {currentPlayer === 1 ? player1.cards.length : player2.cards.length} کارت
            </div>
          </div>

          {selectedCard && (
            <div className="selected-card-preview">
              <div className="preview-header">
                <div className="preview-icon">{selectedCard.icon}</div>
                <div>
                  <div className="preview-name">{selectedCard.name}</div>
                  <div className="preview-desc">{selectedCard.description}</div>
                </div>
              </div>
              <div className="preview-power">
                <span className="power-label">قدرت:</span>
                <span className="power-value">{selectedCard.power}</span>
              </div>
              <div className="preview-instruction">
                <span className="instruction-icon">👉</span>
                روی یک کشور در نقشه کلیک کنید
              </div>
            </div>
          )}

          <div className="cards-grid">
            {currentPlayer === 1 ? (
              player1.cards.length > 0 ? (
                player1.cards.map(card => (
                  <div
                    key={card.id}
                    className={`game-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="card-icon">{card.icon}</div>
                    <div className="card-name">{card.name}</div>
                    <div className="card-power">
                      <span className="power-badge">{card.power}</span>
                    </div>
                    <div className="card-desc">{card.description}</div>
                  </div>
                ))
              ) : (
                <div className="empty-cards">
                  <div className="empty-icon">🃏</div>
                  <div className="empty-text">کارتی ندارید!</div>
                </div>
              )
            ) : (
              player2.cards.length > 0 ? (
                player2.cards.map(card => (
                  <div
                    key={card.id}
                    className={`game-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="card-icon">{card.icon}</div>
                    <div className="card-name">{card.name}</div>
                    <div className="card-power">
                      <span className="power-badge">{card.power}</span>
                    </div>
                    <div className="card-desc">{card.description}</div>
                  </div>
                ))
              ) : (
                <div className="empty-cards">
                  <div className="empty-icon">🃏</div>
                  <div className="empty-text">کارتی ندارید!</div>
                </div>
              )
            )}
          </div>
        </div>
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
              <div className="step-desc">روی کشور مورد نظر در نقشه کلیک کنید</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">۳</div>
            <div className="step-content">
              <div className="step-title">اعمال نفوذ</div>
              <div className="step-desc">نفوذ خود را افزایش دهید و کشور را تصرف کنید</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;