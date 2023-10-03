import React, { useEffect, useState } from 'react'
import { GroundEnemyImages } from './ImageCollections'
import { GameStatus, useGameContext } from '../context/GameContext'

const update_check_rate = 100;
const near_distance = Math.floor(window.innerWidth * 0.2);

export type GroundEnemyType = {
    id: string,
    ref: React.RefObject<HTMLDivElement>
}

type Props = {
    id: string,
    time: number,
    moving: boolean,
    enemyRef: React.RefObject<HTMLDivElement>
}

export default function GroundEnemy({
    id,
    time,
    moving,
    enemyRef,
}: Props) {
    const atackColliderRef = React.useRef<HTMLDivElement>(null)
    const {health, playerColliderRef, onDamage, setHealth, setGameStatus, attacking, setAttacking} = useGameContext();
    const [img, setImg] = useState(GroundEnemyImages.imageA);
    const [lastUpdate, setLastUpdate] = useState(0);
    const [colliding, setColliding] = useState(false)
    const [dead, setDead] = useState(false);

    async function performAttackAnimation() {
        var initialHealth = health;
        setGameStatus(GameStatus.PAUSED)
        setImg(GroundEnemyImages.imageAttackA)
        await new Promise(r => setTimeout(r, 300));
        setImg(GroundEnemyImages.imageAttackB)
        initialHealth += 15
        setHealth(initialHealth)
        await new Promise(r => setTimeout(r, 300));
        setImg(GroundEnemyImages.imageAttackA)
        await new Promise(r => setTimeout(r, 300));
        setImg(GroundEnemyImages.imageAttackB)
        initialHealth += 15
        setHealth(initialHealth)
        await new Promise(r => setTimeout(r, 300));
        setImg(GroundEnemyImages.imageAttackA)
        await new Promise(r => setTimeout(r, 300));
        setImg(GroundEnemyImages.imageAttackB)
        initialHealth += 15
        setHealth(initialHealth)
        await new Promise(r => setTimeout(r, 300));
        setDead(true)
        setAttacking(false)
        setGameStatus(GameStatus.RUNNING)
    }

    useEffect(() => {
        if (dead) return
        if (!time) return
        if (!enemyRef?.current) return
        if (!playerColliderRef?.current) return
        if (!atackColliderRef?.current) return
        let update = lastUpdate;
        update += time
        if (update >= update_check_rate) {
            const playerRect = playerColliderRef.current.getBoundingClientRect()
            const enemyRect = enemyRef.current.getBoundingClientRect()
            const attackRect = atackColliderRef.current.getBoundingClientRect()
            //Check if the player is near the obstacle
            const isNear = !(
                playerRect.right < enemyRect.left - near_distance ||
                playerRect.left > enemyRect.right + near_distance ||
                playerRect.bottom < enemyRect.top ||
                playerRect.top > enemyRect.bottom
            )
            //Check if the player is colliding with the obstacle damage collider
            const isAttacking = !(
                playerRect.right < attackRect.left ||
                playerRect.left > attackRect.right ||
                playerRect.bottom < attackRect.top ||
                playerRect.top > attackRect.bottom
            )
            //Check if the player is colliding with the obstacle damage collider
            const isColliding = !(
                playerRect.right < enemyRect.left ||
                playerRect.left > enemyRect.right ||
                playerRect.bottom < enemyRect.top ||
                playerRect.top > enemyRect.bottom
            )   

            if (isAttacking && !attacking) {
                setAttacking(true)
                performAttackAnimation();
            }

            if (isColliding && !attacking) {
                onDamage && onDamage(30)
                setColliding(true)
            }
/*
            if (isColliding) {
                onDamage && onDamage(10)
                setColliding(true)
            } else {
                setColliding(false)
            }
            */
            update = 0;
        } 
        setLastUpdate(update)     
    }, [time])

    return (
        <div
            className='ground-image-wrapper' 
            data-moving={moving ? "true" : "false"}
            style={{right: 0}}
        >
            {!colliding &&
                <div className='enemy-ground-atack-collider' ref={atackColliderRef}></div>
            }
            <div>
                <img 
                    key={'img'+id} 
                    src={dead ? GroundEnemyImages.imageDead : img} 
                    className='enemy-image' 
                    alt='enemy' 
                >
                </img>
                {!dead && !attacking &&
                    <div className='enemy-ground-collider' ref={enemyRef}></div>
                }
            </div>
        </div>
    )
}