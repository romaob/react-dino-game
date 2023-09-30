import React, { useEffect, useRef, useState } from 'react'
import { useControllerContext } from '../context/ControllerContext';
import { usePlayerContext } from '../context/PlayerContext';

var runUpdate = 0;
var stepRun = 0;
var speed = 0;

export default function Player({
    time
}: {
    time: number;
}) {    
    const {jump} = useControllerContext();
    const playerColliderRef = useRef<HTMLDivElement>(null);
    const {setPlayerColliderRef} = usePlayerContext();
    const [isJumping, setIsJumping] = useState(false)

    const imageA = require('../assets/dino_run_0.png');
    const imageB = require('../assets/dino_run_1.png');
    const imageC = require('../assets/dino_run_2.png');
    const imageIdleA = require('../assets/dino_idle_0.png');

    const imageJumpA = require('../assets/dino_jump_0.png');
    const imageJumpB = require('../assets/dino_jump_1.png');
    const imageJumpC = require('../assets/dino_jump_2.png');
    const imageJumpD = require('../assets/dino_jump_3.png');


    useEffect(() => {
        if (speed === 0) {
            stepRun = -1;
            return;
        }
        runUpdate = runUpdate + time;  
        if (runUpdate >= speed) {
            runUpdate = 0;
            stepRun = stepRun + 1;
            if (stepRun > 2) {
                stepRun = 0;
            }
        }
    }, [time])
    

    useEffect(() => {
        if (jump !== 0 && speed === 0) {
            speed = 200;
            return;
        }
        console.log('jump', jump)
    }, [jump])

    useEffect(() => {
      if (!playerColliderRef?.current) return
        setPlayerColliderRef(playerColliderRef)
    }, [setPlayerColliderRef])

    if (jump > 0 && speed > 0) {
        return (
            <div className='player-main' data-jumping={jump > 1 && jump < 4 ? true : undefined}>
                <div className='player-collider' ref={playerColliderRef}></div>
                {jump === 1 && <img className='player-part' src={imageJumpA} alt="dino" />}
                {jump === 2 && <img className='player-part' src={imageJumpB} alt="dino" />}
                {jump === 3 && <img className='player-part' src={imageJumpC} alt="dino" />}
                {jump === 4 && <img className='player-part' src={imageJumpD} alt="dino" />}
            </div>
        );
    } else {
        return (
            <div className='player-main'> 
                <div className='player-collider' ref={playerColliderRef}></div>
                {stepRun === -1 && <img className='player-part' src={imageIdleA} alt="dino" />}
                {stepRun === 0 && <img className='player-part' src={imageA} alt="dino" />}
                {stepRun === 1 && <img className='player-part' src={imageB} alt="dino" />}
                {stepRun === 2 && <img className='player-part' src={imageC} alt="dino" />}
            </div> 
          )
    }
  
}