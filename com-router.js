class Route extends HTMLElement{
    constructor(){
        super();
        this.routes = new Map();
    }

    connectedCallback(){
        window.addEventListener('hashchange', () =>{
            const hash = window.location.hash;
            const content = document.getElementById('content');
            switch(hash){
                case '#/':
                    content.innerHTML = '<com-home></com-home>';
                case '#messenger':
                    content.innerHTML = '<com-messenger></com-messenger>';
                    break;
                case '#dateidea':
                    content.innerHTML = '<com-dateidea></com-dateidea>';
                    break;
                default :
                    break;                 
            }
        });
    }

    urlBurgtuuleh(url){
        this.routes.set(url.path, url.content);
    }
}

window.customElements.define('com-router', Route);
