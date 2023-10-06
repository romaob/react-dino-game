import React, { useEffect, useRef, useState } from 'react'
import { AirEnemyImages } from './ImageCollections'
import { GameStatus, useGameContext } from '../context/GameContext';

const update_check_rate = 100;
const update_fly_rate = 300;

export type AirEnemyType = {
    id: string,
    ref: React.RefObject<HTMLDivElement>
}

type Props = {
    id: string,
    time: number,
    moving: boolean,
    enemyRef: React.RefObject<HTMLDivElement>
}

export default function AirEnemy({
    id,
    time,
    moving,
    enemyRef
}: Props) {
    const atackColliderRef = React.useRef<HTMLDivElement>(null)
    const {health, playerColliderRef, onDamage, setHealth, setGameStatus, attacking, setAttacking, setScore} = useGameContext();
    const [img, setImg] = useState(AirEnemyImages.imageA);
    const [lastUpdate, setLastUpdate] = useState(0);
    const [lastFlyUpdate, setLastFlyUpdate] = useState(0)
    const [colliding, setColliding] = useState(false)
    const [dead, setDead] = useState(false);
    const [grounded, setGrounded] = useState(false)
    const [attacked, setAttacked] = useState(false)

    async function performAttackAnimation() {
        var initialHealth = health;
        if (initialHealth === 0) {
            setAttacking(false)
            return;
        }
        setScore && setScore(100);
        setAttacked(true)
        setGameStatus(GameStatus.PAUSED)
        setImg(AirEnemyImages.imageAttackA)
        await new Promise(r => setTimeout(r, 300));
        setImg(AirEnemyImages.imageAttackB)
        setGrounded(true)
        await new Promise(r => setTimeout(r, 300));
        setImg(AirEnemyImages.imageAttackC)
        initialHealth += 5
        setHealth(initialHealth)
        await new Promise(r => setTimeout(r, 300));
        setImg(AirEnemyImages.imageAttackB)
        await new Promise(r => setTimeout(r, 300));
        setImg(AirEnemyImages.imageAttackC)
        initialHealth += 5
        setHealth(initialHealth)
        await new Promise(r => setTimeout(r, 300));
        setImg(AirEnemyImages.imageAttackB)
        await new Promise(r => setTimeout(r, 300));
        setDead(true)
        setAttacking(false)
        setAttacked(false)
        setGameStatus(GameStatus.RUNNING)
    }

    useEffect(() => {
      if (dead) return
      if (!time) return

      let update = lastUpdate;
      let flyUpdate = lastFlyUpdate;
      update += time;
      flyUpdate += time;

       //Flight
       if (flyUpdate > update_fly_rate) {
            if (!attacked) {
                switch (img) {
                    case AirEnemyImages.imageA:
                        setImg(AirEnemyImages.imageB);
                        break;
                    case AirEnemyImages.imageB:
                        setImg(AirEnemyImages.imageC);
                        break;
                    default: 
                        setImg(AirEnemyImages.imageA);
                }
            }
            flyUpdate = 0;
        }
      if (update > update_check_rate) {
        const playerRect = playerColliderRef?.current?.getBoundingClientRect()
        const enemyRect = enemyRef?.current?.getBoundingClientRect()
        const attackRect = atackColliderRef?.current?.getBoundingClientRect()
        
        //Check if it is colliding
        const isColliding = enemyRect && playerRect && !(
            playerRect.right < enemyRect.left ||
            playerRect.left > enemyRect.right ||
            playerRect.bottom < enemyRect.top ||
            playerRect.top > enemyRect.bottom
        )
        if (isColliding && !colliding) {
            setColliding(true)
            onDamage && onDamage(25)
        }
        
        //Check if it is attack
        const isAttacking = attackRect && playerRect &&!(
            playerRect.right < attackRect.left ||
            playerRect.left > attackRect.right ||
            playerRect.bottom < attackRect.top ||
            playerRect.top > attackRect.bottom
        )
        if (isAttacking && !isColliding && !colliding && !attacking) {
            setAttacking(true)
            performAttackAnimation()
        }       
        update = 0;
      }
      setLastUpdate(update);
      setLastFlyUpdate(flyUpdate);
    }, [time])


  return (
    <div
        className='air-image-wrapper' 
        data-moving={moving ? "true" : "false"}
        style={{right: 0}}
    >
        {!colliding &&
            <div className='enemy-air-atack-collider' ref={atackColliderRef}></div>
        }
        <div>
            <img 
                key={'img'+id} 
                src={dead ? AirEnemyImages.imageB : img} 
                className='enemy-image-air' 
                data-attacked={attacked ? "true" : "false"}
                data-grounded={dead || grounded ? "true" : "false"}
                alt='enemy' 
            >
            </img>
            {!dead && !attacking &&
                <div className='enemy-air-collider' ref={enemyRef}></div>
            }
        </div>
    </div>
  )
}