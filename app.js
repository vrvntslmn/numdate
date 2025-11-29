import './com-home.js';
import './com-dateidea.js';
import './com-messenger.js';
import './scripts.js';
import './com-route.js';
import './com-routes.js';
import './com-router.js';


class App extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
        <style>
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
        </style>
        <header>
        <nav>
            <div>
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
                <h1>NUMDATE</h1>
            </div>
            <ul>
                <li><a href="#/">Home</a></li>
                <li><a href="#dateidea">Date idea</a></li>
                <li><a href="#messenger">Messages</a></li>
                <li>
                    <a href="#profile">
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.333496 20.1666V17.8333H3.00016V9.66658C3.00016 8.0527 3.55572 6.62353 4.66683 5.37909C5.77794 4.1152 7.22239 3.28881 9.00016 2.89992V2.08325C9.00016 1.59714 9.18905 1.18881 9.56683 0.858251C9.96683 0.508252 10.4446 0.333252 11.0002 0.333252C11.5557 0.333252 12.0224 0.508252 12.4002 0.858251C12.8002 1.18881 13.0002 1.59714 13.0002 2.08325V2.89992C14.7779 3.28881 16.2224 4.1152 17.3335 5.37909C18.4446 6.62353 19.0002 8.0527 19.0002 9.66658V17.8333H21.6668V20.1666H0.333496ZM11.0002 23.6666C10.2668 23.6666 9.6335 23.443 9.10016 22.9958C8.58905 22.5291 8.3335 21.9749 8.3335 21.3333H13.6668C13.6668 21.9749 13.4002 22.5291 12.8668 22.9958C12.3557 23.443 11.7335 23.6666 11.0002 23.6666ZM5.66683 17.8333H16.3335V9.66658C16.3335 8.38325 15.8113 7.28464 14.7668 6.37075C13.7224 5.45686 12.4668 4.99992 11.0002 4.99992C9.5335 4.99992 8.27794 5.45686 7.2335 6.37075C6.18905 7.28464 5.66683 8.38325 5.66683 9.66658V17.8333Z"
                                fill="white" />
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    </header>
    <style>
    body {
        margin: 0;
        background-color: #F5F5F5;
        font-family: 'Yanone Kaffeesatz', sans-serif;
    }

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
        height: 580px;
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
        right: 16px;
        background: rgba(245, 0, 87, 0.9);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 3;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        text-decoration: none;
        display: inline-block;
    }

    .profile .see-more-btn:hover {
        background: rgba(245, 0, 87, 1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 0, 87, 0.4);
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
        background-color: #f50057;
        border: none;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: transform 0.2s;
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

    .catogeries {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 380px;
        align-items: stretch;
        max-height: 600px;
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
        /* background-color: #f50057; */
        border: none;
        /* color: white; */
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        transition: background 0.3s, transform 0.2s;
    }

    .catogeries button:hover {
        background-color: #ff4081;
        transform: translateY(-2px);
    }

    .catogeries button h1 {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
    }

    .catogeries button:hover h2 {
        color: #f50057;
        margin: 0;
    }

    .filter {
        display: block;
        width: fit-content;

        margin: 24px auto 0;


        padding: 10px 40px;
        border-radius: 999px;
        border: 2px solid #f50057;
        background-color: #ffffff;
        color: #f50057;

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
        background: #fff;
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
        background-color: #f50057;
        color: white;
        border: none;
        padding: 20px 30px;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        font-size: 20px;
        transition: background 0.3s, transform 0.2s;
    }

    .dropbtn:hover {
        background-color: #ff4081;
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

    .dropdown-content .button svg {
        color: #f50057;
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
        color: #f50057;
        transform: translateY(-2px);
    }

    .dropdown-content button.selected {
        background: #f50057;
        color: #fff;
        border-color: #f50057;
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

    .dropdown-content-school button {
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: flex-start;
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
    }

    .dropdown-content-school button:hover {
        background: #ffe0e9;
        color: #f50057;
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

    .selected-count {
        display: inline-block;
        background: rgba(255, 255, 255, 0.3);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 14px;
        margin-left: 8px;
    }
    </style>
    <div id="content">
            <main>
                <div>
                    <section class="swipe">
                        <div class="profile">
                            <div>
                                <div><img src="img/image.jpeg" alt="img1" width="200px" height="300px"></div>
                            </div>
                            <h1>Jennie Kim</h1>
                            <p>28, ISTP</p>
                            <a href="othersProfile.html" class="see-more-btn">See more</a>
                        </div>
                        <div class="buttons">
                            <button class="other_button">
                                <svg class="button_icon" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px"
                                    viewBox="0 0 64 64" stroke-width="6.4" stroke="white" fill="none">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M54.89,26.73A23.52,23.52,0,0,1,15.6,49" stroke-linecap="round" />
                                        <path d="M9,37.17a23.75,23.75,0,0,1-.53-5A23.51,23.51,0,0,1,48.3,15.2"
                                            stroke-linecap="round" />
                                        <polyline points="37.73 16.24 48.62 15.44 47.77 5.24" stroke-linecap="round" />
                                        <polyline points="25.91 47.76 15.03 48.56 15.88 58.76" stroke-linecap="round" />
                                    </g>
                                </svg>
                            </button>
                            <button class="heart_button">
                                <svg class="button_icon" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px"
                                    viewBox="0 0 24 24" stroke="white" fill="white">
                                    <path
                                        d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z" />
                                </svg>
                            </button>
                            <button class="other_button">
                                <svg class="button_icon" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px"
                                    viewBox="0 0 32 32" stroke="white" fill="white">
                                    <path
                                        d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
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
                                                        d="M36,24a9.5,9.5,0,0,0-5,1.5V11a8,8,0,0,0-8-8,8.2,8.2,0,0,0-6,2.7A8.2,8.2,0,0,0,11,3a8,8,0,0,0-8,8v4a2,2,0,0,0,4,0V11a4,4,0,0,1,8,0V34a2,2,0,0,0,4,0V11a4,4,0,0,1,8,0V37a4,4,0,0,1-4,4H21a2,2,0,0,0,0,4h2a8.1,8.1,0,0,0,7.4-5A8.5,8.5,0,0,0,36,42a9,9,0,0,0,0-18Zm0,14a5,5,0,1,1,5-5A5,5,0,0,1,36,38Z" />
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
                                    <h1>Хобби</h1>
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
                                </div>
                            </div>
                        </section>
                        <a href="#" class="filter">Хайх</a>

                    </div>
                </div>
            </main>
    </div>
    <com-router>
        <com-routes>
            <com-route path="/" com="com-home"></com-route>
            <com-route path="dateidea" com="com-dateidea"></com-route>
            <com-route path="messenger" com="com-messenger"></com-route>
        </com-routes>
    </com-router>
        `;
    const profiles = [
            {
                name: "Jennie Kim",
                age: 28,
                image: "img/image.jpeg"
            },
            {
                name: "Сарантуяа",
                age: 19,
                image: "img/profile2.jpg"
            },
            {
                name: "Марал",
                age: 18,
                image: "img/profile3.jpg"
            },
            {
                name: "Хулан",
                age: 21,
                image: "img/profile4.jpg"
            },
            {
                name: "Тэмүүжин",
                age: 20,
                image: "img/profile5.jpg"
            }
        ];

        class ProfileSwipe {
            constructor() {
                this.currentProfileIndex = 0;
                this.profileElement = this.querySelector('.profile');
                this.profileImage = this.querySelector('.profile img');
                this.profileName = this.querySelector('.profile h1');
                this.profileAge = this.querySelector('.profile p');
                this.refreshButton = this.querySelector('.buttons button:nth-child(1)');
                this.heartButton = this.querySelector('.buttons button:nth-child(2)');
                this.closeButton = this.querySelector('.buttons button:nth-child(3)');

                this.init();
            }

            init() {
                this.setupTransitions();
                this.attachEventListeners();
                this.setupKeyboardControls();
                this.setupTouchControls();
            }

            setupTransitions() {
                this.profileElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                this.refreshButton.style.transition = 'transform 0.3s ease';
                this.heartButton.style.transition = 'transform 0.3s ease';
                this.closeButton.style.transition = 'transform 0.3s ease';
            }

            updateProfile() {
                if (this.currentProfileIndex >= profiles.length) {
                    this.currentProfileIndex = 0;
                }

                const currentProfile = profiles[this.currentProfileIndex];
                this.profileElement.style.opacity = '0';

                setTimeout(() => {
                    this.profileImage.src = currentProfile.image;
                    this.profileName.textContent = currentProfile.name;
                    this.profileAge.textContent = currentProfile.age;
                    this.profileElement.style.opacity = '1';
                }, 300);
            }

            refresh() {
                this.refreshButton.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    this.refreshButton.style.transform = 'rotate(0deg)';
                }, 300);
                this.updateProfile();
            }

            like() {
                this.heartButton.style.transform = 'scale(1.2)';
                this.profileElement.style.transform = 'translateX(100px) rotate(10deg)';

                setTimeout(() => {
                    this.heartButton.style.transform = 'scale(1)';
                    this.profileElement.style.transform = 'translateX(0) rotate(0)';

                    console.log('Liked:', profiles[this.currentProfileIndex].name);
                    this.currentProfileIndex++;
                    this.updateProfile();
                }, 300);
            }

            pass() {
                this.closeButton.style.transform = 'rotate(90deg)';
                this.profileElement.style.transform = 'translateX(-100px) rotate(-10deg)';

                setTimeout(() => {
                    this.closeButton.style.transform = 'rotate(0deg)';
                    this.profileElement.style.transform = 'translateX(0) rotate(0)';

                    console.log('Passed:', profiles[this.currentProfileIndex].name);
                    this.currentProfileIndex++;
                    this.updateProfile();
                }, 300);
            }

            attachEventListeners() {
                this.refreshButton.addEventListener('click', () => this.refresh());
                this.heartButton.addEventListener('click', () => this.like());
                this.closeButton.addEventListener('click', () => this.pass());
            }

            setupKeyboardControls() {
                this.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        this.pass();
                    } else if (e.key === 'ArrowRight') {
                        this.like();
                    } else if (e.key === ' ') {
                        e.preventDefault();
                        this.refresh();
                    }
                });
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
            constructor() {
                this.dropdowns = this.querySelectorAll('.dropdown');
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
                    const countSpan = dropdown.querySelector('.selected-count');

                    dropbtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleDropdown(dropdown);
                    });

                    buttons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.toggleSelection(button, content, countSpan);
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

            toggleSelection(button, content, countSpan) {
                button.classList.toggle('selected');

                const selectedCount = content.querySelectorAll('button.selected').length;

                if (selectedCount > 0) {
                    countSpan.textContent = selectedCount;
                    countSpan.style.display = 'inline-block';
                } else {
                    countSpan.style.display = 'none';
                }
            }

            setupClickOutside() {
                this.addEventListener('click', () => {
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

        this.addEventListener('DOMContentLoaded', function () {
            const profileSwipe = new ProfileSwipe();
            const dropdownFilter = new DropdownFilter();

            const filterButton = this.querySelector('.filter');
            if (filterButton) {
                filterButton.addEventListener('click', () => {
                    const selectedFilters = dropdownFilter.getSelectedFilters();
                    console.log('Selected Filters:', selectedFilters);
                });
            }
        });
    }

};

window.customElements.define('com-app', App);