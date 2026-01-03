import { api } from "./apiClient.js";
import "./nm-selection.js"; // хэрэгтэй бол үлдээгээрэй (view дээр заавал биш)

class OthersProfile extends HTMLElement {
  constructor() {
    super();
    this.profile = null;
    this._loading = false;

    this._onHashChange = this._onHashChange.bind(this);
  }

  static get observedAttributes() {
    return ["user-id"];
  }

  connectedCallback() {
    this.renderSkeleton();
    window.addEventListener("hashchange", this._onHashChange);
    this.load();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._onHashChange);
  }

  attributeChangedCallback(name, oldV, newV) {
    if (name === "user-id" && oldV !== newV) this.load();
  }

  _onHashChange() {
    const path = this._getPathFromHash();
    if (path === "othersprofile") this.load();
  }

  _getPathFromHash() {
    const hash = window.location.hash || "#/";
    const clean = hash.replace(/^#\/?/, "");
    return (clean.split("?")[0] || "").toLowerCase();
  }

  _getQueryParamsFromHash() {
    const hash = window.location.hash || "";
    const q = hash.split("?")[1] || "";
    return new URLSearchParams(q);
  }

  _getUserIdFromHash() {
    const params = this._getQueryParamsFromHash();
    const id = params.get("userId");
    return id ? String(id) : null;
  }

  _getTokenFromHash() {
    const params = this._getQueryParamsFromHash();
    const t = params.get("t");
    return t ? String(t) : null;
  }

  // ✅ GOYO: token-оор шууд profile авах
  async _fetchProfileByToken(token) {
    const res = await fetch(`/api/othersprofile?t=${encodeURIComponent(token)}`, {
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || data?.message || "Token profile fetch failed";
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async load() {
    if (this._loading) return;
    this._loading = true;

    try {
      const attrId = this.getAttribute("user-id");
      const hashId = this._getUserIdFromHash();
      const token = this._getTokenFromHash();

      this.renderSkeleton();

      // 1) token байвал шууд profile авна (Option B)
      if (token) {
        this.profile = await this._fetchProfileByToken(token);
        this.render();
        this.fill();
        return;
      }

      // 2) байхгүй бол userId-аар авах (Option A)
      const userId = attrId || hashId;

      if (!userId) {
        this.innerHTML = `<p style="padding:16px;">userId алга байна (#/othersprofile?userId=... эсвэл #/othersprofile?t=...)</p>`;
        return;
      }

      // apiClient чинь cookie include хийхгүй байж магадгүй тул fallback fetch хийж болно
      // Гэхдээ одоохондоо api.getOtherProfileByUserId-г ашиглая
      this.profile = await api.getOtherProfileByUserId(userId);

      this.render();
      this.fill();
    } catch (e) {
      console.error("OthersProfile load failed:", e);
      const status = e?.status ? ` (${e.status})` : "";
      const msg =
        e?.data?.error ||
        e?.data?.message ||
        e?.message ||
        "Профайл ачаалж чадсангүй";
      this.innerHTML = `<p style="padding:16px;">${msg}${status}</p>`;
    } finally {
      this._loading = false;
    }
  }

  ageFromDob(dob) {
    if (!dob) return "";
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return "";
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }

  renderSkeleton() {
    this.innerHTML = `<div style="padding:16px;">Loading...</div>`;
  }

  render() {
    this.innerHTML = `
      <style>
        :root{
          --first-color:#FF0B55;
          --second-color:#CF0F47;
          --textWithBack:white;
          --font-header: "Yanone Kaffeesatz", sans-serif;
          --font-body:"Roboto Condensed", sans-serif;
          --box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
          --bg-white: white;
          --brderRad-big: 20px;
          --brderRad-m: 8px;
          --brderRad-sm: 2px;
          --back-col-white: white;
          --inputBorder: #D9D9D9;
          --subInfoTitle-col: #55565A;
        }

        h2{ font-family:var(--font-header); font-weight:400; font-size:36px; margin:0; color: var(--second-color); }
        h3{ margin:0; font-family:var(--font-header); font-size:36px; }
        h4{ font-family:var(--font-header); font-size:24px; margin:0; }
        h5{ font-family:var(--font-header); font-size:20px; margin:0; color: var(--subInfoTitle-col); }
        p{ font-family: var(--font-body); font-weight: 400; }

        :host{ display:block; }
        main{
          display:flex;
          flex-wrap: wrap;
          justify-content: center;
          gap:50px;
          padding: 25px;
        }

        .main-container{
          min-height: 500px;
          background-color: white;
          border-radius: var(--brderRad-big);
          display: flex;
          flex: 0 1 800px;
          flex-wrap: wrap;
          justify-content: space-between;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
        }

        .main-container > article{
          margin: 20px;
          display:flex;
          flex: 1 0 auto;
          flex-direction: column;
          align-items: center;
          width: 36%;
          min-width: 300px;
        }

        .profile-head{
          margin: 0px;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn{
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-left: auto;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          margin-top: -10px;
        }
        .close-btn svg{ pointer-events: none; }

        .avatar{
          margin: 20px 0px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 3px solid var(--second-color);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }
        .avatar > img{
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
        }

        .name{ margin: 0px; font-family: var(--font-body); font-weight: 600; font-size: 24px; }
        .bio{ text-align: center; font-size: 14px; font-weight: 400; color: rgba(0, 0, 0, 0.7); }

        .border-red{
          height: 50px;
          width: 20%;
          border:2px solid var(--second-color);
          border-radius: 7px;
          object-fit: cover;
          background: #f2f2f2;
        }

        .user-image-container{
          display: flex;
          max-width: 60vw;
          width: 100%;
          justify-content: space-around;
          gap: 8px;
        }

        .main-container > section{
          margin: 20px;
          display: grid;
          grid-template-areas: "ln h3" "ln div";
          grid-template-columns: 30px auto;
          grid-template-rows: 50px;
          width: 52%;
          height: 470px;
        }

        .redline{ width:6%; height:100%; background-color: var(--second-color); grid-area: ln; }
        .scroll{ grid-area: div; overflow:scroll; scrollbar-width:none; margin: 0px 3px; }

        .info-head{
          grid-area: h3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 6px;
          z-index: 5;
          position: relative;
        }
        .info-head .close-btn{
          transform: translateY(-2px);
        }

        .scroll > article{ margin-top:25px; display:flex; flex-direction:column; }
        .scroll label{ display:flex; gap:10px; align-items:center; }

        .rowWrap > div{
          padding: 0px 5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rowWrap p{ font-size:20px; margin:0; width: 80%; }

        .goal{ border-bottom: solid 1px var(--inputBorder); }

        /* hide by default */
        .about{ display:none; }
        .height,.mbti,.zodiac{ display:none; }

        /* NOTE: .work markup дээр байхгүй байсан тул fill() дээр safe handle хийнэ */
        .work{ display:none; }

        .interests{ display:block; }
        .art,.sport,.music,.computer,.travel,.book{ display:none; }
      </style>

      <main>
        <div class="main-container">
          <article>
            <div class="profile-head">
              <h2>Profile</h2>
            
            </div>

            <div class="avatar">
              <img src="./img/Image.jpg" alt="profile">
            </div>

            <p class="name"></p>
            <p class="bio"></p>

            <div class="user-image-container">
              <img class="border-red" src="./img/image.jpeg" alt="user photo">
              <img class="border-red" src="./img/image.jpeg" alt="user photo">
              <img class="border-red" src="./img/image.jpeg" alt="user photo">
              <img class="border-red" src="./img/image.jpeg" alt="user photo">
            </div>
          </article>

          <section>
            <div class="redline"></div>

            <div class="info-head">
              <h3 class="info-title">Мэдээлэл</h3>

              <button class="close-btn" aria-label="Close" title="Close">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="#CF0F47"/>
                </svg>
              </button>
            </div>

            <div class="scroll">

              <!-- Харилцаа -->
              <article class="relation">
                <label>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h4>Харилцаа</h4>
                </label>

                <article class="goal rowWrap">
                  <h5>Сонирхсон харилцаа</h5>
                  <div><p></p></div>
                </article>

                <article class="loveLang rowWrap">
                  <h5>Хайрын хэл</h5>
                  <div><p></p></div>
                </article>
              </article>

              <!-- Миний тухай -->
              <article class="about">
                <label>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h4>Миний тухай</h4>
                </label>

                <article class="height rowWrap">
                  <h5>Өндөр</h5>
                  <div><p></p></div>
                </article>

                <article class="zodiac rowWrap">
                  <h5>Орд</h5>
                  <div><p></p></div>
                </article>

                <article class="mbti rowWrap">
                  <h5>MBTI</h5>
                  <div><p></p></div>
                </article>
              </article>

              <!-- Ажил -->
              <article class="job">
                <label><h4>Ажил</h4></label>

                <article class="major rowWrap">
                  <h5>Хөтөлбөр</h5>
                  <div><p></p></div>
                </article>

                <article class="work rowWrap">
                  <h5>Ажил</h5>
                  <div><p></p></div>
                </article>
              </article>

              <!-- Таалагддаг -->
              <article class="likes">
                <label><h4>Таалагддаг</h4></label>

                <section class="interests">
                  <h5>Сонирхол</h5>

                  <div class="art"><p></p></div>
                  <div class="sport"><p></p></div>
                  <div class="music"><p></p></div>
                  <div class="computer"><p></p></div>
                  <div class="travel"><p></p></div>
                  <div class="book"><p></p></div>
                </section>
              </article>

            </div>
          </section>
        </div>
      </main>
    `;

    // ✅ 2 close button байгаа тул хоёуланг нь bind
    this.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", () => history.back());
    });
  }

  fill() {
    const p = this.profile;
    if (!p) return;

    // photos field янз бүр байж болно
    const photos =
      Array.isArray(p.photos) ? p.photos :
      Array.isArray(p.images) ? p.images :
      Array.isArray(p.gallery) ? p.gallery :
      [];

    const {
      avatar,
      name,
      dob,
      bio,
      relationshipGoal,
      loveLanguage,
      about = {},
      major,
      work,
      interests = [],
    } = p;

    const $ = (sel) => this.querySelector(sel);
    const $$ = (sel) => this.querySelectorAll(sel);

    const age = this.ageFromDob(dob);

    // avatar
    const avatarImg = $(".avatar img");
    if (avatarImg) avatarImg.src = avatar || "./img/Image.jpg";

    // name + age
    const nameEl = $(".name");
    if (nameEl) {
      const a = age !== "" ? `, <span>${age}</span>` : "";
      nameEl.innerHTML = `${name || ""}${a}`;
    }

    // bio
    const bioEl = $(".bio");
    if (bioEl) bioEl.textContent = bio || "";

    // goal / loveLang / major
    const goalEl = $(".goal p");
    if (goalEl) goalEl.textContent = relationshipGoal || "";

    const loveEl = $(".loveLang p");
    if (loveEl) loveEl.textContent = loveLanguage || "";

    const majorEl = $(".major p");
    if (majorEl) majorEl.textContent = major || "";

    // work
    const workRow = $(".work");
    const workP = $(".work p");
    if (workRow && workP) {
      if (work) {
        workRow.style.display = "block";
        workP.textContent = work;
      } else {
        workRow.style.display = "none";
      }
    }

    // about block
    const aboutBlock = $(".about");
    const hasAbout = about && (about.height || about.zodiac || about.mbti);

    if (aboutBlock) {
      aboutBlock.style.display = hasAbout ? "block" : "none";

      const hRow = aboutBlock.querySelector(".height");
      if (hRow) hRow.style.display = about?.height ? "block" : "none";
      if (about?.height) {
        const hp = $(".height p");
        if (hp) hp.textContent = about.height;
      }

      const zRow = aboutBlock.querySelector(".zodiac");
      if (zRow) zRow.style.display = about?.zodiac ? "block" : "none";
      if (about?.zodiac) {
        const zp = $(".zodiac p");
        if (zp) zp.textContent = about.zodiac;
      }

      const mRow = aboutBlock.querySelector(".mbti");
      if (mRow) mRow.style.display = about?.mbti ? "block" : "none";
      if (about?.mbti) {
        const mp = $(".mbti p");
        if (mp) mp.textContent = about.mbti;
      }
    }

    // photos (4)
    $$(".user-image-container img").forEach((img, i) => {
      img.src = photos[i] || "./img/image.jpeg";
    });

    // interests
    const map = {
      Art: "art",
      Sport: "sport",
      Music: "music",
      Computer: "computer",
      Travel: "travel",
      Book: "book",
      art: "art",
      sport: "sport",
      music: "music",
      computer: "computer",
      travel: "travel",
      book: "book",
    };

    // эхлээд бүгдийг нуух
    ["art", "sport", "music", "computer", "travel", "book"].forEach((k) => {
      const el = this.querySelector(`.${k}`);
      if (el) el.style.display = "none";
    });

    (interests || []).forEach((it) => {
      const key = String(it).trim();
      const cls = map[key] || map[key.toLowerCase()];
      if (!cls) return;

      const row = this.querySelector(`.${cls}`);
      if (row) {
        row.style.display = "flex"; // ✅ sport/music/travel/book дээр өмнө нь display:none байсан
        const pe = row.querySelector("p");
        if (pe) pe.textContent = key;
      }
    });
  }
}

customElements.define("com-othersprofile", OthersProfile);
