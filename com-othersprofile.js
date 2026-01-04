import { api } from "./apiClient.js";
import "./nm-selection.js";

class OthersProfile extends HTMLElement {
  constructor() {
    super();
    this.profile = null;
    this._loading = false;

    this._onHashChange = this._onHashChange.bind(this);
  }

  connectedCallback() {
    this.renderSkeleton();
    window.addEventListener("hashchange", this._onHashChange);
    const path = this._getPathFromHash();
    if (path === "othersprofile") this.load();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._onHashChange);
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

  async _fetchProfileSessionBased() {
    const res = await fetch(`/api/othersprofile`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data?.error || "Profile fetch failed");
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
      this.renderSkeleton();
      this.profile = await this._fetchProfileSessionBased();
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
        :root {
          --first-color: #FF0B55;
          --second-color: #CF0F47;
          --textWithBack: white;
          --font-header: "Yanone Kaffeesatz", sans-serif;
          --font-body: "Roboto Condensed", sans-serif;
          --box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
          --bg-white: white;
          --brderRad-big: 20px;
          --brderRad-m: 8px;
          --brderRad-sm: 2px;
          --back-col-white: white;
          --inputBorder: #D9D9D9;
          --subInfoTitle-col: #55565A;
        }

        :host {
          display: block;
          color-scheme: light dark;
        }

        h2 {
          font-family: var(--font-header);
          font-weight: 400;
          font-size: 36px;
          margin: 0;
          color: var(--second-color);
        }

        h3 {
          margin: 0;
          font-family: var(--font-header);
          font-size: 36px;
        }

        h4 {
          font-family: var(--font-header);
          font-size: 24px;
          margin: 0;
        }

        h5 {
          font-family: var(--font-header);
          font-size: 20px;
          margin: 0;
          color: var(--subInfoTitle-col);
        }

        p {
          font-family: var(--font-body);
          font-weight: 400;
        }

        
        main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 28px;            
          padding: 18px;      
        }

        div.main-container {
          min-height: 500px;
          background-color: white;
          border-radius: var(--brderRad-big);
          display: flex;
          flex: 0 1 880px;  
          z-index: 0;
          flex-wrap: wrap;
          justify-content: space-between;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
           position: relative;
          }

        div.main-container > article {
          margin: 18px;         /* 20 → 18 */
          display: flex;
          flex: 1 0 auto;
          flex-direction: column;
          align-items: center;
          width: 36%;
          min-width: 300px;
        }

        div.profile-head {
          margin: 0px;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        /* ✅ Mobile үед Profile хажууд гаргах close */
        .close-btn--mobile {
          display: none;
        }

        div.avatar {
          margin: 16px 0px;     /* 20 → 16 */
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 3px solid var(--second-color);
          justify-content: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        div.avatar > img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
        }

        .name {
          margin: 0px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 24px;
        }

        .bio {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.7);
          margin: 8px 0 12px;
        }

        .user-image-container {
          display: flex;
          max-width: 520px;
          width: 90%;
          justify-content: space-around;
          gap: 10px; 
        }

        .border-red {
         width: calc(25% - 8px); 
         height: 72px;           
         border: 2px solid var(--second-color);
         border-radius: 10px;
         object-fit: cover;
         background: #f2f2f2;
        }

        div.main-container > section {
          margin: 18px; /* 20 → 18 */
          display: grid;
          grid-template-areas: "ln h3" "ln div";
          grid-template-columns: 30px auto;
          grid-template-rows: 30px;
          width: 52%;
          height: 470px;
        }

        .redline {
          width: 6%;
          height: 100%;
          background-color: var(--second-color);
          grid-area: ln;
        }

        .info-head {
          grid-area: h3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 6px;
        }

        .scroll {
          grid-area: div;
          overflow: auto;       /* scroll → auto */
          scrollbar-width: none;
          margin: 0px 3px;
          padding-right: 4px;
        }

        .scroll > article {
          margin-top: 18px;     /* 25 → 18 */
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .scroll > article > article {
          margin: 12px 0px;     /* 15 → 12 */
          margin-left: 5px;
        }

        .scroll label {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .rowWrap > div {
          padding: 0px 5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rowWrap p {
          font-size: 20px;
          margin: 0;
          width: 80%;
        }

        button {
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          line-height: 0;
        }

        .interest-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .interest-chip {
          border: 1px solid var(--inputBorder);
          border-radius: 999px;
          padding: 6px 10px;
          font-family: var(--font-body);
          font-size: 14px;
          background: rgba(207, 15, 71, 0.06);
          color: #111;
        }

        .goal {
          border-bottom: solid 1px var(--inputBorder);
          padding-bottom: 10px;
        }

        .about { display: none; }
        .height { display: none; }
        .mbti { display: none; }
        .zodiac { display: none; }
        .work { display: none; }
        .movie { display: none; }
        .taste { display: none; }
        .song { display: none; }

        .interests { display: block; }

        .art, .sport, .music, .computer, .travel, .book { display: none; }

        .likes > label { margin-bottom: 12px; }
        .likes > .rowWrap:first-of-type { margin-top: 6px; }

  
        @media (prefers-color-scheme: dark) {
          body { background-color: #0b0d10 !important; }

          div.main-container {
            background-color: #0f131a !important;
            box-shadow: 0px 10px 30px rgba(0, 0, 0, .55) !important;
          }

          h2, h3, h4, h5, p, label {
            color: #e8ecf3 !important;
          }

          .bio, h5 { color: rgba(232, 236, 243, .75) !important; }

          .border-red { border-color: rgba(207, 15, 71, .8) !important; }

          .goal { border-bottom: 1px solid rgba(255, 255, 255, .12) !important; }

          svg path[stroke="black"] { stroke: rgba(232, 236, 243, .85) !important; }
          svg path[fill="black"] { fill: rgba(232, 236, 243, .85) !important; }

          .interest-chip {
            border-color: rgba(255, 255, 255, .18);
            background: rgba(207, 15, 71, 0.20);
            color: rgba(232, 236, 243, .95);
          }
        }

        
        @media (max-width: 900px) {
          main {
            padding: 12px;
            gap: 16px;
          }

          div.main-container {
            flex: 1 1 auto;
            width: 100%;
            border-radius: 16px;
          }

          div.main-container > article,
          div.main-container > section {
            width: 100%;
            min-width: 0;
            margin: 12px; /* 14 → 12 */
          }

          div.main-container > section {
            display: flex;
            flex-direction: column;
            height: auto;
          }

          .redline {
            width: 100%;
            height: 6px;
            border-radius: 999px;
            margin-bottom: 10px;
          }

          .info-head {
            padding-right: 0;
            margin-bottom: 10px;
          }

          .scroll {
            overflow: visible;
            margin: 0;
            padding-right: 0;
          }

          div.avatar {
            width: 110px;
            height: 110px;
          }
          div.avatar > img {
            width: 110px;
            height: 110px;
          }

          h2, h3 { font-size: 30px; }
          .name { font-size: 20px; }
          .rowWrap p { font-size: 16px; }

          .user-image-container {
            max-width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            justify-content: center;
            align-content: center;
            margin-left: -25px;
          }

          .border-red {
            width: 100%;
            height: 110px;
          }

        

          /* mobile deer X nuuh */
          .info-head .close-btn { display: none; }
           

          .close-btn--mobile {
          display: inline-flex;
           position: absolute;
          top: 12px;
          right: 12px;
          z-index: 50;
          align-items: center;
          justify-content: center;
         padding: 0;
         line-height: 0;

        }

       
         @media (max-width: 520px) {
  
         .close-btn--mobile svg {
         margin-right: 0 !important;
         width: 34px;
         height: 34px;
         }
         }
        }
      </style>

      <main>
        <div class="main-container">
          <article>
            <div class="profile-head">
              <h2>Profile</h2>

              <button class="close-btn close-btn--mobile" aria-label="Close" title="Close">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="#CF0F47"/>
                </svg>
              </button>
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
              <h3>Мэдээлэл</h3>
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

              <article class='relation'>
                <label>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h4>Харилцаа</h4>
                </label>

                <article class="goal rowWrap">
                  <h5>Сонирхсон харилцаа</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.8186 4.25C12.9228 4.25016 15.4543 6.81578 15.4543 10C15.4543 13.1842 12.9228 15.7498 9.8186 15.75C6.7143 15.75 4.18188 13.1843 4.18188 10C4.18188 6.81568 6.7143 4.25 9.8186 4.25Z" stroke="#55565A"/>
                      <path d="M17.1816 0.5C18.2525 0.5 19.1367 1.38675 19.1367 2.5C19.1367 3.61325 18.2525 4.5 17.1816 4.5C16.111 4.49974 15.2275 3.61309 15.2275 2.5C15.2275 1.38691 16.111 0.500258 17.1816 0.5Z" stroke="#55565A"/>
                      <path d="M24.5449 8C25.6158 8 26.5 8.88675 26.5 10C26.5 11.1133 25.6158 12 24.5449 12C23.4743 11.9997 22.5908 11.1131 22.5908 10C22.5908 8.88691 23.4743 8.00026 24.5449 8Z" stroke="#55565A"/>
                      <path d="M17.1816 15.5C18.2525 15.5 19.1367 16.3867 19.1367 17.5C19.1367 18.6133 18.2525 19.5 17.1816 19.5C16.111 19.4997 15.2275 18.6131 15.2275 17.5C15.2275 16.3869 16.111 15.5003 17.1816 15.5Z" stroke="#55565A"/>
                      <path d="M9.81812 8C10.889 8 11.7732 8.88675 11.7732 10C11.7732 11.1133 10.889 12 9.81812 12C8.74745 11.9997 7.86401 11.1131 7.86401 10C7.86401 8.88691 8.74745 8.00026 9.81812 8Z" stroke="#55565A"/>
                      <path d="M9.81812 0.5C10.889 0.5 11.7732 1.38675 11.7732 2.5C11.7732 3.61325 10.889 4.5 9.81812 4.5C8.74745 4.49974 7.86401 3.61309 7.86401 2.5C7.86401 1.38691 8.74745 0.500258 9.81812 0.5Z" stroke="#55565A"/>
                      <path d="M17.1816 8C18.2525 8 19.1367 8.88675 19.1367 10C19.1367 11.1133 18.2525 12 17.1816 12C16.111 11.9997 15.2275 11.1131 15.2275 10C15.2275 8.88691 16.111 8.00026 17.1816 8Z" stroke="#55565A"/>
                      <path d="M9.81812 15.5C10.889 15.5 11.7732 16.3867 11.7732 17.5C11.7732 18.6133 10.889 19.5 9.81812 19.5C8.74745 19.4997 7.86401 18.6131 7.86401 17.5C7.86401 16.3869 8.74745 15.5003 9.81812 15.5Z" stroke="#55565A"/>
                      <path d="M2.4541 8C3.52498 8 4.40918 8.88675 4.40918 10C4.40918 11.1133 3.52498 12 2.4541 12C1.38344 11.9997 0.5 11.1131 0.5 10C0.5 8.88691 1.38344 8.00026 2.4541 8Z" stroke="#55565A"/>
                      <path d="M17.1821 4.25C20.2863 4.25016 22.8179 6.81578 22.8179 10C22.8179 13.1842 20.2863 15.7498 17.1821 15.75C14.0778 15.75 11.5454 13.1843 11.5454 10C11.5454 6.81568 14.0778 4.25 17.1821 4.25Z" stroke="#55565A"/>
                    </svg>
                    <p></p>
                  </div>
                </article>

                <article class="loveLang rowWrap">
                  <h5>Хайрын хэл</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.5559 8.93863C14.9302 8.27337 15.2422 7.67308 15.4346 7.21618C16.3691 4.99757 15.4451 2.44556 13.1863 1.40457C10.9274 0.36358 8.65922 1.443 7.66376 3.52712C5.76014 2.22021 3.22078 2.41214 1.8204 4.45163C0.420021 6.49111 0.859523 9.15551 2.77754 10.6094C3.64803 11.2692 5.36963 12.2417 6.99048 13.107M15.3082 10.7655C14.8857 8.49462 12.9545 6.83381 10.5229 7.28521C8.0913 7.73662 6.51903 9.93157 6.84776 12.3166C7.11186 14.2328 8.56967 18.7286 9.13259 20.4221C9.2094 20.6531 9.24781 20.7687 9.32386 20.8493C9.3901 20.9195 9.47819 20.9703 9.57206 20.9926C9.67983 21.0182 9.79905 20.9937 10.0375 20.9448C11.7848 20.5858 16.4051 19.601 18.1958 18.8718C20.4246 17.9641 21.5748 15.5058 20.7132 13.1717C19.8517 10.8375 17.485 9.99608 15.3082 10.7655Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p></p>
                  </div>
                </article>
              </article>

              <article class='about'>
                <label>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h4>Миний тухай</h4>
                </label>

                <article class="height rowWrap">
                  <h5>Өндөр</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7563 3.88125L13.0688 5.19375M9.13132 6.50625L10.4438 7.81875M6.50632 9.13125L7.81882 10.4438M3.88132 11.7563L5.19382 13.0688M1.31376 14.4388L4.69881 17.8238C4.87206 17.9971 4.95869 18.0837 5.05859 18.1162C5.14646 18.1447 5.24111 18.1447 5.32898 18.1162C5.42887 18.0837 5.5155 17.9971 5.68876 17.8238L17.8238 5.68876C17.9971 5.5155 18.0837 5.42887 18.1162 5.32898C18.1447 5.24111 18.1447 5.14646 18.1162 5.05859C18.0837 4.95869 17.9971 4.87206 17.8238 4.69881L14.4388 1.31376C14.2655 1.1405 14.1789 1.05387 14.079 1.02141C13.9911 0.992862 13.8965 0.992862 13.8086 1.02141C13.7087 1.05387 13.6221 1.1405 13.4488 1.31376L1.31376 13.4488C1.1405 13.6221 1.05387 13.7087 1.02141 13.8086C0.992862 13.8965 0.992862 13.9911 1.02141 14.079C1.05387 14.1789 1.1405 14.2655 1.31376 14.4388Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p></p>
                  </div>
                </article>

                <article class="zodiac rowWrap">
                  <h5>Орд</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.0017 5.00022C21.6667 8.54505 21.6661 13.4578 19 17.0021M11 21C12.5711 21 14.0575 20.6377 15.3803 19.9921C15.2542 19.9974 15.1274 20 15 20C10.0294 20 6 15.9706 6 11C6 6.02944 10.0294 2 15 2C15.1274 2 15.2542 2.00265 15.3803 2.00789C14.0575 1.36229 12.5711 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p></p>
                  </div>
                </article>

                <article class="mbti rowWrap">
                  <h5>MBTI</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12.1111H19.7614C20.3181 12.1111 20.5964 12.1111 20.7554 12.0034C20.894 11.9094 20.9825 11.7652 20.9984 11.6071C21.0167 11.4258 20.8735 11.2055 20.5871 10.7649L18.1484 7.01289C18.0404 6.84661 17.9863 6.76347 17.9652 6.67472C17.9465 6.59621 17.9465 6.5149 17.9652 6.4364C17.9863 6.34764 18.0404 6.2645 18.1484 6.09823L20.5871 2.34622C20.8735 1.90559 21.0167 1.68527 20.9984 1.50399C20.9825 1.34593 20.894 1.20171 20.7554 1.10776C20.5964 1 20.3181 1 19.7614 1H1L1 21" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p></p>
                  </div>
                </article>
              </article>

              <article class='job'>
                <label>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h4>Ажил</h4>
                </label>

                <article class="major rowWrap">
                  <h5>Хөтөлбөр</h5>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.8112 5.23191C15.8112 4.24805 15.8112 3.75612 15.7031 3.35251C15.4096 2.25724 14.5541 1.40174 13.4589 1.10827C13.0553 1.00012 12.5633 1.00012 11.5795 1.00012C10.5956 1.00012 10.1037 1.00012 9.70007 1.10827C8.6048 1.40174 7.7493 2.25724 7.45582 3.35251C7.34768 3.75612 7.34768 4.24805 7.34768 5.23191M4.38543 20.0432H18.7735C19.9585 20.0432 20.551 20.0432 21.0036 19.8125C21.4018 19.6097 21.7254 19.286 21.9283 18.8879C22.1589 18.4352 22.1589 17.8427 22.1589 16.6577V8.61733C22.1589 7.43232 22.1589 6.83982 21.9283 6.3872C21.7254 5.98907 21.4018 5.66538 21.0036 5.46252C20.551 5.23191 19.9585 5.23191 18.7735 5.23191H4.38543C3.20042 5.23191 2.60791 5.23191 2.1553 5.46252C1.75717 5.66538 1.43348 5.98907 1.23062 6.3872C1 6.83982 1 7.43232 1 8.61733V16.6577C1 17.8427 1 18.4352 1.23062 18.8879C1.43348 19.286 1.75717 19.6097 2.1553 19.8125C2.60791 20.0432 3.20042 20.0432 4.38543 20.0432Z" stroke="#5D5B5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p></p>
                  </div>
                </article>

                <article class="work rowWrap">
                  <h5>Ажил</h5>
                  <div><p></p></div>
                </article>
              </article>

              <article class='likes'>
                <label>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                      stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h4>Таалагддаг</h4>
                </label>

                <article class="movie rowWrap">
                  <h5>Кино</h5>
                  <div><p></p></div>
                </article>

                <article class="taste rowWrap">
                  <h5>Амттан</h5>
                  <div><p></p></div>
                </article>

                <article class="song rowWrap">
                  <h5>Дуу</h5>
                  <div><p></p></div>
                </article>

                <section class="interests">
                  <h5>Сонирхол</h5>
                  <div class="interest-list"></div>

                  <div class="art"> ... </div>
                  <div class="sport"><p></p></div>
                  <div class="music"><p></p></div>
                  <div class="computer"> ... </div>
                  <div class="travel"><p></p></div>
                  <div class="book"><p></p></div>
                </section>
              </article>

            </div>
          </section>
        </div>
      </main>
    `;

    this.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", () => history.back());
    });
  }

  fill() {
    const p = this.profile;
    if (!p) return;

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
      likes = {},
      interests = [],
    } = p;

    const $ = (sel) => this.querySelector(sel);
    const $$ = (sel) => this.querySelectorAll(sel);

    const age = this.ageFromDob(dob);

    const avatarImg = $(".avatar img");
    if (avatarImg) avatarImg.src = avatar || "./img/Image.jpg";

    const nameEl = $(".name");
    if (nameEl) {
      const a = age !== "" ? `, <span>${age}</span>` : "";
      nameEl.innerHTML = `${name || ""}${a}`;
    }

    const bioEl = $(".bio");
    if (bioEl) bioEl.textContent = bio || "";

    const goalEl = $(".goal p");
    if (goalEl) goalEl.textContent = relationshipGoal || "";

    const loveEl = $(".loveLang p");
    if (loveEl) loveEl.textContent = loveLanguage || "";

    const majorEl = $(".major p");
    if (majorEl) majorEl.textContent = major || "";

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

    $$(".user-image-container img").forEach((img, i) => {
      img.src = photos[i] || "./img/image.jpeg";
    });

    const hasLikes = likes && Object.keys(likes || {}).length > 0;

    const movieRow = $(".movie");
    const movieP = $(".movie p");
    if (movieRow && movieP) {
      if (likes?.movie) {
        movieRow.style.display = "block";
        movieP.textContent = likes.movie;
      } else movieRow.style.display = "none";
    }

    const tasteRow = $(".taste");
    const tasteP = $(".taste p");
    if (tasteRow && tasteP) {
      if (likes?.taste) {
        tasteRow.style.display = "block";
        tasteP.textContent = likes.taste;
      } else tasteRow.style.display = "none";
    }

    const songRow = $(".song");
    const songP = $(".song p");
    if (songRow && songP) {
      if (likes?.song) {
        songRow.style.display = "block";
        songP.textContent = likes.song;
      } else songRow.style.display = "none";
    }

    ["art", "sport", "music", "computer", "travel", "book"].forEach((k) => {
      const el = this.querySelector(`.${k}`);
      if (el) el.style.display = "none";
    });

    let interestArr = [];
    if (Array.isArray(interests)) {
      interestArr = interests.map((x) => String(x).trim()).filter(Boolean);
    } else if (interests && typeof interests === "object") {
      interestArr = Object.entries(interests)
        .filter(([_, v]) => v)
        .map(([k, v]) => (v === true ? String(k) : String(v)).trim())
        .filter(Boolean);
    }

    const seen = new Set();
    interestArr = interestArr.filter((x) =>
      seen.has(x) ? false : (seen.add(x), true)
    );

    const interestListEl = this.querySelector(".interest-list");
    if (interestListEl) {
      interestListEl.innerHTML = "";

      if (interestArr.length >= 3) {
        interestArr.forEach((txt) => {
          const chip = document.createElement("span");
          chip.className = "interest-chip";
          chip.textContent = txt;
          interestListEl.appendChild(chip);
        });
      } else {
        const msg = document.createElement("p");
        msg.style.margin = "0";
        msg.style.opacity = ".75";
        msg.textContent = "Сонирхол дутуу байна";
        interestListEl.appendChild(msg);
      }
    }
  }
}

customElements.define("com-othersprofile", OthersProfile);
