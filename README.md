# React Three.js Board Game Starter

A multiplayer board game starter project built with React, Three.js, and Socket.io. This project provides a foundation for creating isometric board games with real-time multiplayer functionality.

## Features

- 3D isometric game board with ~20 spaces
- Realistic 3D dice with rolling animation
- Multiplayer support for two players using game codes
- Real-time game state synchronization
- Smooth player movement animations
- Game testing panel for debugging

## Technologies Used

- React (with Vite)
- Three.js (with React Three Fiber & Drei)
- Socket.io for real-time communication
- Express.js for the server

## Project Structure

```
board-game-starter/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board/      # 3D game board components
│   │   │   ├── Dice/       # 3D dice components
│   │   │   ├── Game/       # Game control components
│   │   │   └── Multiplayer/ # Multiplayer functionality
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── App.css         # Application styles
│   └── package.json        # Frontend dependencies
└── server/                 # Backend server
    ├── index.js            # Express and Socket.io server
    └── package.json        # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

1. Start the server:

```bash
cd server
node index.js
```

2. In a separate terminal, start the client:

```bash
cd client
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## How to Play

1. Open the game in two different browser windows
2. In the first window, click "Create New Game" to generate a game code
3. In the second window, enter the game code and click "Join Game"
4. Players take turns rolling the dice and moving around the board
5. First player to reach space 20 wins!

## Customization

This starter project is designed to be easily customizable:

- Modify the board layout in `Board.jsx`
- Change the number of spaces or game rules in `server/index.js`
- Add new game mechanics by extending the socket events
- Customize the visual appearance in the CSS files

## License

This project is licensed under the MIT License - see the LICENSE file for details.
