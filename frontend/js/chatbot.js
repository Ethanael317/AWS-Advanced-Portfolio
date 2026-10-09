```javascript
/**
 * Portfolio Chatbot
 *
 * Sends user messages to a backend API and displays the response.
 * Configure CHAT_API_ENDPOINT with your own backend endpoint.
 *
 * Important:
 * Never place OpenAI API keys or other secrets in frontend code.
 * The backend should handle authentication and AI API requests.
 */

const CHAT_API_ENDPOINT = 'YOUR_CHAT_API_ENDPOINT';

class Chatbot {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.closeBtn = document.getElementById('chatbot-close');
    }

    bindEvents() {
        this.toggle?.addEventListener('click', () => this.toggleWindow());
        this.closeBtn?.addEventListener('click', () => this.closeWindow());
        this.sendBtn?.addEventListener('click', () => this.sendMessage());

        this.input?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleWindow() {
        this.window?.classList.toggle('hidden');

        if (!this.window?.classList.contains('hidden')) {
            this.input?.focus();
        }
    }

    closeWindow() {
        this.window?.classList.add('hidden');
    }

    async sendMessage() {
        const message = this.input?.value.trim();

        if (!message) return;

        if (
            !CHAT_API_ENDPOINT ||
            CHAT_API_ENDPOINT === 'YOUR_CHAT_API_ENDPOINT'
        ) {
            this.addMessage(
                'The chatbot has not been configured with a backend endpoint yet.',
                'bot'
            );
            return;
        }

        this.addMessage(message, 'user');
        this.input.value = '';
        this.setLoading(true);

        try {
            const response = await fetch(CHAT_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error(`Chat API request failed (${response.status})`);
            }

            const data = await response.json();

            if (typeof data.message !== 'string' || !data.message.trim()) {
                throw new Error('The chat API returned an invalid response.');
            }

            this.addMessage(data.message, 'bot');
        } catch (error) {
            // Log the error without logging the user's message or API response.
            console.error('Chatbot request failed:', error.message);

            this.addMessage(
                'Sorry, I’m having trouble connecting right now. Please try again later.',
                'bot'
            );
        } finally {
            this.setLoading(false);
            this.input?.focus();
        }
    }

    setLoading(isLoading) {
        if (this.sendBtn) {
            this.sendBtn.disabled = isLoading;
        }

        if (this.input) {
            this.input.disabled = isLoading;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        // textContent prevents returned text from being interpreted as HTML.
        messageDiv.textContent = text;

        this.messages?.appendChild(messageDiv);

        if (this.messages) {
            this.messages.scrollTop = this.messages.scrollHeight;
        }
    }
}

// Initialize after the page's HTML has loaded.
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
```
