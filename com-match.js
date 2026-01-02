class Match extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timeouts = [];
  }

  connectedCallback() {
    this.render();
    this.bind();
    // HTML дээр: window load үед 1 burst үүсгэдэг
    // component дээр: render хийгдсэний дараа шууд үүсгэнэ
    this.createBurst();
    this.playAudio();
  }

  disconnectedCallback() {
    this._timeouts.forEach(clearTimeout);
    this._timeouts = [];
  }

  attr(name, fallback = "") {
    const v = this.getAttribute(name);
    return v == null || v === "" ? fallback : v;
  }

  esc(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  render() {
    const leftName = this.attr("left-name", "Battsetseg");
    const leftGender = this.attr("left-gender", "she-her-her");
    const leftImg = this.attr("left-img", "img/image.jpeg");

    const rightName = this.attr("right-name", "Temuujin");
    const rightGender = this.attr("right-gender", "he-his-him");
    const rightImg = this.attr("right-img", "img/Image.jpg");

    const chatHref = this.attr("chat-href", "chat.html");
    const cancelHref = this.attr("cancel-href", "index.html");
    const audioSrc = this.attr("audio-src", "./uulen.wav");

    const msg1 = this.attr("message-1", "Та 2 бие биедээ таалагдлаа. ( ˶˘ ³˘)♡");
    const msg2 = this.attr("message-2", "Амжилт хүсье (˶˃ ᵕ ˂˶)");

    this.shadowRoot.innerHTML = `
      <style>
        /* ====== HTML HEAD дээр байсан fonts ====== */
        @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200..700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Rubik+Bubbles&display=swap");

        :host{
          display: block;
          width: 100%;
          /* App чинь header-тэй тул доор нь харагдана */
          background-color: #F5F5F5;
        }

        /* HTML stylesMatch.css - body */
        .page{
          margin: 0;
          background-color: #F5F5F5;
          min-height: calc(100vh - 55px);
          position: relative;
        }

        /* Falling hearts: stylesMatch.css дээр z-index -1 байсан */
        .falling-hearts {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: -1;
        }

        /* ✅ falling hearts-ийн class-ийг тусад нь */
        .fall-heart {
          position: absolute;
          bottom: -400px;
          top: auto;
          animation: heart-fire 6s ease-out forwards;
        }

        @keyframes heart-fire {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-120vh) scale(1.1); opacity: 0; }
        }

        /* main */
        main{
          margin: 0;
          display: flex;
          justify-content: space-around;
          gap: 50px;
          padding: 25px;
        }

        div.main-container{
          padding: 10px;
          height: fit-content;
          background-color: white;
          border-radius: 20px;

          width: 100%;
          max-width: 900px;

          box-shadow: 0px 4px 8px rgba(0,0,0,0.25);
          margin-top: 30px;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }

        div.main-container div:first-child{
          display: flex;
          justify-content: right;
        }

        /* Matches section */
        div.main-container div.Matches{
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        div.MyAvatar, div.OtherAvatar{
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-family: "Roboto Condensed";
          width: 50%;
          position: relative;
          z-index: 2;
        }

        div.MyAvatar{ margin-top: 50px; animation: collide-left 1s ease-in-out; }
        div.OtherAvatar{ margin-bottom: 50px; animation: collide-right 1s linear; }

        @keyframes collide-left{
          0% { transform: translateX(80px); }
          100% { transform: translateX(0); }
        }

        @keyframes collide-right{
          0% { transform: translateX(-80px); }
          100% { transform: translateX(0); }
        }

        /* nm-mini-profile доторх img-г гадаадаас нь style хийхэд shadow доторх элемент тул nm-mini-profile нь lightDOM байж л нөлөөлнө.
           Тиймээс энд шууд nm-mini-profile img-г оноохгүй, nm-mini-profile өөр дээр нь style хийх нь хамгийн зөв.
           Гэхдээ чинь өмнө нь lightDOM ашиглаж байсан тул ихэнхдээ ингэж ажиллана: */
        .MyAvatar img, .OtherAvatar img{
          width: 220px;
          height: 220px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #CF0F47;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .name{
          font-weight: bold;
          font-size: 24px;
          margin: 0;
        }

        /* ✅ center heart (stylesMatch.css дахь .heart) */
        .center-heart{
          position: absolute;
          left: 50%;
          top: 50%;
          width: 260px;
          height: 260px;
          transform: translate(-50%, -50%) scale(0.4);
          border-radius: 50%;
          background: none;
          opacity: 0;
          z-index: 0;

          animation:
            heart-appear 0.8s ease-in-out 0.4s forwards,
            heart-pulse 1.5s ease-in-out 1.2s infinite alternate;
        }

        @keyframes heart-appear{
          from { opacity: 0; transform: translate(-50%, -50%) scale(1); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }

        @keyframes heart-pulse{
          0% { transform: translate(-50%, -50%) scale(1.3); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

        div.congrats{
          font-family: "Rubik Bubbles";
          text-align: center;
          justify-content: center !important;
          z-index:1;
        }

        .start-chatting-btn{
          margin-top: 20px;
          margin-bottom: 20px;
          padding: 10px 20px;
          background: linear-gradient(to top, #EE0067, #BC2265);
          height: 50px;
          border-radius: 25px;
          font-size: 16px;
          font-family: "Rubik Bubbles";
          color: white;
          cursor: pointer;
          width: 150px;
          border: none;
        }

        .start-chatting-btn:hover{
          box-shadow: 0 0 15px rgba(238,0,103,0.7);
          transform: translateY(-2px);
        }

        button{
          border: none;
          background: none;
          cursor: pointer;
        }

        /* жижиг дэлгэц */
        @media (max-width: 520px){
          .MyAvatar img, .OtherAvatar img{ width: 160px; height: 160px; }
          .center-heart{ width: 200px; height: 200px; }
        }
      </style>

      <div class="page">
        <div class="falling-hearts"></div>

        <!-- ✅ HTML дээр байсан hidden template svg (clone хийхэд ашиглана) -->
        <svg id="heart-svg" style="display:none" height="40" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720">
          <path style="fill:#e41568"
            d="m180 45c-99.36 0-180 80.64-180 180 0 47.8 18.66 91.26 49.094 123.5l309.91 326.5 315.34-329.31c31.32-38.01 41.85-70.21 45.66-120.69 0-99.36-80.64-180-180-180-91.55 0-167.21 68.48-178.53 156.97h-2.94c-11.32-88.49-86.98-156.97-178.53-156.97z"/>
        </svg>

        <audio id="heartBeat" src="${this.esc(audioSrc)}" autoplay></audio>

        <main>
          <div class="main-container">
            <div class="cancal-btn">
              <button class="cancel-btn" id="cancelBtn" type="button" aria-label="close">
                <svg width="42px" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="#CF0F47"/>
                </svg>
              </button>
            </div>

            <div class="Matches">
              <div class="OtherAvatar">
                <nm-mini-profile
                  name="${this.esc(leftName)}"
                  gender="${this.esc(leftGender)}"
                  img="${this.esc(leftImg)}"
                ></nm-mini-profile>
              </div>

              <!-- ✅ center heart -->
              <div class="center-heart" aria-hidden="true">
                <!-- чи хүсвэл энд svg/png image тавьж болно -->
                <svg viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">
                  <path style="fill:#e41568"
                    d="m180 45c-99.36 0-180 80.64-180 180 0 47.8 18.66 91.26 49.094 123.5l309.91 326.5 315.34-329.31c31.32-38.01 41.85-70.21 45.66-120.69 0-99.36-80.64-180-180-180-91.55 0-167.21 68.48-178.53 156.97h-2.94c-11.32-88.49-86.98-156.97-178.53-156.97z"/>
                </svg>
              </div>

              <div class="MyAvatar">
                <nm-mini-profile
                  name="${this.esc(rightName)}"
                  gender="${this.esc(rightGender)}"
                  img="${this.esc(rightImg)}"
                ></nm-mini-profile>
              </div>
            </div>

            <div class="congrats">
              <p>${this.esc(msg1)}</p>
              <p>${this.esc(msg2)}</p>
              <button class="start-chatting-btn" id="chatBtn" type="button">Чатлах</button>
            </div>
          </div>
        </main>
      </div>
    `;

    this._chatHref = chatHref;
    this._cancelHref = cancelHref;
  }

  bind() {
    const cancelBtn = this.shadowRoot.querySelector("#cancelBtn");
    const chatBtn = this.shadowRoot.querySelector("#chatBtn");

    cancelBtn?.addEventListener("click", () => this._navigate(this._cancelHref));
    chatBtn?.addEventListener("click", () => this._navigate(this._chatHref));
  }

  _navigate(href) {
    if (!href) return;
    // Router ашиглаж байвал "#match" / "#/match" гэж өгч болно
    if (href.startsWith("#")) window.location.hash = href.replace(/^#/, "");
    else window.location.href = href;
  }

  // ✅ HTML script-тэй яг адил: 80 heart, random left, duration 4.5+rand, delay rand*5
  createBurst() {
    const container = this.shadowRoot.querySelector(".falling-hearts");
    const svgTemplate = this.shadowRoot.querySelector("#heart-svg");
    if (!container || !svgTemplate) return;

    const HEARTS_PER_BURST = 80;

    for (let i = 0; i < HEARTS_PER_BURST; i++) {
      const heart = document.createElement("span");
      heart.classList.add("fall-heart");

      const svgClone = svgTemplate.cloneNode(true);
      svgClone.removeAttribute("id");
      svgClone.style.display = "";
      heart.appendChild(svgClone);

      heart.style.left = Math.random() * 100 + "vw";

      const fallDuration = 4.5 + Math.random();
      heart.style.animationDuration = fallDuration + "s";

      const delay = Math.random() * 5;
      heart.style.animationDelay = delay + "s";

      container.appendChild(heart);

      const t = setTimeout(() => heart.remove(), (fallDuration + delay) * 1000);
      this._timeouts.push(t);
    }
  }

  playAudio() {
    const audio = this.shadowRoot.querySelector("#heartBeat");
    if (!audio) return;
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }
}

window.customElements.define("com-match", Match);
