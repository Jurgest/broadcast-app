# Broadcast App Server

Backend server for the Cross-Tab Collaboration Dashboard built with Express.js and Socket.io.

## Features

- Real-time WebSocket communication
- RESTful API endpoints
- Session management
- Message handling with expiration
- User presence tracking
- Shared counter synchronization
- Error handling and validation
- Rate limiting and security middleware

## API Endpoints

### Sessions

- `POST /api/sessions` - Create a new session
- `GET /api/sessions/:sessionId` - Get session information
- `POST /api/sessions/:sessionId/join` - Join a session
- `POST /api/sessions/:sessionId/leave` - Leave a session

### Messages

- `GET /api/messages/:sessionId` - Get messages for a session
- `POST /api/messages/:sessionId` - Send a message
- `DELETE /api/messages/:sessionId/:messageId` - Delete a message

### Users

- `GET /api/users/:sessionId` - Get active users in session
- `POST /api/users/:sessionId/activity` - Update user activity

### Counter

- `GET /api/counter/:sessionId` - Get counter value
- `POST /api/counter/:sessionId` - Update counter value

## Socket Events

### Client to Server

- `join-session` - Join a session
- `send-message` - Send a message
- `delete-message` - Delete a message
- `update-counter` - Update counter value
- `typing` - Indicate typing status

### Server to Client

- `user-joined` - User joined session
- `user-left` - User left session
- `new-message` - New message received
- `message-deleted` - Message was deleted
- `messages-expired` - Messages expired
- `counter-updated` - Counter value updated
- `user-typing` - User typing status
- `session-state` - Current session state

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Start production server:

```bash
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Client URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)

## Architecture

- **Routes**: Handle HTTP API requests
- **Controllers**: Business logic for each endpoint
- **Middleware**: Request validation, error handling, security
- **Utils**: Helper functions and utilities
- **Socket.io**: Real-time WebSocket communication

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- Content sanitization
- Error handling without exposing sensitive information
