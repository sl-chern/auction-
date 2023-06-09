import React, { useState, useEffect, useRef } from 'react'
import PageLoading from '../PageLoading/PageLoading'
import { useDispatch } from 'react-redux'
import useDarkMode from '../../hooks/useDarkMode'
import { Oval } from 'react-loader-spinner'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { sortOptions } from '../../data/catalogOptions'
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa'
import Order from '../Order/Order'
import { orderStatusesOptions } from '../../data/statusOptions'

const take = 12

export default function OrderList({isLoading, trigger, count, orders, skip, setOrders, setSkip}) {
  const dispatch = useDispatch()

  const [paginationLoading, setPaginationLoading] = useState(false)

  const blockRef = useRef()

  const [ darkMode ] = useDarkMode()

  const [statuses, setStatuses] = useState([])
  const [sort, setSort] = useState()
  const [desc, setDesc] = useState(true)

  const [firstLoaded, setFirstLoaded] = useState(false)

  useEffect(() => {
    let timeout

    if(firstLoaded)
      timeout = setTimeout(() => {
        dispatch(setSkip(0))
        trigger({ take, skip: 0, sort, desc, statuses: statuses.map(item => item.value) }).unwrap().then(res => {
          dispatch(setOrders([...res]))
          setPaginationLoading(false)
        })
      }, 1500)
    
    return () => clearTimeout(timeout)
  }, [sort, desc, statuses])

  useEffect(() => {
    if(orders.length === 0) {
      trigger({ take, skip: skip, sort, desc, statuses: statuses.map(item => item.value) }).unwrap().then(res => {
        dispatch(setOrders([...orders, ...res]))
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

      trigger({ take, skip: skip + take, sort, desc, statuses: statuses.map(item => item.value) }).unwrap().then(res => {
        dispatch(setOrders([...orders, ...res]))
        dispatch(setSkip(skip + take))
        setPaginationLoading(false)
      })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [orders])

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
          <Select 
            styles={useSelectTheme(darkMode, "350px")}
            placeholder='Статуси замовлень'
            value={statuses}
            onChange={value => setStatuses(value)}
            options={orderStatusesOptions}
            isClearable
            isMulti
          />
        </div>
        {
          orders instanceof Array ?
            orders.length > 0 ?
              <section className='w-full flex flex-col gap-4' ref={blockRef}>
                {
                  orders.map((item, index) => 
                    <Order
                      key={`order${index}`}
                      id={item.lot.id}
                      name={item.lot.name}
                      image={item.lot.images[0]?.path}
                      seller={item.lot.user}
                      buyer={item.user}
                      price={item.price}
                      firstName={item.firstName}
                      lastName={item.lastName}
                      phone={item.phone}
                      createdDate={new Date(item.createdDate).toLocaleDateString('uk-UK')}
                      dealType={item.dealType.name}
                      deliveryType={item.delivery.deliveryType.name}
                      paymentType={item.paymentType.name}
                      city={item.delivery.city}
                      address={item.delivery.address}
                      orderStatus={item.orderStatus}
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
