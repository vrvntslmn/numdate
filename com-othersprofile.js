class OthersProfile extends HTMLElement {
  constructor() {
    super();
    this._rendered = false;
    this.attachShadow({ mode: "open" });
    this.currentProfile = null;
  }

  connectedCallback() {
    if (this._rendered) return;
    this._rendered = true;

    // Get userId from URL hash or use current profile
    const urlHash = window.location.hash;
    console.log('Current URL hash:', urlHash);

    const userId = this.extractUserIdFromHash(urlHash);
    console.log('Extracted userId:', userId);

    this.fetchProfile(userId);
  }

  extractUserIdFromHash(hash) {
    console.log('Processing hash:', hash);

    // Handle cases where hash might not have query params
    if (!hash.includes('?')) {
      console.log('No query parameters found, using default');
      return 'demo-user';
    }

    const params = new URLSearchParams(hash.split('?')[1]);
    const userId = params.get('userId');
    console.log('Found userId in params:', userId);

    return userId || 'demo-user';
  }
  fetchProfile(userId) {
    fetch(`/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(profile => {
        this.currentProfile = profile;
        this.render();
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        this.renderError();
      });
  }

  render() {
    if (!this.currentProfile) return;

    const profile = this.currentProfile;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Roboto Condensed", system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #111;
        }
        .wrapper {
          max-width: 1160px;
          margin: 36px auto 40px;
          padding: 0 24px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 100px;
          align-items: flex-start;
        }

        .profile-card {
          flex: 0 0 56%;
          background: #ffffff;
          border-radius: 36px;
          box-shadow: 0 80px 40px rgba(0, 0, 0, 0.08);
          padding: 18px 24px 20px;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) 1px minmax(0, 1fr);
          column-gap: 26px;
          min-height: 500px;
          position: relative;
        }

        .subscription {
          flex: 0 0 24%;
          background: #ffffff;
          border-radius: 26px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
          padding: 18px 22px 16px;
        }

        @media (max-width: 1040px) {
          .wrapper {
            flex-direction: column;
            flex-wrap: nowrap;
          }
          .profile-card,
          .subscription {
            flex: 0 0 auto;
            width: 100%;
          }
        }

        @media (max-width: 960px) {
          .profile-card {
            grid-template-columns: 1fr;
            row-gap: 20px;
            padding: 18px 16px 20px;
          }
          .divider {
            display: none;
          }
        }

        .cancal-btn {
          position: absolute;
          top: 12px;
          right: 16px;
        }

        .cancel-btn {
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cancel-btn svg {
          display: block;
        }

        .profile-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .avatar {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          overflow: hidden;
          border: 4px solid #f1025f;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .name {
          margin-top: 6px;
          margin-bottom: 10px;
          font-size: 21px;
          font-weight: 600;
        }

        .bio {
          margin-top: -20px;
          max-width: 320px;
          font-size: 13px;
          line-height: 1.4;
          color: #444;
        }

        .photo-row {
          display: flex;
          gap: 6px;
        }

        .photo-row img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #f1025f;
        }

        .voice {
          margin-top: 4px;
          width: 100%;
        }

        .voice label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          justify-content: center;
        }

        .voice input {
          display: none;
        }

        .player {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .player .pause {
          display: none;
        }

        .voice input:checked + .player .play {
          display: none;
        }
        .voice input:checked + .player .pause {
          display: block;
        }

        .timeline {
          flex: 0 1 140px;
          height: 2px;
          border-radius: 999px;
          background: #f9c3d7;
          position: relative;
        }
        .timeline::after {
          content: "";
          position: absolute;
          left: 0;
          right: 55%;
          top: 0;
          bottom: 0;
          background: #cf0f47;
        }

        .time {
          font-size: 12px;
          color: #cf0f47;
          font-weight: 600;
        }

        .divider {
          background: #cf0f47;
          border-radius: 999px;
        }

        .profile-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .info-title {
          font-family: "Yanone Kaffeesatz", system-ui;
          font-size: 24px;
          font-weight: 700;
        }

        .info-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
        }

        .info-item svg {
          width: 22px;
          height: 22px;
        }

        .sub-header {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .sub-header span {
          font-family: "Nerko One", system-ui;
          font-size: 16px;
          background: #ff1f7a;
          color: #fff;
          padding: 4px 18px;
          border-radius: 999px;
        }

        .sub-header span strong {
          font-weight: 700;
        }

        .sub-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          line-height: 1.35;
        }

        .sub-table thead th {
          font-weight: 600;
          padding-bottom: 4px;
        }

        .sub-table tbody td {
          padding: 2px 0;
        }

        .sub-col-feature {
          text-align: left;
        }
        .sub-col-free,
        .sub-col-premium {
          text-align: center;
          width: 60px;
        }

        .sub-minus {
          color: #555;
          font-weight: 500;
        }
        .sub-plus {
          color: #ff1f7a;
          font-weight: 700;
        }

        .sub-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .sub-btn {
          border: none;
          outline: none;
          padding: 6px 18px;
          border-radius: 999px;
          background: #ff1f7a;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(255, 31, 122, 0.35);
        }
        .sub-btn:hover {
          filter: brightness(1.05);
        }
      </style>

      <div class="wrapper">
        <section class="profile-card">
          <div class="cancal-btn">
            <button class="cancel-btn">
              <svg width="42px" height="42px" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  fill="#CF0F47"/>
              </svg>
            </button>
          </div>

          <div class="profile-left">
            <div class="avatar">
              <img src="${profile.avatar || './img/image.jpeg'}" alt="profile">
            </div>
            <p class="name">${profile.name}, <span>${profile.age}</span></p>
            <p class="bio">${profile.bio || 'Амьдрал бол аялал.'}</p>

            <div class="photo-row">
              ${(profile.photos || [profile.avatar]).slice(0, 4).map(photo =>
      `<img src="${photo}" alt="user photo">`
    ).join('')}
            </div>

            <div class="voice">
              <label>
                <input type="checkbox">
                <span class="player">
                  <svg width="15" height="20" viewBox="0 0 16 20" fill="none"
                    xmlns="http://www.w3.org/2000/svg" class="play">
                    <path d="M15.2083 9.68894L-3.5e-05 0.000121889L0.314103 19.8541L15.2083 9.68894Z"
                      fill="#CF0F47" />
                  </svg>
                  <svg width="15" height="20" viewBox="0 0 15 20" fill="none"
                    xmlns="http://www.w3.org/2000/svg" class="pause">
                    <rect width="5" height="20" fill="#CF0F47" />
                    <rect x="10" width="5" height="20" fill="#CF0F47" />
                  </svg>
                </span>
                <div class="timeline"></div>
                <span class="time">0.03</span>
              </label>
              <audio src="${profile.voiceUrl || ''}"></audio>
            </div>
          </div>

          <div class="divider"></div>

          <div class="profile-right">
            <h3 class="info-title">Мэдээлэл</h3>
            <ul class="info-list">
              <li class="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 6L19 3M19 3L22 6M19 3V9M16 21V19.8C16 18.1198 16 17.2798 15.673 16.638C15.3854 16.0735 14.9265 15.6146 14.362 15.327C13.7202 15 12.8802 15 11.2 15H6.8C5.11984 15 4.27976 15 3.63803 15.327C3.07354 15.6146 2.6146 16.0735 2.32698 16.638C2 17.2798 2 18.1198 2 19.8V21M12.5 7.5C12.5 9.433 10.933 11 9 11C7.067 11 5.5 9.433 5.5 7.5C5.5 5.567 7.067 4 9 4C10.933 4 12.5 5.567 12.5 7.5Z"
                    stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>Орд: ${profile.about?.zodiac || 'Хумх'}</span>
              </li>

              <li class="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                    stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>${profile.relationshipGoal || 'Long-term'}</span>
              </li>

              <li class="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                    stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>Өндөр: ${profile.about?.height || 170}см | MBTI: ${profile.about?.mbti || 'ENFP'}</span>
              </li>

              <li class="info-item">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z"
                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>${profile.school || 'Сургууль'} | ${profile.major || 'Мэргэжил'}</span>
              </li>

              <li class="info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                    stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>${(profile.interests || []).join(', ')}</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="subscription">
          <div class="sub-header">
            <span>Миний багц: <strong>Free</strong></span>
          </div>

          <table class="sub-table">
            <thead>
              <tr>
                <th class="sub-col-feature">Юу байгаа вэ?</th>
                <th class="sub-col-free">Free</th>
                <th class="sub-col-premium">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="sub-col-feature">Хэн чамайг зүрхлэсэн бэ?</td>
                <td class="sub-col-free sub-minus">–</td>
                <td class="sub-col-premium sub-plus">+</td>
              </tr>
              <tr>
                <td class="sub-col-feature">Хязгааргүй алгасалт</td>
                <td class="sub-col-free sub-minus">–</td>
                <td class="sub-col-premium sub-plus">+</td>
              </tr>
              <tr>
                <td class="sub-col-feature">Алгассан хүнээ буцаах</td>
                <td class="sub-col-free sub-minus">–</td>
                <td class="sub-col-premium sub-plus">+</td>
              </tr>
              <tr>
                <td class="sub-col-feature">Ярих</td>
                <td class="sub-col-free sub-minus">–</td>
                <td class="sub-col-premium sub-plus">+</td>
              </tr>
            </tbody>
          </table>

          <div class="sub-footer">
            <button type="button" class="sub-btn">Premium авах</button>
          </div>
        </section>
      </div>
    `;

    const cancelBtn = this.shadowRoot.querySelector(".cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        window.history.back();
      });
    }
  }

  renderError() {
    this.shadowRoot.innerHTML = `
      <style>
        .error {
          text-align: center;
          padding: 40px;
          color: #cf0f47;
        }
      </style>
      <div class="error">
        <h2>Алдаа гарлаа</h2>
        <p>Профайл ачааллахад алдаа гарлаа.</p>
      </div>
    `;
  }
}

window.customElements.define("com-othersprofile", OthersProfile);