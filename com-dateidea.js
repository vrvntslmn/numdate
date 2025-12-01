class DateIdea extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initCardSelection();
  }

  render() {
    this.innerHTML = `
      <style>
        :root {
          --first-color: #FF0B55;
          --second-color: #CF0F47;
          --font-header: "Yanone Kaffeesatz", sans-serif;
          --font-body: "Roboto Condensed", sans-serif;
        }

        html, body {
          width: 100%;
        }

        body {
          margin: 0;
          background-color: #F5F5F5;
          font-family: var(--font-body);
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

        main.date-layout {
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
          box-sizing: border-box;
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
        }

        .top-card {
          min-width: 150px;
          max-width: 160px;
          border-radius: 18px;
          border: 1px solid #cbd5e1;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
        }

        .top-card:hover {
          box-shadow: 0 8px 20px rgba(148, 163, 184, 0.4);
          transform: translateY(-2px);
        }

        .top-card__image {
          height: 78px;
          background: #dde5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #64748b;
        }

        .top-card__content {
          padding: 10px 12px 12px;
        }

        .top-card__title {
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          margin-bottom: 6px;
        }

        .top-card__subtitle {
          height: 6px;
          border-radius: 4px;
          background: #e2e8f0;
          width: 70%;
        }

        .top-card--selected {
          border-color: var(--second-color);
          box-shadow: 0 0 0 2px rgba(207, 15, 71, 0.25);
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
          box-sizing: border-box;
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
          transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
        }

        .date-card:hover {
          box-shadow: 0 8px 16px rgba(148, 163, 184, 0.35);
          transform: translateY(-2px);
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

        .date-card--selected {
          border-color: var(--second-color);
          box-shadow: 0 0 0 2px rgba(207, 15, 71, 0.25);
        }

        /* --------- CHOSEN MESSAGE ---------- */

        #chosen-message {
          margin-top: 18px;
          font-size: 14px;
          color: #475569;
          padding: 10px 12px;
          border-radius: 999px;
          background: #f9f5ff;
          display: none;
          align-items: center;
          gap: 8px;
        }

        #chosen-message::before {
          content: "💘";
        }

        @media (max-width: 720px) {
          .category-row {
            grid-template-columns: 1fr;
          }
          .category-cards {
            grid-column: 1 / -1;
          }
        }
      </style>

      <main class="date-layout">
        <section class="date-chooser" id="dateidea">

          <!-- TOP STRIP + QUICK IDEAS -->
          <div class="top-strip">
          Top 10 date idea </div>
          <div class="top-cards-row">
            <div class="top-card" data-title="Add custom idea">
              <div class="top-card__image">+</div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
            <div class="top-card top-card" data-title="Add custom idea">
              <div class="top-card__image">+</div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
            <div class="top-card" data-title="Rooftop coffee">
              <div class="top-card__image"></div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
            <div class="top-card" data-title="Park picnic">
              <div class="top-card__image"></div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
            <div class="top-card" data-title="Art museum night">
              <div class="top-card__image"></div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
            <div class="top-card" data-title="Stargazing drive">
              <div class="top-card__image"></div>
              <div class="top-card__content">
                <div class="top-card__title"></div>
                <div class="top-card__subtitle"></div>
              </div>
            </div>
          </div>

          <h2 class="layout-title">Date ideas</h2>
          <p class="layout-subtitle">Pick a vibe: coffee, outdoor chill, adventure, or a romantic dinner.</p>

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
                <article class="date-card" data-title="Rooftop coffee">
                  <div class="date-card__title">Rooftop coffee</div>
                  <div class="date-card__meta">$$ · Evening · City</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">chill</span>
                    <span class="date-card__tag">city view</span>
                    <span class="date-card__tag">coffee</span>
                  </div>
                </article>

                <article class="date-card" data-title="Bookstore & latte">
                  <div class="date-card__title">Bookstore &amp; latte</div>
                  <div class="date-card__meta">$ · Afternoon · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">cozy</span>
                    <span class="date-card__tag">introvert</span>
                  </div>
                </article>

                <article class="date-card" data-title="Window seat café">
                  <div class="date-card__title">Window seat café</div>
                  <div class="date-card__meta">$ · Anytime · City</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">people-watch</span>
                    <span class="date-card__tag">talking</span>
                  </div>
                </article>

                <article class="date-card" data-title="Dessert & coffee flight">
                  <div class="date-card__title">Dessert &amp; coffee flight</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sweet</span>
                    <span class="date-card__tag">coffee</span>
                  </div>
                </article>

                <article class="date-card" data-title="Sunrise takeaway coffee">
                  <div class="date-card__title">Sunrise takeaway coffee</div>
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
                <article class="date-card" data-title="Indoor climbing">
                  <div class="date-card__title">Indoor climbing</div>
                  <div class="date-card__meta">$$ · Afternoon · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">sporty</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article class="date-card" data-title="Go-kart race">
                  <div class="date-card__title">Go-kart race</div>
                  <div class="date-card__meta">$$ · Day · Track</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">competitive</span>
                    <span class="date-card__tag">fun</span>
                  </div>
                </article>

                <article class="date-card" data-title="Paintball squad date">
                  <div class="date-card__title">Paintball squad date</div>
                  <div class="date-card__meta">$$$ · Afternoon · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">group</span>
                    <span class="date-card__tag">action</span>
                  </div>
                </article>

                <article class="date-card" data-title="Short hike & viewpoint">
                  <div class="date-card__title">Short hike &amp; viewpoint</div>
                  <div class="date-card__meta">$ · Morning · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">nature</span>
                    <span class="date-card__tag">active</span>
                  </div>
                </article>

                <article class="date-card" data-title="Trampoline park">
                  <div class="date-card__title">Trampoline park</div>
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
                <article class="date-card" data-title="Candlelight dinner">
                  <div class="date-card__title">Candlelight dinner</div>
                  <div class="date-card__meta">$$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">romantic</span>
                    <span class="date-card__tag">classic</span>
                  </div>
                </article>

                <article class="date-card" data-title="Street food crawl">
                  <div class="date-card__title">Street food crawl</div>
                  <div class="date-card__meta">$$ · Night · Outdoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">casual</span>
                    <span class="date-card__tag">foodie</span>
                  </div>
                </article>

                <article class="date-card" data-title="Cooking class for two">
                  <div class="date-card__title">Cooking class for two</div>
                  <div class="date-card__meta">$$ · Evening · Indoor</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">hands-on</span>
                    <span class="date-card__tag">teamwork</span>
                  </div>
                </article>

                <article class="date-card" data-title="Tasting menu night">
                  <div class="date-card__title">Tasting menu night</div>
                  <div class="date-card__meta">$$$ · Evening · Restaurant</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">fancy</span>
                    <span class="date-card__tag">special</span>
                  </div>
                </article>

                <article class="date-card" data-title="Brunch date">
                  <div class="date-card__title">Lazy brunch date</div>
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
                <article class="date-card" data-title="Bouquet before the date">
                  <div class="date-card__title">Bouquet before the date</div>
                  <div class="date-card__meta">$$ · Delivery / Pickup</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">romantic</span>
                    <span class="date-card__tag">surprise</span>
                  </div>
                </article>

                <article class="date-card" data-title="Table flowers at restaurant">
                  <div class="date-card__title">Flowers on the table</div>
                  <div class="date-card__meta">$$ · Restaurant add-on</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">wow effect</span>
                  </div>
                </article>

                <article class="date-card" data-title="Mini flower & note">
                  <div class="date-card__title">Mini flower &amp; note</div>
                  <div class="date-card__meta">$ · Simple gift</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">thoughtful</span>
                    <span class="date-card__tag">cute</span>
                  </div>
                </article>

                <article class="date-card" data-title="After-date flowers">
                  <div class="date-card__title">After-date bouquet</div>
                  <div class="date-card__meta">$$ · Next-day delivery</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">follow-up</span>
                  </div>
                </article>

                <article class="date-card" data-title="Matching flower bracelets">
                  <div class="date-card__title">Flower bracelets</div>
                  <div class="date-card__meta">$$ · DIY / Shop</div>
                  <div class="date-card__tags">
                    <span class="date-card__tag">cute</span>
                    <span class="date-card__tag">photo-friendly</span>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div id="chosen-message"></div>
        </section>
      </main>
    `;
  }

  initCardSelection() {
    const allCards = this.querySelectorAll(".date-card, .top-card");
    const infoEl = this.querySelector("#chosen-message");
    if (!allCards.length || !infoEl) return;

    infoEl.style.display = "none";

    allCards.forEach((card) => {
      card.addEventListener("click", () => {
        const title =
          card.getAttribute("data-title") ||
          card.querySelector(".date-card__title")?.textContent?.trim() ||
          "this idea";

        // reset
        allCards.forEach((c) => {
          c.classList.remove("date-card--selected", "top-card--selected");
        });

        if (card.classList.contains("top-card")) {
          card.classList.add("top-card--selected");
        } else {
          card.classList.add("date-card--selected");
        }

        infoEl.textContent = "You chose: " + title;
        infoEl.style.display = "inline-flex";
      });
    });
  }
}

window.customElements.define("com-dateidea", DateIdea);
