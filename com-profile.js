class Profile extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.render();

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
                
                    }

                    & > section label{
                        display: flex;
                        gap: 10px;
                    }

                    & > section article{
                        margin: 20px 0px 50px;
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
                    height: 500px;
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
                    margin-left: auto;
                }
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
                        <p class="name">Тэмүүжин, <span>21</span></p>
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
                            <article>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16 6L19 3M19 3L22 6M19 3V9M16 21V19.8C16 18.1198 16 17.2798 15.673 16.638C15.3854 16.0735 14.9265 15.6146 14.362 15.327C13.7202 15 12.8802 15 11.2 15H6.8C5.11984 15 4.27976 15 3.63803 15.327C3.07354 15.6146 2.6146 16.0735 2.32698 16.638C2 17.2798 2 18.1198 2 19.8V21M12.5 7.5C12.5 9.433 10.933 11 9 11C7.067 11 5.5 9.433 5.5 7.5C5.5 5.567 7.067 4 9 4C10.933 4 12.5 5.567 12.5 7.5Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Удам</h4>
                                </label>
                                <p></p>
                            </article>
                            <article>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Харилцаа</h4>
                                </label>
                                <p></p>
                            </article>
                            <article>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Миний тухай</h4>
                                </label>
                                <p></p>
                            </article>
                            <article>
                                <label>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Ажил</h4>
                                </label>
                                <p></p>
                            </article>
                            <article>
                                <label>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
                                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <h4>Дуртай</h4>
                                </label>
                                <p></p>
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
    }

    renderDefault(){
         this.innerHTML=`
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

                    .bckground{
                        position: absolute;
                        width: 100%;
                        height: 590px;
                        z-index: -1;
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
                        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);

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
                                width: 80%;
                                justify-content: center;
                                label{
                                    cursor: pointer;
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
                            margin: 20px;
                            height: 470px;
                            display: grid;
                            grid-template-areas: "ln h3" "ln div";
                            grid-template-columns: 30px auto;
                            grid-template-rows: 30px auto;
                            width: 52%;
                        }

                        & > section label{
                            display: flex;
                            gap: 10px;
                        }

                        & > section article{
                            margin: 20px 0px 50px;
                            height: fit-content;
                            display: flex;
                            flex-direction: column;
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
                        }

                        & > section > div:first-of-type {
                            grid-area: ln;
                        }

                        & > section > h3 {
                            grid-area: h3;
                        }

                        & > section > div:last-of-type {
                            grid-area: div;
                            overflow:scroll;
                            scrollbar-width: none;
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
                        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
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
                        width: 90%;
                        resize: none;
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
                        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
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
                            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
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
                <div id="editVoice"></div>
                <main>
                    <div class="main-container">
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
                            <textarea maxlength="40" class="bio" rows="2" placeholder="Оролдлого, тэвчээр, хөлс 3 нь амжилт дагуулагдашгүй нэгдэл юм." ></textarea>
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
                                <article>
                                    <label>                           
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 6L19 3M19 3L22 6M19 3V9M16 21V19.8C16 18.1198 16 17.2798 15.673 16.638C15.3854 16.0735 14.9265 15.6146 14.362 15.327C13.7202 15 12.8802 15 11.2 15H6.8C5.11984 15 4.27976 15 3.63803 15.327C3.07354 15.6146 2.6146 16.0735 2.32698 16.638C2 17.2798 2 18.1198 2 19.8V21M12.5 7.5C12.5 9.433 10.933 11 9 11C7.067 11 5.5 9.433 5.5 7.5C5.5 5.567 7.067 4 9 4C10.933 4 12.5 5.567 12.5 7.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <h4>Удам</h4>
                                    </label>
                                    <p></p>
                                    <button class="plus-btn" id="udam">НЭМЭХ</button>
                                </article>
                                <article>
                                    <label>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44424C1.42059 7.48108 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.36636 13.2242 7.98596 14.0884M16.2972 11.7499C15.8751 9.482 13.9454 7.82334 11.5156 8.27415C9.08592 8.72497 7.51488 10.9171 7.84335 13.299C8.10725 15.2127 9.56392 19.7027 10.1264 21.394C10.2032 21.6248 10.2415 21.7402 10.3175 21.8206C10.3837 21.8907 10.4717 21.9416 10.5655 21.9638C10.6732 21.9894 10.7923 21.9649 11.0306 21.916C12.7765 21.5575 17.3933 20.574 19.1826 19.8457C21.4096 18.9392 22.5589 16.4841 21.6981 14.153C20.8372 11.8219 18.4723 10.9815 16.2972 11.7499Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <h4>Харилцаа</h4>
                                    </label>
                                    <p></p>
                                    <button class="plus-btn" id="hariltsaa">НЭМЭХ</button>
                                </article>
                                <article>                       
                                    <label>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 12H20M19.071 19.0711L17.6567 17.6569M4 12H2M6.34292 6.34317L4.92871 4.92896M12 4V2M17.6567 6.34317L19.071 4.92896M12 22V20M4.92871 19.0711L6.34292 17.6569M12 7L13.545 10.13L17 10.635L14.5 13.07L15.09 16.51L12 14.885L8.91 16.51L9.5 13.07L7 10.635L10.455 10.13L12 7Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <h4>Миний тухай</h4>
                                    </label>
                                    <p></p>
                                    <button class="plus-btn" id="tuhai">НЭМЭХ</button>
                                </article>
                                <article>
                                    <label>
                                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.6834 9.43925H12.0613C11.1925 9.43925 10.4881 10.1436 10.4881 11.0125C10.4881 11.8813 11.1925 12.5857 12.0613 12.5857H13.1101C13.979 12.5857 14.6834 13.29 14.6834 14.1589C14.6834 15.0278 13.979 15.7321 13.1101 15.7321H10.4881M12.5857 8.39045V9.43925M12.5857 15.7321V16.7809M18.8786 12.5857H18.8891M6.29289 12.5857H6.30338M2.09766 8.60021L2.09766 16.5712C2.09766 17.7459 2.09766 18.3333 2.32628 18.782C2.52739 19.1767 2.84828 19.4976 3.24298 19.6987C3.69168 19.9273 4.27907 19.9273 5.45384 19.9273L19.7176 19.9273C20.8924 19.9273 21.4798 19.9273 21.9285 19.6987C22.3232 19.4976 22.6441 19.1767 22.8452 18.782C23.0738 18.3333 23.0738 17.7459 23.0738 16.5712V8.60021C23.0738 7.42543 23.0738 6.83804 22.8452 6.38934C22.6441 5.99465 22.3232 5.67375 21.9285 5.47265C21.4798 5.24402 20.8924 5.24402 19.7176 5.24402L5.45385 5.24402C4.27907 5.24402 3.69168 5.24402 3.24298 5.47265C2.84828 5.67375 2.52739 5.99465 2.32628 6.38934C2.09766 6.83804 2.09766 7.42543 2.09766 8.60021ZM19.403 12.5857C19.403 12.8753 19.1682 13.1101 18.8786 13.1101C18.589 13.1101 18.3542 12.8753 18.3542 12.5857C18.3542 12.2961 18.589 12.0613 18.8786 12.0613C19.1682 12.0613 19.403 12.2961 19.403 12.5857ZM6.8173 12.5857C6.8173 12.8753 6.58251 13.1101 6.29289 13.1101C6.00327 13.1101 5.76849 12.8753 5.76849 12.5857C5.76849 12.2961 6.00327 12.0613 6.29289 12.0613C6.58251 12.0613 6.8173 12.2961 6.8173 12.5857Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <h4>Ажил</h4>
                                    </label>
                                    <p></p>
                                    <button class="plus-btn" id="ajil">НЭМЭХ</button>
                                </article>
                                <article>
                                    <label>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <h4>Дуртай</h4>
                                    </label>
                                    <p></p>
                                    <button class="plus-btn" id="durtai">НЭМЭХ</button>
                                </article>
                            </div>
                        </section>
                        <div>
                            <button id="exit">EXIT</button>
                            <button id="save">SAVE</button>
                        </div>
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
    }
   
}

window.customElements.define('com-profile', Profile);
