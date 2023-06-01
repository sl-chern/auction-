import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'

export default function WonLot({id, name, price, status, userId, firstName, lastName, path}) {
  const navigate = useNavigate()

  return (
    <div className='w-full flex flex-col p-3 bg-light-300 dark:bg-dark-200 rounded'>
      <div className='flex flex-row w-full justify-between'>
        <div className='flex flex-row gap-6'>
          <div className='aspect-square h-[160px] flex justify-center items-center select-none'>
            <img 
              src={`${import.meta.env.VITE_SERVER_URL}/../${path}`} 
              className='max-w-full max-h-full object-contain'
              alt={name}
            />
          </div>
          <div className='flex flex-col ml-6'>
            <p className='default-text font-oswald text-3xl'>{name}</p>
            <p className='default-text font-openSans text-lg mt-4'>{!!status ? 'За пропозицією' : 'За найбільшою ставкою'}</p>
            <p className='default-text font-oswald text-2xl'>{price}₴</p>
          </div>
        </div>
        <div className='flex w-max mr-0'>
          <Button outline={true} onClick={() => navigate('/wins/:id/delivery')}>
            Оформити доставку
          </Button>
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        <p className='text-dark-400 dark:text-light-400 font-semibold font-openSans text-lg'>Власник лоту:</p>
        <Link to={`/user/${userId}`} className='default-text font-openSans text-lg flex relative after:w-full after:scale-0 after:bottom-[0px] after:absolute after:h-[2px] after:bg-dark-300 dark:after:bg-light-300 hover:after:scale-100'>{firstName} {lastName}</Link>
      </div>
    </div>
  )
}
