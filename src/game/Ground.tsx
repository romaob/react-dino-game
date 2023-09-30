import React, { useEffect, useState } from 'react'
import { useControllerContext } from '../context/ControllerContext';
import { v4 as uuidv4 } from 'uuid';
import { GroundObjects } from './ImageCollections';
import Obstacle, { ObstacleType } from './Obstacle';
import { usePlayerContext } from '../context/PlayerContext';

const ground_items_start = Math.round(window.innerWidth / 14 / 5);
const ground_items_start_dst = Math.floor(window.innerWidth / ground_items_start);
const ground_update_rate = 1000;
var ground_update = 0;

const obstacle_min_generate = 2000;
var obstacle_update = 0;
var next_obstacle_time = obstacle_min_generate;

type Props = {
  time: number
}

type Item = {
  id: string,
  img: string,
  x?: number,
  ref?: React.RefObject<HTMLDivElement>
}

export default function Ground({time}: Props) {
  const {jump} = useControllerContext();
  const {health} = usePlayerContext();

  const [run, setRun] = useState(false);
  const [itemsToRender, setItemsToRender] = useState<Item[]>([]);
  const [obstaclesToRender, setObstaclesToRender] = useState<ObstacleType[]>([])

  useEffect(() => {
    if (health === 0) {
      setRun(false)
      return
    }
    if (jump && !run) {
      setRun(true)
    }
  }, [jump, health])

  useEffect(() => {
    //Generate initial ground items with x position
    const items = []
    for (let i = ground_items_start-1; i >=0; i--) {
      const randomIndex = Math.floor(Math.random() * 12)
      const newItem = {
        id: uuidv4(),
        img: GroundObjects[randomIndex],
        x: ground_items_start_dst * i,
        ref: React.createRef<HTMLDivElement>()
      }
      items.push(newItem)
    }
    setItemsToRender(items)
  },[])

  useEffect(() => {
    if (!run) return
    ground_update += time
    if (ground_update >= ground_update_rate) {
      const randomIndex = Math.floor(Math.random() * 12)
      const newItem = {
        id: uuidv4(),
        img: GroundObjects[randomIndex],
        ref: React.createRef<HTMLDivElement>()
      }

      //Check if there is any ref outside the screen, if so, remove it
      const newItems = itemsToRender.filter((item) => {
        let bounding = item?.ref?.current?.getBoundingClientRect();
        if (bounding && bounding.right >= 0) {
          return true
        }
        return false
      })

      newItems.push(newItem)

      setItemsToRender(newItems)
      ground_update = 0
    }
    //Obstacle generator
    obstacle_update += time
    if (obstacle_update >= next_obstacle_time) {
      const newObstacle = {
        id: uuidv4(),
        ref: React.createRef<HTMLDivElement>()
      }
      //Check if there is any ref outside the screen, if so, remove it
      const newObstacles = obstaclesToRender.filter((obstacle) => {
        let bounding = obstacle?.ref?.current?.getBoundingClientRect();
        if (bounding && bounding.right >= 0) {
          return true
        }
        return false
      })
      newObstacles.push(newObstacle)
      setObstaclesToRender(newObstacles)
      obstacle_update = 0
      next_obstacle_time = (Math.floor(Math.random() * 4) * 1000) + obstacle_min_generate
      console.log('newObstacles: ', newObstacles.length)      
    }
  }, [time])

  return (
    <>
    <div className='ground'>
      {
        itemsToRender?.map((item) => (
          <div 
            className='ground-image-wrapper' 
            key={item?.id} 
            data-moving={run ? "true" : "false"}
            style={{right: item.x || 0}}
            ref={item.ref}
          >            
            <img 
              key={'img'+item.id} 
              src={item.img} 
              className='ground-image' 
              alt='item' 
            />            
          </div>
        ))
      }
    </div>
    <div className='obstacles'>
      {obstaclesToRender.map((obstacle) => (
        <Obstacle 
          id={obstacle.id} 
          moving={run} 
          time={time} 
          obstacleRef={obstacle.ref} 
          key={obstacle.id}
        />
      ))}
    </div>
    </>
  )
}