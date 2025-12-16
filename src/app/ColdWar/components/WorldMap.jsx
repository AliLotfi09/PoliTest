// components/WorldMap.jsx
import React from 'react';

const WorldMap = ({ 
  countries, 
  player1, 
  player2, 
  currentPlayer, 
  selectedCard, 
  onCountrySelect 
}) => {
  return (
    <div style={{
      background: '#f9f9f9',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#000', marginBottom: '20px' }}>🗺️ نقشه جهان</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        نقشه تعاملی به زودی اضافه خواهد شد
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        {countries.slice(0, 6).map(country => (
          <div
            key={country.id}
            style={{
              background: country.controller === 1 ? '#f0f9ff' : 
                        country.controller === 2 ? '#fef2f2' : 'white',
              border: selectedCard && !country.controller ? '2px solid #000' : '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: selectedCard && !country.controller ? 'pointer' : 'default',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              if (selectedCard && !country.controller) {
                onCountrySelect(country);
              }
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
              {country.flag || '🏳️'}
            </div>
            <div style={{ 
              fontWeight: '600', 
              color: '#000',
              marginBottom: '5px'
            }}>
              {country.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              نفوذ: {country.influence}/{country.threshold}
            </div>
            {country.controller && (
              <div style={{ 
                fontSize: '14px', 
                marginTop: '5px',
                color: country.controller === 1 ? '#2563eb' : '#dc2626'
              }}>
                {country.controller === 1 ? '🇺🇸' : '🚩'}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        {countries.length} کشور در بازی وجود دارد
      </div>
    </div>
  );
};

export default WorldMap;