class ComMessenger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.blockedUsers = new Set();
    this.reportedUsers = new Set();
    this.mutedUsers = new Set();
    this.currentUserAvatar = "img/profile2.jpg";
    this._rendered = false;
  }

  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;

    this.shadowRoot.innerHTML = `
    <style>
          @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;600&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');

          *,
          *::before,
          *::after {
              box-sizing: border-box;
          }

          :host {
              display: block;
              font-family: 'Yanone Kaffeesatz', sans-serif;
              --topbar-h: 56px;
              --bottombar-h: 56px;
              --nav-total: calc(var(--topbar-h) + var(--bottombar-h));
              --vh: 1vh;
              --bg: #F5F5F5;
              --panel: #FFFFFF;
              --panel-2: #F5F5F7;
              --text: #101828;
              --text-2: #444;
              --muted: #8E8E8E;
              --border: #DBDBDB;
              --border-soft: #EFEFEF;
              --bubble-in: #EFEFEF;
              --bubble-in-text: #262626;
              --bubble-out: rgb(250, 233, 236);
              --bubble-out-text: #262626;
              --icon: #262626;
              background: var(--bg);
              color: var(--text);
          }

          :host([theme="dark"]) {
              --bg: #000;
              --panel: #000;
              --panel-2: #111C33;
              --text: #E5E7EB;
              --text-2: #E5E7EB;
              --muted: #9CA3AF;
              --border: #1F2937;
              --border-soft: #1F2937;
              --bubble-in: #1F2937;
              --bubble-in-text: #E5E7EB;
              --bubble-out: #2A1B24;
              --bubble-out-text: #E5E7EB;
              --icon: #E5E7EB;
          }

          @media (prefers-color-scheme: dark) {
              :host(:not([theme])) {
                  --bg: #000;
                  --panel: #000;
                  --panel-2: #111C33;
                  --text: #E5E7EB;
                  --text-2: #E5E7EB;
                  --muted: #9CA3AF;
                  --border: #1F2937;
                  --border-soft: #1F2937;

                  --bubble-in: #1F2937;
                  --bubble-in-text: #E5E7EB;
                  --bubble-out: #2A1B24;
                  --bubble-out-text: #E5E7EB;

                  --icon: #E5E7EB;
              }
          }

          main {
              padding: 0;
              max-width: 1400px;
              margin: 0 auto;
          }

          .chat-app {
              width: 100%;
              height: calc((var(--vh) * 100) - var(--nav-total));
              background: var(--panel);
              display: flex;
              overflow: hidden;
              border-radius: 16px;
          }

          .sidebar {
              width: 350px;
              background: var(--panel);
              border-right: 1px solid var(--border);
              display: flex;
              flex-direction: column;
          }

          .stories-header {
              padding: 16px 20px;
              border-bottom: 1px solid var (--border-soft);
          }

          .stories-scroll {
              display: flex;
              gap: 16px;
              overflow-x: auto;
          }

          .stories-scroll::-webkit-scrollbar {
              display: none;
          }

          .story-profile {
              min-width: 64px;
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
          }

          .story-avatar {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background: #E0E0E0;
              overflow: hidden;
          }

          .story-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .story-name {
              margin-top: 6px;
              width: 48px;
              height: 4px;
              border-radius: 2px;
              background: #DBDBDB;
          }

          .conversation-list {
              padding: 8px 0;
              overflow-y: auto;
              flex: 1;
          }

          .conversation-list::-webkit-scrollbar {
              width: 0;
          }

          .conversation-item {
              display: flex;
              align-items: center;
              padding: 8px 16px;
              cursor: pointer;
              transition: background 0.15s ease;
          }

          .conversation-item:hover {
              background: color-mix(in srgb, var(--panel) 92%, white);
          }

          .conversation-item.is-active {
              background: color-mix(in srgb, var(--panel) 85%, white);
          }

          .conversation-avatar {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin-right: 12px;
              flex-shrink: 0;
              overflow: hidden;
          }

          .conversation-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .conversation-text {
              flex: 1;
              min-width: 0;
          }

          .conversation-name {
              font-size: 14px;
              font-weight: 600;
              color: var(--text);
              margin-bottom: 4px;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .conversation-snippet {
              font-size: 13px;
              color: var(--muted);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .conversation-status {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #44B700;
              margin-left: 8px;
              flex-shrink: 0;
          }

          .conversation-item.hidden-status .conversation-status {
              display: none;
          }

          .chat-panel {
              flex: 1;
              display: flex;
              flex-direction: column;
              background: var(--panel);
              position: relative;
          }

          .chat-header {
              background: var(--panel);
              border-bottom: 1px solid var(--border);
              height: 72px;
              display: flex;
              align-items: center;
              padding: 0 20px;
              gap: 12px;
          }

          .back-btn {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: none;
              background: transparent;
              color: var(--icon);
              font-size: 28px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              transition: background 0.2s ease;
          }

         .back-btn:hover { background: color-mix(in srgb, var(--panel) 85%, var(--text) 15%); } 

          .chat-user-avatar {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: #E0E0E0;
              overflow: hidden;
          }

          .chat-user-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .chat-user-info {
              display: flex;
              flex-direction: column;
              justify-content: center;
          }

          .chat-user-name {
              font-size: 16px;
              font-weight: 600;
              color: var(--text);
              font-family: 'Roboto Condensed', sans-serif;
          }

          

          .search-box {
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;
              padding: 6px 12px;
              border-radius: 999px;
              background: var(--panel-2);
              border: 1px solid var(--border);
          }

          .search-icon {
              flex-shrink: 0;
          }

          .search-input {
              border: none;
              outline: none;
              background: transparent;
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 14px;
              color: var(--text-2);
              width: 100%;
          }

          .search-input::placeholder {
              color: var(--muted);
          }

          .chat-user-status {
              margin-top: 2px;
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: var(--muted);
          }

          .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #44B700;
          }

          .chat-user-status.hidden-status .status-dot,
          .chat-user-status.hidden-status span {
              display: none;
          }

          .header-banner {
              margin-left: 8px;
              padding: 4px 10px;
              border-radius: 999px;
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 12px;
              display: none;
              white-space: nowrap;
          }

          .chat-user-actions {
              margin-left: auto;
              display: flex;
              gap: 10px;
              align-items: center;
          }

          .more-btn {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: none;
              background: transparent;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 3px;
              padding: 0;
          }

          .more-btn span {
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background: var(--icon);
          }

          .more-btn:hover { background: color-mix(in srgb, var(--panel) 85%, var(--text) 15%); }

          .details-panel {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              width: 320px;
              background: var(--panel);
              border-left: 1px solid var(--border);
              display: flex;
              flex-direction: column;
              transform: translateX(100%);
              transition: transform 0.25s ease;
              z-index: 20;
          }

          .details-panel.is-open {
              transform: translateX(0);
          }

          .details-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 14px 18px;
              border-bottom: 1px solid var(--border-soft);
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 15px;
              font-weight: 600;
          }

          .details-close {
              border: none;
              background: transparent;
              cursor: pointer;
              font-size: 18px;
              line-height: 1;
              padding: 4px;
              border-radius: 50%;
          }

          .details-close:hover { background: color-mix(in srgb, var(--panel) 85%, var(--text) 15%); }

          .details-section {
              padding: 14px 18px;
              border-bottom: 1px solid var(--border-soft);
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 14px;
          }

          .details-bottom {
              margin-top: auto;
              padding: 16px 18px 18px;
              display: flex;
              flex-direction: column;
              gap: 6px;
              border-top: 1px solid var(--border-soft);
          }

          .details-danger-btn {
              border: none;
              background: transparent;
              padding: 6px 0;
              text-align: left;
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 14px;
              color: #ED4956;
              font-weight: 600;
              cursor: pointer;
          }

          .details-danger-btn:hover {
              opacity: 0.7;
          }

          .switch {
              position: relative;
              display: inline-block;
              width: 36px;
              height: 20px;
          }

          .switch input {
              opacity: 0;
              width: 0;
              height: 0;
          }

          .slider {
              position: absolute;
              inset: 0;
              border-radius: 999px;
              background-color: #DDD;
          }

          .slider::before {
              content: "";
              position: absolute;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--panel);
              left: 3px;
              top: 3px;
              transition: transform 0.2s ease;
          }

          .switch input:checked+.slider {
              background-color: #33b76e;
          }

          .switch input:checked+.slider::before {
              transform: translateX(16px);
          }

          .chat-body {
              flex: 1;
              padding: 20px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 12px;
          }

          .chat-body::-webkit-scrollbar {
              width: 6px;
          }

          .chat-body::-webkit-scrollbar-thumb {
              background: #DBDBDB;
              border-radius: 3px;
          }
              
         .chat-profile-link{
         display:flex;
        align-items:center;
        gap:12px;
        cursor:pointer;
        user-select:none;
        border-radius:12px;
        padding:6px 8px;

       color: var(--text);
      transition: background .15s ease, box-shadow .15s ease;
}

.chat-profile-link:hover{
  background: color-mix(in srgb, var(--panel) 85%, var(--text) 15%);
}

.chat-profile-link:active{
  background: color-mix(in srgb, var(--panel) 78%, var(--text) 22%);
}

.chat-profile-link:focus-visible{
  outline: 2px solid color-mix(in srgb, var(--text) 35%, transparent);
  outline-offset: 2px;
}

          

          .message-row {
              display: flex;
              gap: 8px;
              align-items: flex-start;
          }

          .message-row.incoming {
              justify-content: flex-start;
          }

          .message-row.outgoing {
              justify-content: flex-end;
          }

          .message-avatar {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea, #764ba2);
              flex-shrink: 0;
              overflow: hidden;
          }

          .message-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }

          .message-bubble {
              max-width: 60%;
              min-height: 36px;
              padding: 10px 14px;
              border-radius: 18px;
              font-size: 14px;
              line-height: 18px;
              word-wrap: break-word;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .message-row.incoming .message-bubble {
              background: var(--bubble-in);
              color: var(--bubble-in-text);
          }

          .message-row.outgoing .message-bubble {
              background: var(--bubble-out);
              color: var(--bubble-out-text);
          }

          .chat-footer {
              padding: 12px 20px;
              display: flex;
              align-items: center;
              gap: 10px;
              background: var(--panel);
              border-top: 1px solid var(--border-soft);
              position: relative;
          }

          .footer-banner {
              width: 100%;
              padding: 14px 18px;
              border-radius: 12px;
              text-align: center;
              font-family: 'Roboto Condensed', sans-serif;
              font-size: 14px;
              display: none;
          }

          .attachments-bar {
              display: flex;
              gap: 8px;
              flex-shrink: 0;
          }

          .icon-btn {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: none;
              background: transparent;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s ease;
          }

          .icon-btn:hover {
              background: #aaacf2ff;
          }

          .icon-btn:disabled {
              opacity: 0.4;
              cursor: default;
          }

          .message-form {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 8px;
              margin: 0;
          }

          .message-input {
              flex: 1;
              border-radius: 22px;
              padding: 10px 16px;
              font-size: 14px;
              outline: none;
              font-family: 'Roboto Condensed', sans-serif;
              transition: border 0.2s ease;
              background: var(--panel-2);
              border: 1px solid var(--border);
              color: var(--text);
          }

          .message-input:focus {
              border-color: #A8A8A8;
              background: var(--panel);
          }

          .message-input::placeholder {
              color: #8E8E8E;
          }

          .send-btn {
              min-width: 60px;
              height: 36px;
              border-radius: 18px;
              border: none;
              background: transparent;
              color: #EE0067;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              font-family: 'Roboto Condensed', sans-serif;
              transition: opacity 0.2s ease;
          }

          .send-btn:hover {
              opacity: 0.7;
          }

          .send-btn:disabled {
              opacity: 0.3;
              cursor: default;
          }

          .emoji-panel {
              position: absolute;
              bottom: 80px;
              left: 70px;
              background: var(--panel);
              border-radius: 18px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
              padding: 8px 10px;
              display: none;
              gap: 6px;
              flex-wrap: wrap;
              max-width: 260px;
              z-index: 5;
          }

          .emoji-panel.is-open {
              display: flex;
          }

          .emoji-item {
              border: none;
              background: transparent;
              font-size: 20px;
              cursor: pointer;
              padding: 4px;
          }

          .date-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.35);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 50;
          }

          .date-overlay.is-open {
              display: flex;
          }

          .date-dialog {
              background: var(--panel);
              border-radius: 24px;
              padding: 24px 20px 18px;
              width: 320px;
              max-width: 90%;
              text-align: center;
              font-family: 'Roboto Condensed', sans-serif;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          }

          .date-dialog-title {
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 8px;
              color: #EE0067;
          }

          .date-dialog-text {
              font-size: 15px;
              margin-bottom: 18px;
              color: #444;
          }

          .date-dialog-buttons {
              display: flex;
              justify-content: center;
              gap: 10px;
          }

          .date-dialog-buttons button {
              border: none;
              border-radius: 999px;
              padding: 7px 16px;
              font-size: 14px;
              cursor: pointer;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .date-dialog-cancel {
              background: #F5F5F5;
              color: #333;
          }

          .date-dialog-send {
              background: #EE0067;
              color: #fff;
          }

          .report-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.35);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 60;
          }

          .report-overlay.is-open {
              display: flex;
          }

          .report-sheet {
              width: 430px;
              max-width: 95vw;
              background: var(--panel); color: var(--text);
              border-radius: 18px;
              overflow: hidden;
              font-family: 'Roboto Condensed', sans-serif;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
          }

          .report-sheet-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 16px;
              border-bottom: 1px solid var(--border-soft);
              font-size: 14px;
              font-weight: 600;
          }
          .report-row { background: var(--panel); color: var(--text); }
          .report-row:hover { background: color-mix(in srgb, var(--panel) 85%, var(--text) 15%); }
          .report-row + .report-row { border-top: 1px solid var(--border-soft); }
           .report-close {
              border: none;
              background: transparent;
              cursor: pointer;
              font-size: 20px;
              padding: 4px;
          }

          .report-sheet-title {
              padding: 12px 16px 4px;
              font-size: 14px;
              font-weight: 600;
          }

          .report-sheet-list {
              display: flex;
              flex-direction: column;
              padding: 4px 0 8px;
          }

          .report-row {
              width: 100%;
              padding: 10px 16px;
              border: none;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              font-size: 14px;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .report-row+.report-row {
              border-top: 1px solid #F3F3F3;
          }

          .report-row:hover {
              background: #FAFAFA;
          }

          .report-row-arrow {
              color: #C4C4C4;
              font-size: 18px;
          }

          .report-back {
              width: 100%;
              border: none;
              padding: 10px 16px 12px;
              background: var(--panel-2); color: var(--text);
              font-size: 14px;
              cursor: pointer;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .report-back:hover {
             background: color-mix(in srgb, var(--panel-2) 85%, var(--text) 15%);
          }

          .empty-state {
              position: absolute;
              inset: 0;
              display: none;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: var(--panel);
              text-align: center;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .empty-icon {
              width: 88px;
              height: 88px;
              border-radius: 50%;
              border: 1px solid #DBDBDB;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 16px;
          }

          .empty-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 4px;
              color: #262626;
          }

          .empty-subtitle {
              font-size: 14px;
              color: #8E8E8E;
              margin-bottom: 16px;
          }

          .empty-btn {
              padding: 8px 16px;
              border-radius: 999px;
              border: none;
              background: #3b82f6;
              color: #fff;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
          }

          .empty-btn:hover {
              opacity: .9;
          }


          .confirm-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.35);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 70;
          }

          .confirm-overlay.is-open {
              display: flex;
          }

          .confirm-dialog {
              width: 420px;
              max-width: 95vw;
              background: #fff;
              border-radius: 18px;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
              padding: 24px 24px 10px;
              text-align: center;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .confirm-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 6px;
          }

          .confirm-text {
              font-size: 14px;
              color: #555;
              margin-bottom: 18px;
          }

          .confirm-buttons {
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding-bottom: 10px;
          }

          .confirm-main,
          .confirm-cancel {
              border: none;
              background: transparent;
              padding: 10px 8px;
              border-radius: 999px;
              cursor: pointer;
              font-size: 14px;
              font-family: 'Roboto Condensed', sans-serif;
          }

          .confirm-main {
              color: #ED4956;
              font-weight: 700;
          }

          .confirm-cancel {
              color: #262626;
              background: #F5F5F5;
          }

          .confirm-cancel:hover {
              background: #EBEBEB;
          }

          @media (max-width: 960px) {
              .chat-app {
                  height: calc(100vh - 90px);
              }

              .sidebar {
                  display: flex;
                  width: 100%;
                  border-right: none;
              }

              .chat-panel {
                  display: none;
                  width: 100%;
              }

              .chat-app.is-chat-open .sidebar {
                  display: none;
              }

              .chat-app.is-chat-open .chat-panel {
                  display: flex;
              }

              .details-panel {
                  width: 100%;
              }

              .emoji-panel {
                  left: 20px;
              }
          }
      </style>

      <main>
        <div class="chat-app">
          <aside class="sidebar">
            <div class="stories-header">
              <div class="search-box">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="#B0B3B8" stroke-width="1.5"/>
                  <path d="M15 15L19 19" stroke="#B0B3B8" stroke-width="1.5"
                        stroke-linecap="round"/>
                </svg>
                <input
                  id="conversationSearch"
                  class="search-input"
                  type="text"
                  placeholder="Search"
                  autocomplete="off"
                />
              </div>
            </div>
              <div class="conversation-list" id="conversationList"></div>
          </aside>

          <section class="chat-panel">
            <header class="chat-header">
              <button class="back-btn" aria-label="Back">‹</button>

               <div class="chat-profile-link" id="chatProfileLink" title="View profile">
  <div class="chat-user-avatar">
    <img src="img/profile2.jpg" alt="User" id="headerAvatar">
  </div>

  <div class="chat-user-info">
    <div style="display:flex; align-items:center; gap:8px;">
      <div class="chat-user-name" id="chatUserName">Тэмүүжин</div>
      <span class="header-banner" id="headerBanner"></span>
    </div>
    <div class="chat-user-status" id="headerStatus">
      <span class="status-dot"></span>
      <span>Active now</span>
    </div>
  </div>
</div>


              <div class="chat-user-actions">
                <button class="more-btn" id="actionsToggle" aria-label="More">
                  <span></span><span></span><span></span>
                </button>
              </div>
            </header>

            <div class="chat-body" id="chatBody">
            </div>
            <div class="empty-state" id="emptyState">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12L20 4L12 20L11 13L4 12Z"
                        stroke="#262626" stroke-width="1.5"
                        stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="empty-title">Your messages</div>
              <div class="empty-subtitle">Send a message to start a chat.</div>
              <button class="empty-btn" id="emptyNewMessageBtn">Send message</button>
            </div>


            <footer class="chat-footer">
              <div class="footer-banner" id="footerBanner"></div>

              <div class="attachments-bar" id="attachmentsBar">
                <button type="button" class="icon-btn" id="dateBtn" title="Date invite">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                      fill="#1C274C" />
                  </svg>
                </button>

                <button type="button" class="icon-btn" id="emojiBtn" title="Emoji">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15.4754 9.51572C15.6898 10.3159 15.4311 11.0805 14.8977 11.2234C14.3642 11.3664 13.7579 10.8336 13.5435 10.0334C13.3291 9.23316 13.5877 8.4686 14.1212 8.32565C14.6547 8.18271 15.2609 8.71552 15.4754 9.51572Z"
                      fill="#1C274C" />
                    <path
                      d="M9.67994 11.0687C9.89436 11.8689 9.63571 12.6335 9.10225 12.7764C8.56878 12.9194 7.9625 12.3865 7.74809 11.5863C7.53368 10.7861 7.79232 10.0216 8.32579 9.87863C8.85925 9.73569 9.46553 10.2685 9.67994 11.0687Z"
                      fill="#1C274C" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM17.1789 13.3409C17.467 13.6385 17.4593 14.1133 17.1617 14.4014C16.9917 14.566 16.8128 14.7246 16.6256 14.8766L16.8441 15.3216C17.3971 16.4482 16.9214 17.8094 15.787 18.3464C14.6752 18.8728 13.3468 18.4085 12.8047 17.3043L12.5315 16.7477C11.2117 16.998 9.90919 16.9561 8.73026 16.6606C8.32847 16.5599 8.0844 16.1526 8.1851 15.7508C8.2858 15.349 8.69315 15.1049 9.09494 15.2056C10.2252 15.4889 11.5232 15.4924 12.841 15.1393C14.1588 14.7862 15.2811 14.1342 16.1183 13.3237C16.4159 13.0356 16.8908 13.0433 17.1789 13.3409ZM14.0048 16.345L14.1513 16.6433C14.3319 17.0114 14.7747 17.1661 15.1452 16.9907C15.5233 16.8117 15.6818 16.358 15.4975 15.9825L15.3707 15.7241C14.9417 15.9631 14.4851 16.1716 14.0048 16.345Z"
                      fill="#1C274C" />
                  </svg>
                </button>
              </div>

              <div class="emoji-panel" id="emojiPanel">
                <button type="button" class="emoji-item" data-emoji="😀">😀</button>
                <button type="button" class="emoji-item" data-emoji="😂">😂</button>
                <button type="button" class="emoji-item" data-emoji="🥰">🥰</button>
                <button type="button" class="emoji-item" data-emoji="😍">😍</button>
                <button type="button" class="emoji-item" data-emoji="😎">😎</button>
                <button type="button" class="emoji-item" data-emoji="🤭">🤭</button>
                <button type="button" class="emoji-item" data-emoji="🙈">🙈</button>
                <button type="button" class="emoji-item" data-emoji="❤️">❤️</button>
                <button type="button" class="emoji-item" data-emoji="✨">✨</button>
                <button type="button" class="emoji-item" data-emoji="🫶">🫶</button>
                <button type="button" class="emoji-item" data-emoji="🩷">🩷</button>
                <button type="button" class="emoji-item" data-emoji="💛">💛</button>
                <button type="button" class="emoji-item" data-emoji="💘">💘</button>
                <button type="button" class="emoji-item" data-emoji="🥂">🥂</button>
              </div>

              <div class="date-overlay" id="dateOverlay" aria-hidden="true">
                <div class="date-dialog">
                  <div class="date-dialog-title">Болзоонд явах уу? 🫶</div>
                  <div class="date-dialog-text">
                    Чамтай болзоонд явах санал илгээх гэж байна. Илгээх үү?
                  </div>
                  <div class="date-dialog-buttons">
                    <button type="button" class="date-dialog-cancel" id="dateCancelBtn">Болих</button>
                    <button type="button" class="date-dialog-send" id="dateSendBtn">Илгээх</button>
                  </div>
                </div>
              </div>

              <form class="message-form" id="messageForm">
                <input type="text" class="message-input" id="messageInput"
                       placeholder="Message..." autocomplete="off" />
                <button type="submit" class="send-btn" id="sendBtn">Send</button>
              </form>
            </footer>

            <aside class="details-panel" id="detailsPanel">
              <div class="details-header">
                <span>Details</span>
                <button type="button" class="details-close" id="detailsCloseBtn">✕</button>
              </div>

              <div class="details-section">
                <span>Mute messages</span>
                <label class="switch">
                  <input type="checkbox" id="muteToggle">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="details-bottom">
                <button type="button" class="details-danger-btn" id="reportBtn">Report</button>
                <button type="button" class="details-danger-btn" id="blockBtn">Block</button>
                <button type="button" class="details-danger-btn" id="deleteChatBtn">Delete chat</button>
              </div>
            </aside>

            <div class="report-overlay" id="reportOverlay" aria-hidden="true">
              <div class="report-sheet" role="dialog" aria-modal="true">
                <div class="report-sheet-header">
                  <button type="button" class="report-close" id="reportCloseBtn">✕</button>
                  <span>Report</span>
                  <span style="width:20px;"></span>
                </div>
                <div class="report-sheet-title">Select a problem to report</div>
                <div class="report-sheet-list">
                  <button type="button" class="report-row" data-reason="Nudity or sexual activity">
                    <span>Nudity or sexual activity</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Hate speech or symbols">
                    <span>Hate speech or symbols</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Scam or fraud">
                    <span>Scam or fraud</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Violence or dangerous organizations">
                    <span>Violence or dangerous organizations</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Sale of illegal or regulated goods">
                    <span>Sale of illegal or regulated goods</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Bullying or harassment">
                    <span>Bullying or harassment</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Pretending to be someone else">
                    <span>Pretending to be someone else</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Spam">
                    <span>Spam</span><span class="report-row-arrow">›</span>
                  </button>
                  <button type="button" class="report-row" data-reason="Something else">
                    <span>The problem isn’t listed here</span><span class="report-row-arrow">›</span>
                  </button>
                </div>
                <button type="button" class="report-back" id="reportBackBtn">Back</button>
              </div>
            </div>

            <div class="confirm-overlay" id="confirmOverlay" aria-hidden="true">
              <div class="confirm-dialog" role="dialog" aria-modal="true">
                <div class="confirm-title" id="confirmTitle">Title</div>
                <div class="confirm-text" id="confirmText">Text</div>
                <div class="confirm-buttons">
                  <button type="button" class="confirm-main" id="confirmPrimaryBtn">OK</button>
                  <button type="button" class="confirm-cancel" id="confirmCancelBtn">Cancel</button>
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
    `;

    const $ = (sel) => this.shadowRoot.querySelector(sel);
    const $$ = (sel) => Array.from(this.shadowRoot.querySelectorAll(sel));

    this.els = {
      chatBody: $("#chatBody"),
      chatUserName: $("#chatUserName"),
      headerAvatar: $("#headerAvatar"),
      headerStatus: $("#headerStatus"),
      headerBanner: $("#headerBanner"),
      messageForm: $("#messageForm"),
      messageInput: $("#messageInput"),
      sendBtn: $("#sendBtn"),
      attachmentsBar: $("#attachmentsBar"),
      footerBanner: $("#footerBanner"),
      emojiBtn: $("#emojiBtn"),
      emojiPanel: $("#emojiPanel"),
      dateBtn: $("#dateBtn"),
      dateOverlay: $("#dateOverlay"),
      dateCancelBtn: $("#dateCancelBtn"),
      dateSendBtn: $("#dateSendBtn"),
      blockBtn: $("#blockBtn"),
      reportBtn: $("#reportBtn"),
      deleteChatBtn: $("#deleteChatBtn"),
      conversationList: $("#conversationList"),
      conversationItems: $$(".conversation-item"),
      emojiItems: $$(".emoji-item"),
      actionsToggle: $("#actionsToggle"),
      detailsPanel: $("#detailsPanel"),
      detailsCloseBtn: $("#detailsCloseBtn"),
      muteToggle: $("#muteToggle"),
      reportOverlay: $("#reportOverlay"),
      reportCloseBtn: $("#reportCloseBtn"),
      reportBackBtn: $("#reportBackBtn"),
      reportRows: $$(".report-row"),
      confirmOverlay: $("#confirmOverlay"),
      confirmTitle: $("#confirmTitle"),
      confirmText: $("#confirmText"),
      confirmPrimaryBtn: $("#confirmPrimaryBtn"),
      confirmCancelBtn: $("#confirmCancelBtn"),
      searchInput: $("#conversationSearch"),
      emptyState: $("#emptyState"),
      emptyNewMessageBtn: $("#emptyNewMessageBtn"),
      chatApp: this.shadowRoot.querySelector(".chat-app"),
      backBtn: this.shadowRoot.querySelector(".back-btn"),
      chatProfileLink: $("#chatProfileLink"),


    };

    this.currentUserAvatar =
      this.els.headerAvatar?.getAttribute("src") || this.currentUserAvatar;

    this.bindEvents();

    const active = this.getActiveConversationEl();
    if (active) this.applyUIForUser(active.dataset.user);

    this.updateEmptyState();
    this.initAuthAndUsers();

  }

  bindEvents() {
    const {
      messageForm,
      messageInput,
      chatBody,
      actionsToggle,
      detailsPanel,
      detailsCloseBtn,
      deleteChatBtn,
      muteToggle,
      searchInput,
      emptyNewMessageBtn,
    } = this.els;

    if (actionsToggle && detailsPanel) {
      actionsToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        detailsPanel.classList.toggle("is-open");
      });
    }
    if (detailsCloseBtn && detailsPanel) {
      detailsCloseBtn.addEventListener("click", () => {
        detailsPanel.classList.remove("is-open");
      });
    }

    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const active = this.getActiveConversationEl();
      const user = active?.dataset.user;
      if (!active) return;

      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      const otherId = active.dataset.userId;
      if (!otherId) {
        console.error("No otherId on active conversation");
        return;
      }

      const text = messageInput.value.trim();
      if (!text) return;

      // optimistic UI
      const row = document.createElement("div");
      row.className = "message-row outgoing";
      row.innerHTML = `<div class="message-bubble">${this.escapeHtml(text)}</div>`;
      chatBody.appendChild(row);
      chatBody.scrollTop = chatBody.scrollHeight;
      messageInput.value = "";

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ other: otherId, text, type: "text" }),
        });

        if (!res.ok) {
          console.error("send failed", await res.text());
        }
      } catch (err) {
        console.error("send error", err);
      }
    });
    const { backBtn, chatApp } = this.els;

    if (backBtn && chatApp) {
      backBtn.addEventListener("click", () => {
        chatApp.classList.remove("is-chat-open");

        this.els.detailsPanel?.classList.remove("is-open");
        this.els.emojiPanel?.classList.remove("is-open");
        this.closeDateOverlay?.();

        // focus search
        this.els.searchInput?.focus();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase().trim();
        this.els.conversationItems.forEach(item => {
          const name = (item.dataset.user || "").toLowerCase();
          const snippet = (item.querySelector(".conversation-snippet")?.textContent || "").toLowerCase();
          const match = !q || name.includes(q) || snippet.includes(q);
          item.style.display = match ? "flex" : "none";
        });
      });
    }

    if (emptyNewMessageBtn) {
      emptyNewMessageBtn.addEventListener("click", () => {
        if (searchInput) searchInput.focus();
      });
    }

    this.els.emojiBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user)))
        return;
      this.els.emojiPanel.classList.toggle("is-open");
    });

    this.els.emojiItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = this.getActiveUserName();
        if (
          user &&
          (this.blockedUsers.has(user) || this.reportedUsers.has(user))
        )
          return;
        const emoji = btn.dataset.emoji;
        this.els.messageInput.value += emoji;
        this.els.messageInput.focus();
      });
    });

    // Date
    this.els.dateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user)))
        return;

      this.els.dateOverlay.classList.add("is-open");
      this.els.dateOverlay.setAttribute("aria-hidden", "false");
      this.els.emojiPanel.classList.remove("is-open");
    });

    this.els.dateCancelBtn.addEventListener("click", () => {
      this.closeDateOverlay();
    });

    this.els.dateSendBtn.addEventListener("click", () => {
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user)))
        return;

      const text = "Болзоонд явах уу? 🫶";
      const row = document.createElement("div");
      row.className = "message-row outgoing";
      row.innerHTML = `<div class="message-bubble">${this.escapeHtml(
        text
      )}</div>`;
      this.els.chatBody.appendChild(row);
      this.els.chatBody.scrollTop = this.els.chatBody.scrollHeight;

      this.closeDateOverlay();
    });

    this.els.dateOverlay.addEventListener("click", (e) => {
      if (e.target === this.els.dateOverlay) this.closeDateOverlay();
    });

    this.els.blockBtn.addEventListener("click", () => {
      const userName = this.getActiveUserName();
      if (!userName) return;

      const isBlocked = this.blockedUsers.has(userName);

      if (isBlocked) {
        this.openConfirmOverlay({ type: "unblock", userName });
      } else {
        this.openConfirmOverlay({ type: "block", userName });
      }
    });


    this.els.reportBtn.addEventListener("click", () => {
      const userName = this.getActiveUserName();
      if (!userName) return;
      this._reportUserName = userName;
      this.openReportOverlay();
    });

    if (this.els.reportCloseBtn) {
      this.els.reportCloseBtn.addEventListener("click", () =>
        this.closeReportOverlay()
      );
    }
    if (this.els.reportBackBtn) {
      this.els.reportBackBtn.addEventListener("click", () =>
        this.closeReportOverlay()
      );
    }
    if (this.els.reportOverlay) {
      this.els.reportOverlay.addEventListener("click", (e) => {
        if (e.target === this.els.reportOverlay) this.closeReportOverlay();
      });
    }
    if (this.els.reportRows && this.els.reportRows.length) {
      this.els.reportRows.forEach((btn) => {
        btn.addEventListener("click", () => {
          const label = btn.dataset.reason || btn.textContent.trim();
          const userName = this._reportUserName || this.getActiveUserName();
          if (!userName) return;

          this.closeReportOverlay();
          this.openConfirmOverlay({ type: "report", userName, reason: label });
        });
      });
    }

    if (deleteChatBtn) {
      deleteChatBtn.addEventListener("click", () => {
        const userName = this.getActiveUserName();
        if (!userName) return;
        this.openConfirmOverlay({ type: "delete", userName });
      });
    }

    if (muteToggle) {
      muteToggle.addEventListener("change", () => {
        const userName = this.getActiveUserName();
        if (!userName) return;

        if (muteToggle.checked) this.mutedUsers.add(userName);
        else this.mutedUsers.delete(userName);

        this.applyUIForUser(userName);
      });
    }

    const {
      confirmOverlay,
      confirmPrimaryBtn,
      confirmCancelBtn,
    } = this.els;

    if (confirmCancelBtn && confirmOverlay) {
      confirmCancelBtn.addEventListener("click", () =>
        this.closeConfirmOverlay()
      );
      confirmOverlay.addEventListener("click", (e) => {
        if (e.target === confirmOverlay) this.closeConfirmOverlay();
      });
    }

    if (confirmPrimaryBtn) {
      confirmPrimaryBtn.addEventListener("click", () => {
        const state = this._confirmState;
        if (!state) return;

        const { type, userName } = state;

        if (type === "block") {
          this.blockedUsers.add(userName);

          this.els.headerStatus.classList.add("hidden-status");

          this.updateConversationStatuses();
          this.applyUIForUser(userName);
        }

        else if (type === "unblock") {
          this.blockedUsers.delete(userName);

          if (!this.reportedUsers.has(userName)) {
            this.els.headerStatus.classList.remove("hidden-status");
          }

          this.updateConversationStatuses();
          this.applyUIForUser(userName);
        }

        else if (type === "report") {
          this.reportedUsers.add(userName);
          this.els.headerStatus.classList.add("hidden-status");

          this.updateConversationStatuses();
          this.applyUIForUser(userName);
        }

        else if (type === "delete") {
          this.els.chatBody.innerHTML = "";

          const active = this.getActiveConversationEl();
          if (active) {
            active.remove();
            this.els.conversationItems = this.els.conversationItems.filter(
              (el) => el !== active
            );
          }

          this.updateEmptyState();
        }

        if (this.els.detailsPanel) {
          this.els.detailsPanel.classList.remove("is-open");
        }

        this.closeConfirmOverlay();
      });
    }
    this.shadowRoot.addEventListener("click", (e) => {
      const withinEmoji = e.composedPath().includes(this.els.emojiPanel);
      const withinEmojiBtn = e.composedPath().includes(this.els.emojiBtn);
      if (!withinEmoji && !withinEmojiBtn) {
        this.els.emojiPanel.classList.remove("is-open");
      }

      const withinDetails =
        this.els.detailsPanel &&
        e.composedPath().includes(this.els.detailsPanel);
      const withinDetailsBtn =
        this.els.actionsToggle &&
        e.composedPath().includes(this.els.actionsToggle);
      if (!withinDetails && !withinDetailsBtn && this.els.detailsPanel) {
        this.els.detailsPanel.classList.remove("is-open");
      }
    });
// ✅ Chat header profile click -> OthersProfile (session based)
if (this.els.chatProfileLink) {
  this.els.chatProfileLink.addEventListener("click", (e) => {
    e.preventDefault();

    const otherId = this.activeOtherId; // ✅ чи энд already set хийж байгаа
    if (!otherId) {
      console.warn("No activeOtherId yet. Select a conversation first.");
      return;
    }

    this.openOthersProfileBySession(otherId);
  });
}

  }

  async openOthersProfileBySession(otherId) {
  if (!otherId) {
    console.warn("openOthersProfileBySession: missing otherId");
    return;
  }

  try {
    const res = await fetch("/api/othersprofile/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: otherId }),
    });

    if (!res.ok) {
      console.error("select failed:", res.status, await res.text());
      return;
    }

    window.location.hash = "#/othersprofile";
  } catch (e) {
    console.error("openOthersProfileBySession error:", e);
  }
}


  closeDateOverlay() {
    this.els.dateOverlay.classList.remove("is-open");
    this.els.dateOverlay.setAttribute("aria-hidden", "true");
  }

  openReportOverlay() {
    if (!this.els.reportOverlay) return;
    this.els.reportOverlay.classList.add("is-open");
    this.els.reportOverlay.setAttribute("aria-hidden", "false");
  }

  closeReportOverlay() {
    if (!this.els.reportOverlay) return;
    this.els.reportOverlay.classList.remove("is-open");
    this.els.reportOverlay.setAttribute("aria-hidden", "true");
  }
  openConfirmOverlay({ type, userName, reason }) {
    this._confirmState = { type, userName, reason };

    const { confirmOverlay, confirmTitle, confirmText, confirmPrimaryBtn } = this.els;
    if (!confirmOverlay) return;

    if (type === "block") {
      confirmTitle.textContent = `Block ${userName}?`;
      confirmText.textContent =
        "They won't be able to find your profile, posts or story. They also won't know you blocked them.";
      confirmPrimaryBtn.textContent = "Block";
    } else if (type === "unblock") {
      confirmTitle.textContent = `Unblock ${userName}?`;
      confirmText.textContent = "They will be able to message you and see your profile again.";
      confirmPrimaryBtn.textContent = "Unblock";
    } else if (type === "report") {
      confirmTitle.textContent = `Report ${userName}?`;
      confirmText.textContent = reason
        ? `We'll review your report for "${reason}".`
        : "We'll review this conversation.";
      confirmPrimaryBtn.textContent = "Report";
    } else if (type === "delete") {
      confirmTitle.textContent = "Delete chat from inbox?";
      confirmText.textContent =
        "This will remove the chat from your inbox and erase the chat history. To stop receiving new messages from this account, block them first, then delete the chat.";
      confirmPrimaryBtn.textContent = "Delete";
    }

    confirmOverlay.classList.add("is-open");
    confirmOverlay.setAttribute("aria-hidden", "false");
  }

  closeConfirmOverlay() {
    if (!this.els.confirmOverlay) return;
    this.els.confirmOverlay.classList.remove("is-open");
    this.els.confirmOverlay.setAttribute("aria-hidden", "true");
    this._confirmState = null;
  }

  updateEmptyState() {
    if (!this.els.emptyState) return;
    const hasConversations = (this.els.conversationList?.children.length || 0) > 0;
    this.els.emptyState.style.display = hasConversations ? "none" : "flex";
  }


  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  getActiveConversationEl() {
    return this.shadowRoot.querySelector(".conversation-item.is-active");
  }

  getActiveUserName() {
    return this.els.chatUserName?.textContent || null;
  }

  updateIncomingAvatars() {
    const incoming = this.shadowRoot.querySelectorAll(".incoming-avatar");
    incoming.forEach((img) => (img.src = this.currentUserAvatar));
  }

  updateConversationStatuses() {
    if (!this.els.conversationItems) return;
    this.els.conversationItems.forEach((item) => {
      const user = item.dataset.user;
      const hide = this.blockedUsers.has(user) || this.reportedUsers.has(user);
      item.classList.toggle("hidden-status", hide);
    });
  }

  applyUIForUser(user) {
    const isBlocked = this.blockedUsers.has(user);
    const isReported = this.reportedUsers.has(user);
    const isMuted = this.mutedUsers.has(user);

    if (this.els.blockBtn) {
      this.els.blockBtn.textContent = isBlocked ? "Unblock" : "Block";
    }
    if (this.els.headerBanner) {
      if (isMuted) {
        this.els.headerBanner.style.display = "inline-block";
        this.els.headerBanner.textContent = "Muted";
        this.els.headerBanner.style.background = "#F5F5F5";
        this.els.headerBanner.style.color = "#555";
      } else {
        this.els.headerBanner.style.display = "none";
        this.els.headerBanner.textContent = "";
      }
    }

    if (this.els.muteToggle) {
      this.els.muteToggle.checked = isMuted;
    }

    if (!isBlocked && !isReported) {
      this.els.footerBanner.style.display = "none";
      this.els.footerBanner.textContent = "";

      this.els.attachmentsBar.style.display = "flex";
      this.els.messageForm.style.display = "flex";

      if (this.els.emojiBtn) this.els.emojiBtn.disabled = false;
      if (this.els.dateBtn) this.els.dateBtn.disabled = false;

      return;
    }

    this.els.attachmentsBar.style.display = "none";
    this.els.messageForm.style.display = "none";
    this.els.emojiPanel.classList.remove("is-open");
    this.closeDateOverlay();

    if (this.els.emojiBtn) this.els.emojiBtn.disabled = true;
    if (this.els.dateBtn) this.els.dateBtn.disabled = true;

    this.els.footerBanner.style.display = "block";

    if (isBlocked && isReported) {
      this.els.footerBanner.textContent =
        "Энэ хэрэглэгч блоклогдсон бас репортлосон байна.";
      this.els.footerBanner.style.background = "#F5F5F5";
      this.els.footerBanner.style.color = "#555";
    } else if (isBlocked) {
      this.els.footerBanner.textContent =
        "Та энэ хэрэглэгчийн блоклосон байна.";
      this.els.footerBanner.style.background = "#F5F5F5";
      this.els.footerBanner.style.color = "#555";
    } else {
      this.els.footerBanner.textContent =
        "Та энэ хэрэглэгчийг репортлосон байна.";
      this.els.footerBanner.style.background = "#F5F5F5";
      this.els.footerBanner.style.color = "#555";
    }
  }
  async fetchMe() {
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  }
  async fetchUsers() {
    const res = await fetch("/api/matches", { credentials: "include" });
    if (!res.ok) return [];
    return await res.json();
  }

  async initAuthAndUsers() {
    this.me = await this.fetchMe();
    if (!this.me?._id) {
      this.renderConversationList([]);
      this.updateEmptyState();
      return;
    }
    this.meId = String(this.me._id);

    const users = await this.fetchUsers();

    const normalizeId = (u) => String(u.userId || u._id || "");

    const others = users.filter(u => normalizeId(u) && normalizeId(u) !== this.meId);

    this.renderConversationList(others);

    const first = others[0];
    if (first) {
      this.selectConversationByUserId(normalizeId(first));
    } else {
      this.updateEmptyState();
    }
  }

  renderConversationList(list) {
    const wrap = this.els.conversationList;
    if (!wrap) return;

    wrap.innerHTML = "";

    list.forEach(u => {
      const el = document.createElement("div");
      el.className = "conversation-item";

      const id = u.userId;
      el.dataset.user = `${u.name || ""}`.trim() || "User";
      el.dataset.userId = String(id);
      el.dataset.avatar = u.avatar || "img/profile2.jpg";


      el.innerHTML = `
      <div class="conversation-avatar">
        <img src="${this.escapeHtml(el.dataset.avatar)}" alt="${this.escapeHtml(el.dataset.user)}">
      </div>
      <div class="conversation-text">
        <div class="conversation-name">${this.escapeHtml(el.dataset.user)}</div>
        <div class="conversation-snippet"></div>
      </div>
      <div class="conversation-status"></div>
    `;

      el.addEventListener("click", () => this.selectConversationEl(el));
      wrap.appendChild(el);
    });

    this.els.conversationItems = Array.from(
      this.els.conversationList.querySelectorAll(".conversation-item")
    );

    this.updateEmptyState();
  }

  selectConversationByUserId(userId) {
    const el = this.shadowRoot.querySelector(`.conversation-item[data-user-id="${CSS.escape(userId)}"]`);
    if (el) this.selectConversationEl(el);
  }
  async selectConversationEl(item) {
    this.els.chatApp?.classList.add("is-chat-open");

    this.els.conversationItems.forEach(i => i.classList.remove("is-active"));
    item.classList.add("is-active");

    const userName = item.dataset.user;
    const userAvatar = item.dataset.avatar;
    const otherId = item.dataset.userId;

    this.activeOtherId = otherId;

    this.els.chatUserName.textContent = userName;
    this.els.headerAvatar.src = userAvatar;
    this.currentUserAvatar = userAvatar;

    this.applyUIForUser(userName);
    this.updateConversationStatuses();
    if (this.els.muteToggle) this.els.muteToggle.checked = this.mutedUsers.has(userName);

    await this.loadMessages(otherId, userAvatar, userName);
  }
  async loadMessages(otherId, otherAvatar, otherName) {
    try {
      const res = await fetch(`/api/messages?other=${encodeURIComponent(otherId)}&limit=200`, {
        credentials: "include",
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("loadMessages failed:", res.status, t);
        this.els.chatBody.innerHTML = `<div style="padding:16px;">Failed to load messages (${res.status})</div>`;
        return;
      }


      const msgs = await res.json();
      this.els.chatBody.innerHTML = "";

      msgs.forEach(m => {
        const isOutgoing = String(m.fromUserId) === String(this.meId);

        const row = document.createElement("div");
        row.className = `message-row ${isOutgoing ? "outgoing" : "incoming"}`;

        if (!isOutgoing) {
          row.innerHTML = `
          <div class="message-avatar">
            <img src="${otherAvatar}" alt="${this.escapeHtml(otherName)}" class="incoming-avatar">
          </div>
          <div class="message-bubble">${this.escapeHtml(m.text || "")}</div>
        `;
        } else {
          row.innerHTML = `<div class="message-bubble">${this.escapeHtml(m.text || "")}</div>`;
        }

        this.els.chatBody.appendChild(row);
      });

      this.els.chatBody.scrollTop = this.els.chatBody.scrollHeight;
    } catch (e) {
      console.error("loadMessages error", e);
    }
  }


}
window.customElements.define("com-messenger", ComMessenger);