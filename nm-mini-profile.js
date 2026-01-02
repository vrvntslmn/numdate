class MiniProfile extends HTMLElement {
  connectedCallback() {
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
        }
        img{
          width:220px;
          height:220px;
          object-fit:cover;
          border-radius:50%;
          border:3px solid #CF0F47;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .name{
          font-weight:bold;
          font-size:24px;
          margin: 10px 0 0;
        }
        .gender{
          font-size:12px;
          opacity:.7;
          margin: 5px 0 0;
        }

        @media (max-width: 520px){
          img{ width:160px; height:160px; }
        }
      </style>

      <img src="${img}" alt="profile">
      <p class="name">${name}</p>
      <p class="gender">${gender}</p>
    `;
  }
}

customElements.define("nm-mini-profile", MiniProfile);
