import {api} from './apiClient.js';

class ComProfSet extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.bindEvents();
    }

    render() {
        this.innerHTML = `
            <style>
                a {
                    text-decoration: none;
                    color: inherit;
                }

                .item {
                    padding: 8px 12px;
                    cursor: pointer;
                    border-radius: 6px;
                }

                .item:hover {
                    background: rgba(0,0,0,0.05);
                }

                .logout h4 {
                    color: #CF0F47;
                }

                .delete h4 {
                    color: #E03A3A;
                }

            </style>

            <a href="#profile">
                <div class="item">
                    <h4>Profile</h4>
                </div>
            </a>

            <div class="item logout">
                <h4>Log out</h4>
            </div>

            <div class="item delete">
                <h4>Delete account</h4>
            </div>
        `;
    }

    bindEvents() {
        const logoutEl = this.querySelector('.logout');
        const deleteEl = this.querySelector('.delete');
        const input = document.getElementById('prof');

        if (input){
            input.addEventListener('click', () =>{
                if(input.checked)
                    this.render();
                else this.innerHTML = ``;
            });
            
        }
        if (logoutEl) {
            logoutEl.addEventListener('click', () => {
                api.logout()
                    .then( () =>{
                        window.location.href = '/'
                    }
                    ).catch(e => {
                        console.error('Logout failed:', e);
                    });
            });
        }

        if (deleteEl) {
            deleteEl.addEventListener('click', async () => {
                const ok = window.confirm('Дансаа устгах уу? Энэ үйлдлийг буцаах боломжгүй.');
                if (!ok) return;

                try {
                    const res = await fetch('/api/users/me', {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`HTTP ${res.status}: ${text}`);
                    }

                    // Амжилттай устгасан бол login/home рүү явуулна
                    window.location.href = '/signup'; // эсвэл '/'
                } catch (e) {
                    console.error('Delete account failed:', e);
                    alert('Аккаунт устгахад алдаа гарлаа.');
                }
            });
        }
    }

    disconnectedCallback() {
        // Хэрэв дараа нь event listener-үүдээ цэвэрлэмээр байвал энд хадгалсан ref-үүдээ removeEventListener хийнэ
    }

    attributeChangedCallback(name, oldVal, newVal) {
        // Хэрвээ ирээдүйд attribute-аар (жишээ нь redirect-url гэх мэт) удирдмаар байвал энд хийж болно
    }

    adoptedCallback() {
        // Document хооронд нүүх үед хэрэг болно
    }

    // Хэрэв attribute-ыг ажиглах бол:
    // static get observedAttributes() { return ['logout-redirect', 'delete-redirect']; }
}

window.customElements.define('com-profset', ComProfSet);
