import React, { useState, useEffect, useRef } from 'react'
import PageLoading from '../PageLoading/PageLoading'
import { useDispatch } from 'react-redux'
import ShortLot from '../ShortLot/ShortLot'
import useDarkMode from '../../hooks/useDarkMode'
import { Oval } from 'react-loader-spinner'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { sortOptions } from '../../data/catalogOptions'
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa'

const take = 12

export default function LotList({isLoading, trigger, count, lots, skip, setLots, setSkip, label = 0}) {
  const dispatch = useDispatch()

  const [paginationLoading, setPaginationLoading] = useState(false)

  const blockRef = useRef()

  const [ darkMode ] = useDarkMode()

  const [sort, setSort] = useState()
  const [desc, setDesc] = useState(true)

  const [firstLoaded, setFirstLoaded] = useState(false)

  useEffect(() => {
    let timeout

    if(firstLoaded)
      timeout = setTimeout(() => {
        dispatch(setSkip(0))
        trigger({ take, skip: 0, sort, desc }).unwrap().then(res => {
          dispatch(setLots([...res]))
          setPaginationLoading(false)
        })
      }, 1500)
    
    return () => clearTimeout(timeout)
  }, [sort, desc])

  useEffect(() => {
    if(lots.length === 0) {
      trigger({ take, skip: skip, sort, desc }).unwrap().then(res => {
        dispatch(setLots([...lots, ...res]))
        setPaginationLoading(false)
      })
    }
    setFirstLoaded(true)
  }, [])

  const handleScroll = async () => {
    const scrollBottom = blockRef.current.getBoundingClientRect().bottom <= window.innerHeight

    if (scrollBottom && skip + take < count) {
      setPaginationLoading(true)

      window.removeEventListener('scroll',  handleScroll)

      trigger({ take, skip: skip + take, sort, desc }).unwrap().then(res => {
        dispatch(setLots([...lots, ...res]))
        dispatch(setSkip(skip + take))
        setPaginationLoading(false)
      })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lots])

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
              options={sortOptions}
              isClearable
            />
            <div className="h-10 rounded w-10 ml-2 border-[1px] border-solid border-dark-200 dark:border-light-300 flex justify-center items-center hover:cursor-pointer select-none hover:bg-light-400 dark:hover:bg-dark-400" onClick={() => setDesc(!desc)}>
              {desc ? 
                <FaSortAmountDown size="30px" className="default-icon"/> : 
                <FaSortAmountDownAlt size="30px" className="default-icon"/>
              }
            </div>
          </div>
          {
            !!label
              ? <h2 className='default-text font-roboto text-4xl font-medium'>{label}</h2>
              : null
          }
        </div>
        {
          lots instanceof Array ?
            lots.length > 0 ?
              <section className='w-full grid gap-4 grid-cols-4' ref={blockRef}>
                {
                  lots.map((item, index) => 
                    <ShortLot 
                      key={`shortlot${index}`}
                      id={item.id}
                      name={item.name}
                      image={`${import.meta.env.VITE_SERVER_URL}/../${item?.images[0]?.path}`}
                      price={item.currentPrice}
                      startPrice={item.startPrice}
                      count={item._count.bets}
                      endDate={item.endDate}
                    />
                  )
                }
              </section>
              : <div className="w-full flex py-12 justify-center">
                  <p className='default-text text-xj font-openSans'>Лотів не знайдено</p>
                </div>
            : null
        }
        {
          paginationLoading ?
            <div className="w-full flex justify-center items-center mt-2">
              <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
            </div>
            : null
          }
      </div>
    </PageLoading>
  )
}
