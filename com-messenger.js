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
                       header {
                            display: flex;
                            width: calc(100%-8px);
                            background: linear-gradient(to top, #EE0067, #BC2265);
                            height: 55px;
                            align-items: center;

                            & svg.logo {
                                margin: 10px;
                                margin-right: 0px;
                            }

                            &>div {
                                display: flex;
                                align-items: center;
                                gap: 10px;
                                margin-right: auto;
                                color: white;
                            }

                            &>a {
                                margin-right: 20px;
                            }
                        }

                        header nav {
                            display: flex;


                            justify-content: flex-end;
                            font-family: var(--font-header);
                            align-self: flex-end;

                            ul {
                                display: flex;
                                justify-content: space-around;
                                list-style: none;
                                gap: 15px;
                                padding: 15px 20px;

                                a {
                                    display: flex;
                                    color: white;
                                    text-decoration: none;
                                    font-size: 20px;
                                    font-weight: 600;
                                }
                            }

                            width: 100%;
                            height: 55px;
                            background: linear-gradient(to top, #EE0067, #BC2265);
                            justify-content: space-between;
                            align-items: center;
                            gap: 20px
                        }

                        header nav div {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }

                        header nav div h1 {
                            color: #F5F5F5;
                        }

                        header nav div a img {
                            height: 30px;
                            width: 140px;
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

                .chat-user-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
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
                    background: rgb(250, 233, 236);
                    color: #262626;
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
                                    <div class="story-avatar">
                                        <img src="img/profile2.jpg" alt="Story">
                                    </div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar">
                                        <img src="img/profile3.jpg" alt="Story">
                                    </div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar">
                                        <img src="img/profile4.jpg" alt="Story">
                                    </div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar">
                                        <img src="img/profile5.jpg" alt="Story">
                                    </div>
                                    <div class="story-name"></div>
                                </div>
                                <div class="story-profile">
                                    <div class="story-avatar">
                                        <img src="img/image.jpeg" alt="Story">
                                    </div>
                                    <div class="story-name"></div>
                                </div>
                            </div>
                        </div>

                        <div class="conversation-list">
                            <div class="conversation-item is-active" data-user="Тэмүүжин" data-avatar="img/profile2.jpg">
                                <div class="conversation-avatar">
                                    <img src="img/profile2.jpg" alt="Тэмүүжин">
                                </div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Тэмүүжин</div>
                                    <div class="conversation-snippet">Сайн уу, яаж байна?</div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item" data-user="Jennie Kim" data-avatar="img/profile3.jpg">
                                <div class="conversation-avatar">
                                    <img src="img/profile3.jpg" alt="Jennie Kim">
                                </div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Jennie Kim</div>
                                    <div class="conversation-snippet">See you tomorrow!</div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item" data-user="Анударь" data-avatar="img/profile4.jpg">
                                <div class="conversation-avatar">
                                    <img src="img/profile4.jpg" alt="Анударь">
                                </div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Анударь</div>
                                    <div class="conversation-snippet">Маргааш уулзъя</div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>

                            <div class="conversation-item" data-user="Үүрээ" data-avatar="img/profile5.jpg">
                                <div class="conversation-avatar">
                                    <img src="img/profile5.jpg" alt="Үүрээ">
                                </div>
                                <div class="conversation-text">
                                    <div class="conversation-name">Үүрээ</div>
                                    <div class="conversation-snippet">Баярлалаа!</div>
                                </div>
                                <div class="conversation-status"></div>
                            </div>
                        </div>
                    </aside>

                    <section class="chat-panel">
                        <header class="chat-header">
                            <button class="back-btn" aria-label="Back">‹</button>
                            <div class="chat-user-avatar">
                                <img src="img/profile2.jpg" alt="User" id="headerAvatar">
                            </div>
                            <div class="chat-user-info">
                                <div class="chat-user-name">Тэмүүжин</div>
                                <div class="chat-user-status">
                                    <span class="status-dot"></span>
                                    <span>Active now</span>
                                </div>
                            </div>
                        </header>

                        <div class="chat-body" id="chatBody">
                            <div class="message-row incoming">
                                <div class="message-avatar">
                                    <img src="img/profile2.jpg" alt="User" class="incoming-avatar">
                                </div>
                                <div class="message-bubble">Сайн уу! Яаж байна?</div>
                            </div>
                            <div class="message-row outgoing">
                                <div class="message-bubble">Сайн байна! Чи яаж байна?</div>
                            </div>
                            <div class="message-row incoming">
                                <div class="message-avatar">
                                    <img src="img/profile3.jpg" alt="User" class="incoming-avatar">
                                </div>
                                <div class="message-bubble">Би ч бас сайн. Маргааш уулзах уу?</div>
                            </div>
                        </div>

                        <footer class="chat-footer">
                            <div class="attachments-bar">
                                <button type="button" class="icon-btn" title="Photo/Video">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z"
                                            fill="#262626" />
                                        <path
                                            d="M2.75 12C2.75 9.62 2.75 7.91 2.93 6.61C3.10 5.34 3.43 4.56 4 4C4.56 3.43 5.34 3.10 6.61 2.93C7.91 2.75 9.62 2.75 12 2.75C14.38 2.75 16.09 2.75 17.39 2.93C18.66 3.10 19.44 3.43 20 4C20.56 4.56 20.90 5.34 21.07 6.61C21.25 7.91 21.25 9.62 21.25 12C21.25 14.38 21.25 16.09 21.07 17.39C20.90 18.66 20.56 19.44 20 20C19.44 20.56 18.66 20.90 17.39 21.07C16.09 21.25 14.38 21.25 12 21.25C9.62 21.25 7.91 21.25 6.61 21.07C5.34 20.90 4.56 20.56 4 20C3.43 19.44 3.10 18.66 2.93 17.39C2.75 16.09 2.75 14.38 2.75 12Z"
                                            stroke="#262626" stroke-width="1.5" />
                                    </svg>
                                </button>
                                <button type="button" class="icon-btn" title="Emoji">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="#262626" stroke-width="1.5" />
                                        <path d="M9 16C9.85 16.63 10.88 17 12 17C13.12 17 14.15 16.63 15 16" stroke="#262626"
                                            stroke-width="1.5" stroke-linecap="round" />
                                        <circle cx="15" cy="10" r="1" fill="#262626" />
                                        <circle cx="9" cy="10" r="1" fill="#262626" />
                                    </svg>
                                </button>
                            </div>

                            <form class="message-form" id="messageForm">
                                <input type="text" class="message-input" id="messageInput" placeholder="Message..."
                                    autocomplete="off" />
                                <button type="submit" class="send-btn">Send</button>
                            </form>
                        </footer>
                    </section>
                </div>
            </main>

        `;

        // 2) Add behavior scoped to THIS component
        let currentUserAvatar = 'https://i.pravatar.cc/150?img=12';

        // Message sending functionality
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        const chatBody = document.getElementById('chatBody');

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = messageInput.value.trim();
            if (text) {
                const messageRow = document.createElement('div');
                messageRow.className = 'message-row outgoing';
                messageRow.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
                chatBody.appendChild(messageRow);
                messageInput.value = '';
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        });

        // HTML escape function
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Conversation switching functionality
        const conversationItems = document.querySelectorAll('.conversation-item');
        const chatUserName = document.querySelector('.chat-user-name');
        const headerAvatar = document.getElementById('headerAvatar');

        conversationItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                conversationItems.forEach(i => i.classList.remove('is-active'));
                // Add active class to clicked item
                item.classList.add('is-active');

                // Update chat header with selected user
                const userName = item.dataset.user;
                const userAvatar = item.dataset.avatar;
                chatUserName.textContent = userName;
                headerAvatar.src = userAvatar;
                currentUserAvatar = userAvatar;

                // Clear chat body and add welcome message
                chatBody.innerHTML = `
                    <div class="message-row incoming">
                        <div class="message-avatar">
                            <img src="${userAvatar}" alt="${userName}" class="incoming-avatar">
                        </div>
                        <div class="message-bubble">Сайн уу!</div>
                    </div>
                `;

                // Update all incoming avatars
                updateIncomingAvatars();
            });
        });

        // Function to update incoming message avatars
        function updateIncomingAvatars() {
            const incomingAvatars = document.querySelectorAll('.incoming-avatar');
            incomingAvatars.forEach(avatar => {
                avatar.src = currentUserAvatar;
            });
        }
    }
}

window.customElements.define('com-messenger', ComMessenger);
