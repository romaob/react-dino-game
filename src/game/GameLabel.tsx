import React from 'react'
import { usePlayerContext } from '../context/PlayerContext';

type Props = {}

const is_mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function GameLabel({}: Props) {
    const {health, running} = usePlayerContext();
    return (
        <div className='gamelabel'>
            {!running &&
                <>
                    <h2>REACT DINO RUN</h2>
                    <h1>{health === 0 ? 'GAME OVER' : 'NEW GAME'}</h1>
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