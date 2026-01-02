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
                    break;
                case '#messenger':
                    content.innerHTML = '<com-messenger></com-messenger>';
                    break;
                case '#dateidea':
                    content.innerHTML = '<com-dateidea></com-dateidea>';
                    break;
                case '#profile':
                    content.innerHTML = `<com-profile></com-profile>`;
                    break;
                case '#othersProfile':
                    content.innerHTML = `<com-othersprofile></com-othersprofile>`;
                    break;
                case '#match':
                    content.innerHTML = `<com-match></com-match>`;
                    break;
                default :
                    break;                 
            }
        });
    }

    urlBurtguuleh(url){
        this.routes.set(url.path, url.content);
    }
}

window.customElements.define('com-router', Route);
