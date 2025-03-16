# Setup Instructions

This document provides detailed setup instructions for the React Three.js Board Game Starter project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation Steps

### 1. Clone or Download the Project

If you received the project as a zip file, extract it to your desired location.

### 2. Install Server Dependencies

```bash
# Navigate to the server directory
cd board-game-starter/server

# Install dependencies
npm install
```

### 3. Install Client Dependencies

```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install
```

### 4. Start the Server

```bash
# Navigate to the server directory
cd ../server

# Start the server
node index.js
```

You should see a message indicating that the server is running on port 3001.

### 5. Start the Client

In a new terminal window:

```bash
# Navigate to the client directory
cd board-game-starter/client

# Start the development server
npm run dev
```

This will start the Vite development server and provide you with a local URL (typically http://localhost:5173).

### 6. Access the Game

Open your web browser and navigate to the URL provided by the Vite development server.

## Testing Multiplayer Functionality

To test the multiplayer functionality:

1. Open the game in two different browser windows or tabs
2. In the first window, click "Create New Game" to generate a game code
3. In the second window, enter the game code and click "Join Game"
4. You should now be able to play the game with both windows representing different players

## Troubleshooting

### Connection Issues

If you experience connection issues:

1. Ensure the server is running on port 3001
2. Check that there are no firewall restrictions blocking the connection
3. Verify that the client is configured to connect to the correct server URL (http://localhost:3001)

### Dependency Issues

If you encounter dependency issues:

1. Delete the `node_modules` directory in both client and server folders
2. Run `npm install` again in both directories

## Development Tips

- The GameTester component provides a debugging panel to help verify game functionality
- You can modify the board layout in the Board.jsx component
- Game rules and logic can be adjusted in the server/index.js file
- Styling can be customized in the App.css file
