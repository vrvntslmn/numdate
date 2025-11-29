import './com-home';

class AppCom extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <com-home></com-home>
        `;
    }
}

window.customElements.define('com-home', AppCom);