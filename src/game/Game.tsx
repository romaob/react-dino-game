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
  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0); 

  // Update game state and render the game.
  const gameLoop = useCallback(
    () => {
        if (lastTime !== 0) {
          setTime(new Date().getTime() - lastTime);
          setLastTime(new Date().getTime());
        } else {
            setLastTime(new Date().getTime());
        }       
    },
    [lastTime],
  );

  useEffect(() => {
   const interval = setInterval(() => {
    gameLoop();
   }, 100);
    return () => clearInterval(interval);
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