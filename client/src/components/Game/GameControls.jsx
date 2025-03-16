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
          <p>Waiting for another player to join...</p>
        ) : (
          <>
            <div className="players-info">
              <div className={`player ${myPlayerNumber === 1 ? 'my-player' : ''}`}>
                <div className="player-token" style={{ backgroundColor: '#ff0000' }}></div>
                <div className="player-details">
                  <span className="player-name">Player 1 {myPlayerNumber === 1 ? '(You)' : ''}</span>
                  <span className="player-position">
                    Position: {players[0]?.position || 0}/20
                  </span>
                </div>
              </div>
              
              <div className={`player ${myPlayerNumber === 2 ? 'my-player' : ''}`}>
                <div className="player-token" style={{ backgroundColor: '#0000ff' }}></div>
                <div className="player-details">
                  <span className="player-name">Player 2 {myPlayerNumber === 2 ? '(You)' : ''}</span>
                  <span className="player-position">
                    Position: {players[1]?.position || 0}/20
                  </span>
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
          <li>Create a game or join with a game code</li>
          <li>Take turns rolling the dice</li>
          <li>Move around the board based on your roll</li>
          <li>First player to reach space 20 wins!</li>
        </ol>
      </div>
    </div>
  );
};

export default GameControls;
