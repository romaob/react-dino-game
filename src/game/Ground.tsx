import React, { useEffect, useState } from 'react'
import { useControllerContext } from '../context/ControllerContext';
import { v4 as uuidv4 } from 'uuid';

const ground_items_start = Math.floor(window.innerWidth / 14 / 5);
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
}

export default function Ground({time}: Props) {
  const {jump} = useControllerContext();

  const [run, setRun] = useState(false);
  const [itemsToRender, setItemsToRender] = useState<Item[]>([]);

  const images = [
    require('../assets/ground_01.png'),
    require('../assets/ground_02.png'),
    require('../assets/ground_03.png'),
    require('../assets/ground_04.png'),
    require('../assets/ground_05.png'),
    require('../assets/ground_06.png'),
    require('../assets/ground_07.png'),
    require('../assets/ground_08.png'),
    require('../assets/ground_09.png'),
    require('../assets/ground_10.png'),
    require('../assets/ground_11.png'),
    require('../assets/ground_12.png'),
    require('../assets/ground_13.png')
  ]

  useEffect(() => {
    if (jump && !run) {
      setRun(true)
    }
  }, [jump])

  useEffect(() => {
    //Generate initial ground items with x position
    const items = []
    for (let i = 0; i < ground_items_start; i++) {
      const randomIndex = Math.floor(Math.random() * 12)
      const newItem = {
        id: uuidv4(),
        img: images[randomIndex],
        x: ground_items_start_dst * i
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
        img: images[randomIndex]
      }
      const newItems = [...itemsToRender]
      newItems.shift()
      newItems.push(newItem)
      setItemsToRender(newItems)
      ground_update = 0
    }
  }, [time])

  return (
    <div className='ground'>
      {
        itemsToRender?.map((item) => (
          <div 
            className='ground-image-wrapper' 
            key={item?.id} 
            data-moving={run}
            style={{right: item.x || 0}}
          >
            {
              <img 
                key={'img'+item.id} 
                src={item.img} 
                className='ground-image' 
                alt='item' 
              />
            }
          </div>
        ))
      }
    </div>
  )
}