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

        .category-badge span {
          transform: rotate(-45deg);
          font-size: 24px;
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
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px;
          margin-top: 10px;
        }

        .date-card {
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          height: 96px;
          background: #fff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px 14px;
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease,
            background-color 0.18s ease;
        }

        .date-card__title {
          font-family: var(--font-header);
          font-size: 17px;
          margin-bottom: 4px;
          color: #111827;
        }

        .date-card__meta {
          font-size: 11px;
          color: #6b7280;
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
          background: #eef2ff;
          color: #4f46e5;
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
                <span>☕</span>
              </div>
              <div class="category-text">
                <h3>Coffee &amp; cozy</h3>
                <p>Quick, relaxed dates for easy conversations.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Rooftop coffee"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Rooftop coffee</div>
                  <div class="date-card__meta">$$ · Evening · City</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">chill</span>
                    <span class="date-card__tag">city view</span>
                    <span class="date-card__tag">coffee</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Bookstore &amp; latte"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Bookstore &amp; latte</div>
                  <div class="date-card__meta">$ · Afternoon · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">cozy</span>
                    <span class="date-card__tag">introvert</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Window seat café"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
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
                  data-title="Dessert &amp; coffee flight"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Dessert &amp; coffee flight</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sweet</span>
                    <span class="date-card__tag">coffee</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Sunrise takeaway coffee"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Sunrise takeaway coffee</div>
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
                <span>🤸</span>
              </div>
              <div class="category-text">
                <h3>Extreme &amp; sporty</h3>
                <p>For couples who love adrenaline and trying bold new things.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Indoor climbing"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Indoor climbing</div>
                  <div class="date-card__meta">$$ · Afternoon · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sporty</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Go-kart race"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Go-kart race</div>
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
                >
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
                  data-title="Short hike &amp; viewpoint"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Short hike &amp; viewpoint</div>
                  <div class="date-card__meta">$ · Morning · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">nature</span>
                    <span class="date-card__tag">active</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Trampoline park"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Trampoline park</div>
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
                <span>🍽️</span>
              </div>
              <div class="category-text">
                <h3>Restaurants &amp; food</h3>
                <p>Perfect for anniversaries, birthdays, or a special night.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Candlelight dinner"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Candlelight dinner</div>
                  <div class="date-card__meta">$$$ · Evening · Indoor</div>
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
                >
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
                  data-title="Cooking class for two"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Cooking class for two</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">hands-on</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Tasting menu night"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Tasting menu night</div>
                  <div class="date-card__meta">$$$ · Evening · Restaurant</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">fancy</span>
                    <span class="date-card__tag">special</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Lazy brunch date"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Lazy brunch date</div>
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
                <span>🌸</span>
              </div>
              <div class="category-text">
                <h3>Flowers &amp; little extras</h3>
                <p>Add something sweet on top of your date plan.</p>
              </div>

              <div class="category-cards">
                <article
                  class="date-card"
                  data-date-card
                  data-title="Bouquet before the date"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Bouquet before the date</div>
                  <div class="date-card__meta">$$ · Delivery / Pickup</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">romantic</span>
                    <span class="date-card__tag">surprise</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Flowers on the table"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Flowers on the table</div>
                  <div class="date-card__meta">$$ · Restaurant add-on</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">wow effect</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Mini flower &amp; note"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Mini flower &amp; note</div>
                  <div class="date-card__meta">$ · Simple gift</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">thoughtful</span>
                    <span class="date-card__tag">cute</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="After-date bouquet"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>After-date bouquet</div>
                  <div class="date-card__meta">$$ · Next-day delivery</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">follow-up</span>
                  </div>
                </article>

                <article
                  class="date-card"
                  data-date-card
                  data-title="Flower bracelets"
                  role="button"
                  tabindex="0"
                  aria-pressed="false"
                >
                  <div class="date-card__title" data-card-title>Flower bracelets</div>
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
