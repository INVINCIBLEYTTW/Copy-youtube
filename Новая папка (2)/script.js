const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.querySelector('.chat-messages');

sendButton.addEventListener('click', async () => {
  const message = messageInput.value.trim();
  if (message !== '') {
    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, username: 'anonymous' }),
      });
      const data = await response.json();
      if (data.success) {
        chatMessages.innerHTML += `
          <div class="message">
            <span class="username">${data.username}:</span>
            <span class="text">${data.message}</span>
          </div>
        `;
        messageInput.value = '';
      } else {
        console.error('Ошибка отправки сообщения:', data.error);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }
});

// Получаем сообщения из базы данных
async function getMessages() {
  try {
    const response = await fetch('/api/getMessages');
    const data = await response.json();
    chatMessages.innerHTML = '';
    data.messages.forEach((message) => {
      chatMessages.innerHTML += `
        <div class="message">
          <span class="username">${message.username}:</span>
          <span class="text">${message.text}</span>
        </div>
      `;
    });
  } catch (error) {
    console.error('Ошибка получения сообщений:', error);
  }
}

getMessages();
