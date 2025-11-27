// Энд жаахан interaction нэмье

document.addEventListener("DOMContentLoaded", () => {
    // Сайдбар дээр чат дархад идэвхжүүлэх
    const conversationItems = document.querySelectorAll(".conversation-item");
    const userNameEl = document.querySelector(".chat-user-name");

    conversationItems.forEach((item) => {
        item.addEventListener("click", () => {
            conversationItems.forEach((el) => el.classList.remove("is-active"));
            item.classList.add("is-active");

            const nameEl = item.querySelector(".conversation-name");
            if (nameEl && userNameEl) {
                userNameEl.textContent = nameEl.textContent.trim();
            }
        });
    });

    // Доорх input-оос enter дарахад шинэ гарах мессеж
    const form = document.querySelector(".message-form");
    const input = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");

    if (form && input && chatBody) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            const row = document.createElement("div");
            row.className = "message-row outgoing";

            const bubble = document.createElement("div");
            bubble.className = "message-bubble medium filled";
            bubble.textContent = text;

            row.appendChild(bubble);
            chatBody.appendChild(row);

            chatBody.scrollTop = chatBody.scrollHeight; // доош автоматаар гүйлгэнэ
            input.value = "";
        });
    }
});
