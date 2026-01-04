class ComNotif extends HTMLElement {
  constructor() {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onDocClick = this._onDocClick.bind(this);
  }

  connectedCallback() {
    this._notifInput = document.getElementById("notif");
    if (!this._notifInput) return;

    this._notifInput.addEventListener("click", this._onToggle);
    this.addEventListener("click", this._onClick);
    document.addEventListener("click", this._onDocClick);

    if (this._notifInput.checked) {
      this.classList.add("open");
      this.renderNotif();
    } else {
      this.classList.remove("open");
      this.innerHTML = "";
    }
  }

  disconnectedCallback() {
    this._notifInput?.removeEventListener("click", this._onToggle);
    this.removeEventListener("click", this._onClick);
    document.removeEventListener("click", this._onDocClick);
  }

  async _onToggle() {
    if (!this._notifInput) return;

    if (this._notifInput.checked) {
      this.classList.add("open");
      await this.renderNotif();
    } else {
      this._closePanel();
    }
  }

  _onClick(e) {
    const item = e.target.closest(".notifArt[data-open]");
    if (!item) return;

    const openWhat = item.getAttribute("data-open");
    if (openWhat === "match") {
      const matchId = item.getAttribute("data-match-id");
      const pairKey = item.getAttribute("data-pair-key");

      if (matchId) {
        this._goTo(`match?matchId=${encodeURIComponent(matchId)}`);
      /** } else if (pairKey) {
        this._goTo(`match?pairKey=${encodeURIComponent(pairKey)}`);
        */
      } else {
        console.warn("notif item дээр matchId алга байна");
        this._goTo("match");
      }

      this._closePanel();
      return;
    }

    if (openWhat === "dateidea") {
      this._goTo("match");
      this._closePanel();
      return;
    }
  }

  _onDocClick(e) {
    if (e.target.closest("label.notif")) return;
    if (e.target.closest("com-notif")) return;
    if (this._notifInput?.checked) this._closePanel();
  }

  _closePanel() {
    if (this._notifInput) this._notifInput.checked = false;
    this.classList.remove("open");
    this.innerHTML = "";
  }

  _goTo(routeWithQuery) {
    window.location.hash = `#/${routeWithQuery}`;
  }

  async _markMatchesSeen() {
    try {
      await fetch("/api/notifications/matches/seen", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) { }
  }
  async _markDateIdeasSeen() {
    try {
      await fetch("/api/notifications/dateideas/seen", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) { }
  }


  _refreshBadgeFromApp() {
    const appEl = document.querySelector("com-app");
    if (appEl && typeof appEl.refreshNotifBadge === "function") {
      appEl.refreshNotifBadge();
    }
  }

  _timeAgo(inputDate) {
    const d = inputDate ? new Date(inputDate) : null;
    if (!d || Number.isNaN(d.getTime())) return "now";

    const diffMs = Date.now() - d.getTime();
    const sec = Math.floor(diffMs / 1000);

    if (sec < 5) return "now";
    if (sec < 60) return `${sec}s ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;

    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d ago`;

    const wk = Math.floor(day / 7);
    if (wk < 4) return `${wk}w ago`;

    const mo = Math.floor(day / 30);
    if (mo < 12) return `${mo}mo ago`;

    const yr = Math.floor(day / 365);
    return `${yr}y ago`;
  }

  async _fetchNotifs() {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      if (!res.ok) return [];
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      return [];
    }
  }

  async renderNotif() {

    await this._markMatchesSeen();
    await this._markDateIdeasSeen();
    this._refreshBadgeFromApp();


    this.innerHTML = `
      <style>
        com-notif{
          --n-bg:#ffffff;
          --n-text:#101828;
          --n-muted:#667085;
          --n-hover:#ffd8e5ff;
          --n-dot: var(--second-color);
          --n-shadow: 0 18px 60px rgba(16,24,40,.10);
          color-scheme: light dark;

          display:block;
          background: var(--n-bg);
          color: var(--n-text);
          border-radius: var(--brderRad-m);
          overflow:hidden;
          height:auto;
        }
        @media (prefers-color-scheme: dark){
          com-notif{
            --n-bg: #0b0f17;
            --n-text: #e6eaf2;
            --n-muted: #a0a8b8;
            --n-hover: rgba(255, 216, 229, 0.12);
            --n-dot: var(--second-color);
            --n-shadow: 0 18px 60px rgba(0,0,0,.55);
          }
        }
        com-notif.open{
          background: var(--n-bg);
          color: var(--n-text);
          border-radius: var(--brderRad-m);
          overflow: hidden;
        }
        .notifSec{
          padding: 20px;
          width: 360px;
          max-width: 90vw;
          background: var(--n-bg) !important;
          color: var(--n-text);
          border-radius: var(--brderRad-m);
          box-shadow: var(--n-shadow);
          height: auto !important;
          min-height: 0 !important;
        }

        .notifHead{ color: var(--second-color); font-size: 40px; margin-bottom: 20px; }
        .loading{ font-family: var(--font-body); color: var(--n-muted); }

        .notifCir{
          width: 10px; height: 10px; border-radius: 50%;
          background-color: var(--n-dot);
          flex: 0 0 auto; margin-top: 6px;
        }

        .notifText{ font-size: 20px; margin: 0; color: var(--n-text); }
        .notifText b{ font-weight: 700; }

        .notifDate{
          color: var(--second-color);
          font-size: 18px;
          margin-left: auto;
          flex: 0 0 auto;
          white-space: nowrap;
        }

        .notifArt{
          padding: 10px 10px;
          display:flex;
          align-items:center;
          gap:14px;
          border-radius: var(--brderRad-m);
          user-select:none;
        }

        .notifArt:hover{ background: var(--n-hover); cursor:pointer; }

        .empty{ font-family: var(--font-body); color: var(--n-muted); font-size: 16px; margin: 0; }

        @media (max-width: 768px) {
          .notifSec{ width: min(520px, calc(100vw - 16px)); padding: 14px; margin: 0 auto; }
          .notifHead{ font-size: 28px; margin-bottom: 12px; }
          .notifText{ font-size: 16px; }
          .notifDate{ font-size: 14px; }
          .notifArt{ gap: 10px; padding: 10px 8px; align-items: flex-start; }
          .notifArt svg{ width: 28px; height: 28px; margin-top: 2px; }
          .notifCir{ margin-top: 4px; }
          com-notif{
            background: var(--panel-bg, #fff); 
            overflow: hidden;           
          }
          com-notif .notifSec{
            max-height: calc(100vh - var(--bottom-nav-height) - var(--header-height) - 24px);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      </style>
      <section class="notifSec">
        <h2 class="notifHead">Notification</h2>
        <div class="notifList"><p class="loading">Loading...</p></div>
      </section>

    `;

    const items = await this._fetchNotifs();

    const list = items.filter((n) => n.type === "match" || n.type === "dateidea");

    const listHtml = list.length
      ? list
        .map((n) => {
          const otherName = n.other?.name || "Unknown";
          const when = this._timeAgo(n.createdAt);

          const dotHtml = (n.read || n.seen) ? "" : `<div class="notifCir"></div>`;

          if (n.type === "match") {
            const matchIdAttr = n.matchId ? `data-match-id="${this._escAttr(n.matchId)}"` : "";
            const pairKeyAttr = n.pairKey ? `data-pair-key="${this._escAttr(n.pairKey)}"` : "";

            return `
                <article class="notifArt"
                  data-open="match"
                  ${matchIdAttr}
                  ${pairKeyAttr}
                  role="button" tabindex="0" aria-label="Open match">
                  ${dotHtml}

                  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9998 15.085L14.9998 18.4813L21.7498 10.8398M16.4895 5.12698C13.4905 1.15778 8.48937 0.0900799 4.7318 3.72467C0.974222 7.35927 0.445207 13.4361 3.39605 17.7348C5.62489 20.9816 11.9567 27.4999 14.9218 30.4952C15.4668 31.0459 15.7394 31.3212 16.0585 31.4296C16.3355 31.5236 16.6434 31.5236 16.9205 31.4296C17.2396 31.3212 17.5121 31.0459 18.0572 30.4952C21.0223 27.4999 27.3541 20.9816 29.5829 17.7348C32.5338 13.4361 32.0693 7.32104 28.2472 3.72467C24.425 0.128312 19.4885 1.15778 16.4895 5.12698Z"
                      stroke="#CF0F47" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                  <p class="notifText"><b>${this._escHtml(otherName)}</b> та 2 match боллоо 🎉</p>
                  <p class="notifDate">${when}</p>
                </article>
              `;
          }
          if (n.type === "dateidea") {
            const title = n.title || "Date idea";

            const cardIdAttr = n.cardId ? `data-card-id="${this._escAttr(n.cardId)}"` : "";
            const otherIdAttr = n.other?.userId ? `data-other-id="${this._escAttr(n.other.userId)}"` : "";

            return `
                <article class="notifArt"
                  data-open="dateidea"
                  ${cardIdAttr}
                  ${otherIdAttr}
                  role="button" tabindex="0" aria-label="Open date idea">
                  ${dotHtml}

                  <svg width="33" height="33" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7h8M8 11h8M8 15h5" stroke="#CF0F47" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
                      stroke="#CF0F47" stroke-width="2" stroke-linejoin="round"/>
                  </svg>

                  <div style="display:flex;flex-direction:column;gap:2px;">
                    <p class="notifText">
                      <b>${this._escHtml(otherName)}</b> date idea явууллаа: <b>${this._escHtml(title)}</b>
                    </p>
                    
                  </div>

                  <p class="notifDate">${when}</p>
                </article>
              `;
          }

          return "";
        })
        .join("")
      : `<p class="empty">Одоохондоо мэдэгдэл алга. Хичээгээрэй!</p>`;
    const box = this.querySelector(".notifList");
    if (box) box.innerHTML = listHtml;

  }

  _escAttr(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  _escHtml(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}
window.customElements.define("com-notif", ComNotif);