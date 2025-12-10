class ComNotif extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const notif = document.getElementById('notif');
        notif.addEventListener('click', () =>{
            if (notif.checked) this.renderNotif();
            else this.innerHTML = ``;
        });
    }

    renderNotif(){
        this.innerHTML = `
            <style>
                .notifHead{
                    color: var(--second-color);
                    font-size: 40px;
                    margin-bottom: 20px;
                }
                .notifCir{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width:10px;
                    height:10px;
                    border-radius: 50%;
                    background-color: var(--second-color);
                }

                .notifText{
                    font-size: 20px;
                }
                .notifDate{
                    color : var(--second-color);
                    font-size: 20px;
                }

                .notifSec{
                padding : 20px;}

                .notifArt{
                    padding: 0px 10px;
                    display: flex;
                    align-items: center;
                    gap:14px;
                }

                .notifArt:hover{
                    background-color: #ffd8e5ff;
                    border-radius: var(--brderRad-m);
                    cursor: pointer;
                }
            </style>
            <section class="notifSec">
                <h2 class="notifHead">Notification</h2>
                <article class="notifArt">
                    <div class="notifCir"></div>                
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9998 15.085L14.9998 18.4813L21.7498 10.8398M16.4895 5.12698C13.4905 1.15778 8.48937 0.0900799 4.7318 3.72467C0.974222 7.35927 0.445207 13.4361 3.39605 17.7348C5.62489 20.9816 11.9567 27.4999 14.9218 30.4952C15.4668 31.0459 15.7394 31.3212 16.0585 31.4296C16.3355 31.5236 16.6434 31.5236 16.9205 31.4296C17.2396 31.3212 17.5121 31.0459 18.0572 30.4952C21.0223 27.4999 27.3541 20.9816 29.5829 17.7348C32.5338 13.4361 32.0693 7.32104 28.2472 3.72467C24.425 0.128312 19.4885 1.15778 16.4895 5.12698Z" stroke="#CF0F47" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p class="notifText">Та хоёр match боллоо 🎉</p>
                    <p class="notifDate">now</p>
                </article>
            </section>
        `;
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('com-notif', ComNotif);