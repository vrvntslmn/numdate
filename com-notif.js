class ComNotif extends HTMLElement {
  constructor() {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onDocClick = this._onDocClick.bind(this);
  }

  connectedCallback() {
    // notif checkbox байхгүй бол шууд гарна
    this._notifInput = document.getElementById("notif");
    if (!this._notifInput) return;

    // checkbox toggle
    this._notifInput.addEventListener("click", this._onToggle);

    // panel дотор click delegation
    this.addEventListener("click", this._onClick);

    // гадна дархад хаах (UX)
    document.addEventListener("click", this._onDocClick);

    // анхнаасаа checked байвал render
    if (this._notifInput.checked) this.renderNotif();
  }

  disconnectedCallback() {
    this._notifInput?.removeEventListener("click", this._onToggle);
    this.removeEventListener("click", this._onClick);
    document.removeEventListener("click", this._onDocClick);
  }

  _onToggle() {
    if (!this._notifInput) return;

    if (this._notifInput.checked) this.renderNotif();
    else this._closePanel();
  }

  _onClick(e) {
    const item = e.target.closest(".notifArt[data-open]");
    if (!item) return;

    const openWhat = item.getAttribute("data-open");
    if (openWhat === "match") {
      this._goTo("match");
      this._closePanel();
    }
  }

  _onDocClick(e) {
    // notif icon дээр дарж байвал document click-ээр хаахгүй
    if (e.target.closest("label.notif")) return;

    // panel дотор дарж байвал хаахгүй
    if (e.target.closest("com-notif")) return;

    // checkbox checked үед гадна дарвал хаана
    if (this._notifInput?.checked) this._closePanel();
  }

  _closePanel() {
    if (this._notifInput) this._notifInput.checked = false;
    this.innerHTML = "";
  }

  _goTo(route) {
    // Танай нав дээр "#dateidea" маягийн hash ашиглаж байна.
    // Зарим router "#/xxx" шаардаж магадгүй.
    // Тиймээс эхлээд "#route" тавиад, ажиллахгүй бол "#/route" болгон дахин тохируулна.

    const tryHash1 = `#${route}`;
    const tryHash2 = `#/${route}`;

    // 1) эхнийхийг тавина
    window.location.hash = tryHash1;

    // 2) дараа нь router чинь "#/" шаарддаг бол автоматаар засна
    // (hash өөрчлөгдөөгүй эсвэл router таныг буцаагаад байвал)
    setTimeout(() => {
      // хэрвээ яг хүссэн route руу ороогүй байвал
      const h = window.location.hash || "";
      const normalized = h.replace(/^#\/?/, ""); // '#match' '#/match' -> 'match'

      if (normalized !== route) {
        window.location.hash = tryHash2;
      }
    }, 0);
  }

  renderNotif() {
    this.innerHTML = `
      <style>
        .notifHead{
          color: var(--second-color);
          font-size: 40px;
          margin-bottom: 20px;
        }
        .notifCir{
          display: flex;
          justify-content: center;
          align-items: center;
          width:10px;
          height:10px;
          border-radius: 50%;
          background-color: var(--second-color);
          flex: 0 0 auto;
        }
        .notifText{ font-size: 20px; margin: 0; }
        .notifDate{
          color: var(--second-color);
          font-size: 18px;
          margin-left: auto;
          flex: 0 0 auto;
        }
        .notifSec{ padding: 20px; width: 360px; max-width: 90vw; }
        .notifArt{
          padding: 10px 10px;
          display: flex;
          align-items: center;
          gap:14px;
          border-radius: var(--brderRad-m);
          user-select: none;
        }
        .notifArt:hover{
          background-color: #ffd8e5ff;
          cursor: pointer;
        }
      </style>

      <section class="notifSec">
        <h2 class="notifHead">Notification</h2>

        <article class="notifArt" data-open="match" role="button" tabindex="0" aria-label="Open match">
          <div class="notifCir"></div>
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9998 15.085L14.9998 18.4813L21.7498 10.8398M16.4895 5.12698C13.4905 1.15778 8.48937 0.0900799 4.7318 3.72467C0.974222 7.35927 0.445207 13.4361 3.39605 17.7348C5.62489 20.9816 11.9567 27.4999 14.9218 30.4952C15.4668 31.0459 15.7394 31.3212 16.0585 31.4296C16.3355 31.5236 16.6434 31.5236 16.9205 31.4296C17.2396 31.3212 17.5121 31.0459 18.0572 30.4952C21.0223 27.4999 27.3541 20.9816 29.5829 17.7348C32.5338 13.4361 32.0693 7.32104 28.2472 3.72467C24.425 0.128312 19.4885 1.15778 16.4895 5.12698Z"
              stroke="#CF0F47" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="notifText">Та хоёр match боллоо 🎉</p>
          <p class="notifDate">now</p>
        </article>
      </section>
    `;
  }
}

window.customElements.define("com-notif", ComNotif);
