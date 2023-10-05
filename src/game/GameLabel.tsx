import React, { useEffect } from 'react'
import { GameStatus, useGameContext } from '../context/GameContext';

type Props = {}

const is_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function GameLabel({}: Props) {
    const {health, gameStatus, score} = useGameContext();

    return (
        <div className='gamelabel'>
            {gameStatus !== GameStatus.RUNNING && gameStatus !== GameStatus.PAUSED &&
                <>
                    <h1>REACT DINO RUN</h1>
                    <h2>{health === 0 ? 'GAME OVER' : 'NEW GAME'}</h2>
                    {gameStatus === GameStatus.GAME_OVER &&
                        <h2>Score: {score}</h2>
                    }
                    <div className='instructions'>
                        {is_mobile 
                            ? <p>Tap to jump</p> 
                            : <p>Press space or click to jump</p>
                        }
                        <p>and {health === 0 ? 'restart' : 'start'} the game</p>
                    </div>
                </>
            }
        </div>
    )
}