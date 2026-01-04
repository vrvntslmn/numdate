class MiniProfile extends HTMLElement {
  static get observedAttributes() {
    return ["name", "gender", "img"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  esc(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  render() {
    const name = this.getAttribute("name") || "default-name";
    const gender = this.getAttribute("gender") || "gender";
    const img = this.getAttribute("img") || "img/image.jpeg";

  this.innerHTML = `
  <style>
    :host{
      display:flex;
      flex-direction:column;
      align-items:center;
      text-align:center;
      font-family: "Roboto Condensed", sans-serif;
      width: 100%;
      min-width: 0;
      color-scheme: light dark;

      --ring: #CF0F47;
      --text: #101828;
      --muted: rgba(16,24,40,.65);
      --shadow: 0 10px 22px rgba(0,0,0,0.18);
      --bg: transparent;
    }

    @media (prefers-color-scheme: dark){
      :host{
        --text: #E5E7EB;
        --muted: rgba(229,231,235,.70);
        --shadow: 0 12px 26px rgba(0,0,0,0.55);
      }
    }

    .avatar{
      width: clamp(88px, 18vw, 200px);
      height: clamp(88px, 18vw, 200px);
      object-fit: cover;
      border-radius: 50%;
      
      outline: 2px solid hsla(343, 81%, 45%, 0.96); 
      outline-offset: 0px;

      box-shadow: var(--shadow);
      background: var(--bg);
      display:block;
      flex: 0 0 auto;
    }

    .name{
      font-weight: 700;
      font-size: clamp(14px, 2.3vw, 22px);
      margin: 10px 0 0;
      line-height: 1.15;
      color: var(--text);
      max-width: 18ch;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gender{
      font-size: 12px;
      color: var(--muted);
      margin: 5px 0 0;
      text-transform: capitalize;
    }

    @media (max-width: 360px){
      .avatar{
        width: 82px;
        height: 82px;
        border-width: 2px;
      }
      .name{ font-size: 14px; }
    }
  </style>

  <img class="avatar" src="${this.esc(img)}" alt="profile" loading="lazy">
  <p class="name" title="${this.esc(name)}">${this.esc(name)}</p>
  <p class="gender">${this.esc(gender)}</p>
`;

  }
}

customElements.define("nm-mini-profile", MiniProfile);
