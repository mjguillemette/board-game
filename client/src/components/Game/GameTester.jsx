import React from 'react';
import { useSocket } from '../Multiplayer/SocketContext';

const GameTester = () => {
  const { gameState, rollDice } = useSocket();
  
  // Function to simulate dice rolls for testing
  const testDiceRoll = () => {
    if (gameState.isMyTurn) {
      rollDice();
    }
  };
  
  return (
    <div className="game-tester">
      <h3>Game Testing Panel</h3>
      
      <div className="test-section">
        <h4>Connection Status</h4>
        <div className="status-item">
          <span>Socket Connected:</span> 
          <span className={gameState.playerId ? "status-ok" : "status-error"}>
            {gameState.playerId ? "Yes" : "No"}
          </span>
        </div>
        
        <div className="status-item">
          <span>Player ID:</span> 
          <span>{gameState.playerId || "Not connected"}</span>
        </div>
        
        <div className="status-item">
          <span>Game Started:</span> 
          <span className={gameState.isGameStarted ? "status-ok" : "status-waiting"}>
            {gameState.isGameStarted ? "Yes" : "No"}
          </span>
        </div>
        
        <div className="status-item">
          <span>Game Code:</span> 
          <span>{gameState.gameCode || "N/A"}</span>
        </div>
      </div>
      
      <div className="test-section">
        <h4>Player Status</h4>
        <div className="status-item">
          <span>Players Connected:</span> 
          <span>{gameState.players.length}</span>
        </div>
        
        <div className="status-item">
          <span>Current Turn:</span> 
          <span>Player {gameState.currentTurn + 1}</span>
        </div>
        
        <div className="status-item">
          <span>Is My Turn:</span> 
          <span className={gameState.isMyTurn ? "status-ok" : "status-waiting"}>
            {gameState.isMyTurn ? "Yes" : "No"}
          </span>
        </div>
      </div>
      
      <div className="test-section">
        <h4>Game Actions</h4>
        <button 
          onClick={testDiceRoll}
          disabled={!gameState.isMyTurn || gameState.winner}
          className="test-button"
        >
          Test Dice Roll
        </button>
      </div>
      
      <div className="test-section">
        <h4>Player Positions</h4>
        {gameState.players.map((player, index) => (
          <div key={player.id} className="status-item">
            <span>Player {index + 1}:</span> 
            <span>Position {player.position}/20</span>
          </div>
        ))}
      </div>
      
      {gameState.lastRoll && (
        <div className="test-section">
          <h4>Last Roll</h4>
          <div className="status-item">
            <span>Player:</span> 
            <span>{gameState.lastRoll.playerId === gameState.playerId ? "You" : "Opponent"}</span>
          </div>
          <div className="status-item">
            <span>Value:</span> 
            <span>{gameState.lastRoll.diceValue}</span>
          </div>
        </div>
      )}
      
      {gameState.winner && (
        <div className="test-section winner-section">
          <h4>Game Over</h4>
          <div className="status-item">
            <span>Winner:</span> 
            <span>{gameState.winner === gameState.playerId ? "You" : "Opponent"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTester;
