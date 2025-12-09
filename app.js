import './com-home.js';
import './com-dateidea.js';
import './com-messenger.js';
import './com-profile.js';
import './com-route.js';
import './com-routes.js';
import './com-router.js';


class App extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                :root{
                    --first-color:#FF0B55;
                    --second-color:#CF0F47;
                    --font-header: "Yanone Kaffeesatz", sans-serif;
                    --font-body:"Roboto Condensed", sans-serif;
                }

                .edit-button{
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: no-repeat center;
                    background-size: contain;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 32'><path fill-rule='evenodd' clip-rule='evenodd' d='M19.4782 0.947093L17.4437 3.19506L26.1083 12.7688L28.1428 10.5209C29.2857 9.25806 29.2857 7.21068 28.1428 5.94789L23.6169 0.947092C22.474 -0.315698 20.621 -0.315697 19.4782 0.947093ZM4.02359 18.2305C3.72599 18.5593 3.91974 19.1223 4.33989 19.1496L4.98994 19.1918C5.36024 19.2158 5.65567 19.5422 5.67741 19.9514L5.79611 22.1845C5.80336 22.3209 5.90184 22.4297 6.02527 22.4377L8.04638 22.5689C8.41668 22.5929 8.71211 22.9193 8.73386 23.3285L8.85256 25.5617C8.85981 25.698 8.95828 25.8069 9.08172 25.8149L11.1028 25.946C11.4731 25.97 11.7686 26.2965 11.7903 26.7056L11.8269 27.394C11.8516 27.8582 12.3611 28.0723 12.6587 27.7434L23.7762 15.4595C23.9667 15.2491 23.9667 14.9078 23.7762 14.6974L15.8436 5.93251C15.6531 5.72205 15.3443 5.72205 15.1538 5.93251L4.02359 18.2305ZM0.716566 22.1597C0.327776 22.1345 -3.77004e-05 22.4761 3.25206e-09 22.9064L0.000735568 31.2514C0.000772011 31.6644 0.303771 31.9991 0.67755 31.9992L8.23013 32C8.61959 32 8.92875 31.6378 8.90591 31.2083L8.80063 29.2276C8.78051 28.849 8.50719 28.547 8.1646 28.5248L6.29474 28.4035C6.18055 28.3961 6.08944 28.2954 6.08273 28.1692L5.97291 26.1032C5.95279 25.7246 5.67947 25.4226 5.33688 25.4004L3.46703 25.2791C3.35283 25.2717 3.26172 25.171 3.25502 25.0448L3.1452 22.9788C3.12508 22.6002 2.85176 22.2982 2.50917 22.276L0.716566 22.1597Z' fill='%23CF0F47'/></svg>");
                }

                html{
                    width: 100%;
                }

                h1 {
                    color: #F5F5F5;
                    font-family:var(--font-header);
                }

                h2{
                    font-family:var(--font-header);
                    font-weight: 400;
                    font-size: 36px;
                    margin: 0;
                }

                h3{
                    margin: 0px;
                    font-family:var(--font-header);
                    font-size: 36px;
                }

                h4{
                    font-family:var(--font-header);
                    font-size: 24px;
                    margin: 0px;
                }

                p{
                    font-family: var(--font-body);
                    font-weight: 400;
                }


                body{
                    margin: 0px;
                    background-color: #F5F5F5;
                }



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

                    & div {
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
                        margin-left: auto;
                        a{  
                            display: flex;
                            color: white;
                            text-decoration: none;
                            font-size: 20px;
                            font-weight: 600;
                        }
                        
                        #notif{
                            display: none;
                        }
                    }
                    height: 55px;
                    align-items: center;
                    gap: 20px;
                }

        </style>
        <header>
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
        <nav>
            <ul>
                <li><a href="#/">Home</a></li>
                <li><a href="#dateidea">Date idea</a></li>
                <li><a href="#messenger">Messages</a></li>
                <li><a href="#profile">Profile</a></li>
                <li>
                    <label>
                        <input type='checkbox' id='notif'>
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.333496 20.1666V17.8333H3.00016V9.66658C3.00016 8.0527 3.55572 6.62353 4.66683 5.37909C5.77794 4.1152 7.22239 3.28881 9.00016 2.89992V2.08325C9.00016 1.59714 9.18905 1.18881 9.56683 0.858251C9.96683 0.508252 10.4446 0.333252 11.0002 0.333252C11.5557 0.333252 12.0224 0.508252 12.4002 0.858251C12.8002 1.18881 13.0002 1.59714 13.0002 2.08325V2.89992C14.7779 3.28881 16.2224 4.1152 17.3335 5.37909C18.4446 6.62353 19.0002 8.0527 19.0002 9.66658V17.8333H21.6668V20.1666H0.333496ZM11.0002 23.6666C10.2668 23.6666 9.6335 23.443 9.10016 22.9958C8.58905 22.5291 8.3335 21.9749 8.3335 21.3333H13.6668C13.6668 21.9749 13.4002 22.5291 12.8668 22.9958C12.3557 23.443 11.7335 23.6666 11.0002 23.6666ZM5.66683 17.8333H16.3335V9.66658C16.3335 8.38325 15.8113 7.28464 14.7668 6.37075C13.7224 5.45686 12.4668 4.99992 11.0002 4.99992C9.5335 4.99992 8.27794 5.45686 7.2335 6.37075C6.18905 7.28464 5.66683 8.38325 5.66683 9.66658V17.8333Z"
                                fill="white" />
                        </svg>
                    </label>
                </li>
            </ul>
        </nav>
    </header>
    <div id="content">
        <com-home></com-home>
    </div>
    <com-router>
        <com-routes>
            <com-route path="/" com="com-home"></com-route>
            <com-route path="dateidea" com="com-dateidea"></com-route>
            <com-route path="messenger" com="com-messenger"></com-route>
            <com-route path="profile" com="com-profile"></com-route>
        </com-routes>
    </com-router>
        `;


    }

}

window.customElements.define('com-app', App);
