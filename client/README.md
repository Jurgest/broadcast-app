# Cross-Tab Collaboration Dashboard - Client

A React application built with Vite, TypeScript, and Tailwind CSS that demonstrates real-time collaboration across multiple browser tabs.

## Features

### ✅ Core Requirements (Implemented)

1. **Custom Hook (`useCollaborativeSession`)**

   - Sets up broadcast channel communication
   - Manages internal state for users, chat, counter
   - Exposes actions: `sendMessage()`, `updateCounter()`, `markTyping()`, etc.
   - Uses Socket.io for real-time communication
   - Handles cross-tab synchronization

2. **User Presence System**

   - Detects and displays active users
   - Shows username, last activity timestamp
   - Visual indicators for user join/leave events
   - Real-time user list updates

3. **Shared Counter**

   - Counter synchronized across all tabs
   - Increment/decrement functionality
   - Shows who performed the last action
   - Displays timestamp of last action

4. **Real-time Chat**

   - Text area for message writing
   - Typing indicators when users are actively typing
   - Message synchronization across tabs
   - User identification and timestamps
   - Delete own messages functionality
   - Message expiration feature (1, 5, 15, 30, 60 minutes)

5. **Technical Standards**
   - Proper error handling and cleanup
   - TypeScript with strong typing
   - Modular, reusable components and hooks
   - State synchronization on page load
   - Clean, readable code structure

### ✅ Bonus Features (Implemented)

- **Theme sync across tabs** (light/dark mode)
- **Debouncing for frequent updates** (typing indicators)
- **Loading states** throughout the application
- **Responsive layout** for different screen sizes
- **Activity feed** showing recent actions
- **User avatar system** with generated avatars
- **Error boundary** for graceful error handling
- **Session management** with join/leave functionality

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **Broadcast Channel API** for cross-tab sync
- **Lucide React** for icons
- **Custom hooks** for state management

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment setup:**

   - Update `VITE_SERVER_URL` in `.env` if needed (default: http://localhost:3001)

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. **Join a Session:**

   - Enter a session ID or generate a random one
   - Choose a username or generate a random one
   - Click "Join Session"

2. **Test Cross-Tab Sync:**

   - Click "New Tab" button to open another tab
   - Observe real-time synchronization between tabs
   - Try different actions in each tab

3. **Features to Test:**
   - Send messages and see them appear in other tabs
   - Use typing indicators
   - Increment/decrement the counter
   - Delete your own messages
   - Switch themes
   - Set message expiration times

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
