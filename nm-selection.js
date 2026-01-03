class NmSelection extends HTMLElement {
    static MBTI = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
    static LOVE_LANG = ["Words of Affirmation", "Receiving Gifts", "Quality Time", "Acts of Service", "Physical Touch", "Shared Experiences"];
    static REL_GOALS = ["Long-term", "Short-term fun", "Short-term, open to long", "Friends", "Just have fun", "Not sure"];
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
        this.selection = null;
    }
 
    connectedCallback() {
        this.name = this.getAttribute('name');
        this.select = this.getAttribute('select');
        switch(this.select){
            case 'mbti':
                this.selection =  NmSelection.MBTI;
                break;
            case 'loveLang':
                this.selection =  NmSelection.LOVE_LANG;
                break;
            case 'goal':
                this.selection =  NmSelection.REL_GOALS;
                break;
            case 'interests':
                this.selection =  NmSelection.INTERESTS;
                break;
        }
 
        this.render();
    }
 
    render(){
        let content = ``;
        let temp = ``;
        let k;
        let selected = document.querySelector(`.${this.select} p`);
 
        if(Array.isArray(this.selection)){
            content = this.selection.map((element, i) =>{
                if (element===selected.textContent) {
                    temp = `class="selected"`;
                    k = i;
                }
                else temp = ``;
                return `<div ${temp} value='${i}'><p>${element}</p></div>`
            }
            ).join(``);
        }else if (this.selection && typeof this.selection === "object"){
                content = Object.entries(this.selection).map(([key, value]) => {
                    if (value===selected.textContent) {
                        temp = `class="selected"`;
                        k = key;
                    }else temp = ``;
                    return `<div ${temp} value='${key}'><p>${value}</p></div>`
                }
                ).join(``);
        }
       
       
        this.innerHTML = `
            <style>
                #editSelect{
                    padding: 20px;
                    display:flex;
                    flex-wrap: wrap;
                    width:100%;
                    height:100%;
                    justify-content: center;
                    background-color: var(--back-col-white);
                    box-shadow: var(--box-shadow);    
                    border-radius: var(--brderRad-m);
                    gap: 5%;
 
                    & > div{
                        display: flex;
                        justify-content: center;
                        border: 1px solid var(--first-color);
                        border-radius: var(--brderRad-m);
                        text-align: center;
                        align-items: center;
                        padding: 0px 10px;
                        color: var(--first-color);
                        cursor: pointer;
                        min-width: 15%;
                    }
 
                    & button{
                        width: 80%;
                        height: 10%;
                        min-width: 130px;
                        background-color: var(--first-color);
                        border-radius: var(--brderRad-m);
                        color: white;
                    }
 
                    & .exit{
                        top: 22%;
                    }
 
                    .selected{
                        background-color: var(--first-color);
                        color: white;
                    }
 
                }
                h2{width:100%;}
 
            </style>
            <section id="editSelect">
                <h2>${this.name}</h2>
                ${content}              
                <button><h4>БОЛСОН</h4></button>
                <svg class="exit" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6694 7.55385L19.1157 15.1076L26.6694 22.6614" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3306 22.8763L18.8843 15.3226L11.3306 7.7688" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </section>
        `;
 
        this.querySelectorAll('div').forEach(el => {
            el.addEventListener('click', () => {
                if(!el.classList.contains('selected')){
                    this.querySelector('.selected').classList.remove('selected');
                    el.classList.add('selected');
                    selected = el.querySelector('p').textContent;
                }
            });
        });
 
        this.querySelector('button').addEventListener('click', ()=>{
            document.querySelector(`.${this.select} p`).textContent = selected;
            document.querySelector('#edit').style.display = `none`;
        });
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
 
window.customElements.define('nm-selection', NmSelection);