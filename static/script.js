// DOM Elements - cached for performance
const messages = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');



// Send message on button click or Enter key
function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Add user message immediately
    addMessage(text, 'user');
    input.value = '';
    
    // Show typing indicator
    showTyping();

    // API call
    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(response => response.json())
    .then(data => {
        removeTyping();
        addMessage(data.reply, 'bot');
    })
    .catch(() => {
        removeTyping();
        addMessage('⚠️ Sorry, something went wrong. Please try again!', 'bot');
    });
}

// Add message to chat (optimized DOM manipulation)
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing';
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = `
        <div class="typing">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

// XSS protection
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners (Event Delegation)
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-focus input
input.focus();
