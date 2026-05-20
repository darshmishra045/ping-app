// ============================================================
// PING - Futuristic Chat App
// Single-file React component with localStorage persistence
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";

// ── STYLES ────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg0: #050508;
    --bg1: #0a0b12;
    --bg2: #0f1018;
    --bg3: #141620;
    --bg4: #1a1d28;
    --bg5: #1f2235;
    --surface: #161824;
    --surface2: #1c1f30;
    --border: rgba(100,130,255,0.12);
    --border2: rgba(100,130,255,0.22);
    --blue: #4a7eff;
    --blue2: #6b9eff;
    --cyan: #00d4ff;
    --cyan2: #80eeff;
    --purple: #8b5cf6;
    --green: #00ff88;
    --red: #ff4466;
    --gold: #ffd700;
    --text0: #f0f4ff;
    --text1: #b8c4e8;
    --text2: #6a7599;
    --glow-blue: 0 0 20px rgba(74,126,255,0.35), 0 0 40px rgba(74,126,255,0.15);
    --glow-cyan: 0 0 20px rgba(0,212,255,0.35), 0 0 40px rgba(0,212,255,0.15);
    --glow-sm: 0 0 10px rgba(74,126,255,0.3);
    --font: 'Exo 2', sans-serif;
    --font2: 'Rajdhani', sans-serif;
    --r: 14px;
    --r-lg: 20px;
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  html, body, #root { height: 100%; background: var(--bg0); }

  .ping-app {
    font-family: var(--font);
    background: var(--bg0);
    color: var(--text0);
    height: 100vh;
    max-width: 430px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* Ambient background glow */
  .ping-app::before {
    content: '';
    position: fixed;
    top: -200px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(74,126,255,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* ── LOGIN ── */
  .login-screen {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 32px 24px; gap: 0; position: relative; z-index: 1;
  }
  .login-logo-wrap {
    width: 90px; height: 90px; margin-bottom: 8px;
    border-radius: 24px; overflow: hidden;
    box-shadow: var(--glow-blue), 0 0 60px rgba(74,126,255,0.2);
    border: 1px solid rgba(74,126,255,0.3);
  }
  .login-logo-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .login-logo-placeholder {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, var(--bg4), var(--bg5));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 36px; font-weight: 700;
    color: var(--blue); letter-spacing: 2px;
  }
  .login-title {
    font-family: var(--font2); font-size: 38px; font-weight: 700;
    letter-spacing: 6px; text-transform: uppercase;
    background: linear-gradient(135deg, var(--blue2), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    text-shadow: none; margin-bottom: 4px;
  }
  .login-subtitle {
    font-size: 13px; color: var(--text2); letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 40px;
  }
  .login-card {
    width: 100%; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--r-lg);
    padding: 28px 24px; backdrop-filter: blur(20px);
  }
  .login-label {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text2); margin-bottom: 8px;
  }
  .ping-input {
    width: 100%; background: var(--bg3);
    border: 1px solid var(--border); border-radius: var(--r);
    padding: 13px 16px; font-family: var(--font);
    font-size: 15px; color: var(--text0); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    margin-bottom: 16px;
  }
  .ping-input:focus {
    border-color: var(--blue); box-shadow: var(--glow-sm);
  }
  .ping-input::placeholder { color: var(--text2); }
  .ping-btn {
    width: 100%; padding: 14px; border: none; border-radius: var(--r);
    font-family: var(--font2); font-size: 16px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase; cursor: pointer;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff; box-shadow: var(--glow-blue);
    transition: all var(--transition); position: relative; overflow: hidden;
  }
  .ping-btn:hover { transform: translateY(-1px); box-shadow: var(--glow-cyan); }
  .ping-btn:active { transform: scale(0.98); }
  .ping-btn::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0); transition: background 0.15s;
  }
  .ping-btn:hover::after { background: rgba(255,255,255,0.05); }
  .login-error {
    margin-top: 12px; padding: 10px 14px;
    background: rgba(255,68,102,0.1); border: 1px solid rgba(255,68,102,0.25);
    border-radius: var(--r); font-size: 13px; color: #ff6680; text-align: center;
  }

  /* ── TOP BAR ── */
  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; background: var(--bg1);
    border-bottom: 1px solid var(--border);
    position: relative; z-index: 10; flex-shrink: 0;
  }
  .top-bar-logo {
    width: 32px; height: 32px; border-radius: 9px; overflow: hidden;
    border: 1px solid rgba(74,126,255,0.3); box-shadow: var(--glow-sm);
    flex-shrink: 0;
  }
  .top-bar-logo img { width: 100%; height: 100%; object-fit: cover; }
  .top-bar-logo-ph {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, var(--bg4), var(--bg5));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 14px; font-weight: 700; color: var(--blue);
  }
  .top-bar-title {
    font-family: var(--font2); font-size: 20px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase;
    background: linear-gradient(135deg, var(--blue2), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .top-bar-actions { display: flex; gap: 8px; align-items: center; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 10px; border: none;
    background: var(--bg3); color: var(--text1); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all var(--transition);
    border: 1px solid var(--border);
  }
  .icon-btn:hover { background: var(--bg4); border-color: var(--blue); color: var(--blue); }
  .avatar-sm {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 13px; font-weight: 700;
    cursor: pointer; border: 2px solid var(--blue); flex-shrink: 0;
    overflow: hidden; position: relative;
  }
  .avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-sm .online-dot {
    position: absolute; bottom: 0; right: 0;
    width: 9px; height: 9px; border-radius: 50%; border: 2px solid var(--bg1);
  }

  /* ── MAIN CONTENT ── */
  .main-content {
    flex: 1; overflow-y: auto; position: relative; z-index: 1;
  }

  /* ── BOTTOM NAV ── */
  .bottom-nav {
    display: flex; background: var(--bg1);
    border-top: 1px solid var(--border);
    position: relative; z-index: 10; flex-shrink: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .nav-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 4px; padding: 10px 4px;
    border: none; background: none; color: var(--text2);
    cursor: pointer; transition: all var(--transition); position: relative;
    font-family: var(--font); font-size: 10px; letter-spacing: 1px;
    text-transform: uppercase;
  }
  .nav-btn .nav-icon { font-size: 22px; transition: all var(--transition); }
  .nav-btn.active { color: var(--blue); }
  .nav-btn.active .nav-icon { text-shadow: var(--glow-sm); filter: drop-shadow(0 0 6px var(--blue)); }
  .nav-btn::before {
    content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 2px; background: linear-gradient(90deg, var(--blue), var(--cyan));
    border-radius: 0 0 4px 4px; transition: width var(--transition);
  }
  .nav-btn.active::before { width: 40px; }

  /* ── SECTION HEADERS ── */
  .section-header {
    padding: 20px 16px 12px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .section-title {
    font-family: var(--font2); font-size: 20px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--text0);
  }
  .section-count {
    font-size: 12px; color: var(--text2); background: var(--bg3);
    border: 1px solid var(--border); border-radius: 20px; padding: 2px 10px;
  }
  .add-btn {
    width: 34px; height: 34px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff; cursor: pointer; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--glow-sm); transition: all var(--transition);
  }
  .add-btn:hover { transform: scale(1.08); box-shadow: var(--glow-blue); }

  /* ── FRIEND CARDS ── */
  .friends-list { padding: 0 12px 80px; display: flex; flex-direction: column; gap: 8px; }
  .friend-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 14px 16px;
    display: flex; align-items: center; gap: 14px;
    transition: all var(--transition); cursor: pointer;
    position: relative; overflow: hidden;
  }
  .friend-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, var(--blue), var(--cyan)); opacity: 0;
    transition: opacity var(--transition);
  }
  .friend-card:hover { border-color: var(--border2); background: var(--surface2); }
  .friend-card:hover::before { opacity: 1; }
  .avatar-lg {
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 18px; font-weight: 700;
    position: relative; flex-shrink: 0; overflow: hidden;
    border: 2px solid rgba(74,126,255,0.3);
  }
  .avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
  .status-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--surface);
  }
  .status-dot.online { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .status-dot.offline { background: var(--text2); }
  .friend-info { flex: 1; min-width: 0; }
  .friend-name {
    font-size: 15px; font-weight: 600; color: var(--text0);
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .friend-status { font-size: 12px; color: var(--text2); margin-top: 2px; }
  .role-badge {
    font-size: 10px; font-weight: 700; padding: 1px 7px;
    border-radius: 20px; letter-spacing: 0.5px;
  }
  .badge-creator { background: rgba(255,215,0,0.15); color: var(--gold); border: 1px solid rgba(255,215,0,0.3); }
  .badge-elite { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
  .badge-admin { background: rgba(0,212,255,0.12); color: var(--cyan); border: 1px solid rgba(0,212,255,0.25); }
  .badge-vip { background: rgba(74,126,255,0.12); color: var(--blue2); border: 1px solid rgba(74,126,255,0.25); }
  .friend-actions { display: flex; gap: 6px; }
  .chat-btn {
    padding: 6px 14px; border-radius: 8px; border: none;
    background: rgba(74,126,255,0.15); color: var(--blue2);
    font-family: var(--font); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all var(--transition);
    border: 1px solid rgba(74,126,255,0.2);
  }
  .chat-btn:hover { background: rgba(74,126,255,0.25); box-shadow: var(--glow-sm); }
  .danger-btn {
    padding: 6px 10px; border-radius: 8px; border: none;
    background: rgba(255,68,102,0.1); color: #ff6680;
    font-size: 12px; cursor: pointer; transition: all var(--transition);
    border: 1px solid rgba(255,68,102,0.2);
  }
  .danger-btn:hover { background: rgba(255,68,102,0.2); }

  /* ── GROUPS ── */
  .groups-list { padding: 0 12px 80px; display: flex; flex-direction: column; gap: 8px; }
  .group-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 14px 16px;
    display: flex; align-items: center; gap: 14px;
    transition: all var(--transition); cursor: pointer;
  }
  .group-card:hover { border-color: var(--border2); background: var(--surface2); }
  .group-avatar {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0; overflow: hidden;
    border: 1px solid rgba(74,126,255,0.2);
  }
  .group-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .group-info { flex: 1; min-width: 0; }
  .group-name { font-size: 15px; font-weight: 600; color: var(--text0); }
  .group-meta { font-size: 12px; color: var(--text2); margin-top: 2px; }
  .group-unread {
    min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── PROFILE ── */
  .profile-page { padding: 0 0 80px; }
  .profile-banner {
    height: 140px; position: relative; overflow: hidden;
  }
  .banner-gradient {
    width: 100%; height: 100%;
  }
  .profile-main { padding: 0 16px 16px; }
  .profile-avatar-wrap {
    width: 80px; height: 80px; border-radius: 50%;
    border: 3px solid var(--bg1); margin-top: -40px;
    position: relative; overflow: hidden;
    box-shadow: var(--glow-blue);
  }
  .profile-avatar-wrap .avatar-inner {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 28px; font-weight: 700; color: #fff;
    overflow: hidden;
  }
  .profile-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .profile-name-row {
    display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap;
  }
  .profile-name { font-size: 22px; font-weight: 700; }
  .profile-username { font-size: 14px; color: var(--text2); margin-top: 2px; }
  .profile-bio {
    font-size: 14px; color: var(--text1); margin-top: 10px; line-height: 1.5;
  }
  .profile-section {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 16px; margin-top: 12px;
  }
  .profile-section-title {
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text2); margin-bottom: 12px;
  }
  .profile-field { margin-bottom: 12px; }
  .profile-field:last-child { margin-bottom: 0; }
  .profile-field label { font-size: 12px; color: var(--text2); margin-bottom: 6px; display: block; }
  .color-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .color-swatch {
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    border: 2px solid transparent; transition: all var(--transition);
  }
  .color-swatch.selected { border-color: #fff; transform: scale(1.15); }
  .logout-btn {
    width: 100%; margin-top: 8px; padding: 12px; border-radius: var(--r);
    background: rgba(255,68,102,0.1); border: 1px solid rgba(255,68,102,0.2);
    color: #ff6680; font-family: var(--font2); font-size: 14px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
    transition: all var(--transition);
  }
  .logout-btn:hover { background: rgba(255,68,102,0.2); }

  /* ── CHAT VIEW ── */
  .chat-view { display: flex; flex-direction: column; height: 100%; }
  .chat-header {
    padding: 12px 16px; background: var(--bg1);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  }
  .back-btn {
    width: 32px; height: 32px; border-radius: 9px; border: none;
    background: var(--bg3); color: var(--text1); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; border: 1px solid var(--border); transition: all var(--transition);
  }
  .back-btn:hover { border-color: var(--blue); color: var(--blue); }
  .chat-header-info { flex: 1; min-width: 0; }
  .chat-header-name { font-size: 16px; font-weight: 600; }
  .chat-header-status { font-size: 12px; color: var(--text2); }
  .messages-area {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .msg-row { display: flex; gap: 10px; align-items: flex-end; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font2); font-size: 12px; font-weight: 700;
    overflow: hidden;
  }
  .msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .msg-content { max-width: 75%; display: flex; flex-direction: column; gap: 3px; }
  .msg-name { font-size: 11px; color: var(--text2); padding: 0 4px; }
  .msg-row.mine .msg-name { text-align: right; }
  .msg-bubble {
    padding: 10px 14px; border-radius: 18px; font-size: 14px;
    line-height: 1.45; word-break: break-word;
    animation: msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes msgIn {
    from { opacity: 0; transform: scale(0.85) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .msg-bubble.theirs {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text0); border-bottom-left-radius: 6px;
  }
  .msg-bubble.mine {
    background: linear-gradient(135deg, var(--blue), #3a6ee8);
    color: #fff; border-bottom-right-radius: 6px;
    box-shadow: 0 0 15px rgba(74,126,255,0.3);
  }
  .msg-time { font-size: 10px; color: var(--text2); padding: 0 4px; }
  .msg-row.mine .msg-time { text-align: right; }
  .typing-indicator {
    display: flex; align-items: center; gap: 4px; padding: 10px 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 18px; border-bottom-left-radius: 6px;
    width: fit-content;
  }
  .typing-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--text2);
    animation: typingBounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); background: var(--blue); }
  }
  .chat-input-area {
    padding: 12px 16px; background: var(--bg1);
    border-top: 1px solid var(--border);
    display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
  }
  .chat-input-wrap { flex: 1; position: relative; }
  .chat-textarea {
    width: 100%; background: var(--bg3);
    border: 1px solid var(--border); border-radius: 14px;
    padding: 11px 16px; font-family: var(--font); font-size: 14px;
    color: var(--text0); outline: none; resize: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    max-height: 120px; overflow-y: auto; line-height: 1.45;
  }
  .chat-textarea:focus { border-color: var(--blue); box-shadow: var(--glow-sm); }
  .chat-textarea::placeholder { color: var(--text2); }
  .send-btn {
    width: 44px; height: 44px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff; cursor: pointer; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--glow-sm); transition: all var(--transition);
    flex-shrink: 0;
  }
  .send-btn:hover { transform: scale(1.05); box-shadow: var(--glow-blue); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px); z-index: 100;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-sheet {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 24px 24px 0 0; width: 100%; max-width: 430px;
    padding: 20px 20px 32px; max-height: 85vh; overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .modal-handle {
    width: 40px; height: 4px; border-radius: 2px; background: var(--bg5);
    margin: 0 auto 20px;
  }
  .modal-title {
    font-family: var(--font2); font-size: 20px; font-weight: 700;
    letter-spacing: 1px; margin-bottom: 16px; color: var(--text0);
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 24px; gap: 12px;
    text-align: center;
  }
  .empty-icon { font-size: 48px; opacity: 0.3; }
  .empty-text { font-size: 16px; font-weight: 600; color: var(--text1); }
  .empty-sub { font-size: 13px; color: var(--text2); line-height: 1.5; }

  /* ── RANK EDITOR ── */
  .user-list-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .rank-select {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 10px; color: var(--text0);
    font-family: var(--font); font-size: 13px; outline: none;
    cursor: pointer;
  }
  .rank-select:focus { border-color: var(--blue); }

  /* ── MISC ── */
  .divider { height: 1px; background: var(--border); margin: 8px 0; }
  .tab-content { height: 100%; }

  /* Upload photo */
  .photo-upload-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: var(--r); border: none;
    background: rgba(74,126,255,0.12); color: var(--blue2);
    font-family: var(--font); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all var(--transition);
    border: 1px solid rgba(74,126,255,0.2);
  }
  .photo-upload-btn:hover { background: rgba(74,126,255,0.22); }
  input[type=file] { display: none; }
`;

// ── CONSTANTS ────────────────────────────────────────────────

// Pre-existing secret codes
const EXISTING_CODES = ["D@rsh", "darsh1", "darsh2", "darsh3", "vishit", "Avishi.j"];

// Gradient colors for banner/accents
const ACCENT_COLORS = [
  "linear-gradient(135deg,#1a1f6b,#0a3580)",
  "linear-gradient(135deg,#2d0b4e,#5b0fa8)",
  "linear-gradient(135deg,#0b3b3b,#0a7a5a)",
  "linear-gradient(135deg,#3b0b0b,#8a1a1a)",
  "linear-gradient(135deg,#1a2b00,#3d6a00)",
  "linear-gradient(135deg,#2b1a00,#7a4400)",
];
const ACCENT_HEX = ["#1e2b8a","#5b0fa8","#0a7a5a","#8a1a1a","#3d6a00","#7a4400"];

// Role info
const ROLES = {
  creator: { label: "👑 Creator", class: "badge-creator" },
  elite:   { label: "✨ Elite",   class: "badge-elite" },
  admin:   { label: "🛡 Admin",   class: "badge-admin" },
  vip:     { label: "⭐ VIP",    class: "badge-vip" },
};

// Utility: get initials
const getInitials = (name) => (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

// Utility: avatar background color from name
const avatarColor = (name) => {
  const colors = ["#4a7eff","#8b5cf6","#00d4ff","#ff4466","#00ff88","#ffd700"];
  let h = 0; for (const c of (name||"")) h = c.charCodeAt(0) + ((h<<5)-h);
  return colors[Math.abs(h) % colors.length];
};

// Format timestamp
const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
};

// ── STORAGE HELPERS ──────────────────────────────────────────
const LS = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }},
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

// ── AVATAR COMPONENT ─────────────────────────────────────────
function Avatar({ user, size = "lg", showStatus = false }) {
  const cls = size === "sm" ? "avatar-sm" : "avatar-lg";
  return (
    <div className={cls} style={{ background: avatarColor(user.displayName || user.username) }}>
      {user.photoURL
        ? <img src={user.photoURL} alt={user.displayName} />
        : <span>{getInitials(user.displayName || user.username)}</span>
      }
      {showStatus && (
        <span className={`status-dot ${user.online ? "online" : "offline"}`} />
      )}
    </div>
  );
}

// ── ROLE BADGE ───────────────────────────────────────────────
function RoleBadge({ role }) {
  if (!role || !ROLES[role]) return null;
  const r = ROLES[role];
  return <span className={`role-badge ${r.class}`}>{r.label}</span>;
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function PingApp() {
  const logoSrc = null; // Replace with your uploaded logo URL if desired

  // ── State ──
  const [currentUser, setCurrentUser] = useState(() => LS.get("ping_current_user"));
  const [allUsers, setAllUsers]     = useState(() => LS.get("ping_users") || {});
  const [messages, setMessages]     = useState(() => LS.get("ping_messages") || {});
  const [tab, setTab]               = useState("friends");
  const [chatWith, setChatWith]     = useState(null); // { id, name, isGroup }
  const [showModal, setShowModal]   = useState(null); // "addFriend"|"createGroup"|"rankEditor"|"groupInfo"
  const [typing, setTyping]         = useState({});
  const [loginForm, setLoginForm]   = useState({ username: "", code: "" });
  const [loginError, setLoginError] = useState("");

  // Persist
  useEffect(() => { LS.set("ping_users", allUsers); }, [allUsers]);
  useEffect(() => { LS.set("ping_messages", messages); }, [messages]);
  useEffect(() => {
    if (currentUser) {
      LS.set("ping_current_user", currentUser);
      // Mark online
      setAllUsers(u => ({ ...u, [currentUser.id]: { ...u[currentUser.id], online: true }}));
    }
  }, [currentUser]);

  // Sync currentUser data from allUsers
  useEffect(() => {
    if (currentUser && allUsers[currentUser.id]) {
      const fresh = allUsers[currentUser.id];
      if (JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh);
        LS.set("ping_current_user", fresh);
      }
    }
  }, [allUsers]);

  // ── Login ──
  function handleLogin() {
    const { username, code } = loginForm;
    if (!username.trim() || !code.trim()) { setLoginError("Please fill in all fields."); return; }

    // Check if code matches an existing user
    const existing = Object.values(allUsers).find(u => u.secretCode === code);
    if (existing) {
      setCurrentUser(existing);
      setLoginError("");
      return;
    }

    // Check if code is in EXISTING_CODES (pre-seeded accounts)
    const isPreExisting = EXISTING_CODES.includes(code);

    // Create new account
    const id = `user_${Date.now()}`;
    const isCreator = code === "D@rsh";
    const newUser = {
      id, username: username.trim(), displayName: username.trim(),
      secretCode: code, role: isCreator ? "creator" : null,
      bio: "", photoURL: null, accentColor: 0,
      online: true, friends: [], groups: [],
      createdAt: Date.now(),
    };
    setAllUsers(u => ({ ...u, [id]: newUser }));
    setCurrentUser(newUser);
    setLoginError("");
  }

  // ── Update User ──
  function updateUser(patch) {
    setAllUsers(u => ({
      ...u,
      [currentUser.id]: { ...u[currentUser.id], ...patch }
    }));
  }

  // ── Chat helpers ──
  function getChatId(a, b) {
    return [a, b].sort().join("__");
  }
  function getMessages(chatId) {
    return messages[chatId] || [];
  }
  function sendMessage(chatId, text) {
    if (!text.trim()) return;
    const msg = {
      id: Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      ts: Date.now(),
    };
    setMessages(m => ({ ...m, [chatId]: [...(m[chatId]||[]), msg] }));
  }

  // ── Friend Actions ──
  function addFriend(friendId) {
    if (!friendId || friendId === currentUser.id) return;
    if (currentUser.friends?.includes(friendId)) return;
    updateUser({ friends: [...(currentUser.friends||[]), friendId] });
    // Also add reverse friendship
    setAllUsers(u => ({
      ...u,
      [friendId]: {
        ...u[friendId],
        friends: [...(u[friendId]?.friends||[]), currentUser.id]
      }
    }));
  }
  function removeFriend(friendId) {
    updateUser({ friends: (currentUser.friends||[]).filter(f => f !== friendId) });
    setAllUsers(u => ({
      ...u,
      [friendId]: {
        ...u[friendId],
        friends: (u[friendId]?.friends||[]).filter(f => f !== currentUser.id)
      }
    }));
  }

  // ── Group Actions ──
  function createGroup(name, emoji) {
    const id = `group_${Date.now()}`;
    const group = {
      id, name, emoji: emoji || "💬",
      description: "", members: [currentUser.id],
      ownerId: currentUser.id, createdAt: Date.now(),
      photoURL: null,
    };
    setAllUsers(u => {
      const updated = { ...u };
      // Store groups in a special key
      const groups = LS.get("ping_groups") || {};
      groups[id] = group;
      LS.set("ping_groups", groups);
      return updated;
    });
    // Trigger re-render
    setTab("groups");
    setShowModal(null);
  }

  // If not logged in, show login screen
  if (!currentUser) {
    return (
      <div className="ping-app">
        <style>{CSS}</style>
        <div className="login-screen">
          <div className="login-logo-wrap">
            {logoSrc
              ? <img src={logoSrc} alt="Ping" />
              : <div className="login-logo-placeholder">P</div>
            }
          </div>
          <div className="login-title">PING</div>
          <div className="login-subtitle">Connect · Chat · Belong</div>
          <div className="login-card">
            <div className="login-label">Username</div>
            <input
              className="ping-input"
              placeholder="Choose a username"
              value={loginForm.username}
              onChange={e => setLoginForm(f => ({...f, username: e.target.value}))}
            />
            <div className="login-label">Secret Code</div>
            <input
              className="ping-input"
              placeholder="Enter your secret code"
              type="password"
              value={loginForm.code}
              onChange={e => setLoginForm(f => ({...f, code: e.target.value}))}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <button className="ping-btn" onClick={handleLogin}>
              ENTER PING
            </button>
            {loginError && <div className="login-error">{loginError}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Chat view (DM or Group)
  if (chatWith) {
    const chatId = chatWith.isGroup ? chatWith.id : getChatId(currentUser.id, chatWith.id);
    const msgs = getMessages(chatId);
    const otherUser = !chatWith.isGroup ? allUsers[chatWith.id] : null;
    return (
      <div className="ping-app">
        <style>{CSS}</style>
        <ChatScreen
          chatId={chatId}
          chatWith={chatWith}
          currentUser={currentUser}
          allUsers={allUsers}
          messages={msgs}
          onSend={(text) => sendMessage(chatId, text)}
          onBack={() => setChatWith(null)}
          logoSrc={logoSrc}
        />
      </div>
    );
  }

  const friends = (currentUser.friends||[]).map(id => allUsers[id]).filter(Boolean);
  const groups = (() => {
    const g = LS.get("ping_groups") || {};
    return Object.values(g).filter(grp => grp.members.includes(currentUser.id));
  })();

  return (
    <div className="ping-app">
      <style>{CSS}</style>

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-logo">
          {logoSrc
            ? <img src={logoSrc} alt="Ping" />
            : <div className="top-bar-logo-ph">P</div>
          }
        </div>
        <div className="top-bar-title">PING</div>
        <div className="top-bar-actions">
          {currentUser.role === "creator" && (
            <button className="icon-btn" title="Manage Ranks" onClick={() => setShowModal("rankEditor")}>
              👑
            </button>
          )}
          <Avatar user={currentUser} size="sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {tab === "friends" && (
          <FriendsTab
            currentUser={currentUser}
            allUsers={allUsers}
            friends={friends}
            onChat={(u) => setChatWith(u)}
            onRemove={removeFriend}
            onAddFriend={() => setShowModal("addFriend")}
          />
        )}
        {tab === "groups" && (
          <GroupsTab
            currentUser={currentUser}
            groups={groups}
            allUsers={allUsers}
            onChat={(g) => setChatWith({...g, isGroup:true})}
            onCreateGroup={() => setShowModal("createGroup")}
          />
        )}
        {tab === "profile" && (
          <ProfileTab
            currentUser={currentUser}
            updateUser={updateUser}
            onLogout={() => {
              updateUser({ online: false });
              setCurrentUser(null);
              LS.set("ping_current_user", null);
            }}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { id:"friends", icon:"👥", label:"Friends" },
          { id:"groups",  icon:"💬", label:"Groups" },
          { id:"profile", icon:"👤", label:"Profile" },
        ].map(t => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      {showModal === "addFriend" && (
        <AddFriendModal
          allUsers={allUsers}
          currentUser={currentUser}
          onAdd={addFriend}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === "createGroup" && (
        <CreateGroupModal
          currentUser={currentUser}
          friends={friends}
          allUsers={allUsers}
          onCreate={createGroup}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === "rankEditor" && (
        <RankEditorModal
          allUsers={allUsers}
          currentUser={currentUser}
          setAllUsers={setAllUsers}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
}

// ── FRIENDS TAB ──────────────────────────────────────────────
function FriendsTab({ currentUser, allUsers, friends, onChat, onRemove, onAddFriend }) {
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Friends</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span className="section-count">{friends.length}</span>
          <button className="add-btn" onClick={onAddFriend} title="Add Friend">+</button>
        </div>
      </div>
      {friends.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-text">No friends yet</div>
          <div className="empty-sub">Tap + to add friends by their username</div>
        </div>
      ) : (
        <div className="friends-list">
          {friends.map(u => (
            <div className="friend-card" key={u.id}>
              <div style={{position:"relative"}}>
                <Avatar user={u} size="lg" showStatus />
              </div>
              <div className="friend-info">
                <div className="friend-name">
                  {u.displayName || u.username}
                  <RoleBadge role={u.role} />
                </div>
                <div className="friend-status">
                  {u.online ? "🟢 Online" : "⚫ Offline"}
                </div>
              </div>
              <div className="friend-actions">
                <button className="chat-btn" onClick={() => onChat(u)}>Chat</button>
                <button className="danger-btn" onClick={() => onRemove(u.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── GROUPS TAB ───────────────────────────────────────────────
function GroupsTab({ currentUser, groups, allUsers, onChat, onCreateGroup }) {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">Groups</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span className="section-count">{groups.length}</span>
          <button className="add-btn" onClick={onCreateGroup} title="Create Group">+</button>
        </div>
      </div>
      {groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <div className="empty-text">No groups yet</div>
          <div className="empty-sub">Create a group and invite your friends</div>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map(g => (
            <div className="group-card" key={g.id} onClick={() => onChat(g)}>
              <div className="group-avatar">
                {g.photoURL ? <img src={g.photoURL} alt={g.name} /> : g.emoji}
              </div>
              <div className="group-info">
                <div className="group-name">{g.name}</div>
                <div className="group-meta">{g.members.length} members{g.description ? ` · ${g.description}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROFILE TAB ──────────────────────────────────────────────
function ProfileTab({ currentUser, updateUser, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: currentUser.displayName || currentUser.username,
    bio: currentUser.bio || "",
    accentColor: currentUser.accentColor || 0,
  });
  const fileRef = useRef();

  function saveProfile() {
    updateUser(form);
    setEditing(false);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateUser({ photoURL: ev.target.result });
    reader.readAsDataURL(file);
  }

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-banner">
        <div
          className="banner-gradient"
          style={{ background: ACCENT_COLORS[currentUser.accentColor || 0] }}
        />
      </div>

      <div className="profile-main">
        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <div className="avatar-inner" style={{ background: avatarColor(currentUser.displayName || currentUser.username) }}>
            {currentUser.photoURL
              ? <img src={currentUser.photoURL} alt={currentUser.displayName} />
              : getInitials(currentUser.displayName || currentUser.username)
            }
          </div>
        </div>

        <div className="profile-name-row">
          <span className="profile-name">{currentUser.displayName || currentUser.username}</span>
          <RoleBadge role={currentUser.role} />
        </div>
        <div className="profile-username">@{currentUser.username}</div>
        {currentUser.bio && <div className="profile-bio">{currentUser.bio}</div>}

        {/* Edit Section */}
        <div className="profile-section">
          <div className="profile-section-title">Edit Profile</div>

          <div className="profile-field">
            <label>Display Name</label>
            <input
              className="ping-input"
              value={form.displayName}
              onChange={e => setForm(f => ({...f, displayName: e.target.value}))}
              style={{marginBottom:0}}
            />
          </div>
          <div className="profile-field" style={{marginTop:12}}>
            <label>Bio</label>
            <textarea
              className="ping-input chat-textarea"
              style={{marginBottom:0,resize:"vertical",minHeight:60}}
              value={form.bio}
              onChange={e => setForm(f => ({...f, bio: e.target.value}))}
              placeholder="Tell everyone about yourself..."
            />
          </div>

          <div className="profile-field" style={{marginTop:12}}>
            <label>Profile Photo</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} />
            <button className="photo-upload-btn" onClick={() => fileRef.current?.click()}>
              📷 Upload Photo
            </button>
          </div>

          <div className="profile-field" style={{marginTop:12}}>
            <label>Accent Color</label>
            <div className="color-picker-row">
              {ACCENT_HEX.map((c, i) => (
                <div
                  key={i}
                  className={`color-swatch ${form.accentColor === i ? "selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setForm(f => ({...f, accentColor: i}))}
                />
              ))}
            </div>
          </div>

          <button className="ping-btn" style={{marginTop:16}} onClick={saveProfile}>
            SAVE PROFILE
          </button>
        </div>

        <div className="profile-section">
          <button className="logout-btn" onClick={onLogout}>SIGN OUT</button>
        </div>
      </div>
    </div>
  );
}

// ── CHAT SCREEN ──────────────────────────────────────────────
function ChatScreen({ chatId, chatWith, currentUser, allUsers, messages, onSend, onBack, logoSrc }) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();
  const typingTimer = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    setIsTyping(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTyping(e) {
    setText(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 1500);
  }

  const otherUser = !chatWith.isGroup ? allUsers[chatWith.id] : null;

  return (
    <div className="chat-view" style={{height:"100vh"}}>
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>←</button>
        {chatWith.isGroup ? (
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"var(--surface2)", border:"1px solid var(--border)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0
          }}>
            {chatWith.emoji || "💬"}
          </div>
        ) : otherUser ? (
          <Avatar user={otherUser} size="sm" />
        ) : null}
        <div className="chat-header-info">
          <div className="chat-header-name">
            {chatWith.isGroup ? chatWith.name : (otherUser?.displayName || chatWith.name)}
          </div>
          <div className="chat-header-status">
            {chatWith.isGroup
              ? `${chatWith.members?.length || 0} members`
              : otherUser?.online ? "🟢 Online" : "⚫ Offline"
            }
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state" style={{paddingTop:40}}>
            <div className="empty-icon">💬</div>
            <div className="empty-text">Start the conversation</div>
          </div>
        )}
        {messages.map((msg) => {
          const sender = allUsers[msg.senderId];
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`msg-row ${isMe ? "mine" : ""}`}>
              {!isMe && sender && (
                <div className="msg-avatar" style={{ background: avatarColor(sender.displayName||sender.username) }}>
                  {sender.photoURL
                    ? <img src={sender.photoURL} alt="" />
                    : getInitials(sender.displayName||sender.username)
                  }
                </div>
              )}
              <div className="msg-content">
                {!isMe && <div className="msg-name">{sender?.displayName || sender?.username || "Unknown"}</div>}
                <div className={`msg-bubble ${isMe ? "mine" : "theirs"}`}>{msg.text}</div>
                <div className="msg-time">{fmtTime(msg.ts)}</div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="msg-row">
            <div className="typing-indicator">
              <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            className="chat-textarea"
            placeholder="Message..."
            rows={1}
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ── ADD FRIEND MODAL ─────────────────────────────────────────
function AddFriendModal({ allUsers, currentUser, onAdd, onClose }) {
  const [search, setSearch] = useState("");
  const results = Object.values(allUsers).filter(u =>
    u.id !== currentUser.id &&
    !(currentUser.friends||[]).includes(u.id) &&
    (u.username.toLowerCase().includes(search.toLowerCase()) ||
     (u.displayName||"").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">Add Friend</div>
        <input
          className="ping-input"
          placeholder="Search username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        {search && results.length === 0 && (
          <div style={{color:"var(--text2)",fontSize:13,textAlign:"center",padding:"16px 0"}}>
            No users found with that username
          </div>
        )}
        {results.map(u => (
          <div key={u.id} className="user-list-item">
            <Avatar user={u} size="sm" />
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{u.displayName||u.username}</div>
              <div style={{fontSize:12,color:"var(--text2)"}}>@{u.username}</div>
            </div>
            <RoleBadge role={u.role} />
            <button className="chat-btn" onClick={() => { onAdd(u.id); onClose(); }}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CREATE GROUP MODAL ───────────────────────────────────────
function CreateGroupModal({ currentUser, friends, allUsers, onCreate, onClose }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💬");
  const EMOJIS = ["💬","🎮","🎵","🔥","⚡","🌍","🚀","🎨","📚","💎"];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">Create Group</div>
        <div style={{marginBottom:12}}>
          <div className="login-label">Group Icon</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{
                  width:36,height:36,borderRadius:10,border:`2px solid ${e===emoji?"var(--blue)":"var(--border)"}`,
                  background:"var(--bg3)",fontSize:18,cursor:"pointer",transition:"all 0.15s"
                }}>
                {e}
              </button>
            ))}
          </div>
          <div className="login-label">Group Name</div>
          <input
            className="ping-input"
            placeholder="Enter group name..."
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <button
          className="ping-btn"
          onClick={() => { if(name.trim()) { onCreate(name.trim(), emoji); onClose(); }}}
          disabled={!name.trim()}
        >
          CREATE GROUP
        </button>
      </div>
    </div>
  );
}

// ── RANK EDITOR MODAL ────────────────────────────────────────
function RankEditorModal({ allUsers, currentUser, setAllUsers, onClose }) {
  const users = Object.values(allUsers).filter(u => u.id !== currentUser.id);

  function setRank(userId, role) {
    setAllUsers(u => ({
      ...u,
      [userId]: { ...u[userId], role: role || null }
    }));
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">👑 Manage Ranks</div>
        {users.length === 0 && (
          <div style={{color:"var(--text2)",fontSize:13,textAlign:"center",padding:"16px 0"}}>
            No other users yet
          </div>
        )}
        {users.map(u => (
          <div key={u.id} className="user-list-item">
            <Avatar user={u} size="sm" />
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{u.displayName||u.username}</div>
              <div style={{fontSize:11,color:"var(--text2)"}}>@{u.username}</div>
            </div>
            <select
              className="rank-select"
              value={u.role || ""}
              onChange={e => setRank(u.id, e.target.value)}
            >
              <option value="">No Rank</option>
              <option value="elite">✨ Elite</option>
              <option value="admin">🛡 Admin</option>
              <option value="vip">⭐ VIP</option>
            </select>
          </div>
        ))}
        <button className="ping-btn" style={{marginTop:16}} onClick={onClose}>DONE</button>
      </div>
    </div>
  );
}
