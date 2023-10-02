import React from 'react'
import { GameStatus, useGameContext } from '../context/GameContext';

type Props = {}

export default function HealthBar({}: Props) {
  const {health, gameStatus} = useGameContext();

  if (gameStatus !== GameStatus.RUNNING) return null
  return (
    <div className='healthbar'>
        <div className='healthbar-inner' style={{width: `${health}%`}}>
        </div>
    </div>
  )
}