class DateIdea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.initCardSelection();
  }

  disconnectedCallback() {
    this.teardownCardSelection();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;500&family=Roboto+Condensed:wght@300;400;500&display=swap");

        :host {
          --first-color: #FF0B55;
          --second-color: #CF0F47;
          --font-header: "Yanone Kaffeesatz", sans-serif;
          --font-body: "Roboto Condensed", sans-serif;
          display: block;
          font-family: var(--font-body);
          color: #0f172a;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        h2 {
          font-family: var(--font-header);
          font-weight: 400;
          font-size: 28px;
          margin: 0;
          color: #333;
        }

        p {
          font-family: var(--font-body);
          margin: 0;
        }

        /* --------- MAIN LAYOUT ---------- */

        .date-layout {
          padding: 32px 24px;
          display: flex;
          justify-content: center;
          background: #f8fafc;
        }

        .date-chooser {
          max-width: 1120px;
          width: 100%;
          background: #ffffff;
          border-radius: 28px;
          padding: 24px 28px 32px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);
        }

        /* --------- TOP STRIP + TOP CARDS ---------- */
        .top-strip {
          font-family: var(--font-header);
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .top-cards-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 4px;
          scroll-snap-type: x mandatory;
        }

        .top-card {
          min-width: 180px;
          max-width: 190px;
          border-radius: 18px;
          border: 1px solid #cbd5e1;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease,
            background-color 0.18s ease;
          scroll-snap-align: start;
        }

        /* ЗУРАГ + ТЕКСТ ОВЕРЛЭЙ */
        .top-card__image {
          height: 86px;
          background: #dde5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .top-card__image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .top-card__label {
          position: relative;
          z-index: 1;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
        }

        .top-card__content {
          padding: 10px 12px 12px;
        }

        .top-card__title {
          font-family: var(--font-header);
          font-size: 17px;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .top-card__subtitle {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }

        /* --------- SECTION TITLE ---------- */

        .layout-title {
          margin-top: 24px;
          margin-bottom: 6px;
        }

        .layout-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 20px;
        }

        /* --------- CATEGORY ROWS ---------- */

        .category-section {
          margin-top: 16px;
        }

        .category-row {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 18px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .category-badge {
          width: 64px;
          height: 64px;
          border-radius: 24px;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        }
        .category-badge svg {
        width: 85%;
        height: 85%;
          transform: rotate(-45deg);
          color: #cbd5e1;
          translate:15px;
        }

        .category-text {
          margin-bottom: 10px;
        }

        .category-text h3 {
          font-family: var(--font-header);
          font-size: 22px;
          color: #1f2933;
          margin: 0 0 4px;
        }

        .category-text p {
          font-size: 13px;
          color: #94a3b8;
        }

        .category-cards {
          grid-column: 2 / 3;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 22px;
          margin-top: 15px;
        }

        .date-card {
  position: relative;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  min-height: 150px;
  min-width: 180px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  /* Зургийг дүүрэн харуулахын тулд background дээр ажиллуулна */
  background-color: #000;
  color: #fff;
  padding: 0;
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease,
    background-color 0.18s ease;
}

/* Картын арын ЗУРГИЙГ харуулах pseudo element */
.date-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--card-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.05);
  z-index: 0;
}

.date-card::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 45%;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.9),
    rgba(15, 23, 42, 0.3)
  );
  z-index: 1;
}


/* ТЕКСТИЙН wrapper (зурагны дээр, blur-ийн дээр байрлана) */
.date-card__content {
  position: relative;
  z-index: 2;
  padding: 10px 14px 12px;
}

.date-card__title {
  font-family: var(--font-header);
  font-size: 17px;
  margin-bottom: 4px;
  color: #f9fafb;
}

.date-card__meta {
  font-size: 11px;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.date-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.date-card__tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.12);
  color: #e5e7eb;
}

        /* --------- STATES (hover/focus/selected) ---------- */

        .date-card:hover,
        .top-card:hover {
          box-shadow: 0 8px 16px rgba(148, 163, 184, 0.35);
          transform: translateY(-2px);
        }

        .date-card--selected,
        .top-card--selected {
          border-color: var(--second-color);
          box-shadow: 0 0 0 2px rgba(207, 15, 71, 0.25);
          background: #fff7fb;
        }

        [data-date-card]:focus-visible {
          outline: 2px solid var(--second-color);
          outline-offset: 3px;
        }

        [data-date-card] {
          user-select: none;
        }

        /* --------- CHOSEN MESSAGE ---------- */

        #chosen-message {
          margin-top: 18px;
          font-size: 14px;
          color: #475569;
          padding: 10px 12px;
          border-radius: 999px;
          background: #f9f5ff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        #chosen-message::before {
          content: "💘";
        }

        #chosen-message[hidden] {
          display: none;
        }

        @media (max-width: 720px) {
          .date-layout {
            padding: 20px 16px;
          }

          .date-chooser {
            padding: 20px 18px 24px;
            border-radius: 22px;
          }

          .category-row {
            grid-template-columns: 1fr;
          }

          .category-cards {
            grid-column: 1 / -1;
          }
        }
      </style>

      <section class="date-layout" aria-label="Date ideas picker">
        <div class="date-chooser" id="dateidea">

          <!-- TOP STRIP + QUICK IDEAS -->
          <div class="top-strip">
            Top date picks
          </div>
          <div class="top-cards-row" aria-label="Quick date ideas">
      <!-- 1: Game center -->
            <div
              class="top-card"
              data-date-card
              data-title="Game center"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="gameCenter.png">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Playland</div>
                
                <div class="top-card__subtitle">
                  Хамтдаа цагийг зугаатай өнгөрүлээрэй.
                </div>
              </div>
            </div>

            <!-- 2: Rooftop coffee -->
            <div
              class="top-card"
              data-date-card
              data-title="Rooftop coffee"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="coffeeshop.png">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Coffee shop</div>
                
                <div class="top-card__subtitle">
                  Монголын хамгийн гоё кофе шопуудын нэгэнд хамтдаа кофе, дессертүүд амтлаарай.
                </div>
              </div>
            </div>

            <!-- 3: Park picnic -->
            <div
              class="top-card"
              data-date-card
              data-title="Park picnic"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="picnic.jpeg">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Park picnic</div>
                <div class="top-card__subtitle">
                 Хотын төвийн цэвэр, шинэ паркад, хамтдаа алхан нэгнийгээ таньж мэдээрэй.
                </div>
              </div>
            </div>

            <!-- 4: Art museum night + image -->
            <div
              class="top-card"
              data-date-card
              data-title="Art museum night"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="gallery.jpg">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Art museum night</div>
                <div class="top-card__subtitle">
                  Төв Азийн орчин үеийн урлагийг таниулж буй олон улсын галерей элдвийг ярилцаарай.
                </div>
              </div>
            </div>

            <!-- 5: Stargazing drive -->
            <div
              class="top-card"
              data-date-card
              data-title="Skywatching"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="starObserve.jpg">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Skywatching</div>
                <div class="top-card__subtitle">
                  Хотоос гаран оддыг ажиглаарай.
                </div>
              </div>
            </div>

            <!-- 6: Make art crawl -->
            <div
              class="top-card"
              data-date-card
              data-title="Street food crawl"
              role="button"
              tabindex="0"
              aria-pressed="false"
            >
              <div class="top-card__image">
                <img src="terrarium.png">
              </div>
              <div class="top-card__content">
                <div class="top-card__title">Terrarium art</div>
                <div class="top-card__subtitle">
                 Өөрсдийн жижигхэн хүлэмжийг бүтээгээрэй. 
                </div>
              </div>
            </div>
          </div>

          <h2 class="layout-title">Date ideas</h2>
          <p class="layout-subtitle">
            Pick a vibe: coffee, outdoor chill, adventure, or a romantic dinner.
          </p>

          <div class="category-section">
            <!-- COFFEE -->
            <div class="category-row">
              <div class="category-badge">
         
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1545_12675)">
<path d="M2 4H10C10.1326 4 10.2598 4.05268 10.3536 4.14645C10.4473 4.24021 10.5 4.36739 10.5 4.5V9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11H3.5C2.96957 11 2.46086 10.7893 2.08579 10.4142C1.71071 10.0391 1.5 9.53043 1.5 9V4.5C1.5 4.36739 1.55268 4.24021 1.64645 4.14645C1.74021 4.05268 1.86739 4 2 4V4Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.5 13.5H13.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 5H11.5C12.0304 5 12.5391 5.21071 12.9142 5.58579C13.2893 5.96086 13.5 6.46957 13.5 7C13.5 7.53043 13.2893 8.03914 12.9142 8.41421C12.5391 8.78929 12.0304 9 11.5 9H10.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 0.5V1.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 0.5V1.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 0.5V1.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

              </div>
              <div class="category-text">
                <h3>Coffee &amp; cozy</h3>
                <p>Quick, relaxed dates for easy conversations.</p>
              </div>

              <div class="category-cards">
                
<article
  class="date-card"
  data-date-card
  data-title="Agaarlay"
  role="button"
  tabindex="0"
  aria-pressed="false"
  style="--card-image: url('dateideaImg/cafe/agaarlay.png')"
>
  <div class="date-card__content">
    <div class="date-card__title" data-card-title>Агаарлая</div>
    <div class="date-card__meta">$$ · Evening · City</div>
    <div class="date-card__tags">
      <span class="date-card__tag">chill</span>
      <span class="date-card__tag">city view</span>
      <span class="date-card__tag">coffee</span>
    </div>
  </div>
</article>

                <article
  class="date-card"
  data-date-card
  data-title="Tom n Toms"
  role="button"
  tabindex="0"
  aria-pressed="false"
  style="--card-image: url('dateideaImg/cafe/tomntoms.png')"
>
  <div class="date-card__content">
    <div class="date-card__title" data-card-title>Tom n Toms</div>
    <div class="date-card__meta">$$ · Evening · City</div>
    <div class="date-card__tags">
      <span class="date-card__tag">chill</span>
      <span class="date-card__tag">city view</span>
      <span class="date-card__tag">coffee</span>
    </div>
  </div>
</article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="cafe78"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                   style="--card-image: url('dateideaImg/cafe/cafe78.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Window seat café</div>
                  <div class="date-card__meta">$ · Anytime · City</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">people-watch</span>
                    <span class="date-card__tag">talking</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Dreamy drinks"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                   style="--card-image: url('dateideaImg/cafe/dreamyDrinks.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Dreamy drinks</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sweet</span>
                    <span class="date-card__tag">coffee</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Beauty secret"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                   style="--card-image: url('dateideaImg/cafe/beautySecretcafe.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Beauty secret</div>
                  <div class="date-card__meta">$ · Morning · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">early birds</span>
                    <span class="date-card__tag">view</span>
                  </div>
                </article>
                    
               <article
                  class="date-card"
                  data-date-card
                  data-title="Bird Jazz cafe"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                   style="--card-image: url('dateideaImg/cafe/birdJazzcafe.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Bird Jazz cafe/div>
                  <div class="date-card__meta">$ · Morning · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">early birds</span>
                    <span class="date-card__tag">view</span>
                  </div>
                </article>

              </div>
            </div>
                 
          

            <!-- EXTREME / SPORT -->
            <div class="category-row">
              <div class="category-badge">
                

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle
    cx="7"
    cy="7"
    r="6.5"
    stroke="#94a3b8"
    stroke-width="1"
  />
  <path
    d="M7 0.5V13.5"
    stroke="#94a3b8"
    stroke-width="1"
    stroke-linecap="round"
  />
  <path
    d="M2.1 11.27C2.83273 10.8239 3.43838 10.1968 3.85869 9.449C4.27901 8.70119 4.49986 7.85782 4.5 6.99998C4.49986 6.14214 4.27901 5.29877 3.85869 4.55096C3.43838 3.80315 2.83273 3.17606 2.1 2.72998"
    stroke="#94a3b8"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M11.9 2.72998C11.1675 3.17622 10.5621 3.80339 10.1421 4.55119C9.72201 5.29899 9.50137 6.14227 9.50137 6.99998C9.50137 7.85769 9.72201 8.70097 10.1421 9.44877C10.5621 10.1966 11.1675 10.8237 11.9 11.27"
    stroke="#94a3b8"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>



              </div>
              <div class="category-text">
                <h3>Extreme &amp; sporty</h3>
                <p>For couples who love adrenaline and trying bold new things.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Дээд лиг"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                     style="--card-image: url('dateideaImg/sport/deedleague.png')"
                >
                   <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Дээд лиг</div>
                  <div class="date-card__meta">$$ · Afternoon · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sporty</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Параглидинг"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                     style="--card-image: url('dateideaImg/sport/paragliding.png')"
                >
                   <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Параглидинг</div>
                  <div class="date-card__meta">$$ · Day · Track</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">competitive</span>
                    <span class="date-card__tag">fun</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Paintball squad date"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                      style="--card-image: url('dateideaImg/sport/ubpaintball.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Paintball squad date</div>
                  <div class="date-card__meta">$$$ · Afternoon · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">group</span>
                    <span class="date-card__tag">action</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Steppe arena"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                     style="--card-image: url('dateideaImg/sport/steppearena.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Steppe arena</div>
                  <div class="date-card__meta">$ · Morning · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">nature</span>
                    <span class="date-card__tag">active</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Sky resort"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                      style="--card-image: url('dateideaImg/sport/skyresort.png')"
                > 
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Sky resort</div>
                  <div class="date-card__meta">$$ · Indoor · Fun</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">playful</span>
                    <span class="date-card__tag">energy</span>
                  </div>
                </article>

                 <article
                  class="date-card"
                  data-date-card
                  data-title="Bowling"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                      style="--card-image: url('dateideaImg/sport/ubbowling.png')"
                > 
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Bowling</div>
                  <div class="date-card__meta">$$ · Indoor · Fun</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">playful</span>
                    <span class="date-card__tag">energy</span>
                  </div>
                </article>
              </div>
            </div>

            <!-- RESTAURANT -->
            <div class="category-row">
              <div class="category-badge">
                
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1545_12702)">
<path d="M4 0.5H10C10.9283 0.5 11.8185 0.868749 12.4749 1.52513C13.1313 2.1815 13.5 3.07174 13.5 4C13.5 4.26522 13.3946 4.51957 13.2071 4.70711C13.0196 4.89464 12.7652 5 12.5 5H1.5C1.23478 5 0.98043 4.89464 0.792893 4.70711C0.605357 4.51957 0.5 4.26522 0.5 4C0.5 3.07174 0.868749 2.1815 1.52513 1.52513C2.1815 0.868749 3.07174 0.5 4 0.5V0.5Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.5 7.5H13.5" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 10H7L5.5 11.5L2.5 10H1C0.867392 10 0.740215 10.0527 0.646447 10.1464C0.552678 10.2402 0.5 10.3674 0.5 10.5V10.5C0.5 11.2956 0.81607 12.0587 1.37868 12.6213C1.94129 13.1839 2.70435 13.5 3.5 13.5H10.5C11.2956 13.5 12.0587 13.1839 12.6213 12.6213C13.1839 12.0587 13.5 11.2956 13.5 10.5C13.5 10.3674 13.4473 10.2402 13.3536 10.1464C13.2598 10.0527 13.1326 10 13 10Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

             

              </div>
              <div class="category-text">
                <h3>Restaurants &amp; food</h3>
                <p>Perfect for anniversaries, birthdays, or a special night.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Agnista"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/agnista.png')"
                >
                 <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Agnista</div>
                  <div class="date-card__meta">$$$ · Evening · Vegan</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">romantic</span>
                    <span class="date-card__tag">classic</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Street food crawl"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/blueSkylounge.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Street food crawl</div>
                  <div class="date-card__meta">$$ · Night · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">casual</span>
                    <span class="date-card__tag">foodie</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="California"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/california.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>California</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">hands-on</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Gate"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/gate.png')"
                >
                 <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Gate</div>
                  <div class="date-card__meta">$$$ · Evening · Restaurant</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">fancy</span>
                    <span class="date-card__tag">special</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Route 22"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/route22.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Lazy brunch date</div>
                  <div class="date-card__meta">$$ · Morning · Café</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">chill</span>
                    <span class="date-card__tag">weekend</span>
                  </div>
                </article>
                 
                <article
                  class="date-card"
                  data-date-card
                  data-title="II Fiore Italin restaurant"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  style="--card-image: url('dateideaImg/food/iifiore.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>II Fiore Italin restaurant</div>
                  <div class="date-card__meta">$$ · Morning · Café</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">chill</span>
                    <span class="date-card__tag">weekend</span>
                  </div>
                </article>
              </div>
            </div>

            <!-- FLOWERS / EXTRA -->
            <div class="category-row">
              <div class="category-badge">
                
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1545_8560)">
<path d="M8.5 5C9.05228 5 9.5 4.55228 9.5 4C9.5 3.44772 9.05228 3 8.5 3C7.94772 3 7.5 3.44772 7.5 4C7.5 4.55228 7.94772 5 8.5 5Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.5 10C4.77614 10 5 9.77614 5 9.5C5 9.22386 4.77614 9 4.5 9C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.5 6.5C5.05228 6.5 5.5 6.05228 5.5 5.5C5.5 4.94772 5.05228 4.5 4.5 4.5C3.94772 4.5 3.5 4.94772 3.5 5.5C3.5 6.05228 3.94772 6.5 4.5 6.5Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.52002 12.28C9.50887 12.086 9.44146 11.8995 9.32603 11.7432C9.2106 11.587 9.05214 11.4677 8.87002 11.4C8.41772 11.2513 8.03329 10.9462 7.78584 10.5395C7.5384 10.1327 7.44416 9.65106 7.52009 9.18105C7.59601 8.71105 7.83711 8.28354 8.20004 7.9754C8.56297 7.66726 9.02392 7.49869 9.50002 7.5H11.37C11.6907 7.5009 12.007 7.42464 12.2921 7.27767C12.5771 7.1307 12.8227 6.91732 13.008 6.65554C13.1933 6.39375 13.3129 6.09124 13.3568 5.77353C13.4007 5.45581 13.3675 5.1322 13.26 4.83C12.8623 3.70697 12.1635 2.71485 11.2401 1.96205C10.3167 1.20924 9.20417 0.724704 8.02404 0.561374C6.8439 0.398044 5.64158 0.562205 4.54842 1.03592C3.45526 1.50964 2.51333 2.27468 1.82553 3.24748C1.13773 4.22027 0.730524 5.36339 0.648398 6.55194C0.566273 7.74049 0.812389 8.92875 1.35986 9.9869C1.90732 11.045 2.73508 11.9324 3.7527 12.5519C4.77031 13.1715 5.93863 13.4995 7.13002 13.5C7.71838 13.5016 8.30407 13.4209 8.87002 13.26C9.07788 13.2018 9.25789 13.0707 9.37721 12.8908C9.49653 12.7109 9.54721 12.4942 9.52002 12.28V12.28Z" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

              </div>
              <div class="category-text">
                <h3>Little extras</h3>
                <p>Add something sweet on top of your date plan.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Баллет"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  < style="--card-image: url('dateideaImg/otherActivities/ballet.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Баллет</div>
                  <div class="date-card__meta">$$ · Delivery / Pickup</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">romantic</span>
                    <span class="date-card__tag">surprise</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Cotton Cat cafe"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                 < style="--card-image: url('dateideaImg/otherActivities/cottonCatcafe.png')"
                > 
                <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Cotton Cat cafe</div>
                  <div class="date-card__meta">$$ · Restaurant add-on</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">wow effect</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Симфони; note"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                   < style="--card-image: url('dateideaImg/otherActivities/symphony.png')"
                >
                  <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Симфони</div>
                  <div class="date-card__meta">$ · Simple gift</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">thoughtful</span>
                    <span class="date-card__tag">cute</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Улаанбаатар урлагийн музей"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  < style="--card-image: url('dateideaImg/otherActivities/ubmuseum.png')"
                >
                  <div class="date-card__content"> 
                  <div class="date-card__title" data-card-title>After-date bouquet</div>
                  <div class="date-card__meta">$$ · Next-day delivery</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">follow-up</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Төв номын сан"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  < style="--card-image: url('dateideaImg/otherActivities/library.png')"
                >
                 <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Төв номын сан</div>
                  <div class="date-card__meta">$$ · DIY / Shop</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">cute</span>
                    <span class="date-card__tag">photo-friendly</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Керамик гар урлал"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                  < style="--card-image: url('dateideaImg/otherActivities/keramik.png')"
                >
                 <div class="date-card__content">
                  <div class="date-card__title" data-card-title>Керамик гар урлал</div>
                  <div class="date-card__meta">$$ · DIY / Shop</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">cute</span>
                    <span class="date-card__tag">photo-friendly</span>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div id="chosen-message" hidden></div>
        </div>
      </section>
    `;
  }

  initCardSelection() {
    this.teardownCardSelection(); // safety if re-rendered

    this.allCards = this.shadowRoot.querySelectorAll("[data-date-card]");
    this.infoEl = this.shadowRoot.getElementById("chosen-message");

    if (!this.allCards.length || !this.infoEl) return;

    this.infoEl.hidden = true;

    this.allCards.forEach((card) => {
      card.addEventListener("click", this.handleCardClick);
      card.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          card.click();
        }
      });
    });
  }

  teardownCardSelection() {
    if (!this.allCards) return;
    this.allCards.forEach((card) => {
      card.removeEventListener("click", this.handleCardClick);
    });
    this.allCards = null;
  }

  handleCardClick(evt) {
    const card = evt.currentTarget;
    const title =
      card.getAttribute("data-title") ||
      card.querySelector("[data-card-title]")?.textContent?.trim() ||
      "this idea";

    if (this.allCards) {
      this.allCards.forEach((c) => {
        c.classList.remove("date-card--selected", "top-card--selected");
        c.setAttribute("aria-pressed", "false");
      });
    }

    if (card.classList.contains("top-card")) {
      card.classList.add("top-card--selected");
    } else {
      card.classList.add("date-card--selected");
    }
    card.setAttribute("aria-pressed", "true");

    if (this.infoEl) {
      this.infoEl.textContent = "You chose: " + title;
      this.infoEl.hidden = false;
    }

    this.dispatchEvent(
      new CustomEvent("dateidea-select", {
        detail: {
          title,
          source: card.classList.contains("top-card") ? "top" : "category",
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

window.customElements.define("com-dateidea", DateIdea);
