import React from 'react'
import './ToogleSwitch.css'

export default function ToogleSwitch({onClick, toogled}) {
  let toogledClassName = ''

  if(toogled)
    toogledClassName = 'toogled'

  return (
    <div onClick={() => onClick()} className={`flex items-center h-[30px] w-[55px] bg-dark-200 dark:bg-light-300 rounded-full p-[2px] transition-all duration-100 hover:cursor-pointer select-none ${toogledClassName}`}>
      <div className='aspect-square h-[26px] rounded-full dark:bg-dark-200 bg-light-300 transition-all duration-100'/>
    </div>
  )
}
