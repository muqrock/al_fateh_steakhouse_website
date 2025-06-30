import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      alert(`Sign In\nUsername: ${username}\nPassword: ${password}`);
    } else {
      alert(`Register\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e0e7ef 0%, #f5f7fa 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 20,
          minWidth: 400,
          maxWidth: 95,
          boxShadow: "0 8px 32px 0 rgba(60, 72, 88, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #e3e6f0"
        }}
      >
        <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232" alt="Logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px rgba(60,72,88,0.10)' }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => setMode('login')}
            style={{
              background: mode === 'login' ? '#223a5f' : '#f7f9fa',
              color: mode === 'login' ? '#fff' : '#223a5f',
              border: '1.5px solid #d1d9e6',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '8px 28px',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(34,58,95,0.10)' : 'none',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              background: mode === 'register' ? '#223a5f' : '#f7f9fa',
              color: mode === 'register' ? '#fff' : '#223a5f',
              border: '1.5px solid #d1d9e6',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '8px 28px',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(34,58,95,0.10)' : 'none',
            }}
          >
            Register
          </button>
        </div>
        <h2 style={{ color: "#223a5f", marginBottom: 8, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ color: "#6b7280", marginBottom: 28, fontSize: 16 }}>{mode === 'login' ? 'Login to your account' : 'Register a new account'}</p>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label style={{ fontWeight: 600, color: "#223a5f", marginBottom: 6, display: "block", letterSpacing: 0.5 }}>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 18,
              padding: 14,
              borderRadius: 8,
              border: "1.5px solid #d1d9e6",
              fontSize: 16,
              background: "#f7f9fa",
              outline: 'none',
              transition: 'border 0.2s',
            }}
            required
          />
          {mode === 'register' && (
            <>
              <label style={{ fontWeight: 600, color: "#223a5f", marginBottom: 6, display: "block", letterSpacing: 0.5 }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: 18,
                  padding: 14,
                  borderRadius: 8,
                  border: "1.5px solid #d1d9e6",
                  fontSize: 16,
                  background: "#f7f9fa",
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
                required
              />
            </>
          )}
          <label style={{ fontWeight: 600, color: "#223a5f", marginBottom: 6, display: "block", letterSpacing: 0.5 }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 28,
              padding: 14,
              borderRadius: 8,
              border: "1.5px solid #d1d9e6",
              fontSize: 16,
              background: "#f7f9fa",
              outline: 'none',
              transition: 'border 0.2s',
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 16,
              background: "#223a5f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 10,
              boxShadow: "0 2px 8px rgba(34,58,95,0.10)",
              letterSpacing: 1
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1e3c72')}
            onMouseOut={e => (e.currentTarget.style.background = '#223a5f')}
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;