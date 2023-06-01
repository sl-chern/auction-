import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserId } from '../../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { orderApi } from '../../services/orderService'
import PageLoading from '../../components/PageLoading/PageLoading'
import WonLot from './WonLot'

export default function Wins() {
  const userId = useSelector(selectUserId)

  const navigate = useNavigate()

  useEffect(() => {
    if(!userId)
      navigate('/')
  }, [userId])

  const { data, isLoading } = orderApi.useFetchWinsQuery(userId)

  return (
    <section className='flex flex-col w-full mt-2 gap-2'>
      <PageLoading loading={isLoading}>
        <h2 className='default-text font-openSans text-4xl font-semibold'>Перемоги у торгах</h2>
        {
          !isLoading
            ? data.map((item, index) => 
                <WonLot
                  key={`wonlot${index}`}
                  {...item}
                />
              )
            : null
        }
      </PageLoading>
    </section>
  )
}
