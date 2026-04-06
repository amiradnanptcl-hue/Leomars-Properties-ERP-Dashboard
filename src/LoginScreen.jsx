import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0E11',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '20px',
    }}>
      <div style={{
        background: '#1E2329',
        border: '1px solid #2B3139',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Leomars" style={{
            width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px',
          }} />
          <h1 style={{
            fontSize: '22px', fontWeight: 800, color: '#EAECEF',
            letterSpacing: '-0.02em', marginBottom: '4px',
          }}>Leomars Properties</h1>
          <p style={{ fontSize: '12px', color: '#848E9C', fontWeight: 600 }}>
            Portfolio Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '10px', fontWeight: 700,
              color: '#848E9C', textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@leomars.app"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid #2B3139', background: '#0B0E11',
                color: '#EAECEF', fontSize: '14px', fontWeight: 500,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '10px', fontWeight: 700,
              color: '#848E9C', textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid #2B3139', background: '#0B0E11',
                color: '#EAECEF', fontSize: '14px', fontWeight: 500,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
              borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
              color: '#e63946', fontSize: '12px', fontWeight: 600, textAlign: 'center',
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#2B3139' : '#FCD535',
              color: loading ? '#848E9C' : '#0B0E11',
              fontSize: '13px', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.1em', transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '10px', color: '#474D57', fontWeight: 500,
        }}>
          Leomars Properties ERP &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
