import React, { useState, useEffect } from 'react'
import PageLoading from '../../components/PageLoading/PageLoading'
import useDarkMode from '../../hooks/useDarkMode'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { userApi } from '../../services/userService'
import Review from '../../components/Review/Review'

const options = [
  { value: "recomendation", label: "Рекомендація" },
  { value: "date", label: "Дата" },
]

export default function ReviewContent() {
  const { id } = useParams()
  const [ darkMode ] = useDarkMode()

  const [sort, setSort] = useState()
  const [desc, setDesc] = useState(true)

  const [firstLoaded, setFirstLoaded] = useState(false)

  const [trigger, { data: reviews, isLoading }] = userApi.useLazyGetReviewsQuery()

  useEffect(() => {
    let interval
  
    if(firstLoaded) {
      interval = setTimeout(() => {
        trigger({id, body: { sort, desc }})
      }, 1500)
    }

    return () => clearTimeout(interval)
  }, [sort, desc])

  useEffect(() => {
    if(!reviews) {
      trigger({id, body: { sort, desc }})
    }
    setFirstLoaded(true)
  }, [])

  return (
    <PageLoading loading={isLoading}>
      <div className='flex flex-col w-full gap-4'>
        <div className='flex flex-row-reverse justify-between items-center'>
          <div className='flex flex-row items-center gap-1'>
            <Select 
              styles={useSelectTheme(darkMode, "250px")}
              placeholder='Сортувати за'
              value={sort}
              onChange={value => setSort(value)}
              options={options}
              isClearable
            />
            <div className="h-10 rounded w-10 ml-2 border-[1px] border-solid border-dark-200 dark:border-light-300 flex justify-center items-center hover:cursor-pointer select-none hover:bg-light-400 dark:hover:bg-dark-400" onClick={() => setDesc(!desc)}>
              {desc ? 
                <FaSortAmountDown size="30px" className="default-icon"/> : 
                <FaSortAmountDownAlt size="30px" className="default-icon"/>
              }
            </div>
          </div>
          <h2 className='default-text font-roboto text-4xl font-medium'>Відгуки</h2>
        </div>
        <section className='w-full flex flex-col gap-4'>     
          {
            reviews instanceof Array ?
              reviews.length > 0 ?
                reviews.map((item, index) => 
                  <Review
                    key={`review${index}`}
                    { ...item} 
                  />
                )
                : <div className="w-full flex py-12 justify-center">
                    <p className='default-text text-xj font-openSans'>Відгуки не знайдено</p>
                  </div>
              : null
          }
        </section>
      </div>
    </PageLoading>
  )
}
