// src/components/SupabaseTestConnection.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function SupabaseTestConnection() {
  const [status, setStatus] = useState('testing...');
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // تست 1: بررسی env variables
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Environment variables are missing!');
      }

      // تست 2: چک کردن اتصال با یه query ساده
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (queryError) {
        console.error('Query Error:', queryError);
        throw queryError;
      }

      setStatus('✅ Connected successfully!');
      console.log('Connection successful, data:', data);

      // تست 3: لیست تمام جداول
      const { data: tablesList, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tablesError && tablesList) {
        setTables(tablesList.map(t => t.table_name));
      }

    } catch (err) {
      console.error('Connection Error:', err);
      setError(err.message);
      setStatus('❌ Connection failed');
    }
  };

  const testInsert = async () => {
    try {
      const timestamp = Date.now();
      const testUser = {
        id: `test_${timestamp}`,              // String ID
        username: 'test_user',
        platform: 'web',
        joined_at: timestamp,                 // Number timestamp
        last_active: timestamp,               // Number timestamp
        from_mini_app: false,
        session_id: `sess_${timestamp}`
      };

      console.log('Attempting to insert:', testUser);

      const { data, error } = await supabase
        .from('users')
        .insert([testUser])
        .select();

      if (error) {
        console.error('Insert Error:', error);
        alert(`❌ Insert failed: ${error.message}\n\nCheck console for details`);
      } else {
        console.log('✅ Insert successful:', data);
        alert(`✅ Insert successful!\n\nUser ID: ${data[0].id}`);
      }
    } catch (err) {
      console.error('Insert Exception:', err);
      alert(`❌ Insert exception: ${err.message}`);
    }
  };

  const testQuizInsert = async () => {
    try {
      const timestamp = Date.now();
      const testQuiz = {
        id: `quiz_${timestamp}`,
        user_id: `test_${timestamp}`,
        result: {
          score: 85,
          answers: ['A', 'B', 'C'],
          category: 'political'
        },
        timestamp: timestamp,
        completed: true
      };

      console.log('Attempting to insert quiz:', testQuiz);

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([testQuiz])
        .select();

      if (error) {
        console.error('Quiz Insert Error:', error);
        alert(`❌ Quiz insert failed: ${error.message}`);
      } else {
        console.log('✅ Quiz insert successful:', data);
        alert(`✅ Quiz insert successful!\n\nQuiz ID: ${data[0].id}`);
      }
    } catch (err) {
      console.error('Quiz Insert Exception:', err);
      alert(`❌ Quiz insert exception: ${err.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h3>🔌 Supabase Connection Test</h3>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Anon Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ NOT SET'}
      </div>

      {tables.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Tables found:</strong>
          <ul>
            {tables.map(table => <li key={table}>{table}</li>)}
          </ul>
        </div>
      )}

      <button 
        onClick={testInsert}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Test User Insert
      </button>

      <button 
        onClick={testQuizInsert}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Quiz Insert
      </button>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px',
        background: '#fff3cd',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>⚠️ Checklist:</strong>
        <ol>
          <li>Environment variables در .env تنظیم شده باشن</li>
          <li>Restart کردن dev server بعد از تغییر .env</li>
          <li>Table "users" در Supabase ساخته شده باشه</li>
          <li>RLS policies غیرفعال یا درست تنظیم شده باشن</li>
          <li>Anon key دسترسی insert داشته باشه</li>
        </ol>
      </div>
    </div>
  );
}