import React, { useState, useEffect } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

export default function Carousel({images = [], height}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex(index === images.length-1 ? 0 : index+1), 10000)
    return () => clearInterval(interval)
  }, [index])
  
  return (
    <div style={{height: height}} className='flex flex-row gap-2'>
      <div className='overflow-y-scroll'>
        <div className='flex flex-col gap-2 h-max'>
          {
            images.map((item, ind) => 
              <div key={`carouselBut${ind}`} onClick={() => setIndex(ind)} className='relative overflow-hidden group border-[1px] border-solid border-dark-200 dark:border-light-300 rounded w-[100px] hover:cursor-pointer'>
                <img 
                  src={`${import.meta.env.VITE_SERVER_URL}/../${item}`} 
                  alt={`image button ${ind}`}
                />
                <div className='w-full h-full opacity-30 z-10 group-hover:dark:bg-light-300 group-hover:bg-dark-200 absolute top-0 left-0'></div>
              </div>
            )
          }
        </div>
      </div>
      <div className='relative flex flex-row aspect-square overflow-hidden border-[1px] border-solid border-dark-200 dark:border-light-300 rounded'>
        {
          images.map((item, ind) => 
            <div 
              className='aspect-square h-full flex justify-center items-center transition-transform duration-300 select-none' 
              key={`carousel${ind}`}
              style={{transform: `translateX(${index * -100}%)`}}
            >
              <img 
                src={`${import.meta.env.VITE_SERVER_URL}/../${item}`} 
                className='max-w-full max-h-full object-contain'
                alt={`image ${ind}`}
              />
            </div>
          )
        }
        <div 
          className='flex items-center justify-center absolute top-1/2 right-0 translate-y-[-50%] px-2 py-4 rounded-l dark:bg-dark-200 bg-light-300 border-[1px] border-solid dark:border-light-300 border-dark-200 border-r-0 hover:cursor-pointer'
          onClick={() => setIndex(index === images.length-1 ? 0 : index+1)}
        >
          <FaArrowRight className='text-dark-200 dark:text-light-300' size={20}/>
        </div>
        <div 
          className='flex items-center justify-center absolute top-1/2 left-0 translate-y-[-50%] px-2 py-4 rounded-r dark:bg-dark-200 bg-light-300 border-[1px] border-solid dark:border-light-300 border-dark-200 border-l-0 hover:cursor-pointer'
          onClick={() => setIndex(index === 0 ? images.length-1 : index-1)}
        >
          <FaArrowLeft className='text-dark-200 dark:text-light-300' size={20}/>
        </div>
      </div>
    </div>
  )
}
