import React from 'react';

const GameControls = ({ players, currentTurn, isMyTurn, playerId, winner }) => {
  // Determine player number (1 or 2)
  const myPlayerNumber = players.findIndex(player => player.id === playerId) + 1;
  const currentPlayerNumber = currentTurn + 1;
  
  return (
    <div className="game-controls-container">
      <div className="game-status">
        <h2>Game Status</h2>
        
        {players.length < 2 ? (
          <div className="waiting-message">
            <p>Waiting for another player to join...</p>
            <p className="waiting-subtext">Share your game code for someone to join</p>
          </div>
        ) : (
          <>
            <div className="players-info">
              <div className={`player ${myPlayerNumber === 1 ? 'my-player' : ''} ${currentTurn === 0 ? 'current-player' : ''}`}>
                <div className="player-token" style={{ backgroundColor: '#ff5722' }}></div>
                <div className="player-details">
                  <div className="player-name">Player 1 {myPlayerNumber === 1 ? '(You)' : ''}</div>
                  <div className="player-position">
                    Position: {players[0]?.position || 0}/20
                  </div>
                  {currentTurn === 0 && <div className="player-status">Current Turn</div>}
                </div>
              </div>
              
              <div className={`player ${myPlayerNumber === 2 ? 'my-player' : ''} ${currentTurn === 1 ? 'current-player' : ''}`}>
                <div className="player-token" style={{ backgroundColor: '#2196f3' }}></div>
                <div className="player-details">
                  <div className="player-name">Player 2 {myPlayerNumber === 2 ? '(You)' : ''}</div>
                  <div className="player-position">
                    Position: {players[1]?.position || 0}/20
                  </div>
                  {currentTurn === 1 && <div className="player-status">Current Turn</div>}
                </div>
              </div>
            </div>
            
            {!winner && (
              <div className="turn-indicator">
                <p>
                  {isMyTurn 
                    ? "It's your turn! Roll the dice." 
                    : `Waiting for Player ${currentPlayerNumber} to roll...`}
                </p>
              </div>
            )}
          </>
        )}
        
        {winner && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <p>
              {winner === playerId 
                ? "Congratulations! You won the game!" 
                : "Game over. The other player won."}
            </p>
            <p>Refresh the page to start a new game.</p>
          </div>
        )}
      </div>
      
      <div className="game-instructions">
        <h3>How to Play</h3>
        <ol>
          <li>Take turns rolling the dice</li>
          <li>Your token moves forward by the number rolled</li>
          <li>Navigate around the board</li>
          <li>First player to reach space 20 wins!</li>
        </ol>
      </div>
    </div>
  );
};

export default GameControls;