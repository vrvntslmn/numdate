class ComMessenger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.blockedUsers = new Set();
    this.reportedUsers = new Set();

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

        *, *::before, *::after { box-sizing: border-box; }

        :host {
          display: block;
          background: #F5F5F5;
          font-family: 'Yanone Kaffeesatz', sans-serif;
        }

        main { padding: 0; max-width: 1400px; margin: 0 auto; }
        
        .chat-app {
          width: 100%;
          height: calc(100vh - 110px);
          background: #FFFFFF;
          display: flex;
          overflow: hidden;
          border-radius: 16px;
        }

        .sidebar {
          width: 350px;
          background: #FFFFFF;
          border-right: 1px solid #DBDBDB;
          display: flex;
          flex-direction: column;
        }

        .stories-header { padding: 16px 20px; border-bottom: 1px solid #EFEFEF; }
        .stories-scroll { display: flex; gap: 16px; overflow-x: auto; }
        .stories-scroll::-webkit-scrollbar { display: none; }

        .story-profile {
          min-width: 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        .story-avatar {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: #E0E0E0;
          overflow: hidden;
        }
        .story-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .story-name { margin-top: 6px; width: 48px; height: 4px; border-radius: 2px; background: #DBDBDB; }

        .conversation-list { padding: 8px 0; overflow-y: auto; flex: 1; }
        .conversation-list::-webkit-scrollbar { width: 0; }

        .conversation-item {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .conversation-item:hover { background: #FAFAFA; }
        .conversation-item.is-active { background: #EFEFEF; }

        .conversation-avatar {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          margin-right: 12px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .conversation-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .conversation-text { flex: 1; min-width: 0; }

        .conversation-name {
          font-size: 14px; font-weight: 600;
          color: #262626; margin-bottom: 4px;
          font-family: 'Roboto Condensed', sans-serif;
        }
        .conversation-snippet {
          font-size: 13px; color: #8E8E8E;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .conversation-status {
          width: 8px; height: 8px; border-radius: 50%;
          background: #44B700;
          margin-left: 8px; flex-shrink: 0;
        }

        .conversation-item.hidden-status .conversation-status { display: none; }

        .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
        }

        .chat-header {
          background: #FFFFFF;
          border-bottom: 1px solid #DBDBDB;
          height: 72px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
        }

        .back-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: none; background: transparent;
          color: #262626; font-size: 28px;
          display: flex; justify-content: center; align-items: center;
          cursor: pointer; transition: background 0.2s ease;
        }
        .back-btn:hover { background: #FAFAFA; }

        .chat-user-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #E0E0E0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .chat-user-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .chat-user-info { display: flex; flex-direction: column; justify-content: center; }
        .chat-user-name {
          font-size: 16px; font-weight: 600;
          color: #262626;
          font-family: 'Roboto Condensed', sans-serif;
        }

        .chat-user-status {
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8E8E8E;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #44B700; }

        .chat-user-status.hidden-status .status-dot,
        .chat-user-status.hidden-status span { display: none; }

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

        .block-btn, .report-btn {
          border: none;
          border-radius: 18px;
          padding: 6px 12px;
          cursor: pointer;
          font-family: 'Roboto Condensed', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .block-btn { background: #FF4C4C; color: #fff; }
        .block-btn:hover { background: #E04444; }
        .report-btn { background: #FFC107; color: #fff; }
        .report-btn:hover { background: #E0A800; }

        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-body::-webkit-scrollbar { width: 6px; }
        .chat-body::-webkit-scrollbar-thumb { background: #DBDBDB; border-radius: 3px; }

        .message-row { display: flex; gap: 8px; align-items: flex-start; }
        .message-row.incoming { justify-content: flex-start; }
        .message-row.outgoing { justify-content: flex-end; }

        .message-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          flex-shrink: 0;
          overflow: hidden;
        }
        .message-avatar img { width: 100%; height: 100%; object-fit: cover; }

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
        .message-row.incoming .message-bubble { background: #EFEFEF; color: #262626; }
        .message-row.outgoing .message-bubble { background: rgb(250, 233, 236); color: #262626; }

        .chat-footer {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border-top: 1px solid #EFEFEF;
          position: relative;
        }

        .attachments-bar { display: flex; gap: 8px; }

        .icon-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease;
        }
        .icon-btn:hover { background: #FAFAFA; }
        .icon-btn:disabled { opacity: 0.4; cursor: default; }
        .icon-btn svg { width: 20px; height: 20px; }
        .icon-btn svg path { fill: #262626; stroke: #262626; }

        .message-form { display: flex; flex: 1; gap: 8px; }
        .message-input {
          flex: 1;
          border-radius: 22px;
          border: 1px solid #DBDBDB;
          padding: 10px 16px;
          font-size: 14px;
          outline: none;
          font-family: 'Roboto Condensed', sans-serif;
          transition: border 0.2s ease;
          background: #FAFAFA;
        }
        .message-input:focus { border-color: #A8A8A8; background: #FFFFFF; }
        .message-input::placeholder { color: #8E8E8E; }

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
        .send-btn:hover { opacity: 0.7; }
        .send-btn:disabled { opacity: 0.3; cursor: default; }

        .emoji-panel {
          position: absolute;
          bottom: 60px;
          left: 70px;
          background: #FFFFFF;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          padding: 8px 10px;
          display: none;
          gap: 6px;
          flex-wrap: wrap;
          max-width: 260px;
          z-index: 5;
        }
        .emoji-panel.is-open { display: flex; }

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
          background: rgba(0,0,0,0.35);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .date-overlay.is-open { display: flex; }

        .date-dialog {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 24px 20px 18px;
          width: 320px;
          max-width: 90%;
          text-align: center;
          font-family: 'Roboto Condensed', sans-serif;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
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
        .date-dialog-buttons { display: flex; justify-content: center; gap: 10px; }
        .date-dialog-buttons button {
          border: none;
          border-radius: 999px;
          padding: 7px 16px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Roboto Condensed', sans-serif;
        }
        .date-dialog-cancel { background: #F5F5F5; color: #333; }
        .date-dialog-send { background: #EE0067; color: #fff; }

        .footer-banner {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          text-align: center;
          font-family: 'Roboto Condensed', sans-serif;
          font-size: 14px;
          display: none;
        }

        @media (max-width: 960px) {
          .sidebar { display: none; }
          .emoji-panel { left: 20px; }
        }
      </style>

      <main>
        <div class="chat-app">
          <aside class="sidebar">
            <div class="stories-header">
              <div class="stories-scroll">
                ${["profile2.jpg", "profile3.jpg", "profile4.jpg", "profile5.jpg", "image.jpeg"].map(p => `
                  <div class="story-profile">
                    <div class="story-avatar"><img src="img/${p}" alt="Story"></div>
                    <div class="story-name"></div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="conversation-list">
              <div class="conversation-item is-active" data-user="Тэмүүжин" data-avatar="img/profile2.jpg">
                <div class="conversation-avatar"><img src="img/profile2.jpg" alt="Тэмүүжин"></div>
                <div class="conversation-text">
                  <div class="conversation-name">Тэмүүжин</div>
                  <div class="conversation-snippet">Сайн уу, яаж байна?</div>
                </div>
                <div class="conversation-status"></div>
              </div>

              <div class="conversation-item" data-user="Jennie Kim" data-avatar="img/profile3.jpg">
                <div class="conversation-avatar"><img src="img/profile3.jpg" alt="Jennie Kim"></div>
                <div class="conversation-text">
                  <div class="conversation-name">Jennie Kim</div>
                  <div class="conversation-snippet">See you tomorrow!</div>
                </div>
                <div class="conversation-status"></div>
              </div>

              <div class="conversation-item" data-user="Анударь" data-avatar="img/profile4.jpg">
                <div class="conversation-avatar"><img src="img/profile4.jpg" alt="Анударь"></div>
                <div class="conversation-text">
                  <div class="conversation-name">Анударь</div>
                  <div class="conversation-snippet">Маргааш уулзъя</div>
                </div>
                <div class="conversation-status"></div>
              </div>

              <div class="conversation-item" data-user="Үүрээ" data-avatar="img/profile5.jpg">
                <div class="conversation-avatar"><img src="img/profile5.jpg" alt="Үүрээ"></div>
                <div class="conversation-text">
                  <div class="conversation-name">Үүрээ</div>
                  <div class="conversation-snippet">Баярлалаа!</div>
                </div>
                <div class="conversation-status"></div>
              </div>
            </div>
          </aside>

          <section class="chat-panel">
            <header class="chat-header">
              <button class="back-btn" aria-label="Back">‹</button>

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

              <div class="chat-user-actions">
                <button class="block-btn" id="blockBtn">Block</button>
                <button class="report-btn" id="reportBtn">Report</button>
              </div>
            </header>

            <div class="chat-body" id="chatBody">
              <div class="message-row incoming">
                <div class="message-avatar">
                  <img src="img/profile2.jpg" alt="User" class="incoming-avatar">
                </div>
                <div class="message-bubble">Сайн уу! Яаж байна?</div>
              </div>

              <div class="message-row outgoing">
                <div class="message-bubble">Сайн байна! Чи яаж байна?</div>
              </div>

              <div class="message-row incoming">
                <div class="message-avatar">
                  <img src="img/profile2.jpg" alt="User" class="incoming-avatar">
                </div>
                <div class="message-bubble">Би ч бас сайн. Маргааш уулзах уу?</div>
              </div>
            </div>

            <footer class="chat-footer">
              <div class="footer-banner" id="footerBanner"></div>

              <div class="attachments-bar" id="attachmentsBar">
                <button type="button" class="icon-btn" id="dateBtn" title="Date invite">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z" fill="#1C274C"/>
                  </svg>
                </button>

                <button type="button" class="icon-btn" id="emojiBtn" title="Emoji">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M15.4754 9.51572C15.6898 10.3159 15.4311 11.0805 14.8977 11.2234C14.3642 11.3664 13.7579 10.8336 13.5435 10.0334C13.3291 9.23316 13.5877 8.4686 14.1212 8.32565C14.6547 8.18271 15.2609 8.71552 15.4754 9.51572Z" fill="#1C274C"/>
                    <path d="M9.67994 11.0687C9.89436 11.8689 9.63571 12.6335 9.10225 12.7764C8.56878 12.9194 7.9625 12.3865 7.74809 11.5863C7.53368 10.7861 7.79232 10.0216 8.32579 9.87863C8.85925 9.73569 9.46553 10.2685 9.67994 11.0687Z" fill="#1C274C"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM17.1789 13.3409C17.467 13.6385 17.4593 14.1133 17.1617 14.4014C16.9917 14.566 16.8128 14.7246 16.6256 14.8766L16.8441 15.3216C17.3971 16.4482 16.9214 17.8094 15.787 18.3464C14.6752 18.8728 13.3468 18.4085 12.8047 17.3043L12.5315 16.7477C11.2117 16.998 9.90919 16.9561 8.73026 16.6606C8.32847 16.5599 8.0844 16.1526 8.1851 15.7508C8.2858 15.349 8.69315 15.1049 9.09494 15.2056C10.2252 15.4889 11.5232 15.4924 12.841 15.1393C14.1588 14.7862 15.2811 14.1342 16.1183 13.3237C16.4159 13.0356 16.8908 13.0433 17.1789 13.3409Z" fill="#1C274C"/>
                  </svg>
                </button>
              </div>

              <div class="emoji-panel" id="emojiPanel">
                ${["😀", "😂", "🥰", "😍", "😎", "🤭", "🙈", "❤️", "✨", "🫶", "🩷", "💛", "💘", "🥂"].map(e => `
                  <button type="button" class="emoji-item" data-emoji="${e}">${e}</button>
                `).join("")}
              </div>

              <div class="date-overlay" id="dateOverlay" aria-hidden="true">
                <div class="date-dialog" role="dialog" aria-modal="true">
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
                <input type="text" class="message-input" id="messageInput" placeholder="Message..." autocomplete="off" />
                <button type="submit" class="send-btn" id="sendBtn">Send</button>
              </form>
            </footer>
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
      conversationItems: $$(".conversation-item"),
      emojiItems: $$(".emoji-item"),
    };

    this.currentUserAvatar = this.els.headerAvatar?.getAttribute("src") || this.currentUserAvatar;

    this.bindEvents();

    const active = this.getActiveConversationEl();
    if (active) this.applyUIForUser(active.dataset.user);
  }

  bindEvents() {
    const { messageForm, messageInput, chatBody } = this.els;

    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const active = this.getActiveConversationEl();
      const user = active?.dataset.user;
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      const text = messageInput.value.trim();
      if (!text) return;

      const row = document.createElement("div");
      row.className = "message-row outgoing";
      row.innerHTML = `<div class="message-bubble">${this.escapeHtml(text)}</div>`;
      chatBody.appendChild(row);

      messageInput.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;
    });

    this.els.conversationItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.els.conversationItems.forEach((i) => i.classList.remove("is-active"));
        item.classList.add("is-active");

        const userName = item.dataset.user;
        const userAvatar = item.dataset.avatar;

        this.els.chatUserName.textContent = userName;
        this.els.headerAvatar.src = userAvatar;
        this.currentUserAvatar = userAvatar;

        this.els.chatBody.innerHTML = `
          <div class="message-row incoming">
            <div class="message-avatar">
              <img src="${userAvatar}" alt="${this.escapeHtml(userName)}" class="incoming-avatar">
            </div>
            <div class="message-bubble">Сайн уу!</div>
          </div>
        `;

        this.updateIncomingAvatars();
        this.applyUIForUser(userName);
        this.updateConversationStatuses();
      });
    });

    this.els.emojiBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;
      this.els.emojiPanel.classList.toggle("is-open");
    });

    this.els.emojiItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = this.getActiveUserName();
        if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

        const emoji = btn.dataset.emoji;
        this.els.messageInput.value += emoji;
        this.els.messageInput.focus();
      });
    });

    this.els.dateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      this.els.dateOverlay.classList.add("is-open");
      this.els.dateOverlay.setAttribute("aria-hidden", "false");
      this.els.emojiPanel.classList.remove("is-open");
    });

    this.els.dateCancelBtn.addEventListener("click", () => {
      this.closeDateOverlay();
    });

    this.els.dateSendBtn.addEventListener("click", () => {
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      const text = "Болзоонд явах уу? 🫶";
      const row = document.createElement("div");
      row.className = "message-row outgoing";
      row.innerHTML = `<div class="message-bubble">${this.escapeHtml(text)}</div>`;
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

      const sure = window.confirm(`${userName}-г блоклох уу? Мессеж илгээх боломжгүй болно`);
      if (!sure) return;

      this.blockedUsers.add(userName);

      this.els.headerStatus.classList.add("hidden-status");

      this.updateConversationStatuses();
      this.applyUIForUser(userName);

      window.alert(`\${userName} has been blocked`);
    });

    this.els.reportBtn.addEventListener("click", () => {
      const userName = this.getActiveUserName();
      if (!userName) return;

      const reason = window.prompt(`\${userName}-г мэдээлэх шалтгааныг тодорхой бичнэ үү:`);
      if (reason === null) return;
      if (reason.trim() === "") {
        window.alert("Report cancelled — reason is required.");
        return;
      }

      const sure = window.confirm(`Та үнэхээр \${userName}-г дараах шалтгаанаар мэдээлэхийг хүсч байна уу:\\n"\${reason}"`);
      if (!sure) return;

      this.reportedUsers.add(userName);

      this.els.headerStatus.classList.add("hidden-status");

      this.updateConversationStatuses();
      this.applyUIForUser(userName);

      window.alert(`Reported \${userName}.\\nReason: \${reason}`);
    });

    this.shadowRoot.addEventListener("click", (e) => {
      const withinEmoji = e.composedPath().includes(this.els.emojiPanel);
      const withinEmojiBtn = e.composedPath().includes(this.els.emojiBtn);
      if (!withinEmoji && !withinEmojiBtn) {
        this.els.emojiPanel.classList.remove("is-open");
      }
    });
  }

  closeDateOverlay() {
    this.els.dateOverlay.classList.remove("is-open");
    this.els.dateOverlay.setAttribute("aria-hidden", "true");
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
    this.els.conversationItems.forEach((item) => {
      const user = item.dataset.user;
      if (this.blockedUsers.has(user)) item.classList.add("hidden-status");
      else item.classList.remove("hidden-status");
    });
  }

  applyUIForUser(user) {
    const isBlocked = this.blockedUsers.has(user);
    const isReported = this.reportedUsers.has(user);

    if (!isBlocked && !isReported) {
      this.els.headerBanner.style.display = "none";
    } else {
      this.els.headerBanner.style.display = "inline-block";
      if (isBlocked && isReported) {
        this.els.headerBanner.textContent = "Blocked & reported";
        this.els.headerBanner.style.background = "#FFE6E6";
        this.els.headerBanner.style.color = "#B00020";
      } else if (isBlocked) {
        this.els.headerBanner.textContent = "Blocked";
        this.els.headerBanner.style.background = "#FFE6E6";
        this.els.headerBanner.style.color = "#B00020";
      } else {
        this.els.headerBanner.textContent = "Reported";
        this.els.headerBanner.style.background = "#FFF7E6";
        this.els.headerBanner.style.color = "#8A5F00";
      }
    }

    if (!isBlocked && !isReported) {
      this.els.footerBanner.style.display = "none";
      this.els.footerBanner.textContent = "";

      this.els.attachmentsBar.style.display = "flex";
      this.els.messageForm.style.display = "flex";

      this.els.emojiBtn.disabled = false;
      this.els.dateBtn.disabled = false;

      return;
    }

    this.els.attachmentsBar.style.display = "none";
    this.els.messageForm.style.display = "none";
    this.els.emojiPanel.classList.remove("is-open");
    this.closeDateOverlay();

    this.els.emojiBtn.disabled = true;
    this.els.dateBtn.disabled = true;

    this.els.footerBanner.style.display = "block";

    if (isBlocked && isReported) {
      this.els.footerBanner.textContent = "This user is blocked and reported — messaging disabled.";
      this.els.footerBanner.style.background = "#FFE6E6";
      this.els.footerBanner.style.color = "#B00020";
    } else if (isBlocked) {
      this.els.footerBanner.textContent = "You have blocked this user — messaging disabled.";
      this.els.footerBanner.style.background = "#FFE6E6";
      this.els.footerBanner.style.color = "#B00020";
    } else {
      this.els.footerBanner.textContent = "You reported this user — messaging disabled.";
      this.els.footerBanner.style.background = "#FFF7E6";
      this.els.footerBanner.style.color = "#8A5F00";
    }
  }
}
window.customElements.define("com-messenger", ComMessenger);
