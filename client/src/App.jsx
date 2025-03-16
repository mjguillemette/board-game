import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './components/Board/Board';
import Dice from './components/Dice/Dice';
import GameControls from './components/Game/GameControls';
import GameCodeSystem from './components/Multiplayer/GameCodeSystem';
import GameTester from './components/Game/GameTester';
import { useSocket } from './components/Multiplayer/SocketContext';
import './App.css';
import './components/Game/GameTester.css';

function App() {
  const { 
    gameState, 
    rollDice 
  } = useSocket();

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Three.js Board Game</h1>
        {gameState.gameCode && (
          <div className="game-code">
            Game Code: <span>{gameState.gameCode}</span>
          </div>
        )}
      </header>

      <main>
        {!gameState.isGameStarted ? (
          <GameCodeSystem />
        ) : (
          <div className="game-container">
            <div className="game-board">
              <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Board 
                  players={gameState.players} 
                  playerId={gameState.playerId}
                />
                <OrbitControls enableZoom={true} enablePan={true} />
              </Canvas>
            </div>
            
            <div className="game-controls">
              <GameCodeSystem />
              
              <GameControls 
                players={gameState.players}
                currentTurn={gameState.currentTurn}
                isMyTurn={gameState.isMyTurn}
                playerId={gameState.playerId}
                winner={gameState.winner}
              />
              
              {gameState.isMyTurn && !gameState.winner && (
                <Dice onRoll={rollDice} lastRoll={gameState.lastRoll} />
              )}
              
              {gameState.lastRoll && (
                <div className="last-roll">
                  Last Roll: {gameState.lastRoll.diceValue}
                </div>
              )}
              
              {gameState.error && (
                <div className="error-message">{gameState.error}</div>
              )}
              
              {gameState.winner && (
                <div className="winner-message">
                  {gameState.winner === gameState.playerId 
                    ? "You won!" 
                    : "Other player won!"}
                </div>
              )}
              
              {/* Game Tester Panel */}
              <GameTester />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
