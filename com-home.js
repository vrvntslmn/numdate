import { api } from "./apiClient.js";
class Home extends HTMLElement {
    constructor() {
        super();
        this.allProfiles = [];
        this.filteredProfiles = [];
        this.profileSwipe = null;
        this.dropdownFilter = null;
        this.likedIds = new Set();
        this.me = null;
        this.meId = "";
    }
    async loadLikedIds() {
        try {
            const data = await api.getLikedIds();
            this.likedIds = new Set((data.ids || []).map(String));
        } catch (e) {
            console.warn("loadLikedIds failed:", e);
            this.likedIds = new Set();
        }
    }
    async loadMe() {
        try {
            const data = await api.me();
            const u = data?.user || data;
            this.me = u || null;
            this.meId = String(u?._id || u?.userId || "");
        } catch (e) {
            console.warn("loadMe failed:", e);
            this.me = null;
            this.meId = "";
        }
    }

    removeMe(list) {
        const myId = this.meId;
        if (!myId) return list;

        return list.filter(p => {
            const pid = String(p.userId || p._id || "");
            return pid !== myId;
        });
    }
    getProfileId(profile) {
        return profile?.userId ? String(profile.userId) : null;
    }

    markLiked(profile) {
        const id = this.getProfileId(profile);
        if (id) this.likedIds.add(id);
    }

    removeLiked(list) {
        return list.filter(p => {
            const id = this.getProfileId(p);
            if (!id) return true;
            return !this.likedIds.has(id);
        });
    }


    connectedCallback() {

        this.innerHTML = `
        <style>
            main>div {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 200px;
                margin-top: 10px;
            }

            main {
                min-height: calc(100vh - 55px);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .profile {
                width: 350px;
                height: 80vh;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                position: relative;
                background: #000;
            }

            .profile img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                z-index: 1;
            }

            .profile::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 45%;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
                z-index: 2;
            }

            .profile h1,
            .profile p {
                position: absolute;
                left: 16px;
                color: #fff;
                margin: 0;
                z-index: 3;
                font-family: 'Yanone Kaffeesatz', sans-serif;
            }

            .profile h1 {
                bottom: 80px;
                font-size: 22px;
                font-weight: 600;
            }

            .profile p {
                bottom: 60px;
                font-size: 18px;
            }

            .profile .see-more-btn {
                position: absolute;
                bottom: 64px;
                right: 2px;
                transform: translateX(-50%);
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 0;
                border-radius: 0;
                color: #ffffff;
                font-size: 14px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                text-decoration: none;
                z-index: 3;
                font-family: 'Yanone Kaffeesatz', sans-serif;
                text-transform: uppercase;
            }

            .profile .see-more-btn::after {
                content: "▾";
                font-size: 0.9em;
            }

            .swipe .buttons {
                gap: 20px;
                margin-top: -25px;
                position: relative;
                display: flex;
                justify-content: center;
                gap: 20px;
                z-index: 4;
            }

            .buttons .other_button {
                background-color: #ffffff;
                color: #f50057;
                border: none;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px #d97c9dff;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .buttons .other_button svg path,
            .buttons .other_button svg polyline {
                stroke: currentColor;
            }

            .buttons .other_button_x {
                background-color: #ffffff;
                color: #f50057;
                border: none;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px #d97c9dff;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .buttons .other_button_x svg path,
            .buttons .other_button_x svg polyline {
                stroke: currentColor;
                fill: #f50057;
            }


            .buttons .heart_button {
                background-color: #f50057;
                border: none;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: transform 0.2s;
                margin-top: -10px;
            }

            .buttons button:hover {
                transform: scale(1.1);
            }
            @media (max-width: 1300px) {
                main>div {
                    gap: 100px;
                }
            }

            @media (max-width: 900px) {
                main>div {
                    flex-direction: column;
                    gap: 30px;
                }
            }

            .catogeries {
                display: flex;
                flex-direction: column;
                gap: 16px;
                width: 380px;
                align-items: stretch;
                max-height: 80vh;
                overflow-y: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .catogeries::-webkit-scrollbar {
                display: none;
            }


            .catogeries a {
                text-decoration: none;
            }

            .catogeries button {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border: none;
                padding: 20px 30px;
                border-radius: 10px;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 3px 6px #ffd8e5ff;
                transition: background 0.3s, transform 0.2s;
                text-transform: uppercase;
            }

            .catogeries button:hover {
                background-color: #ffd8e5ff;
                transform: translateY(-2px);
            }

            .catogeries button h1 {
                font-size: 20px;
                font-weight: 500;
                margin: 0;
            }

            .filter {
                display: block;
                width: fit-content;
                margin: 24px auto 0;
                padding: 10px 40px;
                border-radius: 999px;
                border: 2px solid #f50057;
                background-color: #f50057;
                color: #ffffff;

                font-family: 'Yanone Kaffeesatz', sans-serif;
                font-size: 20px;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                text-decoration: none;

                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                transition: background 0.2s, color 0.2s,
                    transform 0.15s, box-shadow 0.15s;
            }

            .filter:hover {
                background-color: #f50057;
                color: #ffffff;
                transform: translateY(-2px);
                box-shadow: 0 8px 18px rgba(245, 0, 87, 0.35);
            }

            .filter:active {
                transform: translateY(0);
                box-shadow: 0 4px 10px rgba(245, 0, 87, 0.25);
            }


            .catogeries>div>div button {
                display: flex;
                align-items: start;
                height: 50px;
                gap: 8px;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                border: 2px solid #f27a91;
                color: #d93b5f;
                padding: 5px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
            }

            .catogeries>div>div button h2 {
                font-size: 15px;
                margin: 0;
            }

            .catogeries>div>div button.active {
                background: #d93b5f;
                color: #fff;
                border-color: #d93b5f;
                transform: translateY(-4px);
                box-shadow: 0 10px 20px rgba(217, 59, 95, 0.18);
            }

            .dropdown {
                position: relative;
                display: flex;
                flex-direction: column;
            }

            .dropbtn {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #ffffff;
                color: #f50057;
                border: none;
                padding: 20px 30px;
                border-radius: 6px;
                cursor: pointer;
                border: 2px solid #f50057;
                box-shadow: 0 3px 6px #f50057;
                font-size: 20px;
                transition: background 0.3s, transform 0.2s;
            }

            .dropbtn h1 {
                color: #f50057;
            }

            com-home .dropbtn:hover {
                background-color: #ffffff;
                color: #f50057;
                transform: translateY(-2px);
            }


            .dropbtn>div {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .dropdown-content {
                display: none;
                justify-content: space-around;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 12px;
            }

            .dropdown-content button svg {
                fill: #f50057;
            }

            .dropdown.open .dropdown-content {
                display: flex;
            }

            .dropdown-content button {
                width: 110px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border-radius: 8px;
                border: 2px solid #f27a91;
                background: #fff;
                color: #f50057;
                font-size: 14px;
                padding: 5px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
                cursor: pointer;
                transition: background 0.3s, transform 0.2s;
            }

            .dropdown-content button h2 {
                margin: 0;
            }

            .dropdown-content button:hover {
                background: #ffe0e9;
            }

            .dropdown-content button.selected {
                background: #f50057;
                color: #ffffff;
                border-color: #f50057;
            }

            .dropdown-content button.selected:hover {
                transform: translateY(-2px);
            }

            .dropdown-content button.selected svg {
                fill: white;
            }

            .catogeries a button,
            .catogeries .filter {
                width: 100%;
            }

            .dropdown-content-school {
                display: none;
                flex-direction: column;
                gap: 12px;
                margin-top: 12px;
            }

            com-home .dropdown-content-school button {
                width: 100%;
                height: auto;
                display: flex;
                justify-content: flex-start;
                text-align: left;
                padding: 10px 15px;
                border-radius: 8px;
                border: 2px solid #f27a91;
                background: #fff;
                color: #f50057;
                font-size: 14px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
                cursor: pointer;
                transition: background 0.3s, transform 0.2s;
            }


            .dropdown-content-school button h2 {
                margin: 0;
                text-align: left;
            }

            .dropdown-content-school button:hover {
                background: #ffe0e9;
                transform: translateY(-2px);
            }

            .dropdown-content-school button.selected {
                background: #f50057;
                color: #fff;
                border-color: #f50057;
            }

            .dropdown.open .dropdown-content-school {
                display: flex;
            }

            com-home .dropbtn {
                background: #ffffff;
                color: #f50057;
                border: 1px solid #ffffff;
                box-shadow: 0 2px 2px rgba(0, 0, 0, .10);
            }

            com-home .dropdown.has-selection .dropbtn {
                background: #f50057;
                color: #ffffff;
                border-color: #f50057;
            }

            com-home .dropdown.has-selection .dropbtn h1,
            com-home .dropdown.has-selection .dropbtn svg {
                color: #ffffff;
            }

            @media (prefers-color-scheme: dark) {
                com-home {
                    background: #0b0f14;
                    color: #e7eaf0;
                }

                com-home main {
                    background: transparent;
                }

                com-home .profile {
                    background: #0b0f14;
                    box-shadow: 0 18px 60px rgba(0, 0, 0, .55);
                }

                com-home .profile h1,
                com-home .profile p,
                com-home .see-more-btn {
                    color: #ffffff;
                }

                com-home .catogeries button {
                    background: #141a22;
                    border: 1px solid #222b36;
                    color: #e7eaf0;
                    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
                }

                com-home .catogeries button:hover {
                    background: #192231;
                }

                com-home .dropbtn {
                    background: #141a22;
                    color: #e7eaf0;
                    border: 1px solid #2a3442;
                    box-shadow: 0 10px 22px rgba(0, 0, 0, .35);
                }

                com-home .dropdown.has-selection .dropbtn {
                    background: #ee0067;
                    border-color: #ee0067;
                    color: #ffffff;
                }

                com-home .dropdown.has-selection .dropbtn h1,
                com-home .dropdown.has-selection .dropbtn svg {
                    color: #ffffff;
                }

                com-home .dropbtn h1 {
                    color: #e7eaf0;
                }

                com-home .dropbtn svg {
                    color: #a9b4c2;
                }

                com-home .dropdown-content button,
                com-home .dropdown-content-school button {
                    background: #10161f;
                    color: #e7eaf0;
                    border: 1px solid #222b36;
                    box-shadow: 0 6px 14px rgba(0, 0, 0, .4);
                }

                com-home .dropdown-content button h2,
                com-home .dropdown-content-school button h2 {
                    color: #e7eaf0;
                }

                com-home .dropdown-content button svg {
                    fill: #a9b4c2;
                }

                com-home .dropdown-content button:hover,
                com-home .dropdown-content-school button:hover {
                    background: #141a22;
                }
                com-home .dropdown-content button.selected,
                com-home .dropdown-content-school button.selected {
                    background: #ee0067;
                    border-color: #ee0067;
                    color: #ffffff;
                }

                com-home .dropdown-content button.selected h2 {
                    color: #ffffff;
                }

                com-home .dropdown-content button.selected svg {
                    fill: #ffffff;
                }

                com-home .filter {
                    background: #ee0067;
                    border-color: #ee0067;
                    color: #fff;
                    box-shadow: 0 12px 26px rgba(238, 0, 103, 0.25);
                }

                com-home .buttons .other_button,
                com-home .buttons .other_button_x {
                    background: #141a22;
                    border: 1px solid #2a3442;
                    box-shadow: 0 10px 22px rgba(0, 0, 0, .45);
                    color: #ee0067;
                }
                com-home .buttons .other_button svg path,
                com-home .buttons .other_button svg polyline {
                    stroke: #ee0067;
                }

                com-home .buttons .other_button_x svg path,
                com-home .buttons .other_button_x svg polyline {
                    fill: #ee0067;
                    stroke: #ee0067;
                }
                com-home .buttons .other_button:hover,
                com-home .buttons .other_button_x:hover {
                    background: #192231;
                    transform: scale(1.08);
                }
                body[data-theme="dark"] com-home {
                    background: #0b0f14;
                    color: #e7eaf0;
                }
            }
        </style>
        <main>
        <div>
            <section class="swipe">
                <div class="profile">
                    <div>
                        <div>
                        <img
  src="img/image.jpeg"
  alt="img1"
  width="200"
  height="300"
  fetchpriority="high"
  loading="eager"
  decoding="async"
>

                        </div>
                    </div>
                    <h1>Jennie Kim, 28</h1>
                    <p>Программ хангамж</p>
                   <a href="#/othersprofile" class="see-more-btn">See more</a>
                </div>
                <div class="buttons">
                    <button class="other_button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 64 64" stroke-width="8" stroke="currentColor" fill="none"><path d="M54.89,26.73A23.52,23.52,0,0,1,15.6,49" stroke-linecap="round"/><path d="M9,37.17a23.75,23.75,0,0,1-.53-5A23.51,23.51,0,0,1,48.3,15.2" stroke-linecap="round"/><polyline points="37.73 16.24 48.62 15.44 47.77 5.24" stroke-linecap="round"/><polyline points="25.91 47.76 15.03 48.56 15.88 58.76" stroke-linecap="round"/></svg>
                    </button>
                    <button class="heart_button">
                        <svg class="button_icon" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px"
                            viewBox="0 0 24 24" stroke="white" fill="white">
                            <path
                                d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z" />
                        </svg>
                    </button>
                    <button class="other_button_x">
                        <svg class="button_icon" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px"
                            viewBox="0 0 32 32" stroke="currentColor" fill="none">
                            <path
                                d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,8.5s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
                        </svg>
                    </button>
                </div>
            </section>
            <div>
                <section class="catogeries">
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Орд</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <g>
                                                <path
                                                    d="M42,27a2,2,0,0,0-2,2v2a4,4,0,0,1-8,0V29a2,2,0,0,0-4,0v2a4,4,0,0,1-8,0V29a2,2,0,0,0-4,0v2a4,4,0,0,1-8,0V29a2,2,0,0,0-4,0v2a8,8,0,0,0,8,8,8.2,8.2,0,0,0,6-2.7,8,8,0,0,0,12,0A8.2,8.2,0,0,0,36,39a8,8,0,0,0,8-8V29A2,2,0,0,0,42,27Z" />
                                                <path
                                                    d="M42,9a2,2,0,0,0-2,2v2a4,4,0,0,1-8,0V11a2,2,0,0,0-4,0v2a4,4,0,0,1-8,0V11a2,2,0,0,0-4,0v2a4,4,0,0,1-8,0V11a2,2,0,0,0-4,0v2a8,8,0,0,0,8,8,8.2,8.2,0,0,0,6-2.7,8,8,0,0,0,12,0A8.2,8.2,0,0,0,36,21a8,8,0,0,0,8-8V11A2,2,0,0,0,42,9Z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <h2>Хумх</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="horoscope">
                                            <path
                                                d="M43,22H33.7A23,23,0,0,1,40.4,7.4a1.9,1.9,0,0,0,0-2.8,1.9,1.9,0,0,0-2.8,0,27.3,27.3,0,0,0-8,17.4H18.4a27.3,27.3,0,0,0-8-17.4,1.9,1.9,0,0,0-2.8,0,1.9,1.9,0,0,0,0,2.8A23,23,0,0,1,14.3,22H5a2,2,0,0,0,0,4h9.3A23,23,0,0,1,7.6,40.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0,27.3,27.3,0,0,0,8-17.4H29.6a27.3,27.3,0,0,0,8,17.4,1.9,1.9,0,0,0,2.8,0,1.9,1.9,0,0,0,0-2.8A23,23,0,0,1,33.7,26H43a2,2,0,0,0,0-4Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Загас</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M41.1,5.7a8,8,0,0,0-8.8,1.6L24,15.2,15.7,7.3A8,8,0,0,0,6.9,5.7,7.9,7.9,0,0,0,2,13a8,8,0,0,0,8.1,8h.2a2,2,0,0,0,0-4h-.2A4,4,0,0,1,6,13,4,4,0,0,1,8.5,9.3a4.2,4.2,0,0,1,4.5.9l9,8.6V41a2,2,0,0,0,4,0V18.8l9-8.6a4.2,4.2,0,0,1,4.5-.9A4,4,0,0,1,42,13a4,4,0,0,1-4.1,4h-.2a2,2,0,0,0,0,4h.2A8,8,0,0,0,46,13,7.9,7.9,0,0,0,41.1,5.7Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Хонь</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M42,3h-.5a8.1,8.1,0,0,0-5.9,2.6l-8,11.9A14.2,14.2,0,0,0,24,17a14.2,14.2,0,0,0-3.6.5L12.6,5.9l-.2-.3A8.1,8.1,0,0,0,6.5,3H6A2,2,0,0,0,6,7h.5A4,4,0,0,1,9.4,8.2l7.3,10.9a14,14,0,1,0,14.6,0L38.6,8.2A4,4,0,0,1,41.5,7H42a2,2,0,0,0,0-4ZM34,31A10,10,0,1,1,24,21,10,10,0,0,1,34,31Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Үхэр</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M33,34.1V11.9A26.5,26.5,0,0,0,43.4,5.4a1.9,1.9,0,0,0,0-2.8,1.9,1.9,0,0,0-2.8,0,23.6,23.6,0,0,1-33.2,0,1.9,1.9,0,0,0-2.8,0,1.9,1.9,0,0,0,0,2.8A26.5,26.5,0,0,0,15,11.9V34.1A26.5,26.5,0,0,0,4.6,40.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0,23.6,23.6,0,0,1,33.2,0,1.9,1.9,0,0,0,2.8,0,1.9,1.9,0,0,0,0-2.8A26.5,26.5,0,0,0,33,34.1ZM19,33V13a27.3,27.3,0,0,0,5,.5,27.3,27.3,0,0,0,5-.5V33a27.3,27.3,0,0,0-5-.5A27.3,27.3,0,0,0,19,33Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Ихэр</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <g>
                                                <path
                                                    d="M11.9,30H12a9.9,9.9,0,0,0,4.6-18.7l-1.5-.6c9.5-4.8,19.5-3.2,27.5,4.8a2,2,0,1,0,2.8-2.8C34,1.1,18.2,1.1,5.3,12.6a9.9,9.9,0,0,0-2.6,11A9.6,9.6,0,0,0,11.9,30ZM12,14a6,6,0,1,1-6,6A6,6,0,0,1,12,14Z" />
                                                <path
                                                    d="M36.1,18H36a9.9,9.9,0,0,0-4.6,18.7,9.4,9.4,0,0,0,1.5.6c-9.5,4.8-19.5,3.2-27.5-4.8a1.9,1.9,0,0,0-2.8,0,1.9,1.9,0,0,0,0,2.8c11.4,11.6,27.2,11.6,40.1.1a9.9,9.9,0,0,0,2.6-11A9.6,9.6,0,0,0,36.1,18ZM36,34a6,6,0,1,1,6-6A6,6,0,0,1,36,34Z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <h2>Мэлхий</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="horoscope">
                                            <path
                                                d="M43,40H39.6a7.8,7.8,0,0,1-6.9-3.9,8,8,0,0,1-.2-7.8l4.6-8.7a12.1,12.1,0,0,0-.4-11.8A12,12,0,0,0,26.4,2H23.6A12,12,0,0,0,13.3,7.8a12.1,12.1,0,0,0-.4,11.8l1.8,3.6L13,23A10,10,0,1,0,23,33a9.8,9.8,0,0,0-1.4-5.1L16.5,17.7a8,8,0,0,1,.2-7.8A7.8,7.8,0,0,1,23.6,6h2.8a7.8,7.8,0,0,1,6.9,3.9,8,8,0,0,1,.2,7.8l-4.6,8.7a12.1,12.1,0,0,0,.4,11.8A12,12,0,0,0,39.6,44H43a2,2,0,0,0,0-4ZM13,39a6,6,0,0,1,0-12,5.8,5.8,0,0,1,5,2.8l.6,1.1h0A5.2,5.2,0,0,1,19,33,6,6,0,0,1,13,39Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Арслан</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="horoscope">
                                            <path
                                                d="M45.7,39.9,37.1,26l5.3-8.3A9.4,9.4,0,0,0,43.1,8a9.3,9.3,0,0,0-8.3-5,9.6,9.6,0,0,0-6.1,2.3A6,6,0,0,0,24,3a6.4,6.4,0,0,0-4,1.5A6.4,6.4,0,0,0,16,3a6.4,6.4,0,0,0-4,1.5A6.4,6.4,0,0,0,8,3,6,6,0,0,0,2,9v6a2,2,0,0,0,4,0V9a2,2,0,0,1,4,0V34a2,2,0,0,0,4,0V9a2,2,0,0,1,4,0V34a2,2,0,0,0,4,0V9a2,2,0,0,1,4,0v.4a9.3,9.3,0,0,0,1.1,8.1l5.2,8.4-9,14a2,2,0,0,0,3.4,2.2l8-12.4,7.6,12.4A2,2,0,0,0,44,43a2.3,2.3,0,0,0,1.1-.3A2.1,2.1,0,0,0,45.7,39.9ZM30.5,15.3a5,5,0,0,1-.3-5.5,5.2,5.2,0,0,1,9.3.1,5,5,0,0,1-.4,5.5l-4.4,6.8Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Охин</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <g>
                                                <path
                                                    d="M4,35H16.2a2.1,2.1,0,0,0,2-1.5,2.2,2.2,0,0,0-.9-2.2A12.9,12.9,0,0,1,11,20.1a13,13,0,1,1,26,0,12.9,12.9,0,0,1-6.3,11.2,2.2,2.2,0,0,0-.9,2.2,2.1,2.1,0,0,0,2,1.5H44a2,2,0,0,0,0-4H37.1a17,17,0,1,0-26.2,0H4a2,2,0,0,0,0,4Z" />
                                                <path d="M44,39H4a2,2,0,0,0,0,4H44a2,2,0,0,0,0-4Z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <h2>Жинлүүр</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M45.4,37.6l-4-4a2,2,0,0,0-2.8,2.8l.6.6H38a2,2,0,0,1-2-2V10A7,7,0,0,0,24,5.1a7,7,0,0,0-10,0A7,7,0,0,0,2,10v5a2,2,0,0,0,4,0V10A2.9,2.9,0,0,1,9,7a2.9,2.9,0,0,1,3,3V34a2,2,0,0,0,4,0V10a3,3,0,0,1,6,0V34a2,2,0,0,0,4,0V10a3,3,0,0,1,6,0V35a6,6,0,0,0,6,6h1.2l-.6.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0l4-4A1.9,1.9,0,0,0,45.4,37.6Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Хилэнц</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M41,5H21a2,2,0,0,0,0,4H36.2L18,27.2l-5.6-5.6a2,2,0,0,0-2.8,2.8L15.2,30,5.6,39.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0L18,32.8l5.6,5.6a1.9,1.9,0,0,0,2.8,0,1.9,1.9,0,0,0,0-2.8L20.8,30,39,11.8V27a2,2,0,0,0,4,0V7A2,2,0,0,0,41,5Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Нум</h2>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="invisible_box" data-name="invisible box">
                                            <rect width="48" height="48" fill="none" />
                                        </g>
                                        <g id="Horoscope">
                                            <path
                                                d="M36,24a9.5,9.5,0,0,0-5,1.5V11a8,8,0,0,0-8-8,8.2,8.2,0,0,0-6,2.7A8.2,8.2,0,0,0,11,3a8,8,0,0,0-8,8v4a2,2,0,0,0,4,0V10A2.9,2.9,0,0,1,9,7a2.9,2.9,0,0,1,3,3V34a2,2,0,0,0,4,0V10a3,3,0,0,1,6,0V34a2,2,0,0,0,4,0V10a3,3,0,0,1,6,0V37a4,4,0,0,1-4,4H21a2,2,0,0,0,0,4h2a8.1,8.1,0,0,0,7.4-5A8.5,8.5,0,0,0,36,42a9,9,0,0,0,0-18Zm0,14a5,5,0,1,1,5-5A5,5,0,0,1,36,38Z" />
                                        </g>
                                    </g>
                                </svg>
                                <h2>Матар</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>MBTI</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <h2>INTJ</h2>
                            </button>
                            <button>
                                <h2>INTP</h2>
                            </button>
                            <button>
                                <h2>ENTJ</h2>
                            </button>
                            <button>
                                <h2>ENTP</h2>
                            </button>
                            <button>
                                <h2>INFJ</h2>
                            </button>
                            <button>
                                <h2>INFP</h2>
                            </button>
                            <button>
                                <h2>ENFJ</h2>
                            </button>
                            <button>
                                <h2>ENFP</h2>
                            </button>
                            <button>
                                <h2>ISTJ</h2>
                            </button>
                            <button>
                                <h2>ISFJ</h2>
                            </button>
                            <button>
                                <h2>ESTJ</h2>
                            </button>
                            <button>
                                <h2>ESFJ</h2>
                            </button>
                            <button>
                                <h2>ISTP</h2>
                            </button>
                            <button>
                                <h2>ISFP</h2>
                            </button>
                            <button>
                                <h2>ESTP</h2>
                            </button>
                            <button>
                                <h2>ESFP</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Relationship goals</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <h2>Long-term</h2>
                            </button>
                            <button>
                                <h2>Short-term fun</h2>
                            </button>
                            <button>
                                <h2>Short-term, open to long</h2>
                            </button>
                            <button>
                                <h2>Friends</h2>
                            </button>
                            <button>
                                <h2>Just have fun</h2>
                            </button>
                            <button>
                                <h2>Not sure</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Love language</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <h2>Words of Affirmation</h2>
                            </button>
                            <button>
                                <h2>Receiving Gifts</h2>
                            </button>
                            <button>
                                <h2>Quality Time</h2>
                            </button>
                            <button>
                                <h2>Acts of Service</h2>
                            </button>
                            <button>
                                <h2>Physical Touch</h2>
                            </button>
                            <button>
                                <h2>Shared Experiences</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Cалбар сургууль</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content-school">
                            <button>
                                <h2>Бизнесийн сургууль</h2>
                            </button>
                            <button>
                                <h2>Инженер, технологийн сургууль</h2>
                            </button>
                            <button>
                                <h2>Мэдээллийн технологи, электроникийн сургууль</h2>
                            </button>
                            <button>
                                <h2>Улс төр судлал, олон улсын харилцаа,
                                    нийтийн удирдлагын сургууль</h2>
                            </button>
                            <button>
                                <h2>Хууль зүйн сургууль</h2>
                            </button>
                            <button>
                                <h2>Шинжлэх ухааны сургууль</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Түвшин</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <h2>1</h2>
                            </button>
                            <button>
                                <h2>2</h2>
                            </button>
                            <button>
                                <h2>3</h2>
                            </button>
                            <button>
                                <h2>4</h2>
                            </button>
                            <button>
                                <h2>5</h2>
                            </button>
                            <button>
                                <h2>6+</h2>
                            </button>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="dropbtn">
                            <h1>Сонирхол</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        <div class="dropdown-content">
                            <button>
                                <h2>Урлаг</h2>
                            </button>
                            <button>
                                <h2>Спорт</h2>
                            </button>
                            <button>
                                <h2>Хөгжим</h2>
                            </button>
                            <button>
                                <h2>Компьютер</h2>
                            </button>
                            <button>
                                <h2>Аялал</h2>
                            </button>
                            <button>
                                <h2>Ном</h2>
                            </button>
                            <button>
                                <h2>Шатар</h2>
                            </button>
                            <button>
                                <h2>Гоо сайхан</h2>
                            </button>
                            <button>
                                <h2>Гэрэл зураг</h2>
                            </button>
                            <button>
                                <h2>Хувцас</h2>
                            </button>
                            <button>
                                <h2>Кино</h2>
                            </button>
                            <button>
                                <h2>Хичээл</h2>
                            </button>
                        </div>
                    </div>
                </section>
                <a href="#" class="filter">Хайх</a>
            </div>
        </div>
    </main>
        `;

        this.initializeComponents();
    }

    async initializeComponents() {
        await this.loadMe();
        await this.loadLikedIds();
        await this.fetchProfiles();

        this.dropdownFilter = new DropdownFilter(this);
        this.initializeDropdownColors();
        this.profileSwipe = new ProfileSwipe(this);
        this.setupEventListeners();

        this.profileSwipe.updateProfile();
    }


    initializeDropdownColors() {
        const dropdowns = this.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            this.dropdownFilter.updateDropdownColor(dropdown);
        });
    }
    async fetchProfiles() {
        try {
            const data = await api.getProfiles();

            const withoutMe = this.removeMe(data);
            this.allProfiles = this.removeLiked(withoutMe);
            this.filteredProfiles = [...this.allProfiles];
        } catch (error) {
            console.error("Error fetching profiles:", error);

            const withoutMe = this.removeMe(this.getDummyProfiles());
            this.allProfiles = this.removeLiked(withoutMe);
            this.filteredProfiles = [...this.allProfiles];
        }
    }
    setupEventListeners() {
        const filterButton = this.querySelector('.filter');
        if (filterButton) {
            filterButton.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedFilters = this.dropdownFilter.getSelectedFilters();
                console.log('Applying filters:', selectedFilters);
                this.applyFilters(selectedFilters);
            });
        }
        const seeMoreBtn = this.querySelector('.see-more-btn');
        if (seeMoreBtn) {
            seeMoreBtn.addEventListener("click", async (e) => {
                e.preventDefault();

                const currentProfile = this.profileSwipe.getCurrentProfile();
                if (!currentProfile) return alert("Профайл олдсонгүй");

                const userId = currentProfile.userId ? String(currentProfile.userId) : null;
                if (!userId) {
                    alert("Demo профайлын дэлгэрэнгүй харах боломжгүй (userId алга).");
                    return;
                }

                try {
                    await api.selectOtherProfile(userId);
                    window.location.hash = "#/othersprofile";
                } catch (err) {
                    console.error(err);
                    alert(err.message || "Профайл сонгож чадсангүй");
                }
            });

        }


    }

    applyFilters(filters) {
        console.log('Filtering with:', filters);

        if (!this.allProfiles.length) {
            console.warn('No profiles available');
            return;
        }

        let result = this.allProfiles.filter(profile => {
            for (const [category, selectedValues] of Object.entries(filters)) {
                if (!selectedValues || selectedValues.length === 0) continue;

                let profileValue;

                switch (category) {
                    case "Орд":
                        profileValue = profile.about?.zodiac;
                        break;

                    case "MBTI":
                        profileValue = profile.about?.mbti;
                        break;

                    case "Relationship goals":
                        profileValue = profile.relationshipGoal;
                        break;

                    case "Love language":
                        profileValue = profile.loveLanguage;
                        break;

                    case "Cалбар сургууль":
                        profileValue = profile.school;
                        break;

                    case "Түвшин":
                        profileValue = String(profile.year);
                        break;

                    case "Сонирхол": {
                        const interests = profile.interests || [];
                        const hasMatchingInterest = selectedValues.some(interest =>
                            interests.includes(interest)
                        );
                        if (!hasMatchingInterest) return false;
                        continue;
                    }

                    default:
                        continue;
                }

                if (!profileValue || !selectedValues.includes(profileValue)) {
                    return false;
                }
            }

            return true;
        });

        result = this.removeLiked(result);

        this.filteredProfiles = result;

        console.log('Found profiles (after liked removed):', this.filteredProfiles.length);

        if (this.profileSwipe) {
            this.profileSwipe.currentProfileIndex = 0;
            this.profileSwipe.updateProfile();
        }

        if (!this.filteredProfiles.length && Object.keys(filters).length > 0) {
            setTimeout(() => {
                alert("Тохирох илэрц олдсонгүй");
            }, 100);
        }
    }

}

class ProfileSwipe {
    constructor(homeComponent) {
        this.home = homeComponent;
        this.currentProfileIndex = 0;
        this.profileElement = homeComponent.querySelector('.profile');
        this.profileImage = homeComponent.querySelector('.profile img');
        this.profileName = homeComponent.querySelector('.profile h1');
        this.profileAge = homeComponent.querySelector('.profile p');
        this.refreshButton = homeComponent.querySelector('.other_button');
        this.heartButton = homeComponent.querySelector('.heart_button');
        this.closeButton = homeComponent.querySelector('.other_button_x');
        this.refreshLimit = 1;
        this.refreshCount = 0;
        this.lastRefreshDate = null;

        this.init();
    }

    init() {

        if (this.profileImage) {
            this.profileImage.setAttribute("fetchpriority", "high");
            this.profileImage.setAttribute("loading", "eager");
            this.profileImage.setAttribute("decoding", "async");
        }

        this.setupTransitions();
        this.attachEventListeners();
        this.setupTouchControls();
        this.checkRefreshLimit();
    }

    async saveSwipe(action, profile) {
        if (!profile) return;

        const isRealUser = !!profile.userId;
        const targetUserId = isRealUser
            ? String(profile.userId)
            : `demo-${String(profile.name || "user").toLowerCase().replace(/\s+/g, "-")}`;

        try {
            if (action === "like" && isRealUser) {
                await api.likeUser(targetUserId);
            }

            await api.swipe({
                action,
                targetUserId,
                targetName: profile.name || null,
                at: new Date().toISOString(),
            });

        } catch (err) {
            console.warn("saveSwipe failed:", err);
        }
    }

    setupTransitions() {
        this.profileElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        this.refreshButton.style.transition = 'transform 0.3s ease';
        this.heartButton.style.transition = 'transform 0.3s ease';
        this.closeButton.style.transition = 'transform 0.3s ease';
    }

    getCurrentProfile() {
        if (!this.home.filteredProfiles.length) {
            console.warn('No profiles match filters');
            this.showNoProfilesMessage();
            return null;
        }

        if (this.currentProfileIndex >= this.home.filteredProfiles.length) {
            this.currentProfileIndex = 0;
        }

        return this.home.filteredProfiles[this.currentProfileIndex];
    }
    checkRefreshLimit() {
        const today = new Date().toDateString();
        const savedData = localStorage.getItem('refreshData');

        if (savedData) {
            const { date, count } = JSON.parse(savedData);
            if (date === today) {
                this.refreshCount = count;
                this.lastRefreshDate = date;
            } else {
                this.refreshCount = 0;
                this.lastRefreshDate = today;
                this.saveRefreshData();
            }
        } else {
            this.lastRefreshDate = today;
            this.saveRefreshData();
        }
        if (this.refreshCount >= this.refreshLimit) {
            this.disableRefreshButton();
        }
    }
    saveRefreshData() {
        const data = {
            date: this.lastRefreshDate,
            count: this.refreshCount
        };
        localStorage.setItem('refreshData', JSON.stringify(data));
    }

    disableRefreshButton() {
        if (this.refreshButton) {
            this.refreshButton.style.opacity = '0.5';
            this.refreshButton.style.cursor = 'not-allowed';
            this.refreshButton.disabled = true;

            this.refreshButton.title = 'Өдөрт 1 удаа л дарж болно';
        }
    }
    enableRefreshButton() {
        if (this.refreshButton) {
            this.refreshButton.style.opacity = '1';
            this.refreshButton.style.cursor = 'pointer';
            this.refreshButton.disabled = false;
            this.refreshButton.title = 'Refresh';
        }
    }

    showNoProfilesMessage() {
        this.profileName.textContent = "Илэрц олдсонгүй";
        this.profileAge.textContent = "Та дахин хайх тохиргоог хийннэ үү.";
        this.profileImage.style.display = 'none';
    }

    updateProfile() {
        const currentProfile = this.getCurrentProfile();
        if (!currentProfile) return;

        this.profileElement.style.opacity = '0';


        if (this._firstPaint) {
            this.profileImage.src = currentProfile.image || 'img/image.jpeg';
            this._firstPaint = false;
            return;
        }
        setTimeout(() => {
            this.profileImage.onerror = () => {
                this.profileImage.src = 'img/default-profile.jpg';
            };
            this.profileImage.src = currentProfile.image || 'img/image.jpeg';
            this.profileImage.style.display = 'block';
            this.profileName.textContent = `${currentProfile.name}, ${currentProfile.age}`;
            this.profileAge.textContent = currentProfile.major || 'Программ хангамж';
            this.profileElement.style.opacity = '1';
        });
    }

    refresh() {
        if (this.refreshCount >= this.refreshLimit) {
            this.showRefreshLimitAlert();
            return;
        }

        this.refreshCount++;
        this.saveRefreshData();

        if (this.refreshCount >= this.refreshLimit) {
            this.disableRefreshButton();
        }

        this.refreshButton.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.refreshButton.style.transform = 'rotate(0deg)';
            this.updateProfile();
        }, 300);
    }
    showRefreshLimitAlert() {
        alert('Өдөрт зөвхөн 1 удаа refresh хийж болно. Маргааш дахин оролдоно уу!');
    }

    like() {
        const currentProfile = this.getCurrentProfile();
        if (!currentProfile) return;

        this.home.markLiked(currentProfile);

        this.saveSwipe("like", currentProfile);

        this.home.allProfiles = this.home.removeLiked(this.home.allProfiles);
        this.home.filteredProfiles = this.home.removeLiked(this.home.filteredProfiles);

        this.heartButton.style.transform = 'scale(1.2)';
        this.profileElement.style.transform = 'translateX(100px) rotate(10deg)';

        setTimeout(() => {
            this.heartButton.style.transform = 'scale(1)';
            this.profileElement.style.transform = 'translateX(0) rotate(0)';

            if (this.currentProfileIndex >= this.home.filteredProfiles.length) {
                this.currentProfileIndex = 0;
            }

            this.updateProfile();
        }, 300);
    }



    pass() {
        const currentProfile = this.getCurrentProfile();
        if (!currentProfile) return;

        this.saveSwipe("pass", currentProfile);

        this.closeButton.style.transform = 'rotate(90deg)';
        this.profileElement.style.transform = 'translateX(-100px) rotate(-10deg)';

        setTimeout(() => {
            this.closeButton.style.transform = 'rotate(0deg)';
            this.profileElement.style.transform = 'translateX(0) rotate(0)';

            console.log('Passed:', currentProfile.name);
            this.currentProfileIndex++;
            if (this.currentProfileIndex >= this.home.filteredProfiles.length) {
                this.currentProfileIndex = 0;
            }
            this.updateProfile();
        }, 300);
    }


    attachEventListeners() {
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => this.refresh());
        }
        if (this.heartButton) {
            this.heartButton.addEventListener('click', () => this.like());
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.pass());
        }
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.profileElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.profileElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;

        if (endX < startX - swipeThreshold) {
            this.pass();
        }

        if (endX > startX + swipeThreshold) {
            this.like();
        }
    }
}
class DropdownFilter {
    constructor(homeComponent) {
        this.home = homeComponent;
        this.dropdowns = homeComponent.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setupClickOutside();
    }

    attachEventListeners() {
        this.dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content, .dropdown-content-school');
            const buttons = content.querySelectorAll('button');

            dropbtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    button.classList.toggle('selected');
                    this.updateDropdownColor(dropdown);
                });
            });
        });
    }

    toggleDropdown(currentDropdown) {
        this.dropdowns.forEach(dropdown => {
            if (dropdown !== currentDropdown) {
                dropdown.classList.remove('open');
            }
        });

        currentDropdown.classList.toggle('open');
    }

    updateDropdownColor(dropdown) {
        const hasSelected = dropdown.querySelectorAll('button.selected').length > 0;

        dropdown.classList.toggle('has-selection', hasSelected);
    }


    setupClickOutside() {
        document.addEventListener('click', () => {
            this.dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        });
    }

    getSelectedFilters() {
        const filters = {};

        this.dropdowns.forEach(dropdown => {
            const dropdownTitle = dropdown.querySelector('.dropbtn h1').textContent;
            const selectedButtons = dropdown.querySelectorAll('button.selected');

            if (selectedButtons.length > 0) {
                filters[dropdownTitle] = Array.from(selectedButtons).map(btn =>
                    btn.querySelector('h2').textContent
                );
            }
        });

        return filters;
    }
}

window.customElements.define('com-home', Home);