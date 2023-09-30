import React, { useEffect, useRef, useState } from 'react'
import { Obstacles } from './ImageCollections'
import { usePlayerContext } from '../context/PlayerContext'

type Props = {
    time: number,
    id: string,
    ref?: React.RefObject<HTMLDivElement>
    moving: boolean
}

export default function Obstacle({
    time,
    id,
    ref,
    moving,
}: Props) {
    const colliderRef = useRef<HTMLDivElement>(null)
    const [imgIndex, setimgIndex] = useState( Math.floor(Math.random() * 6))
    const img = Obstacles[imgIndex];

    const {playerColliderRef, onDamage} = usePlayerContext();

    useEffect(() => {
        if (!time) return
        if (!colliderRef?.current) return
        if (!playerColliderRef?.current) return

        //Check if the player is colliding with the obstacle
        const playerRect = playerColliderRef.current.getBoundingClientRect()
        const obstacleRect = colliderRef.current.getBoundingClientRect()
        const isColliding = !(
            playerRect.right < obstacleRect.left ||
            playerRect.left > obstacleRect.right ||
            playerRect.bottom < obstacleRect.top ||
            playerRect.top > obstacleRect.bottom
        )   
        if (isColliding) {
            onDamage && onDamage(1)
        }
    }, [onDamage, playerColliderRef, time])

  return (
    <div
        className='ground-image-wrapper' 
        data-moving={moving}
        ref={ref}
        style={{right: 0}}
    >
        
        <div className='obstacle-collider' ref={colliderRef}>
            <img 
                key={'img'+id} 
                src={img} 
                className='obstacle-image' 
                alt='obstacle' 
            >
            </img>
        </div>
    </div>
  )
}