import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import Board from './components/Board/Board';
import Dice from './components/Dice/Dice';
import GameControls from './components/Game/GameControls';
import GameCodeSystem from './components/Multiplayer/GameCodeSystem';
import { useSocket } from './components/Multiplayer/SocketContext';
import './App.css';

// Debug panel - only shown when debug mode is active
import GameTester from './components/Game/GameTester';

function App() {
  const { gameState, rollDice } = useSocket();
  const [debugMode, setDebugMode] = useState(false);
  
  // Toggle debug panel
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  // Handle roll with final value
  const handleRoll = (value) => {
    rollDice(value);
  };

  // Determine player numbers (which player is player1/player2)
  const getPlayerType = (index) => {
    return index === 0 ? 'player1' : 'player2';
  };
  
  // Check if enough players to start the game
  const hasEnoughPlayers = gameState.players.length >= 2;
  
  // Find my player index
  const myPlayerIndex = gameState.players.findIndex(player => player.id === gameState.playerId);

  return (
    <div className="app">
      {/* Full screen canvas */}
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
          <Environment preset="sunset" />
          <Board 
            players={gameState.players} 
            playerId={gameState.playerId}
          />
          <Preload all />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* Header Section with Game Info */}
        <header className="app-header">
          <div className="logo">
            <div className="logo-icon"></div>
            <h1>BOARD QUEST</h1>
          </div>
          {gameState.gameCode && (
            <div className="game-code-header">
              <span className="code-label">CODE</span>
              <span className="code-value">{gameState.gameCode}</span>
            </div>
          )}
        </header>

        {/* Main UI Section */}
        <main className="main-content">
          {!gameState.isGameStarted ? (
            <div className="game-setup-panel">
              <GameCodeSystem />
            </div>
          ) : (
            <div className="game-ui">
              <div className="game-status-panel">
                <GameControls 
                  players={gameState.players}
                  currentTurn={gameState.currentTurn}
                  isMyTurn={gameState.isMyTurn}
                  playerId={gameState.playerId}
                  winner={gameState.winner}
                />
              </div>
              
              {/* Dice Panel - Show both player dice when game has enough players */}
              {hasEnoughPlayers && !gameState.winner && (
                <div className="dice-panel">
                  {gameState.players.map((player, index) => (
                    <Dice 
                      key={player.id}
                      onRoll={handleRoll}
                      lastRoll={gameState.lastRoll}
                      playerType={getPlayerType(index)}
                      isCurrentTurn={gameState.currentTurn === index}
                      playerId={gameState.playerId}
                      isMyDice={player.id === gameState.playerId}
                    />
                  ))}
                </div>
              )}
              
              {gameState.error && (
                <div className="notification error-notification">
                  <span className="notification-message">{gameState.error}</span>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Debug Panel */}
        {debugMode && <GameTester />}

        {/* Debug Toggle */}
        <button className="debug-toggle" onClick={toggleDebugMode}>
          {debugMode ? 'Hide Debug' : 'Debug'}
        </button>
      </div>
    </div>
  );
}

export default App;