import React from 'react'
import { Link } from 'react-router-dom'
import { HiThumbUp, HiThumbDown } from 'react-icons/hi'

export default function Review({buyer, text, createdDate, recomendation}) {
  return (
    <div className='flex flex-row p-4 gap-8 bg-light-300 dark:bg-dark-200 rounded'>
      <div className='flex flex-col gap-4'>
        <Link to={`/user/${buyer.id}`}> 
          <div className='flex flex-row gap-2 items-center'>
            <div className='h-10 w-10 bg-light-500 dark:bg-dark-200 rounded flex items-center justify-center overflow-hidden'>
              <img src={`${import.meta.env.VITE_SERVER_URL}/../${buyer.image}`} alt="user image" className='max-w-full max-h-full object-contain'/>
            </div>
            <p className='default-text text-base font-openSans'>{buyer.firstName} {buyer.lastName}</p>
          </div>
        </Link>
        
        <p className='default-text font-roboto'>Залишений: {new Date(createdDate).toLocaleDateString()}</p>
      </div>
      <div className='flex flex-col gap-4'>
        {
          recomendation
            ? <div className='flex flex-row item-center gap-4 border-[1px] border-solid rounded p-2'>
                <HiThumbUp className='default-icon' size={26}/>
                <p className='default-text font-roboto'>Рекомендую</p>
              </div>
            : <div className='flex flex-row item-center gap-4 border-[1px] border-solid rounded p-2'>
                <HiThumbDown className='default-icon' size={26}/>
                <p className='default-text font-roboto'>Не рекомендую</p>
              </div>
        }
        <p className='default-text font-openSans'>
          {text}
        </p>
      </div>
    </div>
  )
}
