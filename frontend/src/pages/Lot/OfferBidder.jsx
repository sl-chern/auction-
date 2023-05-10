import React from 'react'
import getFormatedDate from '../../utils/getFormatedDate'

export default function OfferBidder({price, status, date}) {
  return (
    <div className='flex flex-row justify-between rounded w-full bg-light-300 dark:bg-dark-200 p-2 gap-2 items-center max-w-[800px]'>
      <p className='default-text font-openSans text-base w-[150px] ml-3'>{price}₴</p>
      <p className='default-text font-openSans text-base w-[140px]'>{getFormatedDate(date)}</p>
      <p className='default-text font-roboto text-lg w-[242px]'>Статус: {status}</p>
    </div>
  )
}
