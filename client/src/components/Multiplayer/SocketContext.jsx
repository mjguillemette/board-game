import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create a reusable socket context to be used throughout the app
const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState({
    gameCode: '',
    players: [],
    currentTurn: 0,
    lastRoll: null,
    isGameStarted: false,
    playerId: '',
    winner: null,
    error: ''
  });

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Set up socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
      setConnected(true);
      setGameState(prev => ({
        ...prev,
        playerId: newSocket.id
      }));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('game-created', ({ gameCode }) => {
      console.log('Game created with code:', gameCode);
      setGameState(prev => ({
        ...prev,
        gameCode,
        isGameStarted: true,
        isMyTurn: true,
        players: [{ id: newSocket.id, position: 0 }],
        currentTurn: 0
      }));
    });

    newSocket.on('player-joined', ({ players, currentTurn }) => {
      console.log('Player joined, updated state:', { players, currentTurn });
      setGameState(prev => ({
        ...prev,
        players,
        currentTurn,
        isGameStarted: true, // Set isGameStarted to true when joining
        gameCode: prev.gameCode, // Ensure gameCode is preserved
        isMyTurn: players[currentTurn]?.id === newSocket.id
      }));
    });

    newSocket.on('game-updated', ({ players, currentTurn, lastRoll }) => {
      console.log('Game updated:', { players, currentTurn, lastRoll });
      setGameState(prev => ({
        ...prev,
        players,
        currentTurn,
        lastRoll,
        isMyTurn: players[currentTurn]?.id === newSocket.id
      }));
    });

    newSocket.on('player-left', ({ players, currentTurn }) => {
      console.log('Player left, updated state:', { players, currentTurn });
      setGameState(prev => ({
        ...prev,
        players,
        currentTurn,
        isMyTurn: players[currentTurn]?.id === newSocket.id
      }));
    });

    newSocket.on('game-over', ({ winnerId }) => {
      console.log('Game over, winner:', winnerId);
      setGameState(prev => ({
        ...prev,
        winner: winnerId,
        isMyTurn: false
      }));
    });

    newSocket.on('error', ({ message }) => {
      console.error('Game error:', message);
      setGameState(prev => ({
        ...prev,
        error: message
      }));
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setGameState(prev => ({ ...prev, error: '' }));
      }, 3000);
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Game actions
  const createGame = () => {
    if (socket && connected) {
      socket.emit('create-game');
    } else {
      console.error('Cannot create game: not connected to server');
    }
  };

  const joinGame = (gameCode) => {
    if (socket && connected) {
      // Update local game state immediately to set the game code
      setGameState(prev => ({
        ...prev,
        gameCode,
        // Don't set isGameStarted yet - wait for server confirmation
      }));
      socket.emit('join-game', { gameCode });
    } else {
      console.error('Cannot join game: not connected to server');
    }
  };

  const rollDice = () => {
    if (socket && connected && gameState.isMyTurn) {
      socket.emit('roll-dice', { gameCode: gameState.gameCode });
    } else {
      console.error('Cannot roll dice: not your turn or not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket,
      connected,
      gameState,
      createGame,
      joinGame,
      rollDice
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);

export default SocketContext;