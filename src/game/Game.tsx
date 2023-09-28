import React, { useState, useEffect, useCallback } from 'react';
import Background from './Background';
import DinoTest from './DinoTest';
import Player from './Player';
import Ground from './Ground';
import { ControllerProvider, useControllerContext } from './ControllerContext';

function Game() {
  // State variables for game data.
  const [gameState, setGameState] = useState(/* initial game state */);
  const [updateRate, setUpdateRate] = useState(0);
  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0); 
  const [count, setCount] = useState(0)

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
        requestAnimationFrame(gameLoop);
    },
    [lastTime, time],
  );

  // Start the game loop when the component mounts.
  useEffect(() => {
    requestAnimationFrame(gameLoop);

    // Clean up the game loop when the component unmounts.
    return () => {
      // Cancel any pending animation frames.
    };
  }, [gameLoop]);

  return (
    <div>
      <ControllerProvider>
        <>
          <Background />
          <Ground />
          <Player time={time}/>
        </>
      </ControllerProvider>
    </div>
  );
}

export default Game;