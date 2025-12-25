// src/components/MiniAppDebug.jsx
import { useEffect, useState } from 'react';
import appState from '../utils/appState';
import { getMiniAppState } from '../utils/miniAppDetector';

export default function MiniAppDebug() {
  const [user, setUser] = useState(null);
  const [miniApp, setMiniApp] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setUser(appState.getUser());
    setMiniApp(getMiniAppState());

    const unsubscribe = appState.subscribe((key, value) => {
      if (key === 'user') setUser(value);
      if (key === 'miniApp') setMiniApp(value);
    });

    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setUser(appState.getUser());
    setMiniApp(getMiniAppState());
    console.log('🔄 Data refreshed');
  };

  const testSync = async () => {
    if (user) {
      const info = {
        userId: user.id,
        username: user.username,
        platform: user.platform,
        synced: !!user.syncedAt
      };
      console.log('User Info:', info);
      alert(`User: ${user.username}\nPlatform: ${user.platform}\nSynced: ${user.syncedAt ? '✅' : '❌'}\n\nCheck Supabase Table Editor`);
    } else {
      alert('❌ No user found. Open in Mini App (Eitaa/Telegram) first.');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 9998,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        🐛
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      width: '350px',
      maxHeight: '500px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'auto',
      zIndex: 9998,
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      {/* Header */}
      <div style={{
        background: '#2196F3',
        color: 'white',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '12px 12px 0 0',
        position: 'sticky',
        top: 0
      }}>
        <strong>🐛 Mini App Debug</strong>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 5px'
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '15px' }}>
        {/* Mini App Status */}
        <div style={{
          background: miniApp?.isInitialized ? '#e8f5e9' : '#fff3e0',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: `2px solid ${miniApp?.isInitialized ? '#4CAF50' : '#FF9800'}`
        }}>
          <strong>🌐 Mini App Status:</strong>
          <div style={{ marginTop: '5px' }}>
            {miniApp?.isInitialized ? (
              <>
                <div>✅ <strong>Initialized</strong></div>
                <div>🏷️ Host: <strong style={{ color: '#2196F3' }}>
                  {miniApp.host.toUpperCase()}
                </strong></div>
                {miniApp.isExpanded !== undefined && (
                  <div>📱 Expanded: {miniApp.isExpanded ? '✅' : '❌'}</div>
                )}
              </>
            ) : (
              <div>❌ Not in Mini App</div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div style={{
          background: user ? '#e3f2fd' : '#ffebee',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: `2px solid ${user ? '#2196F3' : '#f44336'}`
        }}>
          <strong>👤 User Info:</strong>
          {user ? (
            <div style={{ marginTop: '5px', fontSize: '11px' }}>
              <div>👤 Username: <strong>{user.username}</strong></div>
              <div style={{ wordBreak: 'break-all' }}>
                🆔 ID: <code style={{ 
                  background: '#fff', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontSize: '10px'
                }}>{user.id}</code>
              </div>
              <div>📱 Platform: <strong>{user.platform}</strong></div>
              <div>🌐 Mini App: {user.fromMiniApp ? '✅' : '❌'}</div>
              {user.firstName && <div>👨 Name: {user.firstName} {user.lastName}</div>}
              {user.languageCode && <div>🗣️ Language: {user.languageCode}</div>}
              {user.isPremium && <div>⭐ Premium: ✅</div>}
              {user.syncedAt && (
                <div style={{ color: '#4CAF50', marginTop: '5px' }}>
                  🔄 Synced: {new Date(user.syncedAt).toLocaleTimeString('fa-IR')}
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: '5px', color: '#f44336' }}>
              ❌ No user data
            </div>
          )}
        </div>

        {/* App State */}
        <div style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <strong>📊 Cache Stats:</strong>
          <div style={{ marginTop: '5px', fontSize: '11px' }}>
            {(() => {
              const stats = appState.getCacheStats();
              return (
                <>
                  <div>📦 Total Items: <strong>{stats.total}</strong></div>
                  <div>👥 Users: <strong>{stats.users}</strong></div>
                  <div>📝 Quizzes: <strong>{stats.quizzes}</strong></div>
                  <div>💾 Size: <strong>{stats.sizeKB} KB</strong></div>
                  {stats.expired > 0 && (
                    <div style={{ color: '#FF9800' }}>
                      ⚠️ Expired: {stats.expired}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexDirection: 'column'
        }}>
          <button
            onClick={refreshData}
            style={{
              padding: '10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh Data
          </button>
          
          <button
            onClick={testSync}
            style={{
              padding: '10px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🔗 Check Supabase Sync
          </button>

          <button
            onClick={() => {
              const info = {
                user: appState.getUser(),
                miniApp: getMiniAppState(),
                cache: appState.getCacheStats(),
                appInfo: appState.getAppInfo()
              };
              console.log('📋 Full App Info:', info);
              alert('✅ Check browser console for full details');
            }}
            style={{
              padding: '10px',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            📋 Log Full Info
          </button>

          <button
            onClick={() => {
              window.open('https://supabase.com/dashboard/project/_/editor', '_blank');
            }}
            style={{
              padding: '10px',
              background: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🗄️ Open Supabase Dashboard
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#fff3cd',
          borderRadius: '8px',
          fontSize: '10px',
          border: '2px solid #FFC107'
        }}>
          <strong>💡 Test Instructions:</strong>
          <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>باز کردن در Eitaa/Telegram</li>
            <li>چک کردن User Info بالا</li>
            <li>کلیک روی "Check Supabase Sync"</li>
            <li>بررسی Table Editor در Supabase</li>
            <li>جستجوی ID کاربر در جدول users</li>
          </ol>
        </div>
      </div>
    </div>
  );
}