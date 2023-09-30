import React, { useEffect, useState } from 'react'
import { useControllerContext } from '../context/ControllerContext';
import { v4 as uuidv4 } from 'uuid';
import { GroundObjects } from './ImageCollections';
import Obstacle from './Obstacle';

const ground_items_start = Math.round(window.innerWidth / 14 / 5);
const ground_items_start_dst = Math.floor(window.innerWidth / ground_items_start);
const ground_update_rate = 1000;
var ground_update = 0;

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

  const [run, setRun] = useState(false);
  const [itemsToRender, setItemsToRender] = useState<Item[]>([]);

  useEffect(() => {
    if (jump && !run) {
      setRun(true)
    }
  }, [jump])

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
      const newItems = []

      //Check if there is any ref outside the screen, if so, remove it
      itemsToRender.forEach((item, index) => {
        let bounding = item?.ref?.current?.getBoundingClientRect();
        if (bounding && bounding.right >= 0) {
          newItems.push(item)
        }
      })

      newItems.push(newItem)

      setItemsToRender(newItems)
      ground_update = 0
      console.log('items total: ', newItems.length)
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
            data-moving={run}
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
      <Obstacle id={'test'} moving={run} time={time}/>
    </div>
    </>
  )
}