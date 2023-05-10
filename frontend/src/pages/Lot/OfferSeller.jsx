import React, { useEffect } from 'react'
import userPlaceholderPicture from '../../assets/user-placeholder.png'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import getFormatedDate from '../../utils/getFormatedDate'

export default function OfferSeller({image, userId, firstName, lastName, price, status, date, id, changeOfferStatus}) {
  return (
    <div className='flex flex-row justify-between rounded w-full bg-light-300 dark:bg-dark-200 p-2 gap-2 items-center'>
      <Link to={`/user/${userId}`}>
        <div className='flex flex-row items-center gap-2 w-[400px]'>
          <img 
            alt="seller" 
            src={image ? `${import.meta.env.VITE_SERVER_URL}/../${image}` : userPlaceholderPicture}
            className='rounded h-10 overflow-hidden'
          />
          <p className='default-text font-roboto text-lg'>{firstName} {lastName}</p>
        </div>
      </Link>
      <p className='default-text font-openSans text-base w-[200px]'>{price}₴</p>
      <p className='default-text font-openSans text-base w-[140px]'>{getFormatedDate(date)}</p>
      <div className='flex flex-row gap-2'>
        {
          status === 'NEW'
            ? <>
                <Button onClick={() => changeOfferStatus(id, 'CONFIRMED')}>Підтвердити</Button>
                <Button onClick={() => changeOfferStatus(id, 'REJECTED')}>Відхилити</Button>
              </>
            : <p className='default-text font-roboto text-lg w-[242px]'>Статус: {status}</p>
        }
      </div>
    </div>
  )
}
