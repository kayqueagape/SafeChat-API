# WebSocket Usage Guide

## Connection

To connect to the WebSocket server, you need to provide a JWT token in the connection:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token-here'
  }
});

// Or using authorization header
const socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token-here'
  }
});
```

## Events

### Join Room

```javascript
socket.emit('join_room', {
  roomId: 1
});

socket.on('joined_room', (data) => {
  console.log('Joined room:', data);
});

socket.on('user_joined', (data) => {
  console.log('User joined:', data.user.username);
});
```

### Leave Room

```javascript
socket.emit('leave_room', {
  roomId: 1
});

socket.on('user_left', (data) => {
  console.log('User left:', data.user.username);
});
```

### Send Message

```javascript
socket.emit('send_message', {
  roomId: 1,
  content: 'Hello, world!'
});

socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  console.log('From:', data.message.user.username);
});
```

### Typing Indicators

```javascript
// Start typing
socket.emit('typing', {
  roomId: 1
});

socket.on('user_typing', (data) => {
  console.log(`${data.user.username} is typing...`);
});

// Stop typing
socket.emit('stop_typing', {
  roomId: 1
});

socket.on('user_stopped_typing', (data) => {
  console.log(`${data.user.username} stopped typing`);
});
```

### Error Handling

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

## Complete Example

```javascript
import io from 'socket.io-client';

// 1. Get JWT token from login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. Connect to WebSocket
const socket = io('http://localhost:3000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Connected to server');
  
  // 3. Join a room
  socket.emit('join_room', { roomId: 1 });
});

socket.on('joined_room', (data) => {
  console.log('Joined room:', data.roomId);
});

socket.on('new_message', (data) => {
  console.log(`[${data.message.user.username}]: ${data.message.content}`);
});

// 4. Send a message
function sendMessage(roomId, content) {
  socket.emit('send_message', { roomId, content });
}

// 5. Typing indicator
let typingTimeout;
function onTyping(roomId) {
  socket.emit('typing', { roomId });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop_typing', { roomId });
  }, 3000);
}
```
