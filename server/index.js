const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active game sessions
const games = {};

// Generate a random 6-character game code
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new game
  socket.on('create-game', () => {
    const gameCode = generateGameCode();
    games[gameCode] = {
      players: [{ id: socket.id, position: 0 }],
      currentTurn: 0
    };
    
    socket.join(gameCode);
    socket.emit('game-created', { gameCode });
    console.log(`Game created with code: ${gameCode}`);
  });

  // Join an existing game
  socket.on('join-game', ({ gameCode }) => {
    const game = games[gameCode];
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (game.players.length >= 2) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }
    
    game.players.push({ id: socket.id, position: 0 });
    socket.join(gameCode);
    
    // Notify all players that someone joined
    io.to(gameCode).emit('player-joined', { 
      players: game.players,
      currentTurn: game.currentTurn
    });
    
    console.log(`Player joined game: ${gameCode}`);
  });

  // Roll dice and move player
  socket.on('roll-dice', ({ gameCode }) => {
    const game = games[gameCode];
    
    if (!game) return;
    
    const playerIndex = game.players.findIndex(player => player.id === socket.id);
    
    if (playerIndex === -1 || playerIndex !== game.currentTurn) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }
    
    // Roll dice (1-6)
    const diceValue = Math.floor(Math.random() * 6) + 1;
    
    // Update player position
    const player = game.players[playerIndex];
    player.position = Math.min(player.position + diceValue, 20); // Max position is 20
    
    // Switch turns
    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    
    // Broadcast updated game state
    io.to(gameCode).emit('game-updated', {
      players: game.players,
      currentTurn: game.currentTurn,
      lastRoll: {
        playerId: socket.id,
        diceValue
      }
    });
    
    // Check for winner
    if (player.position === 20) {
      io.to(gameCode).emit('game-over', { winnerId: socket.id });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove player from any games
    for (const gameCode in games) {
      const game = games[gameCode];
      const playerIndex = game.players.findIndex(player => player.id === socket.id);
      
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        
        if (game.players.length === 0) {
          // Delete empty games
          delete games[gameCode];
          console.log(`Game ${gameCode} deleted (no players)`);
        } else {
          // Update current turn if needed
          if (game.currentTurn >= game.players.length) {
            game.currentTurn = 0;
          }
          
          // Notify remaining players
          io.to(gameCode).emit('player-left', {
            players: game.players,
            currentTurn: game.currentTurn
          });
        }
        
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
