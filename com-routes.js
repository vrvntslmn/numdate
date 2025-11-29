class Routes extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.querySelectorAll('com-route').forEach(r => {
            const path = r.getAttribute('path');
            const content = r.getAttribute('content');
            this.parentElement.urlBurtguul({path, content});
        });
    }

    render(){
        
    }
};

window.customElements.define('com-routes', Routes);