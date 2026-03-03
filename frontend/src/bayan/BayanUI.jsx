import { useEffect, useRef, useState } from "react";

export function BayanUI({
  inputText,
  result,
  loading,
  error,
  theme,
  prompt,
  showPromptEditor,
  uploadedFile,
  isDragging,
  history,
  showHistory,
  onThemeChange,
  onPromptChange,
  onResetPrompt,
  onTogglePromptEditor,
  onOpenHistory,
  onCloseHistory,
  onSelectHistory,
  onDeleteHistory,
  onClearHistory,
  onInputTextChange,
  onDragStateChange,
  onHandleFile,
  onRemoveFile,
  onAnalyze,
  onReset,
  onChatSend,
}) {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!uploadedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadedFile]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;600;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0d1117;
          --ink2: #161c25;
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dim: rgba(201,168,76,0.15);
          --cream: #f5f0e8;
          --cream2: #ede6d9;
          --text: #2c2416;
          --text-muted: #7a6e5e;
          --border: rgba(201,168,76,0.25);
          --shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        body { background: var(--ink); font-family: 'Cairo', sans-serif; direction: rtl; }

        .app {
          --ink: #0d1117;
          --ink2: #161c25;
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dim: rgba(201,168,76,0.15);
          --cream: #f5f0e8;
          --cream2: #ede6d9;
          --text: #2c2416;
          --text-muted: #9b8d7c;
          --border: rgba(201,168,76,0.25);
          --shadow: 0 20px 60px rgba(0,0,0,0.35);
          min-height: 100vh;
          background: var(--ink);
          position: relative;
          overflow-x: hidden;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .app.theme-light {
          --ink: #f7f1e4;
          --ink2: #fffaf0;
          --gold: #a77d2f;
          --gold-light: #c79a45;
          --gold-dim: rgba(167,125,47,0.12);
          --cream: #241b0c;
          --cream2: #4b3a1c;
          --text: #2c2416;
          --text-muted: #74644a;
          --border: rgba(167,125,47,0.22);
          --shadow: 0 20px 60px rgba(73, 49, 8, 0.12);
        }

        .bg-pattern {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.04;
          background-image: 
            repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%),
            repeating-linear-gradient(-45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%);
          background-size: 40px 40px;
        }

        .header {
          background: linear-gradient(135deg, var(--ink2) 0%, #0a0f16 100%);
          border-bottom: 1px solid var(--border);
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }

        .app.theme-light .header {
          background: linear-gradient(135deg, #fffaf0 0%, #f1e5ca 100%);
        }

        .header::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }

        .logo {
          display: flex; align-items: center; gap: 14px;
        }

        .logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Amiri', serif;
          font-size: 22px; color: var(--ink); font-weight: 700;
          box-shadow: 0 4px 20px rgba(201,168,76,0.4);
        }

        .logo-text h1 {
          font-family: 'Amiri', serif;
          font-size: 28px; color: var(--gold-light);
          letter-spacing: 1px;
          line-height: 1;
        }

        .logo-text p {
          font-size: 12px; color: var(--text-muted);
          margin-top: 3px;
        }

        .prompt-btn {
          background: var(--gold-dim);
          border: 1px solid var(--border);
          color: var(--gold-light);
          padding: 9px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .prompt-btn:hover { background: rgba(201,168,76,0.25); border-color: var(--gold); }

        .prompt-editor {
          background: var(--ink2);
          border-bottom: 1px solid var(--border);
          padding: 0 40px;
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s;
        }
        .prompt-editor.open {
          max-height: 400px;
          padding: 24px 40px;
        }

        .prompt-editor label {
          display: block; color: var(--gold); font-size: 13px;
          margin-bottom: 10px; font-weight: 600;
        }

        .prompt-editor textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--cream2);
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          padding: 14px;
          resize: vertical;
          min-height: 160px;
          outline: none;
          direction: rtl;
          line-height: 1.8;
          transition: border-color 0.2s;
        }
        .prompt-editor textarea:focus { border-color: var(--gold); }

        .theme-switch {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .theme-option {
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          padding: 8px 14px;
          border-radius: 9px;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-option:hover {
          color: var(--cream);
          background: rgba(255,255,255,0.04);
        }

        .theme-option.active {
          color: var(--ink);
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 6px 18px rgba(201,168,76,0.22);
        }

        .app.theme-light .theme-switch {
          background: rgba(167,125,47,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.45);
        }

        .app.theme-light .theme-option:hover {
          color: var(--text);
          background: rgba(167,125,47,0.08);
        }

        .reset-prompt {
          background: none; border: none;
          color: var(--text-muted); font-size: 12px;
          cursor: pointer; margin-top: 8px;
          font-family: 'Cairo', sans-serif;
          text-decoration: underline;
        }
        .reset-prompt:hover { color: var(--gold); }

        .main {
          max-width: 860px;
          margin: 0 auto;
          padding: 60px 24px;
          position: relative; z-index: 1;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeUp 0.6s ease both;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold-dim);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 20px;
          font-size: 12px; color: var(--gold);
          letter-spacing: 0.5px;
        }

        .hero h2 {
          font-family: 'Amiri', serif;
          font-size: 42px; color: var(--cream);
          line-height: 1.4; margin-bottom: 14px;
        }

        .hero p {
          font-size: 16px; color: var(--text-muted);
          line-height: 1.8; max-width: 580px; margin: 0 auto;
        }

        .input-card {
          background: linear-gradient(145deg, #161c25, #0f1520);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          box-shadow: var(--shadow);
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .input-label {
          display: flex; align-items: center; gap: 10px;
          color: var(--gold); font-size: 14px; font-weight: 700;
          margin-bottom: 14px;
        }

        .input-label .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 10px var(--gold);
        }

        textarea.main-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          color: var(--cream);
          font-family: 'Cairo', sans-serif;
          font-size: 15px;
          padding: 18px;
          resize: none;
          height: 220px;
          outline: none;
          direction: rtl;
          line-height: 1.9;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        textarea.main-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        textarea.main-input::placeholder { color: rgba(255,255,255,0.2); }

        .char-count {
          text-align: left; font-size: 12px;
          color: var(--text-muted); margin-top: 8px;
        }

        .error-msg {
          background: rgba(220,53,69,0.12);
          border: 1px solid rgba(220,53,69,0.3);
          border-radius: 8px;
          padding: 12px 16px;
          color: #f8a9b0;
          font-size: 14px;
          margin-top: 16px;
          text-align: center;
        }

        .analyze-btn {
          width: 100%;
          margin-top: 20px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: none;
          border-radius: 12px;
          color: var(--ink);
          font-family: 'Cairo', sans-serif;
          font-size: 16px; font-weight: 700;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 8px 30px rgba(201,168,76,0.3);
          letter-spacing: 0.5px;
        }
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201,168,76,0.45);
        }
        .analyze-btn:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none;
        }

        .spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(0,0,0,0.2);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Results */
        .results {
          animation: fadeUp 0.5s ease both;
        }

        .result-header {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px; gap: 16px;
        }

        .result-title {
          font-family: 'Amiri', serif;
          font-size: 30px; color: var(--gold-light);
          line-height: 1.4;
        }

        .back-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--cream2);
          padding: 9px 16px;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .back-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--gold); color: var(--gold); }

        .tabs {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0;
        }

        .tab {
          background: none; border: none;
          padding: 10px 18px;
          border-radius: 8px 8px 0 0;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          display: flex; align-items: center; gap: 7px;
        }
        .tab:hover { color: var(--cream); }
        .tab.active {
          color: var(--gold-light);
          border-bottom-color: var(--gold);
          background: var(--gold-dim);
        }

        .tab-icon { font-size: 16px; }

        .panel { animation: fadeUp 0.3s ease both; }

        /* Summary */
        .summary-box {
          background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .summary-box p {
          color: var(--cream);
          font-size: 16px; line-height: 2;
          font-family: 'Amiri', serif;
        }

        .targets-section h3 {
          color: var(--gold); font-size: 15px;
          margin-bottom: 14px; font-weight: 700;
        }

        .targets-list {
          display: flex; flex-wrap: wrap; gap: 10px;
          list-style: none;
        }

        .target-chip {
          background: rgba(201,168,76,0.1);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 7px 16px;
          color: var(--cream2);
          font-size: 13px;
          display: flex; align-items: center; gap: 6px;
        }

        /* Cards */
        .cards-grid {
          display: flex; flex-direction: column; gap: 14px;
        }

        .card {
          background: linear-gradient(145deg, #161c25, #0f1520);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .card:hover { transform: translateX(-4px); border-color: var(--gold); }

        .card-title {
          font-size: 15px; font-weight: 700;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }

        .obligations .card-title { color: #7ec8a4; }
        .penalties .card-title { color: #f08a8a; }

        .card-desc {
          color: var(--text-muted); font-size: 14px; line-height: 1.8;
        }

        .num-badge {
          width: 26px; height: 26px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
        }
        .obligations .num-badge { background: rgba(126,200,164,0.15); color: #7ec8a4; }
        .penalties .num-badge { background: rgba(240,138,138,0.15); color: #f08a8a; }

        /* FAQs */
        .faq-item {
          background: linear-gradient(145deg, #161c25, #0f1520);
          border: 1px solid var(--border);
          border-radius: 14px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item:hover { border-color: rgba(201,168,76,0.4); }

        .faq-q {
          width: 100%; background: none; border: none;
          padding: 18px 22px;
          color: var(--cream);
          font-family: 'Cairo', sans-serif;
          font-size: 14px; font-weight: 600;
          text-align: right; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px;
        }
        .faq-q:hover { color: var(--gold-light); }

        .faq-arrow { color: var(--gold); font-size: 18px; flex-shrink: 0; transition: transform 0.25s; }
        .faq-arrow.open { transform: rotate(180deg); }

        .faq-a {
          max-height: 0; overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .faq-a.open { max-height: 300px; }

        .faq-a-inner {
          padding: 0 22px 18px;
          color: var(--text-muted);
          font-size: 14px; line-height: 1.9;
          border-top: 1px solid rgba(201,168,76,0.1);
          padding-top: 14px;
        }

        .loading-screen {
          text-align: center; padding: 80px 20px;
        }

        .loading-orb {
          width: 80px; height: 80px;
          margin: 0 auto 30px;
          position: relative;
        }
        .loading-orb::before, .loading-orb::after {
          content: ''; position: absolute; border-radius: 50%;
        }
        .loading-orb::before {
          inset: 0;
          border: 3px solid rgba(201,168,76,0.15);
        }
        .loading-orb::after {
          inset: 0;
          border: 3px solid transparent;
          border-top-color: var(--gold);
          animation: spin 1s linear infinite;
        }
        .loading-inner {
          position: absolute; inset: 12px;
          background: var(--gold-dim);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-screen h3 {
          color: var(--cream); font-size: 20px; margin-bottom: 10px;
          font-family: 'Amiri', serif;
        }
        .loading-screen p { color: var(--text-muted); font-size: 14px; }

        .loading-steps {
          margin-top: 30px; display: flex; flex-direction: column; gap: 10px;
          max-width: 300px; margin: 30px auto 0;
        }

        .step {
          display: flex; align-items: center; gap: 10px;
          color: var(--text-muted); font-size: 13px;
          padding: 10px 16px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          animation: fadeUp 0.5s ease both;
        }
        .step:nth-child(2) { animation-delay: 0.3s; }
        .step:nth-child(3) { animation-delay: 0.6s; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); animation: pulse 1.5s ease-in-out infinite; }

        .empty-state {
          text-align: center; padding: 60px 20px;
          color: var(--text-muted); font-size: 15px;
        }
        .empty-state .icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }

        /* Input tabs */
        .input-switcher {
          display: flex; gap: 6px;
          margin-bottom: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 5px;
        }
        .sw-btn {
          flex: 1; background: none; border: none;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 9px 12px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .sw-btn.active {
          background: var(--gold-dim);
          color: var(--gold-light);
          border: 1px solid var(--border);
        }
        .sw-btn:hover:not(.active) { color: var(--cream); }

        /* Drop zone */
        .drop-zone {
          border: 2px dashed rgba(201,168,76,0.3);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
          background: rgba(255,255,255,0.01);
          position: relative;
        }
        .drop-zone:hover, .drop-zone.dragging {
          border-color: var(--gold);
          background: var(--gold-dim);
        }
        .drop-zone input[type=file] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .drop-icon {
          font-size: 40px; margin-bottom: 12px;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        .drop-title {
          color: var(--cream); font-size: 15px; font-weight: 600;
          margin-bottom: 6px;
        }
        .drop-sub {
          color: var(--text-muted); font-size: 13px;
        }
        .drop-badge {
          display: inline-flex; gap: 8px; margin-top: 14px;
        }
        .file-type-badge {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11px; color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        /* Uploaded file pill */
        .file-pill {
          display: flex; align-items: center; gap: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05));
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 20px;
        }
        .file-pill-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .file-pill-info { flex: 1; min-width: 0; }
        .file-pill-name {
          color: var(--cream); font-size: 14px; font-weight: 600;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .file-pill-sub { color: var(--text-muted); font-size: 12px; margin-top: 3px; }
        .file-remove {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: var(--text-muted);
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 14px;
          transition: all 0.2s; flex-shrink: 0;
        }
        .file-remove:hover { background: rgba(220,53,69,0.2); color: #f08a8a; border-color: rgba(220,53,69,0.3); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* History drawer */
        .history-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .history-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 380px; max-width: 92vw;
          background: linear-gradient(180deg, #161c25, #0f1520);
          border-right: 1px solid var(--border);
          z-index: 101;
          display: flex; flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 6px 0 40px rgba(0,0,0,0.5);
        }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        .history-head {
          padding: 24px 20px 18px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .history-head h2 {
          font-family: 'Amiri', serif;
          color: var(--gold-light); font-size: 22px;
          display: flex; align-items: center; gap: 10px;
        }
        .history-count {
          background: var(--gold-dim);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 2px 10px;
          font-size: 12px; color: var(--gold);
          font-family: 'Cairo', sans-serif;
        }
        .close-drawer {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-muted);
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px;
          transition: all 0.2s;
        }
        .close-drawer:hover { background: rgba(255,255,255,0.1); color: var(--cream); }

        .history-actions {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
          flex-shrink: 0;
        }
        .clear-all-btn {
          background: none; border: none;
          color: var(--text-muted); font-size: 12px;
          cursor: pointer; font-family: 'Cairo', sans-serif;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .clear-all-btn:hover { color: #f08a8a; }

        .history-list {
          flex: 1; overflow-y: auto;
          padding: 12px;
        }
        .history-list::-webkit-scrollbar { width: 4px; }
        .history-list::-webkit-scrollbar-track { background: transparent; }
        .history-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .history-empty {
          text-align: center; padding: 60px 20px;
          color: var(--text-muted);
        }
        .history-empty .h-icon { font-size: 48px; margin-bottom: 14px; opacity: 0.4; }
        .history-empty p { font-size: 14px; line-height: 1.8; }

        .history-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.12);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .history-item::before {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 3px; height: 100%;
          background: linear-gradient(180deg, var(--gold), var(--gold-light));
          opacity: 0;
          transition: opacity 0.2s;
        }
        .history-item:hover {
          border-color: var(--border);
          background: var(--gold-dim);
          transform: translateX(3px);
        }
        .history-item:hover::before { opacity: 1; }

        .hi-title {
          color: var(--cream); font-size: 14px; font-weight: 600;
          margin-bottom: 8px; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .hi-meta {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap;
        }
        .hi-source {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--gold);
          background: var(--gold-dim);
          border-radius: 6px; padding: 3px 8px;
          max-width: 160px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hi-date {
          font-size: 11px; color: var(--text-muted);
          display: flex; align-items: center; gap: 4px;
        }
        .hi-stats {
          display: flex; gap: 8px; margin-top: 10px;
        }
        .hi-stat {
          font-size: 11px; color: var(--text-muted);
          background: rgba(255,255,255,0.04);
          border-radius: 6px; padding: 3px 8px;
          display: flex; align-items: center; gap: 4px;
        }
        .hi-del {
          position: absolute; top: 10px; left: 10px;
          background: none; border: none;
          color: transparent; font-size: 13px;
          cursor: pointer; width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.15s;
        }
        .history-item:hover .hi-del { color: var(--text-muted); }
        .hi-del:hover { background: rgba(240,138,138,0.15) !important; color: #f08a8a !important; }

        /* History button in header */
        .hist-btn {
          background: var(--gold-dim);
          border: 1px solid var(--border);
          color: var(--gold-light);
          padding: 9px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
          position: relative;
        }
        .hist-btn:hover { background: rgba(201,168,76,0.25); border-color: var(--gold); }
        .hist-badge {
          background: var(--gold);
          color: var(--ink);
          border-radius: 100px;
          font-size: 10px; font-weight: 700;
          padding: 1px 6px;
          min-width: 18px; text-align: center;
        }
        .header-btns { display: flex; gap: 10px; align-items: center; }

        .app.theme-light .prompt-editor,
        .app.theme-light .input-card,
        .app.theme-light .card,
        .app.theme-light .faq-item,
        .app.theme-light .history-drawer,
        .app.theme-light .chat-wrap {
          background: linear-gradient(145deg, #fffdf7, #f3ead7);
        }

        .app.theme-light .prompt-editor textarea,
        .app.theme-light textarea.main-input,
        .app.theme-light .chat-input,
        .app.theme-light .file-remove,
        .app.theme-light .close-drawer,
        .app.theme-light .back-btn,
        .app.theme-light .step,
        .app.theme-light .input-switcher,
        .app.theme-light .msg.ai .msg-bubble,
        .app.theme-light .file-type-badge,
        .app.theme-light .hi-stat {
          background: rgba(167,125,47,0.08);
          border-color: rgba(167,125,47,0.2);
          color: var(--cream2);
        }

        .app.theme-light textarea.main-input::placeholder,
        .app.theme-light .chat-input::placeholder {
          color: rgba(75,58,28,0.45);
        }

        .app.theme-light .tab:hover,
        .app.theme-light .sw-btn:hover:not(.active),
        .app.theme-light .theme-option:hover {
          color: var(--text);
        }

        .app.theme-light .drop-zone {
          background: rgba(167,125,47,0.04);
        }

        .app.theme-light .history-overlay {
          background: rgba(88, 67, 27, 0.26);
        }

        .app.theme-light .chat-footer {
          background: rgba(167,125,47,0.06);
        }

        .app.theme-light .msg.ai .msg-avatar {
          background: linear-gradient(135deg, #efe0bc, #e2cca0);
        }

        .app.theme-light .msg.ai.off-topic .msg-bubble {
          color: #a04242;
        }

        @media (max-width: 900px) {
          .header {
            padding: 20px 18px;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .header-btns {
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .theme-switch {
            width: 100%;
            justify-content: space-between;
          }

          .theme-option {
            flex: 1;
          }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }

        /* ── Chat ── */
        .chat-wrap {
          display: flex; flex-direction: column;
          height: 520px;
          background: linear-gradient(180deg, #0f1520, #0d1117);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .chat-messages {
          flex: 1; overflow-y: auto;
          padding: 20px 18px;
          display: flex; flex-direction: column; gap: 16px;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .chat-intro {
          text-align: center; padding: 30px 20px;
          animation: fadeUp 0.4s ease both;
        }
        .chat-intro-icon { font-size: 38px; margin-bottom: 12px; }
        .chat-intro h4 { color: var(--cream); font-size: 16px; margin-bottom: 8px; font-family: 'Amiri', serif; }
        .chat-intro p { color: var(--text-muted); font-size: 13px; line-height: 1.8; }
        .chat-suggestions {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center; margin-top: 18px;
        }
        .chat-suggestion {
          background: var(--gold-dim);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 7px 14px;
          color: var(--gold-light);
          font-size: 12px;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          transition: all 0.2s;
        }
        .chat-suggestion:hover { background: rgba(201,168,76,0.25); border-color: var(--gold); }

        .msg { display: flex; gap: 10px; animation: fadeUp 0.3s ease both; }
        .msg.user { flex-direction: row-reverse; }

        .msg-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .msg.user .msg-avatar {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--ink); font-weight: 700;
        }
        .msg.ai .msg-avatar {
          background: linear-gradient(135deg, #1e2d42, #253348);
          border: 1px solid var(--border);
        }

        .msg-bubble {
          max-width: 78%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px; line-height: 1.85;
        }
        .msg.user .msg-bubble {
          background: linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.1));
          border: 1px solid rgba(201,168,76,0.25);
          color: var(--cream);
          border-top-left-radius: 4px;
        }
        .msg.ai .msg-bubble {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: var(--cream2);
          border-top-right-radius: 4px;
        }
        .msg.ai.off-topic .msg-bubble {
          background: rgba(240,138,138,0.07);
          border-color: rgba(240,138,138,0.2);
          color: #f0c0c0;
        }

        .chat-typing {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 2px;
        }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--gold);
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        .chat-footer {
          border-top: 1px solid var(--border);
          padding: 14px 16px;
          display: flex; gap: 10px; align-items: flex-end;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          color: var(--cream);
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          padding: 11px 14px;
          outline: none;
          resize: none;
          max-height: 100px;
          direction: rtl;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: var(--gold); }
        .chat-input::placeholder { color: rgba(255,255,255,0.2); }
        .chat-send {
          width: 42px; height: 42px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: none; border-radius: 10px;
          color: var(--ink); font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(201,168,76,0.3);
        }
        .chat-send:hover:not(:disabled) { transform: scale(1.07); box-shadow: 0 6px 20px rgba(201,168,76,0.45); }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .chat-clear {
          background: none; border: none;
          color: var(--text-muted); font-size: 11px;
          cursor: pointer; font-family: 'Cairo', sans-serif;
          padding: 4px 8px; border-radius: 6px;
          transition: all 0.2s; white-space: nowrap;
          flex-shrink: 0; align-self: center;
        }
        .chat-clear:hover { color: #f08a8a; background: rgba(240,138,138,0.1); }
      `}</style>

      <div className={`app ${theme === "light" ? "theme-light" : "theme-dark"}`}>
        <div className="bg-pattern" />

        {/* History Drawer */}
        {showHistory && (
          <>
            <div className="history-overlay" onClick={onCloseHistory} />
            <div className="history-drawer">
              <div className="history-head">
                <h2>
                  🕓 السجل
                  {history.length > 0 && <span className="history-count">{history.length} تحليل</span>}
                </h2>
                <button className="close-drawer" onClick={onCloseHistory}>✕</button>
              </div>
              {history.length > 0 && (
                <div className="history-actions">
                  <button className="clear-all-btn" onClick={onClearHistory}>
                    🗑 مسح جميع السجلات
                  </button>
                </div>
              )}
              <div className="history-list">
                {history.length === 0 ? (
                  <div className="history-empty">
                    <div className="h-icon">📭</div>
                    <p>لا توجد تحليلات سابقة بعد.<br />ابدأ بتحليل نص أو ملف وسيظهر هنا.</p>
                  </div>
                ) : history.map(entry => (
                  <div key={entry.id} className="history-item"
                    onClick={() => onSelectHistory(entry.result)}>
                    <button className="hi-del" title="حذف"
                      onClick={e => { e.stopPropagation(); onDeleteHistory(entry.id); }}>✕</button>
                    <div className="hi-title">{entry.result.title || "تحليل بدون عنوان"}</div>
                    <div className="hi-meta">
                      <span className="hi-source">
                        {entry.sourceName.endsWith(".pdf") ? "📄" : "✏️"} {entry.sourceName}
                      </span>
                      <span className="hi-date">🕐 {entry.date} · {entry.time}</span>
                    </div>
                    <div className="hi-stats">
                      <span className="hi-stat">✅ {entry.result.obligations?.length || 0} التزام</span>
                      <span className="hi-stat">⚠️ {entry.result.penalties?.length || 0} عقوبة</span>
                      <span className="hi-stat">❓ {entry.result.faqs?.length || 0} سؤال</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">ب</div>
            <div className="logo-text">
              <h1>بيان</h1>
              <p>منصة تحليل الأنظمة واللوائح بالذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="header-btns">
            <div className="theme-switch" aria-label="تبديل النمط">
              <button
                type="button"
                className={`theme-option ${theme === "dark" ? "active" : ""}`}
                onClick={() => onThemeChange("dark")}
                aria-pressed={theme === "dark"}
              >
                داكن
              </button>
              <button
                type="button"
                className={`theme-option ${theme === "light" ? "active" : ""}`}
                onClick={() => onThemeChange("light")}
                aria-pressed={theme === "light"}
              >
                فاتح
              </button>
            </div>
            <button className="hist-btn" onClick={onOpenHistory}>
              <span>🕓</span>
              السجل
              {history.length > 0 && <span className="hist-badge">{history.length}</span>}
            </button>
            <button className="prompt-btn" onClick={onTogglePromptEditor}>
              <span>⚙️</span>
              {showPromptEditor ? "إخفاء البرومبت" : "تعديل البرومبت"}
            </button>
          </div>
        </header>

        {/* Prompt Editor */}
        <div className={`prompt-editor ${showPromptEditor ? "open" : ""}`}>
          <label>✏️ محرر التعليمات (البرومبت) — يمكنك تخصيص طريقة تحليل الذكاء الاصطناعي:</label>
          <textarea
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            rows={7}
          />
          <button className="reset-prompt" onClick={onResetPrompt}>
            ↺ إعادة تعيين البرومبت للوضع الافتراضي
          </button>
        </div>

        <main className="main">
          {!result && !loading && (
            <>
              <div className="hero">
                <div className="hero-badge">
                  <span>✦</span> مدعوم بالذكاء الاصطناعي
                </div>
                <h2>حوّل أي نظام أو لائحة<br />إلى محتوى سهل الفهم</h2>
                <p>أدخل نص أي نظام أو لائحة رسمية وسيقوم بيان بتحليله وتقديم ملخص مبسط، الالتزامات، العقوبات، والأسئلة الشائعة.</p>
              </div>

              <div className="input-card">
                {/* Switcher */}
                <div className="input-switcher">
                  <button
                    className={`sw-btn ${!uploadedFile || uploadedFile.type === "txt" ? "active" : ""}`}
                    onClick={onRemoveFile}
                  >
                    ✏️ إدخال نص
                  </button>
                  <button
                    className={`sw-btn ${uploadedFile?.type === "pdf" ? "active" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎 رفع ملف
                  </button>
                </div>

                {/* PDF uploaded */}
                {uploadedFile?.type === "pdf" ? (
                  <div className="file-pill">
                    <div className="file-pill-icon">📄</div>
                    <div className="file-pill-info">
                      <div className="file-pill-name">{uploadedFile.name}</div>
                      <div className="file-pill-sub">ملف PDF جاهز للتحليل ✓</div>
                    </div>
                    <button className="file-remove" onClick={onRemoveFile} title="إزالة الملف">✕</button>
                  </div>
                ) : (
                  <>
                    {/* Text input */}
                    <div className="input-label">
                      <span className="dot" />
                      الصق نص النظام أو اللائحة هنا
                    </div>
                    <textarea
                      ref={inputRef}
                      className="main-input"
                      placeholder="مثال: نظام العمل السعودي، لائحة حماية البيانات الشخصية، نظام الشركات..."
                      value={inputText}
                      onChange={e => onInputTextChange(e.target.value)}
                    />
                    <div className="char-count">{inputText.length.toLocaleString('ar-SA')} حرف</div>

                    {/* Drop zone (shown below textarea as alt option) */}
                    <div style={{margin: "16px 0 0", position: "relative"}}>
                      <div
                        className={`drop-zone ${isDragging ? "dragging" : ""}`}
                        onDragOver={e => { e.preventDefault(); onDragStateChange(true); }}
                        onDragLeave={() => onDragStateChange(false)}
                        onDrop={e => { e.preventDefault(); onDragStateChange(false); onHandleFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.txt"
                          onChange={e => onHandleFile(e.target.files[0])}
                          style={{display: "none"}}
                        />
                        <span className="drop-icon">📂</span>
                        <div className="drop-title">أو اسحب وأفلت ملفك هنا</div>
                        <div className="drop-sub">انقر للاختيار من جهازك</div>
                        <div className="drop-badge">
                          <span className="file-type-badge">PDF</span>
                          <span className="file-type-badge">TXT</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Hidden file input for PDF tab button */}
                {uploadedFile?.type !== "pdf" ? null : (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    style={{display:"none"}}
                    onChange={e => onHandleFile(e.target.files[0])}
                  />
                )}

                {error && <div className="error-msg">⚠️ {error}</div>}
                <button
                  className="analyze-btn"
                  onClick={onAnalyze}
                  disabled={!inputText.trim() && !uploadedFile}
                >
                  <span>🔍</span>
                  تحليل {uploadedFile?.type === "pdf" ? "الملف" : "النص"} واستخراج المعلومات
                </button>
              </div>
            </>
          )}

          {loading && (
            <div className="loading-screen">
              <div className="loading-orb">
                <div className="loading-inner">📋</div>
              </div>
              <h3>جارٍ تحليل النص...</h3>
              <p>يعمل الذكاء الاصطناعي على استخراج المعلومات الرئيسية</p>
              <div className="loading-steps">
                <div className="step"><span className="step-dot" /> قراءة النص وفهمه</div>
                <div className="step"><span className="step-dot" /> استخراج الالتزامات والعقوبات</div>
                <div className="step"><span className="step-dot" /> إعداد الملخص المبسط</div>
              </div>
            </div>
          )}

          {result && (
            <Results
              result={result}
              onBack={onReset}
              originalText={inputText}
              uploadedFile={uploadedFile}
              onSendChatMessage={onChatSend}
            />
          )}
        </main>
      </div>
    </>
  );
}

function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    // Headers
    .replace(/^### (.+)$/gm, '<h4 style="color:var(--gold-light);font-size:13px;margin:12px 0 6px;font-family:Cairo,sans-serif;">$1</h4>')
    .replace(/^## (.+)$/gm,  '<h3 style="color:var(--gold-light);font-size:14px;margin:14px 0 7px;font-family:Cairo,sans-serif;">$1</h3>')
    .replace(/^# (.+)$/gm,   '<h2 style="color:var(--gold-light);font-size:15px;margin:14px 0 8px;font-family:Cairo,sans-serif;">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--cream);font-weight:700;">$1</strong>')
    // Bullet lists
    .replace(/^[-•] (.+)$/gm, '<li style="margin:4px 0 4px 0;padding-right:4px;">$1</li>')
    // Checkmark lines
    .replace(/^✅ (.+)$/gm, '<li style="margin:5px 0;list-style:none;display:flex;gap:6px;align-items:flex-start;"><span style="color:#7ec8a4;flex-shrink:0;">✅</span><span>$1</span></li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li[\s\S]*?<\/li>)(\s*<li[\s\S]*?<\/li>)*/g, m => `<ul style="padding:0;margin:8px 0;list-style:disc inside;">${m}</ul>`)
    // Line breaks
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
}

function Results({ result, onBack, originalText, uploadedFile, onSendChatMessage }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [openFaq, setOpenFaq] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const tabs = [
    { id: "summary",     label: "الملخص",          icon: "📄" },
    { id: "obligations", label: `الالتزامات (${result.obligations?.length || 0})`, icon: "✅" },
    { id: "penalties",   label: `العقوبات (${result.penalties?.length || 0})`,     icon: "⚠️" },
    { id: "faqs",        label: `الأسئلة الشائعة (${result.faqs?.length || 0})`,  icon: "❓" },
    { id: "chat",        label: "اسأل عن النظام",   icon: "💬" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const docContext = originalText?.trim()
    ? originalText
    : `ملخص النظام: ${result.summary}\n\nالالتزامات: ${result.obligations?.map(o => o.title + ": " + o.description).join("\n")}\n\nالعقوبات: ${result.penalties?.map(p => p.title + ": " + p.description).join("\n")}`;

  const CHAT_SYSTEM = `أنت مساعد قانوني متخصص في الإجابة على أسئلة المستخدمين حول وثيقة تنظيمية محددة فقط.

الوثيقة التي تعمل عليها هي: "${result.title || 'النظام المحلل'}"

محتوى الوثيقة:
---
${docContext.slice(0, 6000)}
---

تعليمات صارمة:
1. أجب فقط على الأسئلة المتعلقة بهذه الوثيقة تحديداً.
2. إذا كان السؤال خارج نطاق الوثيقة أو لا علاقة له بها (مثل أسئلة عن الطقس، الطبخ، السياسة، أو أي موضوع آخر)، رد بهذا النص بالضبط: "⚠️ سؤالك خارج نطاق هذه الوثيقة. أنا هنا فقط للإجابة على ما يتعلق بـ «${result.title || 'النظام المحلل'}». هل لديك سؤال عن هذا النظام؟"
3. إذا كانت المعلومة غير موجودة في الوثيقة، قل ذلك بوضوح ولا تخترع إجابة.
4. استخدم لغة عربية بسيطة وواضحة.
5. لا تقدم استشارات قانونية رسمية، وذكّر المستخدم بذلك عند الحاجة.`;

  const sendMessage = async (text) => {
    const q = (text || chatInput).trim();
    if (!q || chatLoading) return;
    setChatInput("");
    const userMsg = { role: "user", text: q };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setChatLoading(true);

    try {
      const reply = await onSendChatMessage({
        messages: newMsgs,
        result,
        originalText,
        uploadedFile,
      });
      const isOffTopic = reply.startsWith("⚠️ سؤالك خارج نطاق");
      setMessages(prev => [...prev, { role: "ai", text: reply, offTopic: isOffTopic }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "حدث خطأ، يرجى المحاولة مجدداً.", offTopic: false }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const suggestions = [
    "من هم المخاطبون بهذا النظام؟",
    "ما أبرز الالتزامات؟",
    "ما العقوبات المحتملة؟",
    "متى يسري هذا النظام؟",
  ];

  return (
    <div className="results">
      <div className="result-header">
        <div className="result-title">{result.title || "نتائج التحليل"}</div>
        <button className="back-btn" onClick={onBack}>← تحليل نص جديد</button>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className="panel">
          <div className="summary-box"><p>{result.summary}</p></div>
          <div className="targets-section">
            <h3>👥 الفئات المستهدفة بهذا النظام</h3>
            <ul className="targets-list">
              {result.targets?.map((t, i) => (
                <li key={i} className="target-chip"><span>◆</span> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "obligations" && (
        <div className="panel obligations">
          {result.obligations?.length ? (
            <div className="cards-grid">
              {result.obligations.map((ob, i) => (
                <div key={i} className="card">
                  <div className="card-title"><span className="num-badge">{i + 1}</span>{ob.title}</div>
                  <div className="card-desc">{ob.description}</div>
                </div>
              ))}
            </div>
          ) : <div className="empty-state"><div className="icon">✅</div>لم يتم رصد التزامات محددة.</div>}
        </div>
      )}

      {activeTab === "penalties" && (
        <div className="panel penalties">
          {result.penalties?.length ? (
            <div className="cards-grid">
              {result.penalties.map((pen, i) => (
                <div key={i} className="card">
                  <div className="card-title"><span className="num-badge">{i + 1}</span>{pen.title}</div>
                  <div className="card-desc">{pen.description}</div>
                </div>
              ))}
            </div>
          ) : <div className="empty-state"><div className="icon">⚠️</div>لم يتم رصد عقوبات محددة.</div>}
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="panel">
          {result.faqs?.length ? result.faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.question}</span>
                <span className={`faq-arrow ${openFaq === i ? "open" : ""}`}>▾</span>
              </button>
              <div className={`faq-a ${openFaq === i ? "open" : ""}`}>
                <div className="faq-a-inner">{faq.answer}</div>
              </div>
            </div>
          )) : <div className="empty-state"><div className="icon">❓</div>لا توجد أسئلة شائعة.</div>}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="panel">
          <div className="chat-wrap">
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-intro">
                  <div className="chat-intro-icon">💬</div>
                  <h4>اسألني عن هذا النظام</h4>
                  <p>يمكنك طرح أي سؤال متعلق بـ<br /><strong style={{color:"var(--gold-light)"}}>{result.title || "النظام المحلل"}</strong></p>
                  <div className="chat-suggestions">
                    {suggestions.map((s, i) => (
                      <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              ) : messages.map((m, i) => (
                <div key={i} className={`msg ${m.role} ${m.offTopic ? "off-topic" : ""}`}>
                  <div className="msg-avatar">{m.role === "user" ? "أ" : "🤖"}</div>
                  <div className="msg-bubble">
                    {m.role === "ai"
                      ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
                      : m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="msg ai">
                  <div className="msg-avatar">🤖</div>
                  <div className="msg-bubble">
                    <div className="chat-typing">
                      <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-footer">
              {messages.length > 0 && (
                <button className="chat-clear" onClick={() => setMessages([])}>🗑 مسح</button>
              )}
              <textarea
                ref={chatInputRef}
                className="chat-input"
                rows={1}
                placeholder={`اسأل عن ${result.title || "النظام"}...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="chat-send" onClick={() => sendMessage()} disabled={!chatInput.trim() || chatLoading}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
