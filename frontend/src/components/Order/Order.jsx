import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserId } from '../../store/slices/userSlice'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import useDarkMode from '../../hooks/useDarkMode'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { orderStatusesOptions } from '../../data/statusOptions'
import { orderApi } from '../../services/orderService'
import { toast } from 'react-toastify'

export default function Order({id, image, seller, buyer, name, price, firstName, lastName, phone, dealType, deliveryType, paymentType, city, address, createdDate, orderStatus}) {
  const userId = useSelector(selectUserId)

  const [mode] = useDarkMode()

  const [status, setStatus] = useState(orderStatusesOptions.find(item => item.value === orderStatus))

  const theme = useSelectTheme(mode, "200px")

  const [changeStatus] = orderApi.useChangeOrderStatusMutation()

  return (
    <div className='w-full flex flex-row p-4 rounded bg-light-500 dark:bg-dark-200 gap-4'>
      <div className='flex w-1/4 h-min flex-col gap-1'>
        <Link to={`/lot/${id}`}>
          <div className='flex flex-col w-full gap-1'>
            <div className='aspect-square  w-full rounded flex items-center justify-center overflow-hidden'>
              <img src={`${import.meta.env.VITE_SERVER_URL}/../${image}`} alt={name} className='max-w-full max-h-full object-contain'/>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='default-text text-base leading-[1.1rem] font-openSans line-clamp-2'>{name}</p>
              <p className='default-text text-2xl font-oswald line-clamp-2 leading-8'>{price}₴</p>
            </div>
          </div>
        </Link>
        
      </div>
      <div className='flex flex-col gap-6 grow'>
        <div className='flex flex-col gap-1'>
          <h3 className='default-text font-oswald text-xl font-semibold'>Контактна інформація</h3>
          <div className='grid grid-cols-[max-content_max-content] gap-x-1'>
            <p className='default-text font-roboto text-lg'>{"Ім'я:"}</p>
            <p className='default-text font-roboto text-lg'>{firstName}</p>
            <p className='default-text font-roboto text-lg'>Прізвище:</p>
            <p className='default-text font-roboto text-lg'>{lastName}</p>
            <p className='default-text font-roboto text-lg'>Номер телефону</p>
            <p className='default-text font-roboto text-lg'>{phone}</p>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='default-text font-oswald text-xl font-semibold'>Інформація про доставку і оплату</h3>
          <div className='grid grid-cols-[max-content_max-content] gap-x-1'>
            <p className='default-text font-roboto text-lg'>Тип угоди:</p>
            <p className='default-text font-roboto text-lg'>{dealType}</p>
            <p className='default-text font-roboto text-lg'>Тип оплати:</p>
            <p className='default-text font-roboto text-lg'>{paymentType}</p>
            <p className='default-text font-roboto text-lg'>Тип доставки:</p>
            <p className='default-text font-roboto text-lg'>{deliveryType}</p>
            <p className='default-text font-roboto text-lg'>Місто:</p>
            <p className='default-text font-roboto text-lg'>{city}</p>
            <p className='default-text font-roboto text-lg'>Адреса:</p>
            <p className='default-text font-roboto text-lg'>{address}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[max-content_max-content] gap-2'>
          <p className='default-text font-roboto text-lg'>Дата створення:</p>
          <p className='default-text font-roboto text-lg'>{createdDate}</p>
          {
            userId === seller.id
              ? null
              : <>
                  <p className='default-text font-roboto text-lg'>Статус: </p>
                  <p className='default-text font-roboto text-lg'>{orderStatus}</p>
                </>
          }
        </div>
        {
            userId === seller.id
              ? <Select 
                  styles={theme}
                  placeholder='Статус замовлень'
                  value={status}
                  onChange={value => {
                    setStatus(value)
                    changeStatus({id, body: { status: value.value }})
                      .unwrap()
                      .then(() => toast.success('Статус замовлення був успішно оновлений'))
                      .catch(() => toast.error('Статус замовлення не був оновлений'))
                  }}
                  options={orderStatusesOptions}
                  isClearable
                />
              : null
          }
        <div className='flex flex-col gap-1 w-full'>
          <p className='default-text text-lg font-oswald line-clamp-2'>{userId === seller.id ? "Покупець" : "Власник"}</p>
          <Link to={`/user/${userId === seller.id ? buyer.id : seller.id}`}> 
            <div className='flex flex-row gap-2 items-center'>
              <div className='h-10 w-10 bg-light-500 dark:bg-dark-200 rounded flex items-center justify-center overflow-hidden'>
                <img src={`${import.meta.env.VITE_SERVER_URL}/../${userId === seller.id ? buyer.image : seller.image}`} alt="user image" className='max-w-full max-h-full object-contain'/>
              </div>
              <p className='default-text text-base font-openSans'>{userId === seller.id ? buyer.firstName : seller.firstName} {userId === seller.id ? buyer.lastName : seller.lastName}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
