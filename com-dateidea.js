class DateIdea extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
                  <style>
                    :root {
                    --first-color: #FF0B55;
                    --second-color: #CF0F47;
                    --font-header: "Yanone Kaffeesatz", sans-serif;
                    --font-body: "Roboto Condensed", sans-serif;
                    }

                    /* --------- COMMON TYPOGRAPHY --------- */
                    html,
                    body {
                    width: 100%;
                    }

                    body {
                    margin: 0;
                    background-color: #F5F5F5;
                    font-family: var(--font-body);
                    }

                    h1 {
                    color: #F5F5F5;
                    font-family: var(--font-header);
                    margin: 0;
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

                    p {
                    font-family: var(--font-body);
                    font-weight: 400;
                    margin: 0;
                    }

                    /* --------- EDIT ICON BUTTON (хэрэгтэй бол) --------- */
                    .edit-button {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: no-repeat center;
                    background-size: contain;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 32'><path fill-rule='evenodd' clip-rule='evenodd' d='M19.4782 0.947093L17.4437 3.19506L26.1083 12.7688L28.1428 10.5209C29.2857 9.25806 29.2857 7.21068 28.1428 5.94789L23.6169 0.947092C22.474 -0.315698 20.621 -0.315697 19.4782 0.947093ZM4.02359 18.2305C3.72599 18.5593 3.91974 19.1223 4.33989 19.1496L4.98994 19.1918C5.36024 19.2158 5.65567 19.5422 5.67741 19.9514L5.79611 22.1845C5.80336 22.3209 5.90184 22.4297 6.02527 22.4377L8.04638 22.5689C8.41668 22.5929 8.71211 22.9193 8.73386 23.3285L8.85256 25.5617C8.85981 25.698 8.95828 25.8069 9.08172 25.8149L11.1028 25.946C11.4731 25.97 11.7686 26.2965 11.7903 26.7056L11.8269 27.394C11.8516 27.8582 12.3611 28.0723 12.6587 27.7434L23.7762 15.4595C23.9667 15.2491 23.9667 14.9078 23.7762 14.6974L15.8436 5.93251C15.6531 5.72205 15.3443 5.72205 15.1538 5.93251L4.02359 18.2305ZM0.716566 22.1597C0.327776 22.1345 -3.77004e-05 22.4761 3.25206e-09 22.9064L0.000735568 31.2514C0.000772011 31.6644 0.303771 31.9991 0.67755 31.9992L8.23013 32C8.61959 32 8.92875 31.6378 8.90591 31.2083L8.80063 29.2276C8.78051 28.849 8.50719 28.547 8.1646 28.5248L6.29474 28.4035C6.18055 28.3961 6.08944 28.2954 6.08273 28.1692L5.97291 26.1032C5.95279 25.7246 5.67947 25.4226 5.33688 25.4004L3.46703 25.2791C3.35283 25.2717 3.26172 25.171 3.25502 25.0448L3.1452 22.9788C3.12508 22.6002 2.85176 22.2982 2.50917 22.276L0.716566 22.1597Z' fill='%23CF0F47'/></svg>");
                    cursor: pointer;
                    }

                    /* --------- HEADER (NUMDATE header-ийг нэгтгэв) ---------- */
                    header{
                        display: flex;
                        width: calc(100%-8px);
                        background: linear-gradient(to top, #EE0067, #BC2265);
                        height: 55px;
                        align-items: center;
                        & svg.logo{
                            margin: 10px;
                            margin-right: 0px;
                        }

                        & > div {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin-right: auto;
                            color: white;
                        }
                        & > a {
                            margin-right: 20px;
                        }
                    }

                    header nav {
                        display: flex;
                        font-family: var(--font-header);
                        ul {
                            display: flex;
                            justify-content: space-around;
                            list-style: none;
                            gap:15px;
                            padding : 15px 20px;
                            a{  
                                display: flex;
                                color: white;
                                text-decoration: none;
                                font-size: 20px;
                                font-weight: 600;
                            }
                        }
                        height: 55px;
                        align-items: center;
                        gap: 20px;
                    }

                    /* --------- DATE IDEA SECTION ---------- */

                    main.date-layout {
                    padding: 40px 24px;
                    display: flex;
                    justify-content: center;
                    }

                    .date-chooser {
                    max-width: 960px;
                    width: 100%;
                    background: #ffffff;
                    border-radius: 32px;
                    padding: 24px 28px 32px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    box-sizing: border-box;
                    }

                    .date-chooser h2 {
                    margin-bottom: 4px;
                    }

                    .date-chooser p.date-intro {
                    margin-top: 4px;
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.7);
                    }

                    .date-card-grid {
                    margin-top: 24px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                    }

                    .date-card {
                    background: #fff;
                    border-radius: 24px;
                    border: 1px solid #e3e3e3;
                    padding: 14px 14px 16px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
                    box-sizing: border-box;
                    }

                    .date-card-image {
                    height: 160px;
                    border-radius: 18px;
                    background-size: cover;
                    background-position: center;
                    margin-bottom: 10px;
                    }

                    .date-card h3 {
                    font-size: 24px;
                    color: var(--second-color);
                    margin-bottom: 4px;
                    }

                    .date-card .meta {
                    font-size: 12px;
                    color: #777;
                    margin-bottom: 6px;
                    }

                    .date-card p {
                    font-size: 13px;
                    color: #444;
                    }

                    .date-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 8px;
                    }

                    .date-tag {
                    font-size: 11px;
                    padding: 3px 8px;
                    border-radius: 999px;
                    background: #ffe3ef;
                    color: var(--second-color);
                    }

                    .date-card button {
                    margin-top: 10px;
                    width: 100%;
                    padding: 8px 0;
                    border-radius: 999px;
                    border: none;
                    cursor: pointer;
                    font-family: var(--font-header);
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                    background: linear-gradient(to top, var(--first-color), var(--second-color));
                    }

                    /* Жижигхэн placeholder хэсгүүд */
                    #messages,
                    #profile {
                    padding: 40px 24px;
                    font-size: 18px;
                    }
                </style>
              <main id="home" class="date-layout">
                <section class="date-chooser" id="dateidea">
                <h2>Where do you want to go?</h2>
                <p class="date-intro">
                    Pick a vibe for your next date – cozy coffee, fresh air or something a bit artsy.
                </p>

                <div class="date-card-grid">
                    <!-- Card 1 -->
                    <article class="date-card">
                    <div class="date-card-image"
                        style="background-image:url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80');">
                        <!-- Хэрэв нэг хавтас дотор байгаа зураг ашиглах бол:
                            style="background-image:url('coffee.jpg');" гэх мэтээр сольж бичнэ -->
                    </div>
                    <h3>Rooftop coffee</h3>
                    <div class="meta">Budget: $$ · Evening · City</div>
                    <p>
                        Watch the sunset together on a rooftop café, share a warm drink and talk about everything.
                    </p>
                    <div class="date-tags">
                        <span class="date-tag">chill</span>
                        <span class="date-tag">city view</span>
                        <span class="date-tag">talking</span>
                    </div>
                    <button>Choose this place</button>
                    </article>

                    <!-- Card 2 -->
                    <article class="date-card">
                    <div class="date-card-image"
                        style="background-image:url('https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=800&q=80');">
                    </div>
                    <h3>Park picnic</h3>
                    <div class="meta">Budget: $ · Afternoon · Outdoor</div>
                    <p>
                        Grab a blanket, some snacks and music. Lie in the grass, play games and people-watch together.
                    </p>
                    <div class="date-tags">
                        <span class="date-tag">outdoor</span>
                        <span class="date-tag">low budget</span>
                        <span class="date-tag">daytime</span>
                    </div>
                    <button>Choose this place</button>
                    </article>

                    <!-- Card 3 -->
                    <article class="date-card">
                    <div class="date-card-image"
                        style="background-image:url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80');">
                    </div>
                    <h3>Art museum night</h3>
                    <div class="meta">Budget: $$ · Evening · Indoor</div>
                    <p>
                        Walk slowly through an art gallery or museum, share your favourite pieces and learn about each other’s
                        taste.
                    </p>
                    <div class="date-tags">
                        <span class="date-tag">artsy</span>
                        <span class="date-tag">indoor</span>
                        <span class="date-tag">quiet</span>
                    </div>
                    <button>Choose this place</button>
                    </article>
                </div>
                </section>
            </main>
        `;
        this.addEventListener("DOMContentLoaded", function () {
        // ----- NAV LINK-үүд -----
        const navLinks = this.querySelectorAll("header nav a");

        navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            const href = link.getAttribute("href");

            // Хэрвээ href нь #section бол зөөлөн scroll хийнэ
            if (href && href.startsWith("#")) {
            const target = this.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            }

            // active классыг солих
            navLinks.forEach(function (l) {
            l.classList.remove("active");
            });
            link.classList.add("active");
        });
        });

        // ----- DATE CARD сонгох логик -----
        const buttons = this.querySelectorAll(".date-card button");
        const chooser = this.querySelector(".date-chooser");

        // Сонгосон газар харагдуулах жижиг текст
        let infoEl = null;
        if (chooser) {
        infoEl = this.createElement("div");
        infoEl.id = "chosen-message";
        infoEl.style.marginTop = "16px";
        infoEl.style.fontSize = "14px";
        infoEl.style.color = "#555";
        chooser.appendChild(infoEl);
        }

        buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const card = btn.closest(".date-card");
            const titleEl = card ? card.querySelector("h3") : null;
            const title = titleEl ? titleEl.textContent.trim() : "this place";

            // Бусад товчны текстийг reset хийе
            buttons.forEach(function (b) {
            if (b !== btn) {
                b.textContent = "Choose this place";
            }
            });

            // Энэ товчийг "Chosen ✓" болгоно
            btn.textContent = "Chosen ✓";

            // Дээрээс нь сонгосон газрыг текстээр харуулах
            if (infoEl) {
            infoEl.textContent = "You chose: " + title;
            } else {
            alert("You chose: " + title);
            }
        });
        });
    });
    }
};

window.customElements.define('com-dateidea', DateIdea);