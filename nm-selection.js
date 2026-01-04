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

    static F_ABOUT = {mbti: "MBTI", height: "Өндөр"};
    static F_JOB = {work: "Ажил"};  
    static F_LIKES = {interests: "Сонирхол"};


    constructor() {
        super();
        this.selection = null;
        this.childSelection = null;
    }

    takeSelection(select){
        switch(select){
            case 'loveLang':
                return NmSelection.LOVE_LANG;
            case 'goal':
                return  NmSelection.REL_GOALS;
            case 'interests':
                return NmSelection.INTERESTS;
            //about heseg endees ehelne    
            case 'about':
                return NmSelection.F_ABOUT;
            case 'mbti' : 
                return NmSelection.MBTI;
            //about heseg duuslaa
            //job heseg ehellee
            case 'job':
                return  NmSelection.F_JOB;
            //job heseg duuslaa
            case 'likes':
                return NmSelection.F_LIKES;
        }
    }

    differiantator(select){
        switch(select){
            case 'work':
                return  this.jobInput();
            case 'height':
                return this.heightInput();
            case 'interests' :
                return this.interestsChoose();
            default :
                this.freeChoose(select);
        }
    }

    connectedCallback() {
        this.name = this.getAttribute('name');
        this.select = this.getAttribute('select');
        this.isMulti = this.getAttribute('isMulti');
        this.selection = this.takeSelection(this.select);
        if (this.isMulti !== "true"){
            this.onlyOneChoose();
        }else{
            this.multiChoose();
        }
    }

    onlyOneChoose(){
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
        this.render(this.name, content);

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

        this.enableExit();
    }

    multiChoose() {
        const profile = this.closest('com-profile');
        if (!profile) return console.warn('NmSelection: com-profile not found');

        const field = profile.querySelector(`.${this.select}`);
        if (!field) return console.warn('NmSelection: field not found', `.${this.select}`);

        const content = Object.entries(this.selection || {}).map(([key, value]) => {
            const row = field.querySelector(`.${key}`);
                   const isSelected =
        key === 'interests'
            ? Object.keys(this._getInterestsObj(profile)).length > 0
            : !!(row && row.style.display !== 'none' && row.querySelector('p')?.textContent?.trim());
            
            return `
            <div class="${isSelected ? 'field selected' : 'field'}" data-key="${key}">
                <p>${value}</p>
                <svg class="delete" data-key="${key}" width="27" height="27" viewBox="0 0 27 27" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33333 1H17.6667M1 5.16667H26M23.2222 5.16667L22.2482 19.7768C22.1021 21.9688 22.029 23.0648 21.5556 23.8958C21.1388 24.6275 20.5101 25.2157 19.7523 25.5829C18.8916 26 17.7932 26 15.5963 26H11.4037C9.20681 26 8.10838 26 7.24769 25.5829C6.48994 25.2157 5.86123 24.6275 5.44442 23.8958C4.97099 23.0648 4.89792 21.9688 4.75179 19.7768L3.77778 5.16667M10.7222 11.4167V18.3611M16.2778 11.4167V18.3611"
                stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            `;
        }).join('');

        this.render(this.name, content);

        this.querySelectorAll('.field').forEach(el => {
            el.addEventListener('click', () => {
            this.differiantator(el.dataset.key);
            });
        });


        this.delete();

        this.enableExit();
        
        this.querySelector('button').addEventListener('click', ()=>{
            document.querySelector('#edit').style.display = `none`;
        });
    }


    render(head, content){
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
                        border: 1px solid gray;
                        border-radius: var(--brderRad-m);
                        text-align: center;
                        align-items: center;
                        padding: 0px 10px;
                        cursor: pointer;
                        min-width: 15%;
                        & > p{width: 80%;}
                    }

                    & >.field{
                        min-width: 100%;
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

                    .delete{display: none; width: 20%;}

                    .selected{
                        border: 1px solid var(--first-color);
                        color: var(--first-color);
                        & > .delete{display: block;}
                    }



                }
                h2{width:100%;}

            </style>
            <section id="editSelect">
                <h2>${head}</h2>
                ${content}              
                <button><h4>БОЛСОН</h4></button>
                <svg class="exit" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6694 7.55385L19.1157 15.1076L26.6694 22.6614" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3306 22.8763L18.8843 15.3226L11.3306 7.7688" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </section>
        `;
    }

    freeChoose(select) {
        const profile = this.closest('com-profile');
        if (!profile) return;

        const contentField = profile.querySelector(`.${this.select}`);
        if (!contentField) return;

        const row = contentField.querySelector(`.${select}`);
        if (!row) return;

        let selected = row.querySelector('p')?.textContent?.trim() || '';
        const selection = this.takeSelection(select);

        let content = '';
        if (Array.isArray(selection)) {
            content = selection.map((element, i) => `
            <div class="${element === selected ? 'selected' : ''}" value="${i}">
                <p>${element}</p>
            </div>
            `).join('');
        } else if (selection && typeof selection === 'object') {
            content = Object.entries(selection).map(([key, value]) => `
            <div class="${value === selected ? 'selected' : ''}" value="${key}">
                <p>${value}</p>
            </div>
            `).join('');
        }

        this.render(this.name, content);

        this.querySelectorAll('#editSelect > div').forEach(el => {
            el.addEventListener('click', () => {
            this.querySelector('.selected')?.classList.remove('selected');
            el.classList.add('selected');
            selected = el.querySelector('p').textContent;
            });
        });

        this.querySelector('button')?.addEventListener('click', () => {
            row.querySelector('p').textContent = selected;
            row.style.display = 'block';
            this.multiChoose();
        });

        this.enableExit();
    }

    heightInput() {
        const profile = this.closest('com-profile');
        if (!profile) return;

        const contentField = profile.querySelector(`.${this.select}`);
        if (!contentField) return;

        const row = contentField.querySelector(`.height`);
        if (!row) return;

        const currentText = row.querySelector('p')?.textContent?.trim() || '';
        const currentNumber = (currentText.match(/\d+/)?.[0]) || '';

        const head =
            (this.selection && typeof this.selection === 'object' && this.selection.height)
            ? this.selection.height
            : 'Өндөр';

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
                gap: 14px;
            }
            h2{width:100%;}
            .heightWrap{
                width: 100%;
                display: flex;
                gap: 10px;
                align-items: center;
                justify-content: center;
            }
            input{
                width: 70%;
                min-width: 180px;
                height: 44px;
                padding: 0 12px;
                border-radius: 12px;
                border: 1px solid #cfcfcf;
                outline: none;
            }
            .unit{
                width: 30%;
                min-width: 50px;
                text-align: center;
                color: var(--muted, #8b8f95);
            }
            button{
                width: 80%;
                height: 44px;
                min-width: 130px;
                background-color: var(--first-color);
                border-radius: var(--brderRad-m);
                color: white;
                border: none;
                cursor: pointer;
            }
            .exit{ top: 22%; cursor:pointer; }
            .hint{
                width:100%;
                font-size: 13px;
                color: var(--muted, #8b8f95);
                text-align: center;
            }
            </style>

            <section id="editSelect">
            <h2>${head}</h2>

            <div class="heightWrap">
                <input id="heightInput" inputmode="numeric" placeholder="Жишээ: 170" value="${currentNumber}">
                <div class="unit">см</div>
            </div>

            <div class="hint">140 - 220 хооронд оруулна уу</div>

            <button id="saveHeight"><h4>БОЛСОН</h4></button>

            <svg class="exit" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6694 7.55385L19.1157 15.1076L26.6694 22.6614" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3306 22.8763L18.8843 15.3226L11.3306 7.7688" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </section>
        `;

        const input = this.querySelector('#heightInput');
        const btn = this.querySelector('#saveHeight');

        input?.addEventListener('input', () => {
            input.value = input.value.replace(/[^\d]/g, '');
        });

        btn?.addEventListener('click', () => {
            const n = Number(input.value);

            if (!Number.isFinite(n) || n < 140 || n > 220) {
            alert('Өндөр 140-220 см хооронд байх ёстой');
            return;
            }

            row.querySelector('p').textContent = `${n} см`;
            row.style.display = 'block';

            this.multiChoose();
        });

        this.enableExit();
    }

    jobInput() {
        const profile = this.closest('com-profile');
        if (!profile) return;

        const contentField = profile.querySelector(`.${this.select}`);
        if (!contentField) return;

        const row = contentField.querySelector(`.work`);
        if (!row) return;

        const currentText = row.querySelector('p')?.textContent?.trim() || '';

        const head =
            (this.selection && typeof this.selection === 'object' && this.selection.work)
            ? this.selection.work
            : 'Ажил';

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
                gap: 14px;
            }
            h2{width:100%;}
            input{
                width: 100%;
                min-width: 220px;
                height: 44px;
                padding: 0 12px;
                border-radius: 12px;
                border: 1px solid #cfcfcf;
                outline: none;
            }
            button{
                width: 80%;
                height: 44px;
                min-width: 130px;
                background-color: var(--first-color);
                border-radius: var(--brderRad-m);
                color: white;
                border: none;
                cursor: pointer;
            }
            .exit{ top: 22%; cursor:pointer; }
            .hint{
                width:100%;
                font-size: 13px;
                color: var(--muted, #8b8f95);
                text-align: center;
            }
            </style>

            <section id="editSelect">
            <h2>${head}</h2>

            <input id="jobInput" placeholder="Жишээ: Software Engineer" value="${this._escape(currentText)}">

            <div class="hint">Хоосон үлдээх бол 🗑 delete дарж болно</div>

            <button id="saveJob"><h4>БОЛСОН</h4></button>

            <svg class="exit" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6694 7.55385L19.1157 15.1076L26.6694 22.6614" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3306 22.8763L18.8843 15.3226L11.3306 7.7688" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </section>
        `;

        const input = this.querySelector('#jobInput');
        const btn = this.querySelector('#saveJob');

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btn.click();
        });

        btn?.addEventListener('click', () => {
            const text = (input.value || '').trim();

            if (!text) {
            alert('Ажил хоосон байж болохгүй. Хэрвээ устгах бол 🗑 дар.');
            return;
            }

            row.querySelector('p').textContent = text;
            row.style.display = 'block';

            this.multiChoose();
        });

        this.enableExit();
    }

    _escape(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }


    interestsChoose() {
        const profileEl = this.closest('com-profile');
        if (!profileEl) return;

        const options = NmSelection.INTERESTS;

        const curObj = this._getInterestsObj(profileEl);
        const selected = Object.keys(curObj).length
        ? { ...curObj }
        : this._readInterestsFromDOM(profileEl);


        const content = Object.entries(options).map(([key, label]) => `
            <div class="${selected[key] ? 'selected' : ''}" data-key="${key}">
            <p>${label}</p>
            </div>
        `).join('');

        this.innerHTML = `
            <style>
            #editSelect{ padding:20px; display:flex; flex-wrap:wrap; gap:12px; justify-content:center; background:var(--back-col-white); box-shadow:var(--box-shadow); border-radius:var(--brderRad-m);}
            h2{ width:100%; }
            #editSelect > div[data-key]{ border:1px solid gray; border-radius:var(--brderRad-m); padding:10px 12px; cursor:pointer; min-width:15%; user-select:none; display:flex; justify-content:center; align-items:center; }
            .selected{ border:1px solid var(--first-color); color:var(--first-color); }
            .hint{ width:100%; font-size:13px; color:var(--muted,#8b8f95); text-align:center; }
            button{ width:80%; height:44px; min-width:130px; background:var(--first-color); border-radius:var(--brderRad-m); color:#fff; border:none; cursor:pointer; }
            button:disabled{ opacity:.5; cursor:not-allowed; }
            .exit{ top:22%; cursor:pointer; }
            </style>

            <section id="editSelect">
            <h2>${this.name || 'Сонирхол'}</h2>
            ${content}
            <div class="hint" id="interestHint">Доод тал нь 3 сонгоно уу (одоогоор: ${Object.keys(selected).length})</div>
            <button id="saveInterests" ${Object.keys(selected).length < 3 ? 'disabled' : ''}><h4>БОЛСОН</h4></button>

            <svg class="exit" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6694 7.55385L19.1157 15.1076L26.6694 22.6614" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3306 22.8763L18.8843 15.3226L11.3306 7.7688" stroke="#FF0B55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </section>
        `;

        const hint = this.querySelector('#interestHint');
        const saveBtn = this.querySelector('#saveInterests');

        const updateUI = () => {
            const n = Object.keys(selected).length;
            if (hint) hint.textContent = `Доод тал нь 3 сонгоно уу (одоогоор: ${n})`;
            if (saveBtn) saveBtn.disabled = n < 3;
        };

        this.querySelectorAll('#editSelect > div[data-key]').forEach(card => {
            card.addEventListener('click', () => {
            const key = card.dataset.key;
            if (!key) return;

            if (selected[key]) {
                delete selected[key];
                card.classList.remove('selected');
            } else {
                selected[key] = options[key];
                card.classList.add('selected');
            }
            updateUI();
            });
        });

        saveBtn?.addEventListener('click', () => {
        const n = Object.keys(selected).length;
        if (n < 3) return alert('Хамгийн багадаа 3 сонирхол сонгоно уу.');

        this._setInterestsObj(profileEl, selected);

        const likesField = profileEl.querySelector('.likes');
        const interestsSection = likesField?.querySelector('section.interests');
        if (!interestsSection) return;

        Object.keys(NmSelection.INTERESTS).forEach((key) => {
            const chip = interestsSection.querySelector(`div.${key}`);
            if (!chip) return;
            chip.style.display = selected[key] ? 'flex' : 'none';
        });

        this.multiChoose();
        });



        this.enableExit();
    }





    enableExit() {
        const exitBtn = this.querySelector('.exit');
        if (!exitBtn) return;

        exitBtn.addEventListener('click', () => {
            const edit = document.querySelector('#edit');
            if (!edit) return;
            edit.style.display = 'none';
            edit.innerHTML = '';
        });
    }


    delete() {
        const profile = this.closest('com-profile');
        if (!profile) return;

        const field = profile.querySelector(`.${this.select}`);
        if (!field) return;

        this.querySelectorAll('.delete').forEach(del => {
            del.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = del.dataset.key;
            if (key === 'interests') {
            this._setInterestsObj(profile, {});

            const likesField = profile.querySelector('.likes');
            const interestsSection = likesField?.querySelector('section.interests');
            if (interestsSection) {
                Object.keys(NmSelection.INTERESTS).forEach((k) => {
                const chip = interestsSection.querySelector(`div.${k}`);
                if (chip) chip.style.display = 'none';
                });
            }
            }


            const row = field.querySelector(`.${key}`);
            if (!row) return;

            row.querySelector('p').textContent = '';
            row.style.display = 'none';

            this.multiChoose();
            });
        });
    }

    _readInterestsFromDOM(profileEl) {
        const likesField = profileEl.querySelector('.likes');
        const section = likesField?.querySelector('section.interests');
        if (!section) return {};

        const selected = {};
        Object.entries(NmSelection.INTERESTS).forEach(([key, label]) => {
            const chip = section.querySelector(`div.${key}`);
            if (!chip) return;

            // use computed style (works even if CSS controls display)
            const isVisible = window.getComputedStyle(chip).display !== 'none';
            if (isVisible) selected[key] = label;
        });

        return selected;
        }


    _getInterestsObj(profileEl){
        const p = profileEl._profile || profileEl.profile;
        return (p?.likes?.interests) || {};
    }

    _setInterestsObj(profileEl, obj){
        const p = profileEl._profile || profileEl.profile;
    if (!p) return;
        p.likes = p.likes || {};
        p.likes.interests = obj;
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
