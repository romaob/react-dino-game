import React, { useEffect, useRef } from 'react'
import { useControllerContext } from '../context/ControllerContext';
import { PlayerDead, PlayerJump, PlayerWalk } from './ImageCollections';
import { GameStatus, useGameContext } from '../context/GameContext';

var runUpdate = 0;
var stepRun = 0;
var stepDeadAnimation = 0;
var speed = 0;

export default function Player({
    time
}: {
    time: number;
}) {    
    const {jumpValue} = useControllerContext();
    const playerColliderRef = useRef<HTMLDivElement>(null);
    const {health, setPlayerColliderRef, gameStatus} = useGameContext();

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

            if (stepDeadAnimation > 0 && stepDeadAnimation < 4) {
                stepDeadAnimation++;
            }
        }
    }, [time])

    useEffect(() => {
        console.log('player')
        if (gameStatus === GameStatus.RUNNING) {
            speed = 200;
        }
    }, [gameStatus])

    useEffect(() => {
      if (health === 0) {
        stepDeadAnimation = 1;
      }
    }, [health])

    useEffect(() => {
      if (!playerColliderRef?.current) return
        setPlayerColliderRef(playerColliderRef)
    }, [setPlayerColliderRef])

    if (health === 0) {
        return (
            <div className='player-main'>
                <div className='player-collider' ref={playerColliderRef}></div>
                {stepDeadAnimation === 1 && <img className='player-part' src={PlayerDead.imageDeadA} alt="dino" />}
                {stepDeadAnimation === 2 && <img className='player-part' src={PlayerDead.imageDeadB} alt="dino" />}
                {stepDeadAnimation === 3 && <img className='player-part' src={PlayerDead.imageDeadC} alt="dino" />}
                {stepDeadAnimation === 4 && <img className='player-part' src={PlayerDead.imageDeadD} alt="dino" />}
            </div>
        );
    }
    if (jumpValue > 0 && speed > 0) {
        return (
            <div className='player-main' data-jumping={jumpValue > 1 && jumpValue < 4 ? true : undefined}>
                <div className='player-collider' ref={playerColliderRef}></div>
                {jumpValue === 1 && <img className='player-part' src={PlayerJump.imageJumpA} alt="dino" />}
                {jumpValue === 2 && <img className='player-part' src={PlayerJump.imageJumpB} alt="dino" />}
                {jumpValue === 3 && <img className='player-part' src={PlayerJump.imageJumpC} alt="dino" />}
                {jumpValue === 4 && <img className='player-part' src={PlayerJump.imageJumpD} alt="dino" />}
            </div>
        );
    } 
    return (
        <div className='player-main'> 
            <div className='player-collider' ref={playerColliderRef}></div>
            {stepRun === -1 && <img className='player-part' src={PlayerWalk.imageIdleA} alt="dino" />}
            {stepRun === 0 && <img className='player-part' src={PlayerWalk.imageA} alt="dino" />}
            {stepRun === 1 && <img className='player-part' src={PlayerWalk.imageB} alt="dino" />}
            {stepRun === 2 && <img className='player-part' src={PlayerWalk.imageC} alt="dino" />}
        </div> 
    )
    
  
}