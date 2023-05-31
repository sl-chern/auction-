import React from 'react'
import { Link } from 'react-router-dom'
import getStringDate from '../../utils/getRemainingTime'

export default function ShortLot({id, image, name, price, count, endDate}) {
  return (
    <Link to={`/lot/${id}`}>
      <div className='flex flex-col gap-1'>
        <div className='aspect-square bg-light-500 dark:bg-dark-200 w-full rounded flex items-center justify-center overflow-hidden relative group'>
          <img src={image} alt={name} className='max-w-full max-h-full object-contain'/>
          <div className='p-[2px] absolute left-0 top-4 bg-light-300 border-y-[1px] border-r-[1px] border-solid border-dark-300 rounded-br group-hover:translate-x-[-100%] transition-transform duration-150'>
            <p className='text-dark-300 font-roboto text-sm'>Ставок: {count}</p>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='default-text text-base leading-[1.1rem] font-openSans line-clamp-2'>{name}</p>
          <p className='default-text text-xl font-oswald line-clamp-2 leading-6'>{price}₴</p>
          <p className='text-dark-400 dark:text-light-400 text-sm font-openSans leading-4 '>До кінця торгів: {getStringDate(endDate)}</p>
        </div>
      </div>
    </Link>
  )
}
