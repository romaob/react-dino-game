import React from 'react'
import { GameStatus, useGameContext } from '../context/GameContext';

export default function Score() {
    const {score, gameStatus} = useGameContext();
    if (gameStatus !== GameStatus.RUNNING){
        return null;
    }else {
        return (
            <div className='scorelabel'>{score}</div>
        )
    }
}