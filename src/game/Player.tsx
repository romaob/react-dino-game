import React, { useEffect, useRef, useState } from 'react'
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
    const {health, setPlayerColliderRef, gameStatus, attacking, score, setScore} = useGameContext();
    const [lastHealth, setLastHealth] = useState(health);
    const playerImageRef = useRef<HTMLImageElement>(null);
    const [showScore, setShowScore] = useState(0)
    const [lastScore, setLastScore] = useState(score || 0)

    function showDamage() {
        if (!playerImageRef?.current) return;
        playerImageRef.current.style.filter = 'invert(32%) sepia(21%) saturate(7466%) hue-rotate(344deg) brightness(89%) contrast(78%)';
        setTimeout(() => {
            if (!playerImageRef?.current) return;
            playerImageRef.current.style.filter = 'none';
        }, 1000);
    }

    function getSmallScore() {
        if (Math.abs(showScore) < 2) return null;
        return (
            <div className='score-info'>{showScore > 0 ? "+" : ""}{showScore}</div>
        )
    }

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
            if (health > 0) {
                setScore && setScore(1);
            }
        }
    }, [time])

    useEffect(() => {
        if (gameStatus === GameStatus.RUNNING) {
            speed = 100;
        } 
        if (gameStatus === GameStatus.GAME_OVER) {
            setLastScore(0);
        }
    }, [gameStatus])

    useEffect(() => {
        if (health < lastHealth) {
            showDamage();
        }
        if (health === 0) {
            stepDeadAnimation = 1;
        }
      setLastHealth(health);
    }, [health])

    useEffect(() => {
        if (score !== lastScore) {
            if (Math.abs(score - lastScore) > 1) {
                setShowScore(score - lastScore);
                setTimeout(() => {
                    setShowScore(0);
                }, 1000);
            }
        }
        setLastScore(score);
    }, [score])


    useEffect(() => {
      if (!playerColliderRef?.current) return
        setPlayerColliderRef(playerColliderRef)
    }, [setPlayerColliderRef])

    if (health === 0) {
        return (
            <div className='player-main'>
                {getSmallScore()}
                <div className='player-collider' ref={playerColliderRef}></div>
                {stepDeadAnimation === 1 && <img className='player-part' ref={playerImageRef} src={PlayerDead.imageDeadA} alt="dino" />}
                {stepDeadAnimation === 2 && <img className='player-part' ref={playerImageRef} src={PlayerDead.imageDeadB} alt="dino" />}
                {stepDeadAnimation === 3 && <img className='player-part' ref={playerImageRef} src={PlayerDead.imageDeadC} alt="dino" />}
                {stepDeadAnimation === 4 && <img className='player-part' ref={playerImageRef} src={PlayerDead.imageDeadD} alt="dino" />}
            </div>
        );
    }
    if (attacking) {
        return (
            <div className='player-main'>
                {getSmallScore()}
            </div>
        );
    }
    if (jumpValue > 0 && speed > 0) {
        return (
            <div className='player-main' data-jumping={jumpValue > 1 && jumpValue < 4 ? true : undefined}>
                {getSmallScore()}
                <div className='player-collider' ref={playerColliderRef} data-jumping={true}></div>
                {jumpValue === 1 && <img className='player-part' ref={playerImageRef} src={PlayerJump.imageJumpA} alt="dino" />}
                {jumpValue === 2 && <img className='player-part' ref={playerImageRef} src={PlayerJump.imageJumpB} alt="dino" />}
                {jumpValue === 3 && <img className='player-part' ref={playerImageRef} src={PlayerJump.imageJumpC} alt="dino" />}
                {jumpValue === 4 && <img className='player-part' ref={playerImageRef} src={PlayerJump.imageJumpD} alt="dino" />}
            </div>
        );
    } 
    return (
        <div className='player-main'> 
            {getSmallScore()}
            <div className='player-collider' ref={playerColliderRef}></div>
            {stepRun === -1 && <img className='player-part' ref={playerImageRef} src={PlayerWalk.imageIdleA} alt="dino" />}
            {stepRun === 0 && <img className='player-part' ref={playerImageRef} src={PlayerWalk.imageA} alt="dino" />}
            {stepRun === 1 && <img className='player-part' ref={playerImageRef} src={PlayerWalk.imageB} alt="dino" />}
            {stepRun === 2 && <img className='player-part' ref={playerImageRef} src={PlayerWalk.imageC} alt="dino" />}
        </div> 
    )
    
  
}