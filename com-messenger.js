// com-messenger.js
class ComMessenger extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 1) Render your existing HTML
        this.innerHTML = `
                <style>
                    *,
                    *::before,
                    *::after {
                        box-sizing: border-box;
                    }

                    main {
                        padding: 0;
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    .chat-app {
                        width: 100%;
                        height: calc(100vh - 55px);
                        background: #FFFFFF;
                        display: flex;
                        overflow: hidden;
                    }

                    /* SIDEBAR */
                    .sidebar {
                        width: 350px;
                        background: #FFFFFF;
                        border-right: 1px solid #DBDBDB;
                        display: flex;
                        flex-direction: column;
                    }

                    /* Stories */
                    .stories-header {
                        padding: 16px 20px;
                        border-bottom: 1px solid #EFEFEF;
                    }

                    .stories-scroll {
                        display: flex;
                        gap: 16px;
                        overflow-x: auto;
                    }

                    .stories-scroll::-webkit-scrollbar {
                        display: none;
                    }

                    .story-profile {
                        min-width: 64px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        cursor: pointer;
                    }

                    .story-avatar {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: #E0E0E0;
                        overflow: hidden;
                    }

                    .story-avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .story-name {
                        margin-top: 6px;
                        width: 48px;
                        height: 4px;
                        border-radius: 2px;
                        background: #DBDBDB;
                    }

                    /* Conversations */
                    .conversation-list {
                        padding: 8px 0;
                        overflow-y: auto;
                        flex: 1;
                    }

                    .conversation-list::-webkit-scrollbar {
                        width: 0;
                    }

                    .conversation-item {
                        display: flex;
                        align-items: center;
                        padding: 8px 16px;
                        cursor: pointer;
                        transition: background 0.15s ease;
                    }

                    .conversation-item:hover {
                        background: #FAFAFA;
                    }

                    .conversation-item.is-active {
                        background: #EFEFEF;
                    }

                    .conversation-avatar {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        margin-right: 12px;
                        flex-shrink: 0;
                        overflow: hidden;
                    }

                    .conversation-avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .conversation-text {
                        flex: 1;
                        min-width: 0;
                    }

                    .conversation-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: #262626;
                        margin-bottom: 4px;
                        font-family: 'Roboto Condensed', sans-serif;
                    }

                    .conversation-snippet {
                        font-size: 13px;
                        color: #8E8E8E;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .conversation-status {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #44B700;
                        margin-left: 8px;
                        flex-shrink: 0;
                    }

                    /* CHAT PANEL */
                    .chat-panel {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        background: #FFFFFF;
                    }

                    .chat-header {
                        background: #FFFFFF;
                        border-bottom: 1px solid #DBDBDB;
                        height: 72px;
                        display: flex;
                        align-items: center;
                        padding: 0 20px;
                    }

                    .back-btn {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: none;
                        margin-right: 12px;
                        background: transparent;
                        color: #262626;
                        font-size: 28px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        transition: background 0.2s ease;
                    }

                    .back-btn:hover {
                        background: #FAFAFA;
                    }

                    .chat-user-avatar {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        background: #E0E0E0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;
                        overflow: hidden;
                    }

                    .chat-user-avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .chat-user-name {
                        font-size: 16px;
                        font-weight: 600;
                        color: #262626;
                        font-family: 'Roboto Condensed', sans-serif;
                    }

                    .chat-user-status {
                        margin-top: 2px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 12px;
                        color: #8E8E8E;
                    }

                    .status-dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #44B700;
                    }

                    /* Messages */
                    .chat-body {
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .chat-body::-webkit-scrollbar {
                        width: 6px;
                    }

                    .chat-body::-webkit-scrollbar-thumb {
                        background: #DBDBDB;
                        border-radius: 3px;
                    }

                    .message-row {
                        display: flex;
                        gap: 8px;
                        align-items: flex-start;
                    }

                    .message-row.incoming {
                        justify-content: flex-start;
                    }

                    .message-row.outgoing {
                        justify-content: flex-end;
                    }

                    .message-avatar {
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        flex-shrink: 0;
                        overflow: hidden;
                    }

                    .message-avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .message-bubble {
                        max-width: 60%;
                        min-height: 36px;
                        padding: 10px 14px;
                        border-radius: 18px;
                        font-size: 14px;
                        line-height: 18px;
                        word-wrap: break-word;
                    }

                    .message-row.incoming .message-bubble {
                        background: #EFEFEF;
                        color: #262626;
                    }

                    .message-row.outgoing .message-bubble {
                        background: #EE0067;
                        color: #FFFFFF;
                    }

                    /* FOOTER */
                    .chat-footer {
                        padding: 16px 20px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: #FFFFFF;
                        border-top: 1px solid #EFEFEF;
                    }

                    .attachments-bar {
                        display: flex;
                        gap: 8px;
                    }

                    .icon-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        border: none;
                        background: transparent;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.2s ease;
                    }

                    .icon-btn:hover {
                        background: #FAFAFA;
                    }

                    .icon-btn svg {
                        width: 20px;
                        height: 20px;
                    }

                    .icon-btn svg path {
                        fill: #262626;
                        stroke: #262626;
                    }

                    .message-form {
                        display: flex;
                        flex: 1;
                        gap: 8px;
                    }

                    .message-input {
                        flex: 1;
                        border-radius: 22px;
                        border: 1px solid #DBDBDB;
                        padding: 10px 16px;
                        font-size: 14px;
                        outline: none;
                        font-family: 'Roboto Condensed', sans-serif;
                        transition: border 0.2s ease;
                        background: #FAFAFA;
                    }

                    .message-input:focus {
                        border-color: #A8A8A8;
                        background: #FFFFFF;
                    }

                    .message-input::placeholder {
                        color: #8E8E8E;
                    }

                    .send-btn {
                        min-width: 60px;
                        height: 36px;
                        border-radius: 18px;
                        border: none;
                        background: transparent;
                        color: #EE0067;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        font-family: 'Roboto Condensed', sans-serif;
                        transition: opacity 0.2s ease;
                    }

                    .send-btn:hover {
                        opacity: 0.7;
                    }

                    .send-btn:disabled {
                        opacity: 0.3;
                        cursor: default;
                    }

                    /* RESPONSIVE */
                    @media (max-width: 960px) {
                        .sidebar {
                            display: none;
                        }
                    }
                </style>
            <main>
                <div class="chat-app">
                    <aside class="sidebar">
                        <div class="stories-header">
                            <div class="stories-scroll">
                                <div class="story-profile">
                                    <div class="story-avatar"></div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar"></div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar"></div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar"></div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar"></div>
                                    <div class="story-name"></div>
                                </div>
                            </div>
                        </div>

                        <div class="conversation-list">
                            <div class="conversation-item is-active">
                                <div class="conversation-avatar"></div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Тэмүүжин</div>
                                    <div class="conversation-snippet"></div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item">
                                <div class="conversation-avatar"></div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Jennie Kim</div>
                                    <div class="conversation-snippet"></div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item">
                                <div class="conversation-avatar"></div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Анударь</div>
                                    <div class="conversation-snippet"></div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item">
                                <div class="conversation-avatar"></div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Үүрээ</div>
                                    <div class="conversation-snippet"></div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>
                        </div>
                    </aside>

                    <section class="chat-panel">
                        <header class="chat-header">
                            <button class="back-btn" aria-label="Back">‹</button>

                            <div class="chat-user-avatar">
                                <span><img src="img/image.jpeg" alt=""></span>
                            </div>

                            <div class="chat-user-info">
                                <div class="chat-user-name">Тэмүүжин</div>
                                <div class="chat-user-status">
                                    <span class="status-dot"></span>
                                    <span>Active now</span>
                                </div>
                            </div>
                        </header>

                        <div class="chat-body">
                            <!-- messages will be appended here -->
                        </div>

                        <footer class="chat-footer">
                            <div class="attachments-bar">
                                <button type="button" class="icon-btn">
                                    <!-- your SVGs kept as-is -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 14.2857C13.4229 14.2857 14.5714 13.1371 14.5714 11.7143V6.57143C14.5714 5.14857 13.4229 4 12 4C10.5771 4 9.42857 5.14857 9.42857 6.57143V11.7143C9.42857 13.1371 10.5771 14.2857 12 14.2857Z" fill="#000000" />
                                        <path d="M16.5429 11.7143H18C18 14.6371 15.6686 17.0543 12.8571 17.4743V20.2857H11.1429V17.4743C8.33143 17.0543 6 14.6371 6 11.7143H7.45714C7.45714 14.2857 9.63429 16.0857 12 16.0857C14.3657 16.0857 16.5429 14.2857 16.5429 11.7143Z" fill="#000000" />
                                    </svg>
                                </button>

                                <!-- second icon -->
                                <button type="button" class="icon-btn">
                                    <!-- SVG... -->
                                </button>

                                <!-- third icon -->
                                <button type="button" class="icon-btn">
                                    <!-- SVG... -->
                                </button>
                            </div>

                            <form class="message-form">
                                <input type="text" class="message-input" placeholder="type message" autocomplete="off" />
                                <button type="submit" class="send-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 -0.5 25 25" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M18.455 9.8834L7.063 4.1434C6.76535 3.96928 6.40109 3.95274 6.08888 4.09916C5.77667 4.24558 5.55647 4.53621 5.5 4.8764C5.5039 4.98942 5.53114 5.10041 5.58 5.2024L7.749 10.4424C7.85786 10.7903 7.91711 11.1519 7.925 11.5164C7.91714 11.8809 7.85789 12.2425 7.749 12.5904L5.58 17.8304C5.53114 17.9324 5.5039 18.0434 5.5 18.1564C5.55687 18.4961 5.77703 18.7862 6.0889 18.9323C6.40078 19.0785 6.76456 19.062 7.062 18.8884L18.455 13.1484C19.0903 12.8533 19.4967 12.2164 19.4967 11.5159C19.4967 10.8154 19.0903 10.1785 18.455 9.8834V9.8834Z"
                                            stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </footer>
                    </section>
                </div>
            </main>
        `;

        // 2) Add behavior scoped to THIS component

        const root = this;

        // Sidebar: switch active conversation + change header name
        const conversationItems = root.querySelectorAll('.conversation-item');
        const userNameEl = root.querySelector('.chat-user-name');

        conversationItems.forEach((item) => {
            item.addEventListener('click', () => {
                conversationItems.forEach((el) => el.classList.remove('is-active'));
                item.classList.add('is-active');

                const nameEl = item.querySelector('.conversation-name');
                if (nameEl && userNameEl) {
                    userNameEl.textContent = nameEl.textContent.trim();
                }
            });
        });

        // Chat form: send message → append bubble in chat-body
        const form = root.querySelector('.message-form');
        const input = root.querySelector('.message-input');
        const chatBody = root.querySelector('.chat-body');

        if (form && input && chatBody) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const text = input.value.trim();
                if (!text) return;

                const row = document.createElement('div');
                row.className = 'message-row outgoing';

                const bubble = document.createElement('div');
                bubble.className = 'message-bubble medium filled';
                bubble.textContent = text;

                row.appendChild(bubble);
                chatBody.appendChild(row);

                // auto scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
                input.value = '';
            });
        }

        // (optional) back button – e.g., go back to conversation list on mobile
        const backBtn = root.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // you can add mobile-specific behavior here
                console.log('Back pressed');
            });
        }
    }
}

window.customElements.define('com-messenger', ComMessenger);
