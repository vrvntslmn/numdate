class Profile extends HTMLElement{
    constructor(){
        super();
        this.profile = null;
    }

    connectedCallback(){

        this.addEventListener('click', (event) => {
            const target = event.target;

            if (target.closest('.edit-button')) {
                this.renderDefault();
            } else if (target.closest('#exit')) {
                this.render();
            } else if (target.closest('#save')) {
                this.render();
            }
        });

        fetch('/api/profile')
            .then(async (res) => {
                const text = await res.text(); // read body even on errors
                console.log('HTTP:', res.status, res.statusText);
                console.log('Body:', text);

                if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
                }

                return text ? JSON.parse(text) : null; // or res.json() if you're sure it's JSON
            })
            .then(data => {
                console.log('Profiles from server:', data);
                this.profile = data;
                this.render();
            })
            .catch(err => console.error('Failed to load profiles:', err)
        );

    }

    loadUser() {
        const p = this.profile;
        if (!p) return;

        const {
        avatar,
        name,
        age,
        bio,
        photos: images = [],
        goal,
        loveLang,
        likes = {},
        interest = {},
        job = {},
        about = {}
        } = p;

        const $  = (sel) => this.querySelector(sel);
        const $$ = (sel) => this.querySelectorAll(sel);

        const goalEl = $('.goal p');
        if (goalEl) goalEl.textContent = goal || '';

        const loveEl = $('.loveLang p');
        if (loveEl) loveEl.textContent = loveLang || '';

        const majorEl = $('.major p');
        if (majorEl && job.major) majorEl.textContent = job.major;

        const aboutBlock = $('.about');
        if (Object.keys(about).length > 0) {
        if (aboutBlock) aboutBlock.style.display = 'flex';
        

        if (about.height) {
            const el = $('.height p');
            if (el) el.textContent = about.height;
        }
        if (about.sign) {
            const el = $('.sign p');
            if (el) el.textContent = about.sign;
        }
        if (about.mbti) {
            const el = $('.mbti p');
            if (el) el.textContent = about.mbti;
        }
        }else {
            const aboutButton = aboutBlock.querySelector('button');
            if(aboutButton) aboutButton.style.display = 'none';
        }

        const likesEl = $('.likes button'); 
        
        if(!likes || Object.keys(likes).length == 0) if (likesEl) likesEl.style.display = 'none';

        Object.keys(interest).forEach((key) => {
        const el = $(`.${key} p`);
        if (el) {
            el.parentElement.style.display = 'flex';
            el.textContent = interest[key];
        }
        });

        const avatarImg = $('.avatar img');
        if (avatarImg && avatar) avatarImg.src = avatar;

        const nameEl = $('.name');
        if (nameEl) nameEl.innerHTML = `${name}, <span>${age}</span>`;

        const bioEl = $('.bio');
        if (bioEl) bioEl.textContent = bio || '';

        $$('.user-image-container img').forEach((img, i) => {
        if (images[i]) img.src = images[i];
        });
    }


    render(){
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
                    --subInfoTitle-col: #55565A;
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

                h5{
                    font-family:var(--font-header);
                    font-size: 20px;
                    margin: 0px; 
                    color: var(--subInfoTitle-col);
                }
                
                p{
                    font-family: var(--font-body);
                    font-weight: 400;
                }
                
                .title{
                    margin-top: 2vh;
                    margin-bottom: 1vh;
                    display: flex;
                    width: 100%;
                    gap: 3px;
                }
                
                input, textarea{
                    border: 1px solid var(--inputBorder);
                    border-radius: var(--brderRad-sm);
                }
                
                
                body{
                    margin: 0px;
                    background-color: #F5F5F5;
                }

                main{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    gap:50px;
                    padding: 25px;
                }

                div.main-container{
                    min-height: 500px;
                    background-color: white;
                    border-radius: var(--brderRad-big);
                    display: flex;
                    flex: 0 1 800px;
                    z-index: 0;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);

                    h2{
                        color: var(--second-color);
                    }

                    & > article{
                        margin: 20px;
                        display:flex;
                        flex: 1 0 auto;
                        flex-direction: column;
                        align-items: center;
                        width: 36%;
                        min-width: 300px;

                        .edit-button{cursor: pointer;}

                        & > .user-image-container{
                            display: flex;
                            max-width: 60vw;
                            width: 100%;
                            justify-content: space-around;
                        }

                        & > .voice {
                            margin-top: 20px;
                            display: flex;
                            max-width: 60vw;
                            width: 100%;
                            justify-content: center;
                            label{
                                display: flex;
                                align-items: center;
                                width: 60%;
                                color: var(--second-color);
                                font-family: var(--font-body);
                                font-weight: 600;
                                justify-content: space-between;
                            }
                            label > .voice-progress{
                                width: 100px;
                                height: 2px;
                                background-color:var(--second-color);
                            }
                            input{
                                display: none;
                            }
                            .player{
                                height: 20px;
                            }
                            .pause{
                                cursor: pointer;
                                display: none;
                            }
                            .play{
                                cursor:pointer;
                            }

                            input:checked + .player > .pause{
                                display: inline;
                            }

                            input:checked + .player > .play{
                                display: none;
                            }
                        }
                    }
                    & > section{
                        margin: 20px;
                        display: grid;
                        grid-template-areas: "ln h3" "ln div";
                        grid-template-columns: 30px auto;
                        grid-template-rows: 30px;
                        width: 52%;
                        height: 470px;
                    }

                    & > section > div:last-of-type {
                        overflow:scroll;
                        scrollbar-width: none;
                        margin: 0px 3px;
                        & > article {
                            margin-top: 25px;
                            height: fit-content;
                            display: flex;
                            flex-direction: column;
                            & > article{
                                margin: 15px 0px;
                                margin-left: 5px;
                                & > div{
                                    margin: 10px 0px;
                                }
                            }

                            & > section{
                                margin: 15px 0px;
                                margin-left: 5px;
                                display: flex;
                                flex-wrap: wrap;
                                gap: 10px;
                                h5{width: 100%};
                                & > div{
                                    margin: 10px 0px;
                                    padding: 0px 5px;
                                    align-items: center;
                                    gap: 3px;
                                    border-radius: var(--brderRad-m);
                                    border: solid 2px var(--inputBorder);
                                }
                            }
                        }

                    }


                    & > section label{
                        display: flex;
                        gap: 10px;
                    }

                    & > section article > div{
                        padding: 0px 5px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        p{font-family: var(--font-body); font-size: 20px; margin: 0px;}
                    }

                    & > section > div:first-of-type {
                        grid-area: ln;
                    }

                    & > section > h3 {
                        grid-area: h3;
                    }

                    & > section > div:last-of-type {
                        grid-area: div;
                    }
                }

                div.profile-head{
                    margin: 0px;
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                }

                div.avatar{
                    margin: 20px 0px;
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    border: 3px solid var(--second-color);
                    justify-content: center;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
                }

                div.avatar > img{
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    justify-content: center;
                }

                .name{
                    margin: 0px;
                    font-family: var(--font-body);
                    font-weight: 600;
                    font-size: 24px;
                }

                .bio{
                    text-align: center;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.7);
                }



                .border-red{
                    height: 50px;
                    width: 20%;
                    border:2px solid var(--second-color);
                    border-radius: 7px;
                }


                .redline{
                    width: 6%;
                    height: 100%;
                    background-color: var(--second-color);
                }

                article.subscription{
                    padding: 20px;
                    width: 25%;
                    height: 250px;
                    background-color: white;
                    border-radius: 41px;
                    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                    min-width: 300px;
                    & > h4{
                        margin: 10px 60px;
                        font-size: 20px;
                        text-align: center;
                        padding: 5px 0px;
                        background-color: var(--first-color);
                        border-radius: 14px;
                        color:white;
                    }

                    & > div{
                        display: flex;
                        justify-content: space-between;
                    }

                    & > div h4{
                        font-size: 16px;
                        font-weight: 400;
                        margin: 10px 0px;
                    }

                    & > div:last-of-type{
                        margin-top: 10px;
                        display: flex;
                        justify-content:right;
                    }

                    button:last-of-type{
                        cursor: pointer;
                        color:white;
                        font-family: var(--font-header);
                        font-size: 18px;
                        font-weight: bold;
                        background-color:var(--first-color);
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
                        padding: 10px;
                        border-radius: 5px;
                        border:none;
                    }
                }

                .description p{
                    font-size: 12px;
                }

                .minus p{
                    margin: 0;
                    font-family:'Nerko One';
                    font-size: 32px;
                    font-weight: 400;
                    line-height: 25px;
                }

                .plus p{
                    margin: 0;
                    color:var(--second-color);
                    font-family:'Nerko One';
                    font-size: 32px;
                    font-weight: 400;
                    line-height: 25px;
                }

                .blackline{
                    height: 100%;
                    width: 1px;
                    background-color: black;
                }
                button{   
                    border: none;              
                    background: none;          
                    cursor: pointer; 
                }

                .goal{border-bottom: solid 1px var(--inputBorder);}

                .about{display:none;}

                .work{
                    display: none;
                }

                .movie{
                    display: none;
                }

                .taste{
                    display: none;
                }

                .song{
                    display: none;
                }

                .interest{display: block;}
                
                .art{display:none;}
                .sport{display:none;}
                .music{display:none;}
                .computer{display:none;}
                .travel{display:none;}
                .book{display:none;}
                
            </style>
            <main>

                <div class="main-container">
                    <article>
                        <div class="profile-head">
                            <h2>
                                My profile
                            </h2>
                            <button class="edit-button"></button>
                        </div>

                        <div class="avatar">
                            <img src="./img/Image.jpg" alt="profile">
                        </div>
                        <p class="name">, <span>21</span></p>
                        <p class="bio">Оролдлого, тэвчээр, хөлс 3 нь амжилт дагуулдаг ялагдашгүй нэгдэл юм.</p>
                        <div class="user-image-container">
                            <img class="border-red" src="./img/image.jpeg" alt="user photo">
                            <img class="border-red" src="./img/image.jpeg" alt="user photo">
                            <img class="border-red" src="./img/image.jpeg" alt="user photo">
                            <img class="border-red" src="./img/image.jpeg" alt="user photo">
                        </div>
                        <div class="voice">
                            <label>
                                <input type="checkbox">
                                <span class="player">
                                    <svg width="15" height="20" viewBox="0 0 16 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="play">
                                        <path d="M15.2083 9.68894L-3.52182e-05 0.000121889L0.314103 19.8541L15.2083 9.68894Z"
                                            fill="#CF0F47" />
                                    </svg>
                                    <svg width="15" height="20" viewBox="0 0 15 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="pause">
                                        <rect width="5" height="20" fill="#CF0F47" />
                                        <rect x="10" width="5" height="20" fill="#CF0F47" />
                                    </svg>
                                </span>
                                <div class="voice-progress"></div>
                                <span>0.03</span>
                            </label>

                            <audio id="audio">
                            </audio>
                        </div>
                    </article>
                    <section>
                        <div class="redline"></div>
                        <h3>Мэдээлэл</h3>
                        <div>
                            <article class='relation'>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Харилцаа</h4>
                                </label>
                                <article class="goal">
                                    <h5>Сонирхсон харилцаа</h5>
                                    <div>                                       
                                        <svg width="20" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.8186 4.25C12.9228 4.25016 15.4543 6.81578 15.4543 10C15.4543 13.1842 12.9228 15.7498 9.8186 15.75C6.7143 15.75 4.18188 13.1843 4.18188 10C4.18188 6.81568 6.7143 4.25 9.8186 4.25Z" stroke="#55565A"/>
                                        <path d="M17.1816 0.5C18.2525 0.5 19.1367 1.38675 19.1367 2.5C19.1367 3.61325 18.2525 4.5 17.1816 4.5C16.111 4.49974 15.2275 3.61309 15.2275 2.5C15.2275 1.38691 16.111 0.500258 17.1816 0.5Z" stroke="#55565A"/>
                                        <path d="M24.5449 8C25.6158 8 26.5 8.88675 26.5 10C26.5 11.1133 25.6158 12 24.5449 12C23.4743 11.9997 22.5908 11.1131 22.5908 10C22.5908 8.88691 23.4743 8.00026 24.5449 8Z" stroke="#55565A"/>
                                        <path d="M17.1816 15.5C18.2525 15.5 19.1367 16.3867 19.1367 17.5C19.1367 18.6133 18.2525 19.5 17.1816 19.5C16.111 19.4997 15.2275 18.6131 15.2275 17.5C15.2275 16.3869 16.111 15.5003 17.1816 15.5Z" stroke="#55565A"/>
                                        <path d="M9.81812 8C10.889 8 11.7732 8.88675 11.7732 10C11.7732 11.1133 10.889 12 9.81812 12C8.74745 11.9997 7.86401 11.1131 7.86401 10C7.86401 8.88691 8.74745 8.00026 9.81812 8Z" stroke="#55565A"/>
                                        <path d="M9.81812 0.5C10.889 0.5 11.7732 1.38675 11.7732 2.5C11.7732 3.61325 10.889 4.5 9.81812 4.5C8.74745 4.49974 7.86401 3.61309 7.86401 2.5C7.86401 1.38691 8.74745 0.500258 9.81812 0.5Z" stroke="#55565A"/>
                                        <path d="M17.1816 8C18.2525 8 19.1367 8.88675 19.1367 10C19.1367 11.1133 18.2525 12 17.1816 12C16.111 11.9997 15.2275 11.1131 15.2275 10C15.2275 8.88691 16.111 8.00026 17.1816 8Z" stroke="#55565A"/>
                                        <path d="M9.81812 15.5C10.889 15.5 11.7732 16.3867 11.7732 17.5C11.7732 18.6133 10.889 19.5 9.81812 19.5C8.74745 19.4997 7.86401 18.6131 7.86401 17.5C7.86401 16.3869 8.74745 15.5003 9.81812 15.5Z" stroke="#55565A"/>
                                        <path d="M2.4541 8C3.52498 8 4.40918 8.88675 4.40918 10C4.40918 11.1133 3.52498 12 2.4541 12C1.38344 11.9997 0.5 11.1131 0.5 10C0.5 8.88691 1.38344 8.00026 2.4541 8Z" stroke="#55565A"/>
                                        <path d="M17.1821 4.25C20.2863 4.25016 22.8179 6.81578 22.8179 10C22.8179 13.1842 20.2863 15.7498 17.1821 15.75C14.0778 15.75 11.5454 13.1843 11.5454 10C11.5454 6.81568 14.0778 4.25 17.1821 4.25Z" stroke="#55565A"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                </article>
                                <article class="loveLang">
                                    <h5>Хайрын хэл</h5>
                                    <div>
                                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.5559 8.93863C14.9302 8.27337 15.2422 7.67308 15.4346 7.21618C16.3691 4.99757 15.4451 2.44556 13.1863 1.40457C10.9274 0.36358 8.65922 1.443 7.66376 3.52712C5.76014 2.22021 3.22078 2.41214 1.8204 4.45163C0.420021 6.49111 0.859523 9.15551 2.77754 10.6094C3.64803 11.2692 5.36963 12.2417 6.99048 13.107M15.3082 10.7655C14.8857 8.49462 12.9545 6.83381 10.5229 7.28521C8.0913 7.73662 6.51903 9.93157 6.84776 12.3166C7.11186 14.2328 8.56967 18.7286 9.13259 20.4221C9.2094 20.6531 9.24781 20.7687 9.32386 20.8493C9.3901 20.9195 9.47819 20.9703 9.57206 20.9926C9.67983 21.0182 9.79905 20.9937 10.0375 20.9448C11.7848 20.5858 16.4051 19.601 18.1958 18.8718C20.4246 17.9641 21.5748 15.5058 20.7132 13.1717C19.8517 10.8375 17.485 9.99608 15.3082 10.7655Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p>Big textter<p>
                                    </div>
                                </article>
                            </article>
                            <article class='about'>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Миний тухай</h4>
                                </label>
                                <article class="height">
                                    <h5>Өндөр</h5>
                                    <div>                                    
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.7563 3.88125L13.0688 5.19375M9.13132 6.50625L10.4438 7.81875M6.50632 9.13125L7.81882 10.4438M3.88132 11.7563L5.19382 13.0688M1.31376 14.4388L4.69881 17.8238C4.87206 17.9971 4.95869 18.0837 5.05859 18.1162C5.14646 18.1447 5.24111 18.1447 5.32898 18.1162C5.42887 18.0837 5.5155 17.9971 5.68876 17.8238L17.8238 5.68876C17.9971 5.5155 18.0837 5.42887 18.1162 5.32898C18.1447 5.24111 18.1447 5.14646 18.1162 5.05859C18.0837 4.95869 17.9971 4.87206 17.8238 4.69881L14.4388 1.31376C14.2655 1.1405 14.1789 1.05387 14.079 1.02141C13.9911 0.992862 13.8965 0.992862 13.8086 1.02141C13.7087 1.05387 13.6221 1.1405 13.4488 1.31376L1.31376 13.4488C1.1405 13.6221 1.05387 13.7087 1.02141 13.8086C0.992862 13.8965 0.992862 13.9911 1.02141 14.079C1.05387 14.1789 1.1405 14.2655 1.31376 14.4388Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                </article>
                                <article class="sign">
                                    <h5>Орд</h5>
                                    <div>
                                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.0017 5.00022C21.6667 8.54505 21.6661 13.4578 19 17.0021M11 21C12.5711 21 14.0575 20.6377 15.3803 19.9921C15.2542 19.9974 15.1274 20 15 20C10.0294 20 6 15.9706 6 11C6 6.02944 10.0294 2 15 2C15.1274 2 15.2542 2.00265 15.3803 2.00789C14.0575 1.36229 12.5711 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                </article>
                                <article class="mbti">
                                    <h5>MBTI</h5>
                                    <div>                                
                                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12.1111H19.7614C20.3181 12.1111 20.5964 12.1111 20.7554 12.0034C20.894 11.9094 20.9825 11.7652 20.9984 11.6071C21.0167 11.4258 20.8735 11.2055 20.5871 10.7649L18.1484 7.01289C18.0404 6.84661 17.9863 6.76347 17.9652 6.67472C17.9465 6.59621 17.9465 6.5149 17.9652 6.4364C17.9863 6.34764 18.0404 6.2645 18.1484 6.09823L20.5871 2.34622C20.8735 1.90559 21.0167 1.68527 20.9984 1.50399C20.9825 1.34593 20.894 1.20171 20.7554 1.10776C20.5964 1 20.3181 1 19.7614 1H1L1 21" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                </article>
                            </article>
                            <article class='job'>
                                <label>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Ажил</h4>
                                </label>
                                <article class="major">
                                    <h5>Хөтөлбөр</h5>
                                    <div>
                                        <svg width="20" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.8112 5.23191C15.8112 4.24805 15.8112 3.75612 15.7031 3.35251C15.4096 2.25724 14.5541 1.40174 13.4589 1.10827C13.0553 1.00012 12.5633 1.00012 11.5795 1.00012C10.5956 1.00012 10.1037 1.00012 9.70007 1.10827C8.6048 1.40174 7.7493 2.25724 7.45582 3.35251C7.34768 3.75612 7.34768 4.24805 7.34768 5.23191M4.38543 20.0432H18.7735C19.9585 20.0432 20.551 20.0432 21.0036 19.8125C21.4018 19.6097 21.7254 19.286 21.9283 18.8879C22.1589 18.4352 22.1589 17.8427 22.1589 16.6577V8.61733C22.1589 7.43232 22.1589 6.83982 21.9283 6.3872C21.7254 5.98907 21.4018 5.66538 21.0036 5.46252C20.551 5.23191 19.9585 5.23191 18.7735 5.23191H4.38543C3.20042 5.23191 2.60791 5.23191 2.1553 5.46252C1.75717 5.66538 1.43348 5.98907 1.23062 6.3872C1 6.83982 1 7.43232 1 8.61733V16.6577C1 17.8427 1 18.4352 1.23062 18.8879C1.43348 19.286 1.75717 19.6097 2.1553 19.8125C2.60791 20.0432 3.20042 20.0432 4.38543 20.0432Z" stroke="#5D5B5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                </article>
                                <article class="work">
                                    <h5>Ажил</h5>
                                    <div><p><p></div>
                                </article>
                            </article>
                            <article class='likes'>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Таалагддаг</h4>
                                </label>
                                <article class="movie">
                                    <h5>Кино</h5>
                                    <div><p><p></div>
                                </article>
                                <article class="taste">
                                    <h5>Амттан</h5>
                                    <div><p><p></div>
                                </article>
                                <article class="song">
                                    <h5>Дуу</h5>
                                    <div><p><p></div>
                                </article>
                                <section class="interest">
                                    <h5>Сонирхол</h5>
                                    <div class="art">                                      
                                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.12624 10.0104L11.9722 13.8489M7.08262 19.9198C5.69113 21.3086 3.03608 20.9614 1 20.9614C2.04359 18.9293 0.652101 16.2793 2.04359 14.8905C3.43508 13.5017 5.69113 13.5017 7.08262 14.8905C8.47411 16.2793 8.47411 18.531 7.08262 19.9198ZM11.1006 14.7884L20.4025 4.76172C21.2218 3.87859 21.1954 2.50711 20.3427 1.65606C19.49 0.805003 18.1158 0.778637 17.231 1.59635L7.18492 10.8803C6.66579 11.3601 6.40622 11.5999 6.25484 11.8558C5.89182 12.4692 5.87721 13.2276 6.21634 13.8546C6.35776 14.116 6.6079 14.3657 7.10818 14.865C7.60845 15.3643 7.85859 15.614 8.12054 15.7551C8.7487 16.0936 9.50857 16.079 10.1232 15.7167C10.3796 15.5656 10.6199 15.3065 11.1006 14.7884Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                    <div class="sport"><p><p></div>
                                    <div class="music"><p><p></div>
                                    <div class="computer">                                    
                                        <svg width="20" height="17" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.0002 13V4.2C20.0002 3.0799 20.0002 2.51984 19.7823 2.09202C19.5905 1.71569 19.2845 1.40973 18.9082 1.21799C18.4804 1 17.9203 1 16.8002 1H5.20024C4.08014 1 3.52009 1 3.09226 1.21799C2.71594 1.40973 2.40998 1.71569 2.21823 2.09202C2.00024 2.51984 2.00024 3.0799 2.00024 4.2V13M3.66691 17H18.3336C18.9536 17 19.2635 17 19.5179 16.9319C20.2081 16.7469 20.7472 16.2078 20.9321 15.5176C21.0002 15.2633 21.0002 14.9533 21.0002 14.3333C21.0002 14.0233 21.0002 13.8683 20.9662 13.7412C20.8737 13.3961 20.6042 13.1265 20.2591 13.0341C20.1319 13 19.9769 13 19.6669 13H2.33358C2.02359 13 1.86859 13 1.74143 13.0341C1.39633 13.1265 1.12679 13.3961 1.03432 13.7412C1.00024 13.8683 1.00024 14.0233 1.00024 14.3333C1.00024 14.9533 1.00024 15.2633 1.06839 15.5176C1.25333 16.2078 1.79242 16.7469 2.48261 16.9319C2.73694 17 3.04693 17 3.66691 17Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p><p>
                                    </div>
                                    <div class="travel"><p><p></div>
                                    <div class="book"><p><p></div>
                                </section>
                            </article>
                        </div>
                    </section>
                </div>
                <article class="subscription">
                    <h4>
                        Миний багц:<span>Free</span>
                    </h4>
                    <div>
                        <div class="description">
                            <h4>Юу байгаа вэ?</h4>
                            <p>Хэн чамайг зүрхлэсэн бэ?</p>
                            <p>Хязгааргүй алгасалт</p>
                            <p>Алгассан хүнээ буцаах</p>
                            <p>Ярих</p>
                        </div>
                        <div class="blackline"></div>
                        <div class="minus">
                            <h4>Free</h4>
                            <p>-</p>
                            <p>-</p>
                            <p>-</p>
                            <p>-</p>
                        </div>
                        <div class="blackline"></div>
                        <div class="plus">
                            <h4>Premium</h4>
                            <p>+</p>
                            <p>+</p>
                            <p>+</p>
                            <p>+</p>
                        </div>
                    </div>
                    <div>
                        <button>Premium авах</button>
                    </div>
                </article>
            </main>
        `;

        if (this.profile) this.loadUser();
    }

    renderDefault(){
        const mainCont = this.querySelector('.main-container');
        const elMain = mainCont.parentElement;
     
        mainCont.innerHTML = `
            <article>
                <div class="profile-head">
                    <h2>
                    Edit
                    </h2>
                </div>
                
                <div class="avatar">
                    <img src="./img/Image.jpg" alt="profile">
                </div>
                <div class="title">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_542_2498)">
                    <path d="M15 1.66663L18.3333 4.99996M1.66663 18.3333L2.73029 14.4332C2.79969 14.1787 2.83439 14.0515 2.88765 13.9329C2.93495 13.8275 2.99306 13.7274 3.06106 13.6341C3.13764 13.5289 3.23088 13.4357 3.41738 13.2492L12.0286 4.63803C12.1936 4.47302 12.2761 4.39052 12.3712 4.35961C12.4549 4.33242 12.545 4.33242 12.6287 4.35961C12.7239 4.39052 12.8064 4.47302 12.9714 4.63803L15.3619 7.02855C15.5269 7.19356 15.6094 7.27607 15.6403 7.3712C15.6675 7.45489 15.6675 7.54503 15.6403 7.62872C15.6094 7.72385 15.5269 7.80636 15.3619 7.97136L6.75071 16.5825C6.56422 16.769 6.47097 16.8623 6.36586 16.9389C6.27253 17.0069 6.17239 17.065 6.06706 17.1123C5.94841 17.1655 5.82119 17.2002 5.56674 17.2696L1.66663 18.3333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_542_2498">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                    <h4>BIO</h4>
                </div>
                <textarea maxlength="40" class="bio" rows="3" placeholder="Оролдлого, тэвчээр, хөлс 3 нь амжилт дагуулагдашгүй нэгдэл юм." ></textarea>
                <div class="title">                                       
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h4>ЗУРАГ</h4>
                </div>
                <div class="user-image-container">
                    <img class="border-red" src="./img/image.jpeg" alt="user photo">
                    <img class="border-red" src="./img/image.jpeg" alt="user photo">
                    <img class="border-red" src="./img/image.jpeg" alt="user photo">
                    <img class="border-red" src="./img/image.jpeg" alt="user photo">
                </div>
                <div class="voice">
                    <p class="item">Voice</p>
                    <label>
                        <input type="checkbox" class='editPlayer'>
                        <div class="player">                      
                            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 9V11C15 14.866 11.866 18 8 18M1 9V11C1 14.866 4.13401 18 8 18M8 18V21M4 21H12M8 14C6.34315 14 5 12.6569 5 11V4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4V11C11 12.6569 9.65685 14 8 14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </label>
                    <p class="item">солих</p>
                </div>
            </article>
            <section>
                <div class="redline"></div>
                <h3>Мэдээлэл</h3>
                <div>
                    <article class='relation'>
                        <label>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h4>Харилцаа</h4>
                        </label>
                        <article class="goal">
                            <h5>Сонирхсон харилцаа</h5>
                            <div>                                       
                                <svg width="20" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.8186 4.25C12.9228 4.25016 15.4543 6.81578 15.4543 10C15.4543 13.1842 12.9228 15.7498 9.8186 15.75C6.7143 15.75 4.18188 13.1843 4.18188 10C4.18188 6.81568 6.7143 4.25 9.8186 4.25Z" stroke="#55565A"/>
                                <path d="M17.1816 0.5C18.2525 0.5 19.1367 1.38675 19.1367 2.5C19.1367 3.61325 18.2525 4.5 17.1816 4.5C16.111 4.49974 15.2275 3.61309 15.2275 2.5C15.2275 1.38691 16.111 0.500258 17.1816 0.5Z" stroke="#55565A"/>
                                <path d="M24.5449 8C25.6158 8 26.5 8.88675 26.5 10C26.5 11.1133 25.6158 12 24.5449 12C23.4743 11.9997 22.5908 11.1131 22.5908 10C22.5908 8.88691 23.4743 8.00026 24.5449 8Z" stroke="#55565A"/>
                                <path d="M17.1816 15.5C18.2525 15.5 19.1367 16.3867 19.1367 17.5C19.1367 18.6133 18.2525 19.5 17.1816 19.5C16.111 19.4997 15.2275 18.6131 15.2275 17.5C15.2275 16.3869 16.111 15.5003 17.1816 15.5Z" stroke="#55565A"/>
                                <path d="M9.81812 8C10.889 8 11.7732 8.88675 11.7732 10C11.7732 11.1133 10.889 12 9.81812 12C8.74745 11.9997 7.86401 11.1131 7.86401 10C7.86401 8.88691 8.74745 8.00026 9.81812 8Z" stroke="#55565A"/>
                                <path d="M9.81812 0.5C10.889 0.5 11.7732 1.38675 11.7732 2.5C11.7732 3.61325 10.889 4.5 9.81812 4.5C8.74745 4.49974 7.86401 3.61309 7.86401 2.5C7.86401 1.38691 8.74745 0.500258 9.81812 0.5Z" stroke="#55565A"/>
                                <path d="M17.1816 8C18.2525 8 19.1367 8.88675 19.1367 10C19.1367 11.1133 18.2525 12 17.1816 12C16.111 11.9997 15.2275 11.1131 15.2275 10C15.2275 8.88691 16.111 8.00026 17.1816 8Z" stroke="#55565A"/>
                                <path d="M9.81812 15.5C10.889 15.5 11.7732 16.3867 11.7732 17.5C11.7732 18.6133 10.889 19.5 9.81812 19.5C8.74745 19.4997 7.86401 18.6131 7.86401 17.5C7.86401 16.3869 8.74745 15.5003 9.81812 15.5Z" stroke="#55565A"/>
                                <path d="M2.4541 8C3.52498 8 4.40918 8.88675 4.40918 10C4.40918 11.1133 3.52498 12 2.4541 12C1.38344 11.9997 0.5 11.1131 0.5 10C0.5 8.88691 1.38344 8.00026 2.4541 8Z" stroke="#55565A"/>
                                <path d="M17.1821 4.25C20.2863 4.25016 22.8179 6.81578 22.8179 10C22.8179 13.1842 20.2863 15.7498 17.1821 15.75C14.0778 15.75 11.5454 13.1843 11.5454 10C11.5454 6.81568 14.0778 4.25 17.1821 4.25Z" stroke="#55565A"/>
                                </svg>
                                <p><p>
                            </div>
                        </article>
                        <article class="loveLang">
                            <h5>Хайрын хэл</h5>
                            <div>
                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5559 8.93863C14.9302 8.27337 15.2422 7.67308 15.4346 7.21618C16.3691 4.99757 15.4451 2.44556 13.1863 1.40457C10.9274 0.36358 8.65922 1.443 7.66376 3.52712C5.76014 2.22021 3.22078 2.41214 1.8204 4.45163C0.420021 6.49111 0.859523 9.15551 2.77754 10.6094C3.64803 11.2692 5.36963 12.2417 6.99048 13.107M15.3082 10.7655C14.8857 8.49462 12.9545 6.83381 10.5229 7.28521C8.0913 7.73662 6.51903 9.93157 6.84776 12.3166C7.11186 14.2328 8.56967 18.7286 9.13259 20.4221C9.2094 20.6531 9.24781 20.7687 9.32386 20.8493C9.3901 20.9195 9.47819 20.9703 9.57206 20.9926C9.67983 21.0182 9.79905 20.9937 10.0375 20.9448C11.7848 20.5858 16.4051 19.601 18.1958 18.8718C20.4246 17.9641 21.5748 15.5058 20.7132 13.1717C19.8517 10.8375 17.485 9.99608 15.3082 10.7655Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p>Big textter<p>
                            </div>
                        </article>
                        <button class="plus-btn" id="durtai">ЗАСАХ</button>
                    </article>
                    <article class='about'>
                        <label>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h4>Миний тухай</h4>
                        </label>
                        <article class="height">
                            <h5>Өндөр</h5>
                            <div>                                    
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.7563 3.88125L13.0688 5.19375M9.13132 6.50625L10.4438 7.81875M6.50632 9.13125L7.81882 10.4438M3.88132 11.7563L5.19382 13.0688M1.31376 14.4388L4.69881 17.8238C4.87206 17.9971 4.95869 18.0837 5.05859 18.1162C5.14646 18.1447 5.24111 18.1447 5.32898 18.1162C5.42887 18.0837 5.5155 17.9971 5.68876 17.8238L17.8238 5.68876C17.9971 5.5155 18.0837 5.42887 18.1162 5.32898C18.1447 5.24111 18.1447 5.14646 18.1162 5.05859C18.0837 4.95869 17.9971 4.87206 17.8238 4.69881L14.4388 1.31376C14.2655 1.1405 14.1789 1.05387 14.079 1.02141C13.9911 0.992862 13.8965 0.992862 13.8086 1.02141C13.7087 1.05387 13.6221 1.1405 13.4488 1.31376L1.31376 13.4488C1.1405 13.6221 1.05387 13.7087 1.02141 13.8086C0.992862 13.8965 0.992862 13.9911 1.02141 14.079C1.05387 14.1789 1.1405 14.2655 1.31376 14.4388Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                        </article>
                        <article class="sign">
                            <h5>Орд</h5>
                            <div>
                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.0017 5.00022C21.6667 8.54505 21.6661 13.4578 19 17.0021M11 21C12.5711 21 14.0575 20.6377 15.3803 19.9921C15.2542 19.9974 15.1274 20 15 20C10.0294 20 6 15.9706 6 11C6 6.02944 10.0294 2 15 2C15.1274 2 15.2542 2.00265 15.3803 2.00789C14.0575 1.36229 12.5711 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                        </article>
                        <article class="mbti">
                            <h5>MBTI</h5>
                            <div>                                
                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 12.1111H19.7614C20.3181 12.1111 20.5964 12.1111 20.7554 12.0034C20.894 11.9094 20.9825 11.7652 20.9984 11.6071C21.0167 11.4258 20.8735 11.2055 20.5871 10.7649L18.1484 7.01289C18.0404 6.84661 17.9863 6.76347 17.9652 6.67472C17.9465 6.59621 17.9465 6.5149 17.9652 6.4364C17.9863 6.34764 18.0404 6.2645 18.1484 6.09823L20.5871 2.34622C20.8735 1.90559 21.0167 1.68527 20.9984 1.50399C20.9825 1.34593 20.894 1.20171 20.7554 1.10776C20.5964 1 20.3181 1 19.7614 1H1L1 21" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                        </article>
                        <button class="plus-btn" id="durtai">ЗАСАХ</button>
                    </article>
                    <article class='job'>
                        <label>
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z"
                                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h4>Ажил</h4>
                        </label>
                        <article class="major">
                            <h5>Хөтөлбөр</h5>
                            <div>
                                <svg width="20" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8112 5.23191C15.8112 4.24805 15.8112 3.75612 15.7031 3.35251C15.4096 2.25724 14.5541 1.40174 13.4589 1.10827C13.0553 1.00012 12.5633 1.00012 11.5795 1.00012C10.5956 1.00012 10.1037 1.00012 9.70007 1.10827C8.6048 1.40174 7.7493 2.25724 7.45582 3.35251C7.34768 3.75612 7.34768 4.24805 7.34768 5.23191M4.38543 20.0432H18.7735C19.9585 20.0432 20.551 20.0432 21.0036 19.8125C21.4018 19.6097 21.7254 19.286 21.9283 18.8879C22.1589 18.4352 22.1589 17.8427 22.1589 16.6577V8.61733C22.1589 7.43232 22.1589 6.83982 21.9283 6.3872C21.7254 5.98907 21.4018 5.66538 21.0036 5.46252C20.551 5.23191 19.9585 5.23191 18.7735 5.23191H4.38543C3.20042 5.23191 2.60791 5.23191 2.1553 5.46252C1.75717 5.66538 1.43348 5.98907 1.23062 6.3872C1 6.83982 1 7.43232 1 8.61733V16.6577C1 17.8427 1 18.4352 1.23062 18.8879C1.43348 19.286 1.75717 19.6097 2.1553 19.8125C2.60791 20.0432 3.20042 20.0432 4.38543 20.0432Z" stroke="#5D5B5B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                        </article>
                        <article class="work">
                            <h5>Ажил</h5>
                            <div><p><p></div>
                        </article>
                        <button class="plus-btn" id="durtai">ЗАСАХ</button>
                    </article>
                    <article class='likes'>
                        <label>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h4>Таалагддаг</h4>
                        </label>
                        <article class="movie">
                            <h5>Кино</h5>
                            <div><p><p></div>
                        </article>
                        <article class="taste">
                            <h5>Амттан</h5>
                            <div><p><p></div>
                        </article>
                        <article class="song">
                            <h5>Дуу</h5>
                            <div><p><p></div>
                        </article>
                        <button class="plus-btn" id="durtai">ЗАСАХ</button>
                        <section class="interest">
                            <h5>Сонирхол</h5>
                            <div class="art">                                      
                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.12624 10.0104L11.9722 13.8489M7.08262 19.9198C5.69113 21.3086 3.03608 20.9614 1 20.9614C2.04359 18.9293 0.652101 16.2793 2.04359 14.8905C3.43508 13.5017 5.69113 13.5017 7.08262 14.8905C8.47411 16.2793 8.47411 18.531 7.08262 19.9198ZM11.1006 14.7884L20.4025 4.76172C21.2218 3.87859 21.1954 2.50711 20.3427 1.65606C19.49 0.805003 18.1158 0.778637 17.231 1.59635L7.18492 10.8803C6.66579 11.3601 6.40622 11.5999 6.25484 11.8558C5.89182 12.4692 5.87721 13.2276 6.21634 13.8546C6.35776 14.116 6.6079 14.3657 7.10818 14.865C7.60845 15.3643 7.85859 15.614 8.12054 15.7551C8.7487 16.0936 9.50857 16.079 10.1232 15.7167C10.3796 15.5656 10.6199 15.3065 11.1006 14.7884Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                            <div class="sport"><p><p></div>
                            <div class="music"><p><p></div>
                            <div class="computer">                                    
                                <svg width="20" height="17" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.0002 13V4.2C20.0002 3.0799 20.0002 2.51984 19.7823 2.09202C19.5905 1.71569 19.2845 1.40973 18.9082 1.21799C18.4804 1 17.9203 1 16.8002 1H5.20024C4.08014 1 3.52009 1 3.09226 1.21799C2.71594 1.40973 2.40998 1.71569 2.21823 2.09202C2.00024 2.51984 2.00024 3.0799 2.00024 4.2V13M3.66691 17H18.3336C18.9536 17 19.2635 17 19.5179 16.9319C20.2081 16.7469 20.7472 16.2078 20.9321 15.5176C21.0002 15.2633 21.0002 14.9533 21.0002 14.3333C21.0002 14.0233 21.0002 13.8683 20.9662 13.7412C20.8737 13.3961 20.6042 13.1265 20.2591 13.0341C20.1319 13 19.9769 13 19.6669 13H2.33358C2.02359 13 1.86859 13 1.74143 13.0341C1.39633 13.1265 1.12679 13.3961 1.03432 13.7412C1.00024 13.8683 1.00024 14.0233 1.00024 14.3333C1.00024 14.9533 1.00024 15.2633 1.06839 15.5176C1.25333 16.2078 1.79242 16.7469 2.48261 16.9319C2.73694 17 3.04693 17 3.66691 17Z" stroke="#55565A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p><p>
                            </div>
                            <div class="travel"><p><p></div>
                            <div class="book"><p><p></div>
                        </section>
                        <button class="plus-btn" id="durtai">ЗАСАХ</button>
                    </article>
                </div>
            </section>
            <div>
                <button id="exit">EXIT</button>
                <button id="save">SAVE</button>
            </div>

        `;

           elMain.innerHTML += `
            <style>
                .bckground{
                    position: absolute;
                    width: 100%;
                    height: 590px;
                    z-index: -1;
                }

                div.main-container{
                    & > article{

                        & > .voice {
                            label{
                                cursor: pointer;
                                width: fit-content;
                            }
                            
                            input{
                                display: none;
                            }
                            .player{
                                height: 60px;
                                background-color: var(--first-color);
                                width: 60px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 50%;
                                box-shadow: var(--box-shadow);
                            }

                            }
                        .item{
                            flex: 1;
                            text-align: center;
                            font:var(--font-header);
                            font-family: var(--font-body);
                            color: var(--second-color);
                            font-weight: 600;
                        }
                    }
                    & > section{
                        height: 470px;
                    }

                    & > section label{
                        display: flex;
                        gap: 10px;
                    }

                    
                    .plus-btn{
                        align-self: center;
                        min-width: 100px;
                        width: 13vw;
                        height: 4vh;
                        background-color: var(--first-color);
                        font-size: var(--font-body);
                        font-weight: 600;
                        color:var(--textWithBack);
                        border-radius: 8px;
                        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
                    }

                    & > div{
                        height: fit-content;
                        display: flex;
                        gap: 1vw;
                        margin-bottom: 20px;
                        margin-right: 2vw;
                        justify-content: end;
                        width: 100%;

                        & button{
                            min-width: 130px;
                            color: var(--textWithBack);
                            border-radius: 3px;
                            font-family: var(--font-body);
                            font-size: var(--font-body);
                            font-weight: 600;
                            margin-left
                        }

                        #exit{
                            border: 3px solid var(--first-color);
                            background-color: var(--bg-white);
                            color:var(--first-color);
                        }

                        #save{
                            background-color: var(--first-color);
                        }
                    }
                }

                div.avatar{
                    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
                    margin: 0px;
                }

                .bio{
                    width: 90%;
                    resize: none;
                }
            
                #editVoice{
                    z-index: 1;
                    
                }

                .voice {
                    margin-top: 20px;
                    display: flex;
                    max-width: 60vw;
                    width: 100%;
                    justify-content: center;
                    label{
                        display: flex;
                        align-items: center;
                        width: 60%;
                        color: var(--second-color);
                        font-family: var(--font-body);
                        font-weight: 600;
                        justify-content: space-between;
                    }
                    label > .voice-progress{
                        width: 100px;
                        height: 2px;
                        background-color:var(--second-color);
                    }
                    input{
                        display: none;
                    }
                    .player{
                        height: 20px;
                    }
                    .pause{
                        cursor: pointer;
                        display: none;
                    }
                    .play{
                        cursor:pointer;
                    }

                    input:checked + .player > .pause{
                        display: inline;
                    }

                    input:checked + .player > .play{
                        display: none;
                    }
                }
            </style>
            <div id="editVoice"></div>`
            

        const editPlayer = document.querySelector('#editVoice');
        const player = this.querySelector('.editPlayer');
        player.addEventListener('change', ()=>{
            if(player.checked) {
                editPlayer.innerHTML = `
                    <div>
                        <p>Таны одоогийн voice</p>
                        <div class="voice">
                            <label>
                                <input type="checkbox">
                                <span class="player">
                                    <svg width="15" height="20" viewBox="0 0 16 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="play">
                                        <path d="M15.2083 9.68894L-3.52182e-05 0.000121889L0.314103 19.8541L15.2083 9.68894Z"
                                            fill="#CF0F47" />
                                    </svg>
                                    <svg width="15" height="20" viewBox="0 0 15 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="pause">
                                        <rect width="5" height="20" fill="#CF0F47" />
                                        <rect x="10" width="5" height="20" fill="#CF0F47" />
                                    </svg>
                                </span>
                                <div class="voice-progress"></div>
                                <span>0.03</span>
                            </label>

                            <audio id="audio">
                            </audio>
                        </div>
                        <div class="redline"></div>
                        <div class="player">                      
                            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 9V11C15 14.866 11.866 18 8 18M1 9V11C1 14.866 4.13401 18 8 18M8 18V21M4 21H12M8 14C6.34315 14 5 12.6569 5 11V4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4V11C11 12.6569 9.65685 14 8 14Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                `;
            }
            else editPlayer.innerHTML = ``;
        });
        if (this.profile) this.loadUser();
    }
   
}

window.customElements.define('com-profile', Profile);
