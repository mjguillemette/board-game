import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Text } from "@react-three/drei";

// Component for a single board space
const BoardSpace = ({ position, index, isOccupied, playerColor }) => {
  // Add a slight hover animation
  const meshRef = useRef();

  // Ensure position is valid before using it
  if (!position || !Array.isArray(position) || position.length < 3) {
    console.error("Invalid position for BoardSpace:", position);
    return null;
  }

  useFrame(() => {
    if (meshRef.current && !isOccupied) {
      meshRef.current.position.y =
        position[1] + Math.sin(Date.now() * 0.001 + index * 0.5) * 0.03;
    }
  });

  return (
    <group>
      <Box
        ref={meshRef}
        position={position}
        args={[0.9, 0.2, 0.9]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={
            isOccupied ? playerColor : index % 2 === 0 ? "#a0a0a0" : "#c0c0c0"
          }
          roughness={0.5}
          metalness={0.0}
        />
      </Box>
    </group>
  );
};

// Component for a player token with animation
const PlayerToken = ({ position, color, targetPosition, isMoving }) => {
  const tokenRef = useRef();
  const animationRef = useRef({
    progress: 0,
    startPosition: position ? [...position] : [0, 0, 0],
    targetPosition: targetPosition
      ? [...targetPosition]
      : position
      ? [...position]
      : [0, 0, 0],
    isMoving: false
  });

  // Update animation state when target position changes
  useEffect(() => {
    if (position && targetPosition && isMoving) {
      animationRef.current = {
        progress: 0,
        startPosition: [...position],
        targetPosition: [...targetPosition],
        isMoving: true
      };
    }
  }, [targetPosition, isMoving, position]);

  // Animate player token movement and bobbing
  useFrame(() => {
    if (!tokenRef.current) return;

    // Handle movement animation
    if (animationRef.current.isMoving) {
      // Increment progress
      animationRef.current.progress += 0.02;

      if (animationRef.current.progress >= 1) {
        // Animation complete
        animationRef.current.isMoving = false;
        animationRef.current.progress = 1;
      }

      // Calculate current position using easing function
      const t = easeInOutCubic(animationRef.current.progress);
      const currentX = lerp(
        animationRef.current.startPosition[0],
        animationRef.current.targetPosition[0],
        t
      );
      const currentZ = lerp(
        animationRef.current.startPosition[2],
        animationRef.current.targetPosition[2],
        t
      );

      // Apply position
      tokenRef.current.position.x = currentX;
      tokenRef.current.position.z = currentZ;
    } else {
      // Apply bobbing animation when not moving
      tokenRef.current.position.y =
        position[1] + 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
      tokenRef.current.rotation.y += 0.01;
    }
  });

  // Linear interpolation helper
  const lerp = (start, end, t) => start * (1 - t) + end * t;

  // Easing function for smoother animation
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  return (
    <group
      ref={tokenRef}
      position={[position[0], position[1] + 0.3, position[2]]}
      castShadow
    >
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Add a small indicator on top */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial
          color={color === "#ff0000" ? "#ffcccc" : "#ccccff"}
        />
      </mesh>
    </group>
  );
};

const Board = ({ players, playerId }) => {
  // Create an array to hold the board spaces positioned in a path
  const boardSpaces = [];

  // Define the positions for the board spaces
  const boardPositions = [
    // Square board
    [0, -.1, 0],
    [1, -.1, 0],
    [2, -.1, 0],
    [3, -.1, 0],
    [4, -.1, 0],
    [5, -.1, 0],
    [5, -.1, 1],
    [5, -.1, 2],
    [5, -.1, 3],
    [5, -.1, 4],
    [5, -.1, 5],
    [4, -.1, 5],
    [3, -.1, 5],
    [2, -.1, 5],
    [1, -.1, 5],
    [0, -.1, 5],
    [0, -.1, 4],
    [0, -.1, 3],
    [0, -.1, 2],
    [0, -.1, 1],
    [0, -.1, 6]
  ];

  // Get the positions we need
  const spacesPositions = boardPositions;

  // Create board spaces objects with positions and indices
  for (let i = 0; i < 20; i++) {
    // Make sure spacesPositions[i] exists
    if (i < spacesPositions.length && spacesPositions[i]) {
      boardSpaces.push({
        position: spacesPositions[i],
        index: i
      });
    } else {
      console.error(`Missing position for space ${i}`);
    }
  }

  // Track previous player positions for animation
  const prevPositionsRef = useRef({});

  // Update previous positions when players change
  useEffect(() => {
    players.forEach((player) => {
      if (!prevPositionsRef.current[player.id]) {
        prevPositionsRef.current[player.id] = player.position;
      }
    });
  }, [players]);

  // Player colors
  const playerColors = ["#ff0000", "#0000ff"];

  return (
    <group rotation={[0, Math.PI / 6, 0]}>
      {/* Board base */}
      <Box position={[2.5, -0.2, 2.5]} args={[6.5, 0.1, 6.5]} receiveShadow>
        <meshStandardMaterial color="#8b5a2b" />
      </Box>

      {/* Decorative elements */}
      <Box position={[2.5, -0.3, 2.5]} args={[7.5, 0.1, 7.5]} receiveShadow>
        <meshStandardMaterial color="#654321" />
      </Box>

      {/* Board spaces */}
      {boardSpaces.map((space, idx) => {
        // Check if any player is on this space
        const playersOnSpace = players.filter(
          (player) => player.position === idx
        );
        const isOccupied = playersOnSpace.length > 0;
        const playerColor = isOccupied
          ? playersOnSpace[0].id === playerId
            ? playerColors[0]
            : playerColors[1]
          : null;

        return (
          <BoardSpace
            key={idx}
            position={space.position}
            index={space.index}
            isOccupied={isOccupied}
            playerColor={playerColor}
          />
        );
      })}

      {/* Player tokens */}
      {players.map((player, idx) => {
        // Safety check to make sure player has a valid position and it exists in boardSpaces
        if (
          player &&
          typeof player.position === "number" &&
          player.position >= 0 &&
          player.position < boardSpaces.length &&
          boardSpaces[player.position] &&
          boardSpaces[player.position].position
        ) {
          const spacePosition = boardSpaces[player.position].position;
          // Offset slightly if multiple players on same space
          const offset = idx * 0.4;

          // Check if player has moved
          const hasPlayerMoved =
            prevPositionsRef.current[player.id] !== player.position;
          const prevPosition = prevPositionsRef.current[player.id];
          let targetPosition = null;
          let isMoving = false;

          // Only animate if previous position exists and is valid
          if (
            hasPlayerMoved &&
            typeof prevPosition === "number" &&
            prevPosition >= 0 &&
            prevPosition < boardSpaces.length &&
            boardSpaces[prevPosition] &&
            boardSpaces[prevPosition].position
          ) {
            const prevSpacePosition = boardSpaces[prevPosition].position;
            targetPosition = [
              spacePosition[0],
              spacePosition[1],
              spacePosition[2] + offset
            ];
            isMoving = true;

            // Update previous position for next render
            prevPositionsRef.current[player.id] = player.position;
          }

          // Create position arrays with fallbacks in case of undefined values
          const currentPosition = [
            spacePosition[0],
            spacePosition[1],
            spacePosition[2] + offset
          ];

          // Only use previous position if it's valid
          const previousPosition =
            hasPlayerMoved &&
            prevPosition !== undefined &&
            boardSpaces[prevPosition] &&
            boardSpaces[prevPosition].position
              ? [
                  boardSpaces[prevPosition].position[0],
                  spacePosition[1],
                  boardSpaces[prevPosition].position[2] + offset
                ]
              : currentPosition;

          return (
            <PlayerToken
              key={player.id}
              position={hasPlayerMoved ? previousPosition : currentPosition}
              targetPosition={targetPosition}
              isMoving={isMoving}
              color={player.id === playerId ? playerColors[0] : playerColors[1]}
            />
          );
        }
        return null;
      })}

      {/* Add lighting for better 3D effect */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.4} />
    </group>
  );
};

export default Board;
