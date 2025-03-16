import React, { useState } from 'react';
import { useSocket } from '../Multiplayer/SocketContext';

const GameCodeSystem = () => {
  const { connected, gameState, createGame, joinGame } = useSocket();
  const [inputGameCode, setInputGameCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Handle game code input change
  const handleInputChange = (e) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const cleanedInput = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setInputGameCode(cleanedInput);
  };

  // Copy game code to clipboard
  const copyGameCodeToClipboard = () => {
    if (gameState.gameCode) {
      navigator.clipboard.writeText(gameState.gameCode)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setCopySuccess('Failed to copy');
        });
    }
  };

  return (
    <div className="game-code-system">
      {!gameState.isGameStarted ? (
        <div className="game-setup">
          <h2>Board Game</h2>
          <p>Create a new game or join an existing one with a game code</p>
          
          <button 
            className="create-game-btn"
            onClick={createGame}
            disabled={!connected}
          >
            Create New Game
          </button>
          
          <div className="join-game-container">
            <h3>Join Existing Game</h3>
            <div className="join-game">
              <input
                type="text"
                placeholder="Enter 6-digit Game Code"
                onChange={handleInputChange}
                value={inputGameCode}
                maxLength={6}
                className="game-code-input"
              />
              <button 
                onClick={() => joinGame(inputGameCode)}
                disabled={!connected || inputGameCode.length < 6}
                className="join-game-btn"
              >
                Join Game
              </button>
            </div>
          </div>
          
          {!connected && (
            <div className="connection-status">
              <p>Connecting to server...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="active-game-code">
          <div className="game-code-display">
            <span>Game Code: </span>
            <span className="code">{gameState.gameCode}</span>
            <button 
              onClick={copyGameCodeToClipboard}
              className="copy-btn"
              title="Copy to clipboard"
            >
              Copy
            </button>
            {copySuccess && <span className="copy-success">{copySuccess}</span>}
          </div>
          <p className="share-instruction">
            Share this code with another player to join your game
          </p>
          
          {gameState.players.length < 2 && (
            <div className="waiting-message">
              <p>Waiting for another player to join...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCodeSystem;
