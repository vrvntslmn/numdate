class ComNotif extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const notif = document.getElementById('notif');
        notif.addEventListener('change', () =>{
            this.renderNotif();
        });
    }

    renderNotif(){
        this.innerHTML = `
            <div>
            
            </div>
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