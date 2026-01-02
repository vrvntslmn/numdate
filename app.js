import './com-home.js';
import './com-dateidea.js';
import './com-messenger.js';
import './com-profile.js';

// ✅ com-match эхэлж import (notif дараа нь)
import './com-match.js';
import './com-notif.js';

import './com-route.js';
import './com-routes.js';
import './com-router.js';
import './com-auth.js';
import './com-othersprofile.js';

class App extends HTMLElement {
  constructor() {
    super();
    this.user = null;
  }

  connectedCallback() {
    this.bootstrap();
  }

  async bootstrap() {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });

      if (!res.ok) {
        this.renderLogin();
        return;
      }

      const data = await res.json();

      if (!data.user) {
        this.renderLogin();
      } else {
        this.user = data.user;
        this.render();
      }
    } catch (err) {
      console.error('bootstrap /api/me error', err);
      this.renderLogin();
    }
  }

  render() {
    this.innerHTML = `
      <style>
        :root{
          --first-color:#FF0B55;
          --second-color:#CF0F47;
          --textWithBack:white;
          --font-header: "Yanone Kaffeesatz", sans-serif;
          --font-body:"Roboto Condensed", sans-serif;
          --box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
          --bg-white: white;
          --brderRad-big: 20px;
          --brderRad-m: 8px;
          --brderRad-sm: 2px;
          --inputBorder: #D9D9D9;
          --header-height: 55px;
          --bottom-nav-height: 64px;
        }

        html { width: 100%; }
        body { margin: 0; background-color: #F5F5F5; }

        h1 { color: #F5F5F5; font-family: var(--font-header); }
        h2 { font-family: var(--font-header); font-weight: 400; font-size: 36px; margin: 0; }
        h3 { margin: 0; font-family: var(--font-header); font-size: 36px; }
        h4 { font-family: var(--font-header); font-size: 24px; margin: 0; }
        p  { font-family: var(--font-body); font-weight: 400; }

        .edit-button{
          width: 32px;
          height: 32px;
          border: none;
          background: no-repeat center;
          background-size: contain;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 32'><path fill-rule='evenodd' clip-rule='evenodd' d='M19.4782 0.947093L17.4437 3.19506L26.1083 12.7688L28.1428 10.5209C29.2857 9.25806 29.2857 7.21068 28.1428 5.94789L23.6169 0.947092C22.474 -0.315698 20.621 -0.315697 19.4782 0.947093ZM4.02359 18.2305C3.72599 18.5593 3.91974 19.1223 4.33989 19.1496L4.98994 19.1918C5.36024 19.2158 5.65567 19.5422 5.67741 19.9514L5.79611 22.1845C5.80336 22.3209 5.90184 22.4297 6.02527 22.4377L8.04638 22.5689C8.41668 22.5929 8.71211 22.9193 8.73386 23.3285L8.85256 25.5617C8.85981 25.698 8.95828 25.8069 9.08172 25.8149L11.1028 25.946C11.4731 25.97 11.7686 26.2965 11.7903 26.7056L11.8269 27.394C11.8516 27.8582 12.3611 28.0723 12.6587 27.7434L23.7762 15.4595C23.9667 15.2491 23.9667 14.9078 23.7762 14.6974L15.8436 5.93251C15.6531 5.72205 15.3443 5.72205 15.1538 5.93251L4.02359 18.2305ZM0.716566 22.1597C0.327776 22.1345 -3.77004e-05 22.4761 3.25206e-09 22.9064L0.000735568 31.2514C0.000772011 31.6644 0.303771 31.9991 0.67755 31.9992L8.23013 32C8.61959 32 8.92875 31.6378 8.90591 31.2083L8.80063 29.2276C8.78051 28.849 8.50719 28.547 8.1646 28.5248L6.29474 28.4035C6.18055 28.3961 6.08944 28.2954 6.08273 28.1692L5.97291 26.1032C5.95279 25.7246 5.67947 25.4226 5.33688 25.4004L3.46703 25.2791C3.35283 25.2717 3.26172 25.171 3.25502 25.0448L3.1452 22.9788C3.12508 22.6002 2.85176 22.2982 2.50917 22.276L0.716566 22.1597Z' fill='%23CF0F47'/></svg>");
        }

        header{
          display: flex;
          width: 100%;
          background: linear-gradient(to top, #EE0067, #BC2265);
          height: var(--header-height);
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        header svg.logo{
          margin: 10px;
          margin-right: 0;
        }

        header > div{
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: auto;
          color: white;
        }

        header nav{
          display: flex;
          height: var(--header-height);
          align-items: center;
          gap: 20px;
          font-family: var(--font-header);
        }

        header nav ul{
          display: flex;
          justify-content: space-around;
          list-style: none;
          gap: 15px;
          padding: 15px 20px;
          margin: 0;
          margin-left: auto;
          align-items: center;
        }

        header nav ul a{
          display: flex;
          gap: 10px;
          height: 100%;
          align-items: center;
          color: white;
          text-decoration: none;
          font-size: 21px;
          font-weight: 600;
          line-height: 1;
          padding: 6px 8px;
          border-radius: 8px;
        }

        header nav ul a:hover{
          color: #ffd8e5ff;
        }

        header nav ul .notif{
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }

        header nav ul .notif input{
          display: none;
        }

        /* notif panel */
        com-notif{
          height: 90%;
          background-color: white;
          border-radius: var(--brderRad-m);
          box-shadow: var(--box-shadow);
          position: absolute;
          right: 0;
          top: var(--header-height);
          z-index: 20;
        }

        /* content area */
        #content{
          min-height: calc(100vh - var(--header-height));
        }

        /* =========================
           MOBILE: Bottom navbar
           ========================= */
        @media (max-width: 768px) {
          header{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
          }

          #content{
            padding-bottom: var(--bottom-nav-height);
            padding-top: var(--header-height);
          }

          header > div h1{
            font-size: 25px;
            letter-spacing: 0.06em;
          }

          header nav{
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: var(--bottom-nav-height);
            background: white;
            border-top: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 -8px 20px rgba(0,0,0,0.08);
            z-index: 30;
            display: flex;
            justify-content: center;
          }

          header nav ul{
            width: 100%;
            max-width: 520px;
            padding: 8px 10px;
            margin: 0;
            gap: 6px;
            justify-content: space-around;
          }

          header nav ul li{
            flex: 1;
            display: flex;
            justify-content: center;
          }

          header nav ul a{
            width: 100%;
            justify-content: center;
            gap: 0;
            font-size: 12px;
            padding: 10px 0;
            color: var(--second-color);
          }

          header nav ul a .nav-text{
            display: none;
          }

          header nav ul a svg path{
            stroke: var(--second-color);
          }

          header nav ul label.notif svg path{
            fill: var(--second-color);
          }

          com-notif{
            top: auto;
            bottom: var(--bottom-nav-height);
            right: 10px;
          }
        }

        /* ✅ Match overlay visible дээр гарах баталгаа */
        com-match{
          display: block;
        }
      </style>

      <header>
        <div>
          <svg class="logo" width="54" height="34" viewBox="0 0 54 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50.136 22.8237H54.0002V25.2515H47.8684V24.7739H47.8606L47.8743 15.7222L45.4895 16.7349L44.7004 13.9741L49.8528 11.9985V12.0103L50.2317 11.8354L50.136 22.8237Z" fill="white" />
            <path d="M4.30957 12.1104L4.29199 12.0615L9.91406 14.0518L8.06445 16.5996L6.1123 15.708L6.13867 24.917H6.13184V25.252H0V22.8232H3.93652L3.84082 11.9033L4.30957 12.1104Z" fill="white" />
            <path d="M14.0569 10.7131L12.3108 13.5393L10.0598 12.5657L10.0989 26.1028L7.51392 26.1125L7.37329 8.4436L7.38989 8.45239L7.38208 8.43481L14.0569 10.7131Z" fill="white" />
            <path d="M46.5684 26.1333L44.0576 26.1255L44.0938 12.1401L41.1895 13.0864L40.5225 10.0347L45.8271 8.58154L45.8418 8.62939L46.7275 8.27588L46.5684 26.1333Z" fill="white" />
            <path d="M28.8005 1.61523L28.7937 1.62109L33.2908 6.07324L31.4402 7.90527L26.9431 3.45312L22.4968 7.85645L20.8669 6.24219L25.3123 1.83789L25.3093 1.83496L27.1599 0.00292969L27.1628 0.00585938L27.1697 0L28.8005 1.61523Z" fill="white" />
            <path d="M42.6882 26.8562L39.5046 26.8386L39.4851 9.05444L27.3943 12.9421L27.3796 12.8962L27.3611 12.9587L14.7527 9.09937L14.7244 26.6433L11.4558 26.6628L11.3464 4.71362L12.5916 5.18042L12.6072 5.12964L27.3972 9.65698L41.6052 5.09058L41.6277 5.16187L42.8074 4.70288L42.6882 26.8562Z" fill="white" />
            <path d="M30.9601 14.4175C35.6415 13.9417 37.8321 18.1152 37.3641 21.1851C36.6873 25.6243 28.9405 29.861 27.4134 31.3232C25.935 30.0066 17.0865 25.2019 16.7024 20.1194C16.4966 17.3964 18.3845 14.3232 22.0179 14.3232C26.2356 14.5844 27.0213 17.359 27.0213 17.359C27.0213 17.359 27.2234 15.156 30.9601 14.4175Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M0 26.1072C0 26.1072 22.709 32.609 27.2508 30.9759C31.7926 29.3428 31.7926 31.2481 27.2508 33.1533C22.709 35.0585 0.613143 33.1533 0.613143 33.1533L0 26.1072Z" fill="white" />
            <path d="M53.3433 26.1072C53.3433 26.1072 32.1558 32.609 27.7956 30.9759C23.4355 29.3428 23.4355 31.2481 27.7956 33.1533C32.1558 35.0585 53.3433 33.1533 53.3433 33.1533V26.1072Z" fill="white" />
          </svg>
          <h1>NUMDATE</h1>
        </div>

        <nav>
          <ul>
            <li>
              <a href="#/">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.00024 9.29821C1.00024 8.72385 1.00024 8.43667 1.07427 8.17221C1.13985 7.93794 1.24761 7.7176 1.39227 7.52201C1.55558 7.30121 1.78227 7.1249 2.23563 6.77228L9.01794 1.49715C9.36926 1.2239 9.54493 1.08727 9.7389 1.03476C9.91005 0.988415 10.0904 0.988415 10.2616 1.03476C10.4556 1.08727 10.6312 1.2239 10.9825 1.49715L17.7649 6.77228C18.2182 7.1249 18.4449 7.30121 18.6082 7.52201C18.7529 7.7176 18.8606 7.93794 18.9262 8.17221C19.0002 8.43667 19.0002 8.72385 19.0002 9.29821V16.5331C19.0002 17.6532 19.0002 18.2133 18.7823 18.6411C18.5905 19.0174 18.2846 19.3234 17.9082 19.5152C17.4804 19.7331 16.9203 19.7331 15.8002 19.7331H4.20024C3.08014 19.7331 2.52009 19.7331 2.09226 19.5152C1.71594 19.3234 1.40998 19.0174 1.21823 18.6411C1.00024 18.2133 1.00024 17.6532 1.00024 16.5331V9.29821Z"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="nav-text">Home</span>
              </a>
            </li>

            <li>
              <a href="#dateidea">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5V21M11 5H7.46429C6.94332 5 6.4437 4.78929 6.07533 4.41421C5.70695 4.03914 5.5 3.53043 5.5 3C5.5 2.46957 5.70695 1.96086 6.07533 1.58579C6.4437 1.21071 6.94332 1 7.46429 1C10.2143 1 11 5 11 5ZM11 5H14.5357C15.0567 5 15.5563 4.78929 15.9247 4.41421C16.293 4.03914 16.5 3.53043 16.5 3C16.5 2.46957 16.293 1.96086 15.9247 1.58579C15.5563 1.21071 15.0567 1 14.5357 1C11.7857 1 11 5 11 5ZM19 10V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21L6.2 21C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V10M1 6.6L1 8.4C1 8.96005 1 9.24008 1.10899 9.45399C1.20487 9.64215 1.35785 9.79513 1.54601 9.89101C1.75992 10 2.03995 10 2.6 10L19.4 10C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V6.6C21 6.03995 21 5.75992 20.891 5.54601C20.7951 5.35785 20.6422 5.20487 20.454 5.10899C20.2401 5 19.9601 5 19.4 5L2.6 5C2.03995 5 1.75992 5 1.54601 5.10899C1.35785 5.20487 1.20487 5.35785 1.10899 5.54601C1 5.75992 1 6.03995 1 6.6Z"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="nav-text">Date idea</span>
              </a>
            </li>

            <li>
              <a href="#messenger">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H14.2C15.8802 1 16.7202 1 17.362 1.32698C17.9265 1.6146 18.3854 2.07354 18.673 2.63803C19 3.27976 19 4.11984 19 5.8V11.2C19 12.8802 19 13.7202 18.673 14.362C18.3854 14.9265 17.9265 15.3854 17.362 15.673C16.7202 16 15.8802 16 14.2 16H7.68375C7.0597 16 6.74767 16 6.44921 16.0613C6.18443 16.1156 5.9282 16.2055 5.68749 16.3285C5.41617 16.4671 5.17252 16.662 4.68521 17.0518L2.29976 18.9602C1.88367 19.2931 1.67563 19.4595 1.50054 19.4597C1.34827 19.4599 1.20422 19.3906 1.10923 19.2716C1 19.1348 1 18.8684 1 18.3355V5.8Z"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="nav-text">Messages</span>
              </a>
            </li>

            <li>
              <a href="#profile">
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.35727 13C6.1872 13 3.36807 14.5306 1.57327 16.906C1.18698 17.4172 0.993832 17.6728 1.00015 18.0183C1.00503 18.2852 1.17263 18.6219 1.38264 18.7867C1.65446 19 2.03114 19 2.7845 19H15.93C16.6834 19 17.0601 19 17.3319 18.7867C17.5419 18.6219 17.7095 18.2852 17.7144 18.0183C17.7207 17.6728 17.5276 17.4172 17.1413 16.906C15.3465 14.5306 12.5273 13 9.35727 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.35727 10C11.8426 10 13.8573 7.98528 13.8573 5.5C13.8573 3.01472 11.8426 1 9.35727 1C6.87199 1 4.85727 3.01472 4.85727 5.5C4.85727 7.98528 6.87199 10 9.35727 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </li>

            <li>
              <label class="notif">
               <svg width="22" height="20" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.333496 20.1666V17.8333H3.00016V9.66658C3.00016 8.0527 3.55572 6.62353 4.66683 5.37909C5.77794 4.1152 7.22239 3.28881 9.00016 2.89992V2.08325C9.00016 1.59714 9.18905 1.18881 9.56683 0.858251C9.96683 0.508252 10.4446 0.333252 11.0002 0.333252C11.5557 0.333252 12.0224 0.508252 12.4002 0.858251C12.8002 1.18881 13.0002 1.59714 13.0002 2.08325V2.89992C14.7779 3.28881 16.2224 4.1152 17.3335 5.37909C18.4446 6.62353 19.0002 8.0527 19.0002 9.66658V17.8333H21.6668V20.1666H0.333496ZM11.0002 23.6666C10.2668 23.6666 9.6335 23.443 9.10016 22.9958C8.58905 22.5291 8.3335 21.9749 8.3335 21.3333H13.6668C13.6668 21.9749 13.4002 22.5291 12.8668 22.9958C12.3557 23.443 11.7335 23.6666 11.0002 23.6666ZM5.66683 17.8333H16.3335V9.66658C16.3335 8.38325 15.8113 7.28464 14.7668 6.37075C13.7224 5.45686 12.4668 4.99992 11.0002 4.99992C9.5335 4.99992 8.27794 5.45686 7.2335 6.37075C6.18905 7.28464 5.66683 8.38325 5.66683 9.66658V17.8333Z" fill="white"></path>
               </svg>
                <input type="checkbox" id="notif">
              </label>
            </li>
          </ul>
        </nav>
      </header>

      <com-notif></com-notif>

      <div id="content">
        <com-home></com-home>
      </div>

      <com-router>
        <com-routes>
          <com-route path="/" com="com-home"></com-route>
          <com-route path="dateidea" com="com-dateidea"></com-route>
          <com-route path="messenger" com="com-messenger"></com-route>
          <com-route path="profile" com="com-profile"></com-route>
          <com-route path="othersprofile" com="com-othersprofile"></com-route>
          <!-- ✅ MATCH ROUTE НЭМСЭН -->
          <com-route path="match" com="com-match"></com-route>
        </com-routes>
      </com-router>
    `;
  }

  renderLogin() {
    this.innerHTML = `<com-auth></com-auth>`;
  }
}

window.customElements.define('com-app', App);
