import React, { useEffect, useRef, useState } from 'react'
import { Obstacles } from './ImageCollections'
import { useGameContext } from '../context/GameContext';

const obstacle_update_rate = 100;

export type ObstacleType = {
    id: string,
    ref: React.RefObject<HTMLDivElement>
}

type Props = {
    time: number,
    id: string,
    obstacleRef: React.RefObject<HTMLDivElement>
    moving: boolean
}

export default function Obstacle({
    time,
    id,
    obstacleRef,
    moving,
}: Props) {
    const colliderRef = useRef<HTMLDivElement>(null)
    const [imgIndex, setimgIndex] = useState( Math.floor(Math.random() * 6))
    const [obstacleUpdate, setObstacleUpdate] = useState(0)
    const img = Obstacles[imgIndex];

    const {playerColliderRef, onDamage} = useGameContext();

    useEffect(() => {
        if (!time) return
        if (!colliderRef?.current) return
        if (!playerColliderRef?.current) return

        let obstacle_update = obstacleUpdate;
        obstacle_update += time
        if (obstacle_update >= obstacle_update_rate) {
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
                onDamage && onDamage(5)
            }
            obstacle_update = 0;
        }
        setObstacleUpdate(obstacle_update)
    }, [onDamage, playerColliderRef, time])

  return (
    <div
        className='ground-image-wrapper' 
        data-moving={moving ? "true" : "false"}
        ref={obstacleRef}
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