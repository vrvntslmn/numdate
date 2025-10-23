class miniprofile extends HTMLElement {

    connectedCallback() {
        const name = this.getAttribute('name') || 'default-name';
        const gender = this.getAttribute('gender') || 'gender';
        const img = this.getAttribute('img') || 'img/image.jpeg';
        this.innerHTML = `
            
                    <img src="${img}" alt="OthersProfile"> 
                    <p class="name">${name}</p>
                    <p>${gender}</p>
                
        `;
    }
}
customElements.define('nm-mini-profile', miniprofile);