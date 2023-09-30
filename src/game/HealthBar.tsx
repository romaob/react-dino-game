import React from 'react'
import { usePlayerContext } from '../context/PlayerContext'

type Props = {}

export default function HealthBar({}: Props) {
    const {health} = usePlayerContext();
  return (
    <div className='healthbar'>
        <div className='healthbar-inner' style={{width: `${health}%`}}>
        </div>
    </div>
  )
}