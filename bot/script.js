/**
 * Portfolio AI Chatbot — frontend client
 */

const CHAT_API_URL = 'https://msohaibkhan-portfolio-ai-backend.hf.space/chat';

const messagesContainer = document.getElementById('chatbot-messages');
const chatInput = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('chatbot-send-btn');

let isSending = false;
let thinkingEl = null;

function toggleChatbot() {
    const chatBox = document.getElementById('chatbot-box');
    const overlay = document.getElementById('intro-overlay');

    if (!chatBox || !overlay) {
        console.log("Element nahi mila!");
        return;
    }

    if (chatBox.classList.contains('chatbot-hidden')) {
        // Orb animation dikhao
        overlay.style.display = 'flex';

        // 3 second baad chatbox kholo
        setTimeout(() => {
            overlay.style.display = 'none';
            chatBox.classList.remove('chatbot-hidden');
            chatBox.classList.add('chatbot-visible');
        }, 3000);

    } else {
        chatBox.classList.remove('chatbot-visible');
        chatBox.classList.add('chatbot-hidden');
    }
}
sendBtn?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

function appendMessage(text, role) {
  if (!messagesContainer) return null;
  const el = document.createElement('div');
  el.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;
  el.textContent = text;
  messagesContainer.appendChild(el);
  scrollToBottom();
}

function scrollToBottom() {
  if (!messagesContainer) return;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showThinking() {
  removeThinking();
  thinkingEl = document.createElement('div');
  thinkingEl.id = 'thinking-indicator';
  thinkingEl.className = 'message bot-message thinking-message';
  thinkingEl.innerHTML = '<img src="bg-video.webp" style="width: 30px; vertical-align: middle;"> Thinking...';
  messagesContainer.appendChild(thinkingEl);
  scrollToBottom();
}

function removeThinking() {
  if (thinkingEl?.parentNode) {
    thinkingEl.parentNode.removeChild(thinkingEl);
  }
  thinkingEl = null;
}

function setInputEnabled(enabled) {
  if (chatInput) chatInput.disabled = !enabled;
  if (sendBtn) sendBtn.disabled = !enabled;
}

async function sendMessage() {
  if (!chatInput || isSending) return;
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  chatInput.value = '';
  isSending = true;
  setInputEnabled(false);
  showThinking();

  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    removeThinking();

    if (response.ok) {
      appendMessage(data.response, 'bot');
    } else {
      appendMessage('Server Error: ' + (data.detail || 'Unknown error'), 'bot');
    }
  } catch (error) {
    removeThinking();
    appendMessage('Error: Cannot reach server.', 'bot');
  } finally {
    isSending = false;
    setInputEnabled(true);
    chatInput?.focus();
  }
}