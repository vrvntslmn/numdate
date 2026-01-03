class ComMessenger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.blockedUsers = new Set();
    this.reportedUsers = new Set();
    this.mutedUsers = new Set();

    this.currentUserAvatar = "img/profile2.jpg";
    this._rendered = false;

    this._pendingOtherId = null;
    this.me = null;
    this.meId = null;
    this.activeOtherId = null;

    this._onHashChange = this._onHashChange.bind(this);
  }

  /* ================= ROUTE HELPERS ================= */

  _getHashQuery(key) {
    const h = window.location.hash || "";
    const q = h.includes("?") ? h.split("?")[1] : "";
    return q ? new URLSearchParams(q).get(key) : null;
  }

  _handleHashParams() {
    const other = this._getHashQuery("other");
    if (!other) return;

    // list render болсон бол шууд select
    if (this.els?.conversationItems?.length) {
      this.selectConversationByUserId(String(other));
    } else {
      this._pendingOtherId = String(other);
    }
  }

  _onHashChange() {
    // hash өөрчлөгдөхөд other= ирвэл select
    this._handleHashParams();
  }

  /* ================= LIFECYCLE ================= */

  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;

    window.addEventListener("hashchange", this._onHashChange);

    this.shadowRoot.innerHTML = `
      <style>
        /* ======= ТАНЫ CSS ХЭВЭЭРЭЭ (тасалсангүй) ======= */
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        :host{display:block;font-family:'Yanone Kaffeesatz',sans-serif;--topbar-h:56px;--bottombar-h:56px;--nav-total:calc(var(--topbar-h) + var(--bottombar-h));--vh:1vh;--bg:#F5F5F5;--panel:#FFFFFF;--panel-2:#F5F5F7;--text:#101828;--text-2:#444;--muted:#8E8E8E;--border:#DBDBDB;--border-soft:#EFEFEF;--bubble-in:#EFEFEF;--bubble-in-text:#262626;--bubble-out:rgb(250,233,236);--bubble-out-text:#262626;--icon:#262626;background:var(--bg);color:var(--text);}
        :host([theme="dark"]){--bg:#000;--panel:#000;--panel-2:#111C33;--text:#E5E7EB;--text-2:#E5E7EB;--muted:#9CA3AF;--border:#1F2937;--border-soft:#1F2937;--bubble-in:#1F2937;--bubble-in-text:#E5E7EB;--bubble-out:#2A1B24;--bubble-out-text:#E5E7EB;--icon:#E5E7EB;}
        @media (prefers-color-scheme: dark){:host(:not([theme])){--bg:#000;--panel:#000;--panel-2:#111C33;--text:#E5E7EB;--text-2:#E5E7EB;--muted:#9CA3AF;--border:#1F2937;--border-soft:#1F2937;--bubble-in:#1F2937;--bubble-in-text:#E5E7EB;--bubble-out:#2A1B24;--bubble-out-text:#E5E7EB;--icon:#E5E7EB;}}
        main{padding:0;max-width:1400px;margin:0 auto;}
        .chat-app{width:100%;height:calc((var(--vh) * 100) - var(--nav-total));background:var(--panel);display:flex;overflow:hidden;border-radius:16px;}
        .sidebar{width:350px;background:var(--panel);border-right:1px solid var(--border);display:flex;flex-direction:column;}
        .stories-header{padding:16px 20px;border-bottom:1px solid #EFEFEF;}
        .search-box{display:flex;align-items:center;gap:8px;width:100%;padding:6px 12px;border-radius:999px;background:var(--panel-2);border:1px solid var(--border);}
        .search-input{border:none;outline:none;background:transparent;font-family:'Roboto Condensed',sans-serif;font-size:14px;color:var(--text-2);width:100%;}
        .search-input::placeholder{color:var(--muted);}
        .conversation-list{padding:8px 0;overflow-y:auto;flex:1;}
        .conversation-list::-webkit-scrollbar{width:0;}
        .conversation-item{display:flex;align-items:center;padding:8px 16px;cursor:pointer;transition:background .15s ease;}
        .conversation-item:hover{background:color-mix(in srgb,var(--panel) 92%, white);}
        .conversation-item.is-active{background:color-mix(in srgb,var(--panel) 85%, white);}
        .conversation-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);margin-right:12px;flex-shrink:0;overflow:hidden;}
        .conversation-avatar img{width:100%;height:100%;object-fit:cover;}
        .conversation-text{flex:1;min-width:0;}
        .conversation-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;font-family:'Roboto Condensed',sans-serif;}
        .conversation-snippet{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .conversation-status{width:8px;height:8px;border-radius:50%;background:#44B700;margin-left:8px;flex-shrink:0;}
        .conversation-item.hidden-status .conversation-status{display:none;}
        .chat-panel{flex:1;display:flex;flex-direction:column;background:var(--panel);position:relative;}
        .chat-header{background:var(--panel);border-bottom:1px solid var(--border);height:72px;display:flex;align-items:center;padding:0 20px;gap:12px;}
        .back-btn{width:40px;height:40px;border-radius:50%;border:none;background:transparent;color:#262626;font-size:28px;display:flex;justify-content:center;align-items:center;cursor:pointer;transition:background .2s ease;}
        .back-btn:hover{background:#FAFAFA;}
        .chat-user-avatar{width:48px;height:48px;border-radius:50%;background:#E0E0E0;overflow:hidden;}
        .chat-user-avatar img{width:100%;height:100%;object-fit:cover;}
        .chat-user-name{font-size:16px;font-weight:600;color:var(--text);font-family:'Roboto Condensed',sans-serif;}
        .chat-user-status{margin-top:2px;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);}
        .status-dot{width:6px;height:6px;border-radius:50%;background:#44B700;}
        .chat-user-status.hidden-status .status-dot,.chat-user-status.hidden-status span{display:none;}
        .header-banner{margin-left:8px;padding:4px 10px;border-radius:999px;font-family:'Roboto Condensed',sans-serif;font-size:12px;display:none;white-space:nowrap;}
        .chat-user-actions{margin-left:auto;display:flex;gap:10px;align-items:center;}
        .more-btn{width:32px;height:32px;border-radius:50%;border:none;background:transparent;cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:3px;padding:0;}
        .more-btn span{width:3px;height:3px;border-radius:50%;background:var(--icon);}
        .more-btn:hover{background:#FAFAFA;}
        .details-panel{position:absolute;top:0;right:0;bottom:0;width:320px;background:var(--panel);border-left:1px solid var(--border);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;z-index:20;}
        .details-panel.is-open{transform:translateX(0);}
        .details-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #EFEFEF;font-family:'Roboto Condensed',sans-serif;font-size:15px;font-weight:600;}
        .details-close{border:none;background:transparent;cursor:pointer;font-size:18px;line-height:1;padding:4px;border-radius:50%;}
        .details-close:hover{background:#F5F5F5;}
        .details-section{padding:14px 18px;border-bottom:1px solid #F5F5F5;display:flex;align-items:center;justify-content:space-between;gap:8px;font-family:'Roboto Condensed',sans-serif;font-size:14px;}
        .details-bottom{margin-top:auto;padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;border-top:1px solid #F5F5F5;}
        .details-danger-btn{border:none;background:transparent;padding:6px 0;text-align:left;font-family:'Roboto Condensed',sans-serif;font-size:14px;color:#ED4956;font-weight:600;cursor:pointer;}
        .details-danger-btn:hover{opacity:.7;}
        .switch{position:relative;display:inline-block;width:36px;height:20px;}
        .switch input{opacity:0;width:0;height:0;}
        .slider{position:absolute;inset:0;border-radius:999px;background-color:#DDD;}
        .slider::before{content:"";position:absolute;width:14px;height:14px;border-radius:50%;background:var(--panel);left:3px;top:3px;transition:transform .2s ease;}
        .switch input:checked+.slider{background-color:#33b76e;}
        .switch input:checked+.slider::before{transform:translateX(16px);}
        .chat-body{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;}
        .message-row{display:flex;gap:8px;align-items:flex-start;}
        .message-row.incoming{justify-content:flex-start;}
        .message-row.outgoing{justify-content:flex-end;}
        .message-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);flex-shrink:0;overflow:hidden;}
        .message-avatar img{width:100%;height:100%;object-fit:cover;}
        .message-bubble{max-width:60%;min-height:36px;padding:10px 14px;border-radius:18px;font-size:14px;line-height:18px;word-wrap:break-word;font-family:'Roboto Condensed',sans-serif;}
        .message-row.incoming .message-bubble{background:var(--bubble-in);color:var(--bubble-in-text);}
        .message-row.outgoing .message-bubble{background:var(--bubble-out);color:var(--bubble-out-text);}
        .chat-footer{padding:12px 20px;display:flex;align-items:center;gap:10px;background:var(--panel);border-top:1px solid var(--border-soft);position:relative;}
        .footer-banner{width:100%;padding:14px 18px;border-radius:12px;text-align:center;font-family:'Roboto Condensed',sans-serif;font-size:14px;display:none;}
        .attachments-bar{display:flex;gap:8px;flex-shrink:0;}
        .icon-btn{width:36px;height:36px;border-radius:50%;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s ease;}
        .icon-btn:hover{background:#aaacf2ff;}
        .icon-btn:disabled{opacity:.4;cursor:default;}
        .message-form{flex:1;display:flex;align-items:center;gap:8px;margin:0;}
        .message-input{flex:1;border-radius:22px;padding:10px 16px;font-size:14px;outline:none;font-family:'Roboto Condensed',sans-serif;background:var(--panel-2);border:1px solid var(--border);color:var(--text);}
        .send-btn{min-width:60px;height:36px;border-radius:18px;border:none;background:transparent;color:#EE0067;cursor:pointer;font-size:14px;font-weight:600;font-family:'Roboto Condensed',sans-serif;}
        .emoji-panel{position:absolute;bottom:80px;left:70px;background:var(--panel);border-radius:18px;box-shadow:0 4px 16px rgba(0,0,0,.15);padding:8px 10px;display:none;gap:6px;flex-wrap:wrap;max-width:260px;z-index:5;}
        .emoji-panel.is-open{display:flex;}
        .emoji-item{border:none;background:transparent;font-size:20px;cursor:pointer;padding:4px;}
        .date-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;align-items:center;justify-content:center;z-index:50;}
        .date-overlay.is-open{display:flex;}
        .date-dialog{background:var(--panel);border-radius:24px;padding:24px 20px 18px;width:320px;max-width:90%;text-align:center;font-family:'Roboto Condensed',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);}
        .date-dialog-title{font-size:22px;font-weight:700;margin-bottom:8px;color:#EE0067;}
        .date-dialog-text{font-size:15px;margin-bottom:18px;color:#444;}
        .date-dialog-buttons{display:flex;justify-content:center;gap:10px;}
        .date-dialog-buttons button{border:none;border-radius:999px;padding:7px 16px;font-size:14px;cursor:pointer;font-family:'Roboto Condensed',sans-serif;}
        .date-dialog-cancel{background:#F5F5F5;color:#333;}
        .date-dialog-send{background:#EE0067;color:#fff;}
        .empty-state{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:var(--panel);text-align:center;font-family:'Roboto Condensed',sans-serif;}
        .empty-btn{padding:8px 16px;border-radius:999px;border:none;background:#3b82f6;color:#fff;font-size:14px;font-weight:600;cursor:pointer;}
        @media (max-width:960px){.chat-app{height:calc(100vh - 90px);} .sidebar{display:flex;width:100%;border-right:none;} .chat-panel{display:none;width:100%;} .chat-app.is-chat-open .sidebar{display:none;} .chat-app.is-chat-open .chat-panel{display:flex;} .details-panel{width:100%;} .emoji-panel{left:20px;}}
      </style>

      <main>
        <div class="chat-app">
          <aside class="sidebar">
            <div class="stories-header">
              <div class="search-box">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="#B0B3B8" stroke-width="1.5"/>
                  <path d="M15 15L19 19" stroke="#B0B3B8" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input id="conversationSearch" class="search-input" type="text"
                  placeholder="Search" autocomplete="off" />
              </div>
            </div>
            <div class="conversation-list" id="conversationList"></div>
          </aside>

          <section class="chat-panel">
            <header class="chat-header">
              <button class="back-btn" aria-label="Back">‹</button>

              <div class="chat-user-avatar">
                <img src="img/profile2.jpg" alt="User" id="headerAvatar">
              </div>

              <div class="chat-user-info">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="chat-user-name" id="chatUserName">Messages</div>
                  <span class="header-banner" id="headerBanner"></span>
                </div>
                <div class="chat-user-status" id="headerStatus">
                  <span class="status-dot"></span>
                  <span>Active now</span>
                </div>
              </div>

              <div class="chat-user-actions">
                <button class="more-btn" id="actionsToggle" aria-label="More">
                  <span></span><span></span><span></span>
                </button>
              </div>
            </header>

            <div class="chat-body" id="chatBody"></div>

            <div class="empty-state" id="emptyState">
              <div class="empty-title">Your messages</div>
              <div class="empty-subtitle">Send a message to start a chat.</div>
              <button class="empty-btn" id="emptyNewMessageBtn">Send message</button>
            </div>

            <footer class="chat-footer">
              <div class="footer-banner" id="footerBanner"></div>

              <div class="attachments-bar" id="attachmentsBar">
                <button type="button" class="icon-btn" id="dateBtn" title="Date invite">📅</button>
                <button type="button" class="icon-btn" id="emojiBtn" title="Emoji">😊</button>
              </div>

              <div class="emoji-panel" id="emojiPanel">
                <button type="button" class="emoji-item" data-emoji="😀">😀</button>
                <button type="button" class="emoji-item" data-emoji="😂">😂</button>
                <button type="button" class="emoji-item" data-emoji="🥰">🥰</button>
                <button type="button" class="emoji-item" data-emoji="😍">😍</button>
                <button type="button" class="emoji-item" data-emoji="😎">😎</button>
                <button type="button" class="emoji-item" data-emoji="❤️">❤️</button>
              </div>

              <div class="date-overlay" id="dateOverlay" aria-hidden="true">
                <div class="date-dialog">
                  <div class="date-dialog-title">Болзоонд явах уу? 🫶</div>
                  <div class="date-dialog-text">Илгээх үү?</div>
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

              <div class="confirm-overlay" id="confirmOverlay" aria-hidden="true"></div>
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
      emojiItems: $$(".emoji-item"),
      dateBtn: $("#dateBtn"),
      dateOverlay: $("#dateOverlay"),
      dateCancelBtn: $("#dateCancelBtn"),
      dateSendBtn: $("#dateSendBtn"),
      conversationList: $("#conversationList"),
      actionsToggle: $("#actionsToggle"),
      detailsPanel: $("#detailsPanel"),
      detailsCloseBtn: $("#detailsCloseBtn"),
      muteToggle: $("#muteToggle"),
      reportBtn: $("#reportBtn"),
      blockBtn: $("#blockBtn"),
      deleteChatBtn: $("#deleteChatBtn"),
      searchInput: $("#conversationSearch"),
      emptyState: $("#emptyState"),
      emptyNewMessageBtn: $("#emptyNewMessageBtn"),
      chatApp: this.shadowRoot.querySelector(".chat-app"),
      backBtn: this.shadowRoot.querySelector(".back-btn"),
      conversationItems: [],
      // confirm overlay-ын чинь full UI-г та оруулаагүй болохоор мини хувилбар дээр minimal үлдээлээ
      confirmOverlay: $("#confirmOverlay"),
      confirmTitle: null,
      confirmText: null,
      confirmPrimaryBtn: null,
      confirmCancelBtn: null,
    };

    this.currentUserAvatar =
      this.els.headerAvatar?.getAttribute("src") || this.currentUserAvatar;

    this.bindEvents();
    this.updateEmptyState();

    // hash param (other=) хадгална
    this._handleHashParams();

    this.initAuthAndUsers();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._onHashChange);
  }

  /* ================= EVENTS ================= */

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
      backBtn,
      chatApp,
    } = this.els;

    // details toggle
    if (actionsToggle && detailsPanel) {
      actionsToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        detailsPanel.classList.toggle("is-open");
      });
    }
    detailsCloseBtn?.addEventListener("click", () => detailsPanel?.classList.remove("is-open"));

    // send message
    messageForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const active = this.getActiveConversationEl();
      if (!active) return;

      const userName = active.dataset.user || "";
      if (userName && (this.blockedUsers.has(userName) || this.reportedUsers.has(userName))) return;

      const otherId = active.dataset.userId;
      if (!otherId) return;

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
        if (!res.ok) console.error("send failed", await res.text());
      } catch (err) {
        console.error("send error", err);
      }
    });

    // mobile back
    backBtn?.addEventListener("click", () => {
      chatApp?.classList.remove("is-chat-open");
      this.els.detailsPanel?.classList.remove("is-open");
      this.els.emojiPanel?.classList.remove("is-open");
      this.closeDateOverlay();
      this.els.searchInput?.focus();
    });

    // search
    searchInput?.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase().trim();
      this.els.conversationItems.forEach((item) => {
        const name = (item.dataset.user || "").toLowerCase();
        const snippet = (item.querySelector(".conversation-snippet")?.textContent || "").toLowerCase();
        const ok = !q || name.includes(q) || snippet.includes(q);
        item.style.display = ok ? "flex" : "none";
      });
    });

    emptyNewMessageBtn?.addEventListener("click", () => this.els.searchInput?.focus());

    // emoji toggle
    this.els.emojiBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;
      this.els.emojiPanel?.classList.toggle("is-open");
    });

    // emoji pick
    this.els.emojiItems?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = this.getActiveUserName();
        if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;
        const emoji = btn.dataset.emoji || "";
        this.els.messageInput.value += emoji;
        this.els.messageInput.focus();
      });
    });

    // date open/close/send
    this.els.dateBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      this.els.dateOverlay?.classList.add("is-open");
      this.els.dateOverlay?.setAttribute("aria-hidden", "false");
      this.els.emojiPanel?.classList.remove("is-open");
    });

    this.els.dateCancelBtn?.addEventListener("click", () => this.closeDateOverlay());

    this.els.dateSendBtn?.addEventListener("click", async () => {
      const user = this.getActiveUserName();
      if (user && (this.blockedUsers.has(user) || this.reportedUsers.has(user))) return;

      const active = this.getActiveConversationEl();
      const otherId = active?.dataset.userId;
      if (!otherId) return;

      const text = "Болзоонд явах уу? 🫶";

      // optimistic
      const row = document.createElement("div");
      row.className = "message-row outgoing";
      row.innerHTML = `<div class="message-bubble">${this.escapeHtml(text)}</div>`;
      this.els.chatBody.appendChild(row);
      this.els.chatBody.scrollTop = this.els.chatBody.scrollHeight;

      this.closeDateOverlay();

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ other: otherId, text, type: "date" }),
        });
        if (!res.ok) console.error("date send failed", await res.text());
      } catch (err) {
        console.error("date send error", err);
      }
    });

    this.els.dateOverlay?.addEventListener("click", (e) => {
      if (e.target === this.els.dateOverlay) this.closeDateOverlay();
    });

    // mute
    muteToggle?.addEventListener("change", () => {
      const userName = this.getActiveUserName();
      if (!userName) return;

      if (muteToggle.checked) this.mutedUsers.add(userName);
      else this.mutedUsers.delete(userName);

      this.applyUIForUser(userName);
    });

    // global click to close panels
    this.shadowRoot.addEventListener("click", (e) => {
      const path = e.composedPath();

      const withinEmoji = this.els.emojiPanel && path.includes(this.els.emojiPanel);
      const withinEmojiBtn = this.els.emojiBtn && path.includes(this.els.emojiBtn);
      if (!withinEmoji && !withinEmojiBtn) this.els.emojiPanel?.classList.remove("is-open");

      const withinDetails = this.els.detailsPanel && path.includes(this.els.detailsPanel);
      const withinDetailsBtn = this.els.actionsToggle && path.includes(this.els.actionsToggle);
      if (!withinDetails && !withinDetailsBtn) this.els.detailsPanel?.classList.remove("is-open");
    });

    // (block/report/delete UI чинь confirm overlay-оос хамаараад их кодтой байсан – энд minimal үлдээсэн)
    deleteChatBtn?.addEventListener("click", () => {
      // UI дээрээс л арилгана (DB delete байхгүй)
      this.els.chatBody.innerHTML = "";
      const active = this.getActiveConversationEl();
      if (active) {
        active.remove();
        this.els.conversationItems = this.els.conversationItems.filter((el) => el !== active);
      }
      this.updateEmptyState();
    });
  }

  /* ================= OVERLAYS ================= */

  closeDateOverlay() {
    this.els.dateOverlay?.classList.remove("is-open");
    this.els.dateOverlay?.setAttribute("aria-hidden", "true");
  }

  /* ================= UI HELPERS ================= */

  updateEmptyState() {
    if (!this.els.emptyState) return;
    const hasConversations = (this.els.conversationList?.children.length || 0) > 0;
    this.els.emptyState.style.display = hasConversations ? "none" : "flex";
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  getActiveConversationEl() {
    return this.shadowRoot.querySelector(".conversation-item.is-active");
  }

  getActiveUserName() {
    return this.getActiveConversationEl()?.dataset.user || this.els.chatUserName?.textContent || null;
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

    if (this.els.muteToggle) this.els.muteToggle.checked = isMuted;

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
    this.els.emojiPanel?.classList.remove("is-open");
    this.closeDateOverlay();

    if (this.els.emojiBtn) this.els.emojiBtn.disabled = true;
    if (this.els.dateBtn) this.els.dateBtn.disabled = true;

    this.els.footerBanner.style.display = "block";
    this.els.footerBanner.style.background = "#F5F5F5";
    this.els.footerBanner.style.color = "#555";

    if (isBlocked && isReported) this.els.footerBanner.textContent = "Энэ хэрэглэгч блоклогдсон бас репортлосон байна.";
    else if (isBlocked) this.els.footerBanner.textContent = "Та энэ хэрэглэгчийн блоклосон байна.";
    else this.els.footerBanner.textContent = "Та энэ хэрэглэгчийг репортлосон байна.";
  }

  /* ================= API ================= */

  async fetchMe() {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  async fetchUsers() {
    try {
      const res = await fetch("/api/matches", { credentials: "include" });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  /* ================= INIT ================= */

  async initAuthAndUsers() {
    this.me = await this.fetchMe();

    // ✅ /api/me зассаны дараа _id string болно
    if (!this.me?._id) {
      this.renderConversationList([]);
      this.updateEmptyState();
      return;
    }

    this.meId = String(this.me._id);

    const users = await this.fetchUsers();

    const normalizeId = (u) => String(u.userId || u._id || "");
    const others = users.filter((u) => normalizeId(u) && normalizeId(u) !== this.meId);

    this.renderConversationList(others);

    // URL other=
    const wanted = this._pendingOtherId || this._getHashQuery("other");
    if (wanted) {
      this.selectConversationByUserId(String(wanted));
      this._pendingOtherId = null;
      return;
    }

    // default first
    const first = others[0];
    if (first) this.selectConversationByUserId(normalizeId(first));
    else this.updateEmptyState();
  }

  renderConversationList(list) {
    const wrap = this.els.conversationList;
    if (!wrap) return;

    wrap.innerHTML = "";

    list.forEach((u) => {
      const el = document.createElement("div");
      el.className = "conversation-item";

      const id = String(u.userId || u._id || "");
      const name = `${u.name || ""}`.trim() || "User";
      const avatar = u.avatar || "img/profile2.jpg";

      // ✅ dataset нь camelCase, HTML dataset selector нь kebab-case
      el.dataset.user = name;
      el.dataset.userId = id;
      el.dataset.avatar = avatar;

      el.innerHTML = `
        <div class="conversation-avatar">
          <img src="${this.escapeHtml(avatar)}" alt="${this.escapeHtml(name)}">
        </div>
        <div class="conversation-text">
          <div class="conversation-name">${this.escapeHtml(name)}</div>
          <div class="conversation-snippet"></div>
        </div>
        <div class="conversation-status"></div>
      `;

      el.addEventListener("click", () => this.selectConversationEl(el));
      wrap.appendChild(el);
    });

    this.els.conversationItems = Array.from(wrap.querySelectorAll(".conversation-item"));

    this.updateConversationStatuses();
    this.updateEmptyState();
  }

  // ✅ FIX: data-user-id selector ашиглана (dataset.userId -> attribute data-user-id)
  selectConversationByUserId(userId) {
    const safe = String(userId);
    const el = this.shadowRoot.querySelector(
      `.conversation-item[data-user-id="${CSS.escape(safe)}"]`
    );
    if (el) this.selectConversationEl(el);
  }

  async selectConversationEl(item) {
    this.els.chatApp?.classList.add("is-chat-open");

    this.els.conversationItems.forEach((i) => i.classList.remove("is-active"));
    item.classList.add("is-active");

    const userName = item.dataset.user || "User";
    const userAvatar = item.dataset.avatar || "img/profile2.jpg";
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
      if (!otherId) return;

      const res = await fetch(
        `/api/messages?other=${encodeURIComponent(otherId)}&limit=200`,
        { credentials: "include" }
      );

      if (!res.ok) {
        const t = await res.text();
        console.error("loadMessages failed:", res.status, t);
        this.els.chatBody.innerHTML = `<div style="padding:16px;">Failed to load messages (${res.status})</div>`;
        return;
      }

      const msgs = await res.json();
      this.els.chatBody.innerHTML = "";

      msgs.forEach((m) => {
        // ✅ server дээр string болгож буцаасан гэж үзнэ
        const isOutgoing = String(m.fromUserId) === String(this.meId);

        const row = document.createElement("div");
        row.className = `message-row ${isOutgoing ? "outgoing" : "incoming"}`;

        if (!isOutgoing) {
          row.innerHTML = `
            <div class="message-avatar">
              <img src="${this.escapeHtml(otherAvatar)}" alt="${this.escapeHtml(otherName)}">
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
