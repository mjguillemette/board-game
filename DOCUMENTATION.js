// This file contains documentation for the components in the project

/**
 * App.jsx
 * 
 * The main application component that serves as the entry point for the game.
 * It integrates all the game components and manages the overall layout.
 * 
 * Key features:
 * - Renders different views based on game state (setup vs gameplay)
 * - Integrates the 3D game board with Three.js
 * - Displays game controls and status information
 * - Includes the testing panel for debugging
 */

/**
 * Board.jsx
 * 
 * The 3D game board component built with Three.js.
 * 
 * Key features:
 * - Creates an isometric board with ~20 spaces in a square pattern
 * - Renders player tokens with position tracking
 * - Implements smooth animations for player movement
 * - Includes visual indicators for start and finish positions
 * - Uses lighting effects for better 3D visualization
 */

/**
 * Dice.jsx
 * 
 * A 3D dice component with realistic rolling animation.
 * 
 * Key features:
 * - Renders a 3D dice with proper face numbering (dots)
 * - Implements realistic rolling animation
 * - Smoothly transitions to the final value
 * - Provides visual feedback for dice rolls
 * - Integrates with the game's turn-based mechanics
 */

/**
 * GameControls.jsx
 * 
 * Component for displaying game status and player information.
 * 
 * Key features:
 * - Shows current player turn information
 * - Displays player positions on the board
 * - Provides game instructions
 * - Shows game over state and winner information
 */

/**
 * GameCodeSystem.jsx
 * 
 * Component for managing game creation and joining via game codes.
 * 
 * Key features:
 * - Provides interface for creating new games
 * - Allows joining existing games with a game code
 * - Displays and allows copying of the current game code
 * - Shows waiting status when expecting another player
 */

/**
 * GameTester.jsx
 * 
 * A testing panel for debugging and verifying game functionality.
 * 
 * Key features:
 * - Displays connection status information
 * - Shows detailed player and game state
 * - Provides test actions for game mechanics
 * - Tracks player positions and dice rolls
 */

/**
 * SocketContext.jsx
 * 
 * Context provider for Socket.io integration throughout the app.
 * 
 * Key features:
 * - Establishes and maintains socket connection
 * - Handles all socket events (game creation, joining, updates)
 * - Manages game state and provides it to components
 * - Exposes methods for game actions (create, join, roll)
 */

/**
 * server/index.js
 * 
 * The backend server that handles multiplayer functionality.
 * 
 * Key features:
 * - Sets up Express server with Socket.io
 * - Manages game sessions and player connections
 * - Handles game logic (turns, dice rolling, movement)
 * - Implements game code generation for connecting players
 * - Broadcasts game state updates to connected players
 */
