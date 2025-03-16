import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

// 3D Dice component that renders within Canvas
const DiceModel = ({ rolling, diceValue, setRolling }) => {
  const diceRef = useRef();
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [rollSpeed, setRollSpeed] = useState([0, 0, 0]);
  
  // Set final rotation based on dice value
  useEffect(() => {
    if (!rolling) {
      switch (diceValue) {
        case 1:
          setTargetRotation([0, 0, 0]);
          break;
        case 2:
          setTargetRotation([0, Math.PI / 2, 0]);
          break;
        case 3:
          setTargetRotation([Math.PI / 2, 0, 0]);
          break;
        case 4:
          setTargetRotation([-Math.PI / 2, 0, 0]);
          break;
        case 5:
          setTargetRotation([0, -Math.PI / 2, 0]);
          break;
        case 6:
          setTargetRotation([Math.PI, 0, 0]);
          break;
        default:
          setTargetRotation([0, 0, 0]);
      }
    }
  }, [diceValue, rolling]);
  
  // Start rolling animation
  useEffect(() => {
    if (rolling) {
      // Random rotation speeds
      setRollSpeed([
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.3 + 0.1
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
    } else {
      // Smooth transition to target rotation when not rolling
      const dampingFactor = 0.1;
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
    }
    
    diceRef.current.rotation.x = rotation[0];
    diceRef.current.rotation.y = rotation[1];
    diceRef.current.rotation.z = rotation[2];
  });
  
  // Dice dots positions
  const dotPositions = {
    1: [[0, 0, 0.51]],
    2: [[-0.3, -0.3, 0.51], [0.3, 0.3, 0.51]],
    3: [[-0.3, -0.3, 0.51], [0, 0, 0.51], [0.3, 0.3, 0.51]],
    4: [[-0.3, -0.3, 0.51], [-0.3, 0.3, 0.51], [0.3, -0.3, 0.51], [0.3, 0.3, 0.51]],
    5: [[-0.3, -0.3, 0.51], [-0.3, 0.3, 0.51], [0, 0, 0.51], [0.3, -0.3, 0.51], [0.3, 0.3, 0.51]],
    6: [[-0.3, -0.3, 0.51], [-0.3, 0, 0.51], [-0.3, 0.3, 0.51], [0.3, -0.3, 0.51], [0.3, 0, 0.51], [0.3, 0.3, 0.51]]
  };
  
  // Render dice dots for each face
  const renderDots = (face) => {
    return dotPositions[face].map((pos, idx) => (
      <mesh key={idx} position={pos}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    ));
  };
  
  return (
    <group ref={diceRef} position={[0, 0, 0]}>
      <Box args={[1, 1, 1]} castShadow receiveShadow>
        <meshStandardMaterial color="white" roughness={0.1} />
        
        {/* Front face (1) */}
        <group position={[0, 0, 0.5]}>
          {renderDots(1)}
        </group>
        
        {/* Back face (6) */}
        <group position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
          {renderDots(6)}
        </group>
        
        {/* Right face (3) */}
        <group position={[0.5, 0, 0]} rotation={[0, Math.PI/2, 0]}>
          {renderDots(3)}
        </group>
        
        {/* Left face (4) */}
        <group position={[-0.5, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
          {renderDots(4)}
        </group>
        
        {/* Top face (2) */}
        <group position={[0, 0.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
          {renderDots(2)}
        </group>
        
        {/* Bottom face (5) */}
        <group position={[0, -0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
          {renderDots(5)}
        </group>
      </Box>
    </group>
  );
};

// Main Dice component
const Dice = ({ onRoll, lastRoll }) => {
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [rollSound] = useState(() => new Audio('/dice-roll.mp3'));
  
  // Handle dice roll animation
  useEffect(() => {
    if (lastRoll) {
      rollDice(lastRoll.diceValue);
    }
  }, [lastRoll]);
  
  const rollDice = (value = null) => {
    // Start rolling animation
    setRolling(true);
    
    // Try to play sound (will fail silently if file doesn't exist)
    try {
      rollSound.currentTime = 0;
      rollSound.play().catch(() => {});
    } catch (e) {
      console.log("Sound couldn't be played");
    }
    
    // Stop rolling after a random time between 1-2 seconds
    setTimeout(() => {
      setRolling(false);
      // Set final dice value (either from parameter or random)
      setDiceValue(value || Math.floor(Math.random() * 6) + 1);
    }, Math.random() * 1000 + 1000);
  };
  
  const handleRollClick = () => {
    if (!rolling) {
      rollDice();
      onRoll();
    }
  };
  
  return (
    <div className="dice-container">
      <div className="dice-3d" style={{ width: '150px', height: '150px' }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
          <DiceModel 
            rolling={rolling} 
            diceValue={diceValue} 
            setRolling={setRolling} 
          />
        </Canvas>
      </div>
      
      <button 
        className="roll-button" 
        onClick={handleRollClick}
        disabled={rolling}
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
      
      {!rolling && diceValue > 0 && (
        <div className="dice-value">
          You rolled: <span>{diceValue}</span>
        </div>
      )}
    </div>
  );
};

export default Dice;
