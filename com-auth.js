class Auth extends HTMLElement {
    static MBTI = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
    static LOVE_LANG = ["Words of Affirmation", "Receiving Gifts", "Quality Time", "Acts of Service", "Physical Touch", "Shared Experiences"];
    static REL_GOALS = ["Long-term", "Short-term fun", "Short-term, open to long", "Friends", "Just have fun", "Not sure"];
    static INTERESTED_IN = ["Эр", "Эм", "Бусад", "Бүгд"];
    static INTERESTS = {
        art: "Урлаг",
        sport: "Спорт",
        music: "Хөгжим",
        computer: "Компьютер",
        travel: "Аялал",
        book: "Ном",
        chess: "Шатар",
        beauty: "Гоо сайхан",
        photo: "Гэрэл зураг",
        fashion: "Хувцас",
        movie: "Кино",
        study: "Хичээл",
        coffee: "Кофе",
        run: "Гүйлт",
        gaming: "Gaming",
        cooking: "Cooking",
    };


    constructor() {
        super();
        this.state = {
            authMode: 'login',
            stepIndex: 0,
            signup: {
                mbti: '',
                loveLanguage: '',
                relationshipGoal: '',
                interestedIn: '',
                interests: {},
                avatarFile: null,
                avatarUrl: ""
            }
        };
    }

    connectedCallback() {
        this.render();
        this.cache();
        this.bind();
        this.mountChips();
        this.setAuth('login');
        this.setStep(0);
    }

    render() {
        this.innerHTML = `
            <style>
                :root {
                    --bg: #faf8f9;
                    --card: #ffffff;
                    --accent: #EE0067;
                    --accent2: #BC2265;
                    --muted: #8b8f95;
                    --text: #101828;
                    --danger: #E03A3A;
                    --success: #27AE60;
                    --radius: 16px;
                    --shadow: 0 18px 60px rgba(16, 24, 40, .10);
                    font-family: "Roboto Condensed", system-ui, -apple-system, "Segoe UI", Roboto, Arial;
                }
                * { box-sizing: border-box }
                html, body { height: 100%; margin: 0; }
                body {
                    background:
                        radial-gradient(1200px 800px at 10% 10%, rgba(238, 0, 103, .10), transparent 55%),
                        radial-gradient(900px 700px at 90% 30%, rgba(188, 34, 101, .10), transparent 55%),
                        linear-gradient(180deg, #fff 0, #fbf5f7 100%);
                    color: var(--text);
                }
                .wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 28px;
                }
                .shell {
                    width: min(980px, 96vw);
                    display: grid;
                    grid-template-columns: 1.05fr .95fr;
                    gap: 18px;
                    align-items: stretch;
                }
                .promo {
                    min-height: 560px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 32px;
                    border-radius: var(--radius);
                    background: linear-gradient(135deg,
                        rgba(238, 0, 103, .96),
                        rgba(188, 34, 101, .96));
                    color: #fff;
                    box-shadow: var(--shadow);
                    position: relative;
                    overflow: hidden;
                }
                .promo::after {
                    content: "";
                    position: absolute;
                    inset: -120px -120px auto auto;
                    width: 420px;
                    height: 420px;
                    background: radial-gradient(circle at 30% 30%,
                        rgba(255, 255, 255, .35),
                        rgba(255, 255, 255, 0) 60%);
                    transform: rotate(18deg);
                    pointer-events: none;
                }
                .promoHeader {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-bottom: 0;
                }
                .promo .logo {
                    width: 112px;
                    height: auto;
                    flex: 0 0 auto;
                }
                .brandName {
                    font-size: 56px;
                    letter-spacing: 1.2px;
                }
                .brandSub {
                    margin-top: 10px;
                    opacity: .92;
                }
                p.tagline {
                    font-size: 16px;
                    line-height: 1.65;
                    margin: 6px 0 0;
                    max-width: 50ch;
                }
                .pillrow {
                    margin-top: 0;
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                }
                .pill {
                    padding: 12px 14px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    background: rgba(255, 255, 255, .14);
                    border: 1px solid rgba(255, 255, 255, .20);
                }
                .promoFoot {
                    margin-top: 8px;
                    font-size: 12.5px;
                    opacity: .9;
                    line-height: 1.5;
                    padding-top: 14px;
                    border-top: 1px solid rgba(255, 255, 255, .18);
                }
                .card {
                    border-radius: var(--radius);
                    background: var(--card);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                    min-height: 620px;
                    display: flex;
                    flex-direction: column;
                }
                .cardHead {
                    padding: 18px 18px 10px 18px;
                    border-bottom: 1px solid rgba(16, 24, 40, .06);
                }
                .lead {
                    margin: 0;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.4;
                    font-weight: 400;
                }
                .switchRow {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 10px;
                }
                .authFooter {
                    margin-top: auto;
                    padding-top: 14px;
                    border-top: 1px solid rgba(16, 24, 40, .06);
                    display: flex;
                    justify-content: center;
                }
                .authTitle {
                    font-weight: 800;
                    font-size: 40px;
                    color: var(--accent);
                }
                .linkBtn {
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                    padding: 6px 0;
                    font-family: "Roboto Condensed", system-ui, sans-serif;
                    font-size: 13.5px;
                    color: var(--accent2);
                    font-weight: 700;
                }
                .linkBtn:hover {
                    text-decoration: underline;
                }
                .metaRow {
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-end;
                }
                .cardBody {
                    padding: 16px 18px 18px 18px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                form { margin: 0; }
                label {
                    display: block;
                    font-size: 12.8px;
                    font-weight: 700;
                    color: #20242c;
                    margin: 10px 0 6px;
                }
                .row2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .field {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid rgba(16, 24, 40, .10);
                    padding: 11px 12px;
                    border-radius: 12px;
                    background: #fff;
                    transition: border .12s, box-shadow .12s;
                }
                .field:focus-within {
                    border-color: rgba(238, 0, 103, .35);
                    box-shadow: 0 0 0 4px rgba(238, 0, 103, .08);
                }
                input, select {
                    border: 0;
                    outline: none;
                    font-size: 14.5px;
                    width: 100%;
                    background: transparent;
                    color: #111;
                    font-family: "Roboto Condensed", system-ui, sans-serif;
                }
                select { appearance: none; }
                .hint {
                    font-size: 12.5px;
                    color: var(--muted);
                    margin-top: 6px;
                }
                .err {
                    font-size: 12.5px;
                    color: var(--danger);
                    margin-top: 6px;
                    display: none;
                    font-weight: 400;
                }
                .ok {
                    font-size: 12.5px;
                    color: var(--success);
                    margin-top: 6px;
                    display: none;
                    font-weight: 400;
                }
                .pw-toggle {
                    background: transparent;
                    border: 0;
                    cursor: pointer;
                    font-weight: 700;
                    color: var(--muted);
                    font-size: 12px;
                    font-family: "Roboto Condensed", system-ui, sans-serif;
                }
                .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 14px;
                    align-items: center;
                }
                .actions.stack {
                    flex-direction: column;
                    align-items: stretch;
                }
                .actions.stack .btn { width: 100%; }
                .btn {
                    flex: 1;
                    border: 0;
                    padding: 11px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 700;
                    letter-spacing: .2px;
                    transition: transform .12s, box-shadow .12s, opacity .12s;
                    font-family: "Roboto Condensed", system-ui, sans-serif;
                }
                .btn.primary {
                    background: linear-gradient(90deg, var(--accent), var(--accent2));
                    color: #fff;
                    box-shadow: 0 14px 34px rgba(238, 0, 103, .18);
                }
                .btn.secondary {
                    background: #fff;
                    border: 1px solid rgba(188, 34, 101, .14);
                    color: var(--accent2);
                    box-shadow: none;
                }
                .btn:active { transform: translateY(1px); }
                .btn.disabled {
                    opacity: .45;
                    cursor: default;
                    box-shadow: none;
                    transform: none;
                }
                .wizardTop {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 10px;
                }
                .stepTitle {
                    font-weight: 700;
                    font-size: 14px;
                    margin: 0;
                }
                .stepCounter {
                    font-size: 12.5px;
                    color: var(--muted);
                    font-weight: 700;
                }
                .progress {
                    height: 8px;
                    border-radius: 999px;
                    background: rgba(16, 24, 40, .08);
                    overflow: hidden;
                    margin-bottom: 12px;
                }
                .bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, var(--accent), var(--accent2));
                    border-radius: 999px;
                    transition: width .18s ease;
                }
                .step { display: none; }
                .step.active { display: block; }
                .chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 8px;
                }
                .chip {
                    border: 1px solid rgba(16, 24, 40, .12);
                    background: #fff;
                    padding: 10px 12px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #222;
                    cursor: pointer;
                    transition: transform .12s, background .12s, color .12s, border .12s, box-shadow .12s;
                    user-select: none;
                    font-family: "Roboto Condensed", system-ui, sans-serif;
                }
                .chip:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 18px rgba(16, 24, 40, .06);
                }
                .chip.selected {
                    background: linear-gradient(90deg, var(--accent), var(--accent2));
                    border-color: transparent;
                    color: #fff;
                    box-shadow: 0 12px 26px rgba(238, 0, 103, .16);
                }
                .divider {
                    height: 1px;
                    background: rgba(16, 24, 40, .06);
                    margin: 12px 0;
                }
                .tiny {
                    font-size: 12px;
                    color: var(--muted);
                    line-height: 1.4;
                }
                @media (max-width: 900px) {
                    .shell { grid-template-columns: 1fr; }
                    .promo { min-height: 220px; }
                    .card { min-height: auto; }
                }
                @media (max-width: 520px) {
                    .promo { padding: 22px; min-height: 380px; }
                    .promo .logo { width: 86px; }
                    .brandName { font-size: 44px; }
                    .pillrow { grid-template-columns: 1fr; }
                }
            </style>

            <div class="wrap">
                <div class="shell">

                    <section class="promo" aria-label="NUMdate promo">
                        <div class="promoHeader">
                            <!-- logo svg omitted here for brevity, keep same as your version -->
                            <svg class="logo" width="54" height="34" viewBox="0 0 54 34" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M50.136 22.8237H54.0002V25.2515H47.8684V24.7739H47.8606L47.8743 15.7222L45.4895 16.7349L44.7004 13.9741L49.8528 11.9985V12.0103L50.2317 11.8354L50.136 22.8237Z"
                                    fill="white" />
                                <path
                                    d="M4.30957 12.1104L4.29199 12.0615L9.91406 14.0518L8.06445 16.5996L6.1123 15.708L6.13867 24.917H6.13184V25.252H0V22.8232H3.93652L3.84082 11.9033L4.30957 12.1104Z"
                                    fill="white" />
                                <path
                                    d="M14.0569 10.7131L12.3108 13.5393L10.0598 12.5657L10.0989 26.1028L7.51392 26.1125L7.37329 8.4436L7.38989 8.45239L7.38208 8.43481L14.0569 10.7131Z"
                                    fill="white" />
                                <path
                                    d="M46.5684 26.1333L44.0576 26.1255L44.0938 12.1401L41.1895 13.0864L40.5225 10.0347L45.8271 8.58154L45.8418 8.62939L46.7275 8.27588L46.5684 26.1333Z"
                                    fill="white" />
                                <path
                                    d="M28.8005 1.61523L28.7937 1.62109L33.2908 6.07324L31.4402 7.90527L26.9431 3.45312L22.4968 7.85645L20.8669 6.24219L25.3123 1.83789L25.3093 1.83496L27.1599 0.00292969L27.1628 0.00585938L27.1697 0L28.8005 1.61523Z"
                                    fill="white" />
                                <path
                                    d="M42.6882 26.8562L39.5046 26.8386L39.4851 9.05444L27.3943 12.9421L27.3796 12.8962L27.3611 12.9587L14.7527 9.09937L14.7244 26.6433L11.4558 26.6628L11.3464 4.71362L12.5916 5.18042L12.6072 5.12964L27.3972 9.65698L41.6052 5.09058L41.6277 5.16187L42.8074 4.70288L42.6882 26.8562Z"
                                    fill="white" />
                                <path
                                    d="M30.9601 14.4175C35.6415 13.9417 37.8321 18.1152 37.3641 21.1851C36.6873 25.6243 28.9405 29.861 27.4134 31.3232C25.935 30.0066 17.0865 25.2019 16.7024 20.1194C16.4966 17.3964 18.3845 14.3232 22.0179 14.3232C26.2356 14.5844 27.0213 17.359 27.0213 17.359C27.0213 17.359 27.2234 15.156 30.9601 14.4175Z"
                                    stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M0 26.1072C0 26.1072 22.709 32.609 27.2508 30.9759C31.7926 29.3428 31.7926 31.2481 27.2508 33.1533C22.709 35.0585 0.613143 33.1533 0.613143 33.1533L0 26.1072Z"
                                    fill="white" />
                                <path
                                    d="M53.3433 26.1072C53.3433 26.1072 32.1558 32.609 27.7956 30.9759C23.4355 29.3428 23.4355 31.2481 27.7956 33.1533C32.1558 35.0585 53.3433 33.1533 53.3433 33.1533V26.1072Z"
                                    fill="white" />
                            </svg>

                            <div class="brandText">
                                <div class="brandName">NUMDATE</div>
                                <div class="brandSub">NUM students only</div>
                            </div>
                        </div>

                        <p class="tagline">
                            NUM оюутнуудад зориулсан болзооны платформ.<br />
                            Зөвхөн <b>@stud.num.edu.mn</b> имэйлээр нэвтэрнэ.
                        </p>

                        <div class="pillrow">
                            <div class="pill">Love interest</div>
                            <div class="pill">MBTI</div>
                            <div class="pill">Love language</div>
                            <div class="pill">Relationship goals</div>
                            <div class="pill">School / Major</div>
                            <div class="pill">Interests</div>
                        </div>
                    </section>

                    <section class="card" role="region" aria-label="NUMdate authentication">
                        <div class="cardHead">
                            <div class="switchRow">
                                <span id="authTitle" class="authTitle">Нэвтрэх</span>
                            </div>
                        </div>

                        <div class="cardBody">

                            <section id="panelLogin" role="tabpanel" aria-hidden="false">
                                <form id="formLogin" novalidate>
                                    <label for="loginEmail">NUM имэйл</label>
                                    <div class="field">
                                        <input id="loginEmail" type="email" placeholder="name@stud.num.edu.mn"
                                            autocomplete="username">
                                    </div>
                                    <div id="loginEmailErr" class="err"></div>

                                    <label for="loginPw">Нууц үг</label>
                                    <div class="field">
                                        <input id="loginPw" type="password" placeholder="••••••••"
                                            autocomplete="current-password">
                                        <button type="button" class="pw-toggle" id="loginPwToggle">Show</button>
                                    </div>
                                    <div id="loginPwErr" class="err"></div>

                                    <div class="actions stack">
                                        <button type="submit" id="loginBtn" class="btn primary disabled"
                                            aria-disabled="true">Нэвтрэх</button>
                                        <button type="button" id="loginMs" class="btn secondary">Microsoft</button>
                                    </div>

                                    <div class="divider"></div>
                                    <div class="metaRow">
                                        <button type="button" id="forgotPw" class="linkBtn">Нууц үгээ мартсан уу?</button>
                                    </div>
                                </form>
                            </section>

                            <section id="panelSignup" role="tabpanel" aria-hidden="true" style="display:none;">
                                <form id="formSignup" novalidate>
                                    <div class="wizardTop">
                                            <p id="stepTitle" class="stepTitle">Алхам 1: Үндсэн мэдээлэл</p>
                                            <div class="stepCounter"><span id="stepNow">1</span>/<span id="stepTotal">4</span></div>
                                        </div>
                                        <div class="progress" aria-label="Signup progress">
                                            <div class="bar" id="progressBar"></div>
                                        </div>

                                        <div class="step active" data-step="1">
                                            <div class="row2">
                                                <div>
                                                    <label for="signupOvog">Овог</label>
                                                    <div class="field"><input id="signupOvog" type="text" placeholder="Жишээ: Бат"
                                                        autocomplete="family-name"></div>
                                                    <div id="signupOvogErr" class="err"></div>
                                                </div>
                                                <div>
                                                    <label for="signupNer">Нэр</label>
                                                    <div class="field"><input id="signupNer" type="text"
                                                        placeholder="Жишээ: Анударь" autocomplete="given-name"></div>
                                                    <div id="signupNerErr" class="err"></div>
                                                </div>
                                            </div>

                                            <label for="signupEmail">NUM имэйл</label>
                                            <div class="field"><input id="signupEmail" type="email"
                                                placeholder="name@stud.num.edu.mn" autocomplete="email"></div>
                                            <div id="signupEmailErr" class="err"></div>

                                            <div class="row2">
                                                <div>
                                                    <label for="signupPw">Нууц үг (≥8)</label>
                                                    <div class="field">
                                                        <input id="signupPw" type="password" placeholder="••••••••"
                                                            autocomplete="new-password">
                                                            <button type="button" class="pw-toggle" id="signupPwToggle">Show</button>
                                                    </div>
                                                    <div id="signupPwErr" class="err"></div>
                                                </div>
                                                <div>
                                                    <label for="signupPwConfirm">Нууц үг давтах</label>
                                                    <div class="field">
                                                        <input id="signupPwConfirm" type="password" placeholder="••••••••"
                                                            autocomplete="new-password">
                                                            <button type="button" class="pw-toggle"
                                                                id="signupPwConfirmToggle">Show</button>
                                                    </div>
                                                    <div id="signupPwMatchMsg" class="err"></div>
                                                    <div id="signupPwOkMsg" class="ok"></div>
                                                </div>
                                            </div>

                                            <div class="actions">
                                                <button type="button" id="signupNext1" class="btn primary disabled"
                                                    aria-disabled="true">Next</button>
                                                <button type="button" id="signupMs" class="btn secondary">Microsoft</button>
                                            </div>
                                        </div>

                                        <div class="step" data-step="2">
                                            <label for="signupMajor">Мэргэжил</label>
                                            <div class="field">
                                                <input id="signupMajor" type="text" placeholder="Жишээ: Программ хангамж">
                                            </div>
                                            <div id="signupMajorErr" class="err"></div>

                                            <label for="signupSchool">Сургууль / Салбар</label>
                                            <div class="field">
                                                <select id="signupSchool">
                                                    <option value="">Сонгох…</option>
                                                    <option>Бизнесийн сургууль</option>
                                                    <option>Инженер, технологийн сургууль</option>
                                                    <option>Мэдээллийн технологи, электроникийн сургууль</option>
                                                    <option>Улс төр судлал, олон улсын харилцаа, нийтийн удирдлагын сургууль
                                                    </option>
                                                    <option>Хууль зүйн сургууль</option>
                                                    <option>Шинжлэх ухааны сургууль</option>
                                                </select>
                                            </div>
                                            <div id="signupSchoolErr" class="err"></div>

                                            <div class="row2">
                                                <div>
                                                    <label for="signupDob">Төрсөн өдөр</label>
                                                    <div class="field"><input id="signupDob" type="date"></div>
                                                    <div id="signupDobErr" class="err"></div>
                                                    <div class="hint">Нас бодоход ашиглана.</div>
                                                </div>
                                                <div>
                                                    <label for="signupGender">Хүйс</label>
                                                    <div class="field">
                                                        <select id="signupGender">
                                                            <option value="">Сонгох…</option>
                                                            <option value="male">Эр</option>
                                                            <option value="female">Эм</option>
                                                            <option value="other">Бусад</option>
                                                        </select>
                                                    </div>
                                                    <div id="signupGenderErr" class="err"></div>
                                                </div>
                                            </div>

                                            <div class="row2">
                                                <div>
                                                    <label for="signupZodiac">Зурхайн орд</label>
                                                    <div class="field">
                                                        <select id="signupZodiac">
                                                            <option value="">Сонгох…</option>
                                                            <option>Хонь</option>
                                                            <option>Үхэр</option>
                                                            <option>Ихэр</option>
                                                            <option>Мэлхий</option>
                                                            <option>Арслан</option>
                                                            <option>Охин</option>
                                                            <option>Жинлүүр</option>
                                                            <option>Хилэнц</option>
                                                            <option>Нум</option>
                                                            <option>Матар</option>
                                                            <option>Хумх</option>
                                                            <option>Загас</option>
                                                        </select>
                                                    </div>
                                                    <div id="signupZodiacErr" class="err"></div>
                                                </div>

                                                <div>
                                                    <label for="signupCourse">Курс</label>
                                                    <div class="field">
                                                        <select id="signupCourse">
                                                            <option value="">Сонгох…</option>
                                                            <option value="1">1-р курс</option>
                                                            <option value="2">2-р курс</option>
                                                            <option value="3">3-р курс</option>
                                                            <option value="4">4-р курс</option>
                                                            <option value="5">5-р курс</option>
                                                            <option value="6">6+ курс</option>
                                                            <option value="master">Магистр</option>
                                                            <option value="phd">Доктор</option>
                                                        </select>
                                                    </div>
                                                    <div id="signupCourseErr" class="err"></div>
                                                </div>
                                            </div>

                                            <div class="actions">
                                                <button type="button" id="signupBack2" class="btn secondary">Back</button>
                                                <button type="button" id="signupNext2" class="btn primary disabled"
                                                    aria-disabled="true">Next</button>
                                            </div>
                                        </div>

                                        <div class="step" data-step="3">
                                            <label>MBTI</label>
                                            <div class="chips" id="mbtiChips"></div>
                                            <div id="signupMbtiErr" class="err"></div>

                                            <label>Love language</label>
                                            <div class="chips" id="loveLangChips"></div>
                                            <div id="signupLoveLangErr" class="err"></div>

                                            <label>Relationship goals</label>
                                            <div class="chips" id="relGoalChips"></div>
                                            <div id="signupRelGoalErr" class="err"></div>

                                            <div class="actions">
                                                <button type="button" id="signupBack3" class="btn secondary">Back</button>
                                                <button type="button" id="signupNext3" class="btn primary disabled"
                                                    aria-disabled="true">Next</button>
                                            </div>
                                        </div>

                                        <div class="step" data-step="4">
                                            <label>Сонирхсон хүйс (Interested in)</label>
                                            <div class="chips" id="interestedInChips"></div>
                                            <div id="signupInterestedInErr" class="err"></div>

                                            <label>Interests (олон сонголт)</label>
                                            <div class="chips" id="interestChips"></div>
                                            <div class="hint">Хамгийн багадаа 3-г сонго.</div>
                                            <div id="signupInterestsErr" class="err"></div>
                                             <div class="divider"></div>
                                                <label>Profile зураг (Avatar)</label>

                                                <div class="row2">
                                                <div>
                                                    <div class="field" style="justify-content: space-between;">
                                                    <span id="avatarHint" class="hint" style="margin:0;">Зураг сонгоогүй байна</span>
                                                    <button type="button" id="pickAvatarBtn" class="btn secondary" style="max-width:140px;">Choose</button>
                                                    </div>

                                                    <input id="avatarInput" type="file" accept="image/*" hidden />
                                                    <div id="avatarErr" class="err"></div>
                                                </div>

                                                <div style="display:flex; align-items:center; justify-content:center;">
                                                    <img id="avatarPreview"
                                                    src="img/default-profile.jpg"
                                                    alt="avatar preview"
                                                    style="width:110px; height:110px; border-radius:50%; object-fit:cover; border:1px solid rgba(16,24,40,.12);" />
                                                </div>
                                                </div>


                                            <div class="actions">
                                                <button type="button" id="signupBack4" class="btn secondary">Back</button>
                                                <button type="submit" id="signupBtn" class="btn primary disabled"
                                                    aria-disabled="true">Бүртгүүлэх</button>
                                            </div>
                                            <div class="divider"></div>
                                        </div>
                                </form>
                            </section>

                            <div class="authFooter">
                                <button type="button" id="switchAuth" class="linkBtn">
                                    Бүртгэлгүй юу? <b>Бүртгүүлэх</b>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    cache() {
        const q = s => this.querySelector(s);

        this.panelLogin = q('#panelLogin');
        this.panelSignup = q('#panelSignup');
        this.switchAuth = q('#switchAuth');
        this.authTitle = q('#authTitle');

        this.loginEmail = q('#loginEmail');
        this.loginPw = q('#loginPw');
        this.loginBtn = q('#loginBtn');

        this.loginPwToggle = q('#loginPwToggle');          // FIX: cache pw toggle
        this.signupPwToggle = q('#signupPwToggle');        // FIX
        this.signupPwConfirmToggle = q('#signupPwConfirmToggle'); // FIX

        this.formLogin = q('#formLogin');
        this.formSignup = q('#formSignup');

        this.steps = [...this.querySelectorAll('.step')];
        this.stepTitle = q('#stepTitle');
        this.stepNow = q('#stepNow');
        this.stepTotal = q('#stepTotal');
        this.progressBar = q('#progressBar');

        this.signupNext1 = q('#signupNext1');
        this.signupNext2 = q('#signupNext2');
        this.signupNext3 = q('#signupNext3');
        this.signupBtn = q('#signupBtn');
        this.signupBack2 = q('#signupBack2');
        this.signupBack3 = q('#signupBack3');
        this.signupBack4 = q('#signupBack4');

        this.pickAvatarBtn = q('#pickAvatarBtn');
        this.avatarInput = q('#avatarInput');
        this.avatarPreview = q('#avatarPreview');
        this.avatarHint = q('#avatarHint');
        this.avatarErr = q('#avatarErr');

    }

    bind() {
        this.switchAuth.onclick = () =>
            this.setAuth(this.state.authMode === 'login' ? 'signup' : 'login');

        this.loginEmail.oninput = () => this.validateLogin();
        this.loginPw.oninput = () => this.validateLogin();

        // FIX: wire up password toggles
        if (this.loginPwToggle) {
            this.loginPwToggle.onclick = () => this.togglePw(this.loginPw, this.loginPwToggle);
        }
        if (this.signupPwToggle) {
            const pw = this.querySelector('#signupPw');
            this.signupPwToggle.onclick = () => this.togglePw(pw, this.signupPwToggle);
        }
        if (this.signupPwConfirmToggle) {
            const pw2 = this.querySelector('#signupPwConfirm');
            this.signupPwConfirmToggle.onclick = () => this.togglePw(pw2, this.signupPwConfirmToggle);
        }


        this.formLogin.onsubmit = async (e) => {
            e.preventDefault();

            if (this.loginBtn.classList.contains('disabled')) return;

            const email = this.loginEmail.value.trim();
            const password = this.loginPw.value;

            const emailErr = this.querySelector('#loginEmailErr');
            const pwErr = this.querySelector('#loginPwErr');

            if (emailErr) { emailErr.textContent = ''; emailErr.style.display = 'none'; }
            if (pwErr) { pwErr.textContent = ''; pwErr.style.display = 'none'; }

            this.toggleBtn(this.loginBtn, false);
            this.loginBtn.textContent = 'Нэвтэрч байна…';

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // same-origin is default, but explicit is fine
                    credentials: 'same-origin',
                    body: JSON.stringify({ email, password }),
                });

                let data = {};
                try {
                    data = await res.json();
                } catch (_) {
                    data = {};
                }

                if (!res.ok) {
                    const msg = data.error || 'Нэвтрэх амжилтгүй боллоо';
                    if (pwErr) {
                        pwErr.textContent = msg;
                        pwErr.style.display = 'block';
                    }
                    this.loginBtn.textContent = 'Нэвтрэх';
                    this.validateLogin();
                    return;
                }

                this.loginBtn.textContent = 'Амжилттай';

                window.location.href = '/';

            } catch (err) {
                console.error('Login fetch error', err);
                if (pwErr) {
                    pwErr.textContent = 'Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.';
                    pwErr.style.display = 'block';
                }
                this.loginBtn.textContent = 'Нэвтрэх';
                this.validateLogin();
            }
        };


        this.signupBack2.onclick = () => this.setStep(0);
        this.signupBack3.onclick = () => this.setStep(1);
        this.signupBack4.onclick = () => this.setStep(2);

        this.signupNext1.onclick = () => this.validateStep1() && this.setStep(1);
        this.signupNext2.onclick = () => this.validateStep2() && this.setStep(2);
        this.signupNext3.onclick = () => this.validateStep3() && this.setStep(3);

        this.formSignup.onsubmit = async (e) => {
            e.preventDefault();

            if (!this.validateStep1() || !this.validateStep2() || !this.validateStep3() || !this.validateStep4()) return;

            const payload = this.collectSignupPayload();
            this.toggleBtn(this.signupBtn, false);
            this.signupBtn.textContent = "Түр хүлээнэ үү...";

            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify(payload),
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    alert(data.error || "Бүртгэл амжилтгүй.");
                    return;
                }

                if (this.state.signup.avatarFile) {
                    const url = await this.uploadImage({ file: this.state.signup.avatarFile, type: "avatar" });
                    console.log("avatar uploaded:", url);
                }

                alert(data.message || "Бүртгэл амжилттай. Имэйлээ шалгаад баталгаажуулаарай.");
                this.setAuth("login");
            } catch (err) {
                console.error(err);
                alert("Сервертэй холбогдож чадсангүй.");
            } finally {
                this.signupBtn.textContent = "Бүртгүүлэх";
                this.validateStep4();
            }
        };




        ['#signupOvog', '#signupNer', '#signupEmail', '#signupPw', '#signupPwConfirm']
            .forEach(sel => this.querySelector(sel).addEventListener('input', () => this.validateStep1()));

        ['#signupMajor', '#signupSchool', '#signupDob', '#signupGender', '#signupZodiac', '#signupCourse']
            .forEach(sel => this.querySelector(sel).addEventListener('input', () => this.validateStep2()));

        if (this.pickAvatarBtn && this.avatarInput) {
            this.pickAvatarBtn.onclick = () => this.avatarInput.click();

            this.avatarInput.onchange = () => {
                const file = this.avatarInput.files?.[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    if (this.avatarErr) {
                        this.avatarErr.textContent = 'Зөвхөн зураг сонгоно уу.';
                        this.avatarErr.style.display = 'block';
                    }
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    if (this.avatarErr) {
                        this.avatarErr.textContent = 'Зураг 5MB-аас бага байх ёстой.';
                        this.avatarErr.style.display = 'block';
                    }
                    return;
                }

                if (this.avatarErr) { this.avatarErr.textContent = ''; this.avatarErr.style.display = 'none'; }

                const url = URL.createObjectURL(file);
                if (this.avatarPreview) this.avatarPreview.src = url;
                if (this.avatarHint) this.avatarHint.textContent = file.name;

                this.state.signup.avatarFile = file;
            };
        }

    }
    async uploadImage({ file, type = "avatar", index = 0 }) {
        if (!file) return null;

        const fd = new FormData();
        fd.append("image", file);
        fd.append("type", type);
        if (type === "gallery") fd.append("index", String(index));

        const res = await fetch("/api/upload/image", {
            method: "POST",
            credentials: "same-origin",
            body: fd,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");
        return data.url;
    }


    setAuth(mode) {
        this.state.authMode = mode;
        const login = mode === 'login';

        this.panelLogin.style.display = login ? 'block' : 'none';
        this.panelSignup.style.display = login ? 'none' : 'block';
        this.authTitle.textContent = login ? 'Нэвтрэх' : 'Бүртгүүлэх';
        this.switchAuth.innerHTML = login
            ? 'Бүртгэлгүй юу? <b>Бүртгүүлэх</b>'
            : 'Бүртгэлтэй юу? <b>Нэвтрэх</b>';
    }

    validateLogin() {
        const ok =
            this.loginEmail.value.endsWith('@stud.num.edu.mn') &&
            this.loginPw.value.length > 0;
        this.toggleBtn(this.loginBtn, ok);
    }

    setStep(i) {
        this.state.stepIndex = i;
        this.steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
        this.stepNow.textContent = i + 1;
        this.stepTotal.textContent = this.steps.length;
        this.progressBar.style.width = ((i + 1) / this.steps.length) * 100 + '%';

        if (i === 0) this.validateStep1();
        if (i === 1) this.validateStep2();
        if (i === 2) this.validateStep3();
        if (i === 3) this.validateStep4();
    }

    validateStep1() {
        const req = ['signupOvog', 'signupNer', 'signupEmail', 'signupPw', 'signupPwConfirm'];
        const ok = req.every(id => this.querySelector('#' + id)?.value);
        this.toggleBtn(this.signupNext1, ok);
        return ok;
    }

    validateStep2() {
        const req = ['signupMajor', 'signupSchool', 'signupDob', 'signupGender', 'signupZodiac', 'signupCourse'];
        const ok = req.every(id => this.querySelector('#' + id)?.value);
        this.toggleBtn(this.signupNext2, ok);
        return ok;
    }

    validateStep3() {
        const s = this.state.signup;
        const ok = s.mbti && s.loveLanguage && s.relationshipGoal;
        this.toggleBtn(this.signupNext3, ok);
        return ok;
    }

    validateStep4() {
        const s = this.state.signup;
        const count = Object.keys(s.interests || {}).length;
        const ok = s.interestedIn && count >= 3;
        this.toggleBtn(this.signupBtn, ok);
        return ok;
    }


    collectSignupPayload() {
        const s = this.state.signup;
        const get = (selector) =>
            this.querySelector(selector)?.value.trim() || '';

        const lastName = get('#signupOvog');
        const firstName = get('#signupNer');
        const email = get('#signupEmail');
        const password = get('#signupPw');
        const major = get('#signupMajor');
        const school = get('#signupSchool');
        const dob = get('#signupDob');
        const gender = get('#signupGender');
        const zodiac = get('#signupZodiac');
        const course = get('#signupCourse');

        return {
            email,
            password,
            name: firstName,
            lname: lastName,
            major,
            school,
            dob,
            gender,
            zodiac,
            course,

            mbti: s.mbti,
            loveLanguage: s.loveLanguage,
            relationshipGoal: s.relationshipGoal,
            interestedIn: s.interestedIn,
            interests: Object.keys(s.interests || {}),
        };
    }



    mountChips() {
        this.single('mbtiChips', Auth.MBTI, 'mbti');
        this.single('loveLangChips', Auth.LOVE_LANG, 'loveLanguage');
        this.single('relGoalChips', Auth.REL_GOALS, 'relationshipGoal');
        this.single('interestedInChips', Auth.INTERESTED_IN, 'interestedIn');
        this.multi('interestChips', Auth.INTERESTS, 'interests');
    }



    single(id, opts, key) {
        const root = this.querySelector('#' + id);
        if (!root) return;

        opts.forEach(o => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.textContent = o;
            b.onclick = () => {
                this.state.signup[key] = o;
                [...root.children].forEach(c => c.classList.toggle('selected', c === b));

                if (key === 'interestedIn') this.validateStep4();
                else this.validateStep3();
            };
            root.appendChild(b);
        });
    }

    multi(id, opts, key) {
        const root = this.querySelector('#' + id);
        if (!root) return;

        Object.entries(opts).forEach(([interestKey, label]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.textContent = label;

            b.onclick = () => {
                const obj = this.state.signup[key];
                if (obj[interestKey]) {
                    delete obj[interestKey];
                    b.classList.remove('selected');
                } else {
                    obj[interestKey] = label;
                    b.classList.add('selected');
                }
                this.validateStep4();
            };

            root.appendChild(b);
        });
    }


    toggleBtn(btn, ok) {
        if (!btn) return;
        btn.classList.toggle('disabled', !ok);
        btn.setAttribute('aria-disabled', String(!ok));
        btn.disabled = !ok;
    }

    togglePw(input, btn) {
        if (!input || !btn) return;
        const isPw = input.type === 'password';
        input.type = isPw ? 'text' : 'password';
        btn.textContent = isPw ? 'Hide' : 'Show';
    }
}

window.customElements.define('com-auth', Auth);