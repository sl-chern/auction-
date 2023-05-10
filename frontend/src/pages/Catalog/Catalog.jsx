import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  return (
    <section className='w-full mt-2 flex flex-row gap-2'>
      <div className='flex flex-row flex-wrap grow'>
        Lots
      </div>
      <div className='flex flex-col w-[300px]'>

      </div>
    </section>
  )
}
