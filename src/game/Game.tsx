import React, { useState, useEffect, useCallback, useRef } from 'react';
import Background from './Background';
import DinoTest from './DinoTest';
import Player from './Player';
import Ground from './Ground';
import { ControllerProvider, useControllerContext } from '../context/ControllerContext';
import { GameProvider } from '../context/GameContext';
import HealthBar from './HealthBar';
import GameLabel from './GameLabel';
import Score from './Score';

function Game() {
  // State variables for game data.
  const [gameState, setGameState] = useState(/* initial game state */);
  const [updateRate, setUpdateRate] = useState(0);
  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0); 
  const [count, setCount] = useState(0)
  const gameRef = useRef<number | null>(null);

  // Update game state and render the game.
  const gameLoop = useCallback(
    () => {
        // Update game logic.
        // Update the state using setGameState.
    
        // Render game graphics.
        // Use the game state to render game elements.
    
        // Request the next frame.    
        if (lastTime !== 0) {
            setTime(new Date().getTime() - lastTime);
        } else {
            setLastTime(new Date().getTime());
        }
        const x = requestAnimationFrame(gameLoop);
        if (gameRef.current === null) {
            gameRef.current = x;
        }
    },
    [lastTime, time],
  );

  // Start the game loop when the component mounts.
  useEffect(() => {
    const x = requestAnimationFrame(gameLoop);
    gameRef.current = x;
    return () => {
        if (gameRef.current !== null) {
            cancelAnimationFrame(gameRef.current);
        }
    }
  }, [gameLoop]);

  return (
    <div>
      <ControllerProvider>
        <GameProvider>
          <>
            <Background />
            <HealthBar />
            <GameLabel />
            <Score />
            <Ground time={time}/>
            <Player time={time}/>
          </>
        </GameProvider>
      </ControllerProvider>
    </div>
  );
}

export default Game;