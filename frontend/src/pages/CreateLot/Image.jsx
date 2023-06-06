import React from 'react'
import { ImCross } from 'react-icons/im'

export default function Image({index, image, callback}) {
  return (
    <div className='relative h-20 w-auto'>
      <div className='overflow-hidden border-[1px] border-solid border-dark-200 dark:border-light-300 rounded h-full w-auto'>
        <img 
          src={image} 
          alt={`lot image ${index}`}
          className='h-full w-auto'
        />
      </div>
      <div 
        className='absolute rounded-full top-0 right-0 z-10 bg-dark-200 dark:bg-light-300 p-[4px] translate-x-[20%] translate-y-[-20%] hover:cursor-pointer border-[1px] border-solid border-light-300 dark:border-dark-200'
        onClick={() => callback(index)}
      >
        <ImCross className='text-light-300 dark:text-dark-200' size={12}/>
      </div>
    </div>
  )
}
