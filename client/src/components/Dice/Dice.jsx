import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Html } from '@react-three/drei';

// 3D Dice component that renders within Canvas
const DiceModel = ({ rolling, diceValue, playerType }) => {
  const diceRef = useRef();
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [rollSpeed, setRollSpeed] = useState([0, 0, 0]);
  
  // Set final rotation based on dice value to ensure the face is visible to player
  useEffect(() => {
    if (!rolling) {
      // These rotations are adjusted to ensure the face with the result 
      // is angled toward the camera for better visibility
      switch (diceValue) {
        case 1:
          setTargetRotation([0, 0, 0]); // Top face showing 1
          break;
        case 2:
          setTargetRotation([0, Math.PI / 4, 0]); // Right face showing 2, angled toward camera
          break;
        case 3:
          setTargetRotation([Math.PI / 4, 0, 0]); // Front face showing 3, angled toward camera
          break;
        case 4:
          setTargetRotation([-Math.PI / 4, 0, 0]); // Back face showing 4, angled toward camera
          break;
        case 5:
          setTargetRotation([0, -Math.PI / 4, 0]); // Left face showing 5, angled toward camera
          break;
        case 6:
          setTargetRotation([Math.PI / 4, Math.PI / 4, 0]); // Bottom face showing 6, angled toward camera
          break;
        default:
          setTargetRotation([0, 0, 0]);
      }
    }
  }, [diceValue, rolling]);
  
  // Start rolling animation
  useEffect(() => {
    if (rolling) {
      // Random rotation speeds - reduced for shorter animation
      setRollSpeed([
        Math.random() * 0.3 + 0.2,
        Math.random() * 0.3 + 0.2,
        Math.random() * 0.3 + 0.2
      ]);
    }
  }, [rolling]);
  
  // Animate dice rolling or smooth transition to final position
  useFrame(() => {
    if (!diceRef.current) return;
    
    if (rolling) {
      // Fast random rotation during rolling
      setRotation([
        rotation[0] + rollSpeed[0],
        rotation[1] + rollSpeed[1],
        rotation[2] + rollSpeed[2]
      ]);
      
      // Add a slight bouncing animation during roll
      diceRef.current.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.2;
    } else {
      // Smooth transition to target rotation when not rolling
      const dampingFactor = 0.2; // Increased for faster settling
      const newRotation = rotation.map((rot, i) => {
        // Calculate shortest path to target rotation
        let diff = targetRotation[i] - rot;
        // Normalize to [-π, π]
        diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
        return rot + diff * dampingFactor;
      });
      
      setRotation(newRotation);
      
      // Check if we've essentially reached the target
      const isAtTarget = newRotation.every((rot, i) => 
        Math.abs(rot - targetRotation[i]) < 0.01
      );
      
      if (isAtTarget) {
        setRotation(targetRotation);
      }
      
      // Gentle settling animation when not rolling
      diceRef.current.position.y = Math.max(0, diceRef.current.position.y * 0.9);
    }
    
    diceRef.current.rotation.x = rotation[0];
    diceRef.current.rotation.y = rotation[1];
    diceRef.current.rotation.z = rotation[2];
  });
  
  // Dice dots positions - inset into the dice rather than protruding
  const renderFace = (dots, rotation) => {
    return (
      <group rotation={rotation}>
        {dots.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            {/* Use cylinders for inset dots rather than protruding spheres */}
            <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
            <meshStandardMaterial 
              color="black" 
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>
    );
  };
  
  // Dot patterns for each face
  const dotPatterns = {
    1: [[0, 0, 0]],
    2: [[-0.25, -0.25, 0], [0.25, 0.25, 0]],
    3: [[-0.25, -0.25, 0], [0, 0, 0], [0.25, 0.25, 0]],
    4: [[-0.25, -0.25, 0], [-0.25, 0.25, 0], [0.25, -0.25, 0], [0.25, 0.25, 0]],
    5: [[-0.25, -0.25, 0], [-0.25, 0.25, 0], [0, 0, 0], [0.25, -0.25, 0], [0.25, 0.25, 0]],
    6: [[-0.25, -0.25, 0], [-0.25, 0, 0], [-0.25, 0.25, 0], [0.25, -0.25, 0], [0.25, 0, 0], [0.25, 0.25, 0]]
  };
  
  // Define dice colors based on player type
  const diceColor = 'white';
  
  return (
    <group 
      ref={diceRef} 
      position={[0, 0, 0]}
    >
      <Box 
        args={[1, 1, 1]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={diceColor} 
          roughness={0.1}
          metalness={0.1}
        />
        
        {/* Adding inset faces for the dots */}
        <group position={[0, 0, 0.5]}>
          {/* Use inset meshes for the dots */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.05]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[1].map(p => [p[0], p[1], -0.025]), [0, 0, 0])}
        </group>
        
        <group position={[0, 0, -0.5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.05]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[6].map(p => [p[0], p[1], 0.025]), [0, Math.PI, 0])}
        </group>
        
        <group position={[0.5, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.9, 0.9]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[3].map(p => [0.025, p[0], p[1]]), [0, Math.PI/2, 0])}
        </group>
        
        <group position={[-0.5, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.9, 0.9]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[4].map(p => [-0.025, p[0], p[1]]), [0, -Math.PI/2, 0])}
        </group>
        
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.9]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[2].map(p => [p[0], 0.025, p[1]]), [-Math.PI/2, 0, 0])}
        </group>
        
        <group position={[0, -0.5, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.9]} />
            <meshStandardMaterial color={diceColor} />
          </mesh>
          {renderFace(dotPatterns[5].map(p => [p[0], -0.025, p[1]]), [Math.PI/2, 0, 0])}
        </group>
      </Box>
      
      {/* Show a visible value indicator for the current roll */}
      {!rolling && (
        <Html position={[0, 0.7, 0]} center>
          <div className={`dice-value-indicator ${playerType}-indicator`}>
            {diceValue}
          </div>
        </Html>
      )}
    </group>
  );
};

// Main Dice Component
const Dice = ({ onRoll, lastRoll, playerType, isCurrentTurn, playerId, isMyDice }) => {
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [rollSound] = useState(() => new Audio('/dice-roll.mp3'));
  const rollTimeoutRef = useRef(null);
  
  // Handle receiving new roll data from the server
  useEffect(() => {
    if (lastRoll && lastRoll.playerType === playerType) {
      // If this is an update for this player's dice
      if (!rolling) {
        // If we're not already rolling, start rolling with the final value
        rollDice(lastRoll.diceValue);
      }
    }
  }, [lastRoll, playerType, rolling]);
  
  const rollDice = (finalValue = null) => {
    // Clear any existing timeout
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
    }
    
    // Start rolling animation
    setRolling(true);
    
    // Try to play sound (will fail silently if file doesn't exist)
    try {
      rollSound.currentTime = 0;
      rollSound.play().catch(() => {});
    } catch (e) {
      console.log("Sound couldn't be played");
    }
    
    // Reduced roll duration for quicker animation (500-800ms)
    const rollDuration = Math.random() * 300 + 500;
    
    // Stop rolling after the determined time
    rollTimeoutRef.current = setTimeout(() => {
      setRolling(false);
      
      // Set final dice value (either from parameter or random)
      const value = finalValue !== null ? finalValue : Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      
      // If this was a local roll request (not from server), notify parent
      if (finalValue === null && isCurrentTurn && isMyDice) {
        onRoll(value);
      }
    }, rollDuration);
  };
  
  const handleRollClick = () => {
    if (!rolling && isCurrentTurn && isMyDice) {
      rollDice();
    }
  };
  
  const buttonColor = playerType === 'player1' ? 'orange-button' : 'blue-button';
  
  return (
    <div className={`dice-container ${playerType}-dice ${isCurrentTurn ? 'current-turn' : ''}`}>
      <div className="player-header">
        <span className="player-label">
          {playerType === 'player1' ? 'Player 1' : 'Player 2'}
          {isMyDice ? ' (You)' : ''}
        </span>
        {isCurrentTurn && <span className="current-turn-badge">Current Turn</span>}
      </div>
      
      <div className="dice-3d">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
          <DiceModel 
            rolling={rolling} 
            diceValue={diceValue}
            playerType={playerType}
          />
        </Canvas>
      </div>
      
      {isCurrentTurn && isMyDice && (
        <button 
          className={`roll-button ${buttonColor}`}
          onClick={handleRollClick}
          disabled={rolling}
        >
          {rolling ? "Rolling..." : "ROLL DICE"}
        </button>
      )}
      
      <div className="dice-value-text">
        Last roll: {diceValue}
      </div>
    </div>
  );
};

export default Dice;