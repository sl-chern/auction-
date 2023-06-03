import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { orderApi } from '../../services/orderService'
import PageLoading from '../../components/PageLoading/PageLoading'
import { Link } from 'react-router-dom'
import { useForm, useFormState } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormField from '../../components/FormField/FormField'
import FormTextArea from '../../components/FormTextArea/FormTextArea'
import FormSelect from '../../components/FormSelect/FormSelect'
import Button from '../../components/Button/Button'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = orderApi.useFetchLotCheckoutInfoQuery(id)
  const [ createOrder, { data: creatingData, isLoading: orderCreating, error: creatingErrors } ] = orderApi.useCreateOrderMutation()

  useEffect(() => {
    if(!isLoading && !!error)
      navigate('/')
  }, [isLoading, error])

  const schema = yup.object().shape({
    firstName: yup.string("Ім'я повинно бути строкою").required("Ім'я повинно бути вказаним").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Ім'я містить некоректні символи"),
    lastName: yup.string("Прізвище повинно бути строкою").required("Прізвище повинно бути вказаним").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Прізвище містить некоректні символи"),
    address: yup.string("Адреса повинна бути строкою").required("Адреса повинна бути вказана").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9.,]+$/, "Адреса містить некоректні символи"),
    city: yup.string("Місто повинно бути строкою").required("Місто повинно бути вказаним").min(2, "Місто повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Місто містить некоректні символи"),
    phone: yup.string("Телефон повинен бути строкою").required("Телефон повинен бути вказаним").matches(/^[+0-9]+$/, "Номер містить некоректні символи").min(13, "Телефон повинен бути 13 символів у довжину").max(13, "Телефон повинен бути 13 символів у довжину"),
    dealType: yup.object("").required("Тип угоди повинен бути вказаним"),
    deliveryType: yup.object("").required("Тип доставки повинен бути вказаним"),
    paymentType: yup.object("").required("Тип оплати повинен бути вказаним"),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })

  const { errors } = useFormState({control})

  const submitOrder = async (data) => {
    const body = { ...data }

    body.dealType = body.dealType.value
    body.deliveryType = body.deliveryType.value
    body.paymentType = body.paymentType.value

    createOrder({id, body})
  }

  useEffect(() => {
    if(!orderCreating && !!creatingData)
      navigate('/')
  }, [creatingData, orderCreating, creatingErrors])

  return (
    <PageLoading loading={isLoading}>
      <section className='flex flex-row gap-4 mt-2 h-max w-3/5 mx-auto'>
        <div className='w-3/5'>
          <form onSubmit={handleSubmit(submitOrder)} className='flex flex-col checkout-form gap-6'>
            <div className='flex flex-col gap-4'>
              <h2 className='default-text font-oswald text-3xl'>Контактна інформація</h2>
              <FormField
                control={control}
                name="firstName"
                label="Ім'я"
                helperText={errors.firstName?.message}
              />
              <FormField
                control={control}
                name="lastName"
                label="Прізвище"
                helperText={errors.lastName?.message}
              />
              <FormField
                control={control}
                name="phone"
                label="Номер телефону"
                helperText={errors.phone?.message}
              />
            </div>
            <div className='flex flex-col gap-4'>
              <h2 className='default-text font-oswald text-3xl'>Інформація про доставку і оплату</h2>
              <div className='flex flex-col'>
                <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.dealType?.message ? 'error-text' : ''}`}>Тип угоди</p>
                <FormSelect 
                  control={control}
                  name='dealType'
                  helperText={errors.dealType?.message}
                  options={data?.dealTypeList.map(item => ({ value: item.dealType.id, label: item.dealType.name }))}
                  placeholder='Обрати'
                  className='mt-1'
                />
              </div>
              <div className='flex flex-col'>
                <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.paymentType?.message ? 'error-text' : ''}`}>Тип оплати</p>
                <FormSelect 
                  control={control}
                  name='paymentType'
                  helperText={errors.paymentType?.message}
                  options={data?.paymentTypeList.map(item => ({ value: item.paymentType.id, label: item.paymentType.name }))}
                  placeholder='Обрати'
                  className='mt-1'
                />
              </div>
              <div className='flex flex-col'>
                <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.deliveryType?.message ? 'error-text' : ''}`}>Тип доставки</p>
                <FormSelect 
                  control={control}
                  name='deliveryType'
                  helperText={errors.deliveryType?.message}
                  options={data?.deliveryTypeList.map(item => ({ value: item.deliveryType.id, label: item.deliveryType.name }))}
                  placeholder='Обрати'
                  className='mt-1'
                />
              </div>
              <FormField
                control={control}
                name="city"
                label="Місто"
                helperText={errors.city?.message}
              />
              <FormTextArea 
                control={control}
                name="address"
                label="Адреса"
                helperText={errors.address?.message}
              />
              <Button type='submit' outline={true}>Оформити</Button>
            </div>
          </form>
        </div>
        <div className='flex w-2/5 sticky top-2 h-min rounded flex-col p-2 gap-1'>
          <div className='aspect-square bg-light-500 dark:bg-dark-200 w-full rounded flex items-center justify-center overflow-hidden'>
            <img src={`${import.meta.env.VITE_SERVER_URL}/../${data?.images[0]?.path}`} alt={data?.name} className='max-w-full max-h-full object-contain'/>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='default-text text-base leading-[1.1rem] font-openSans line-clamp-2'>{data?.name}</p>
            <p className='default-text text-2xl font-oswald line-clamp-2 leading-8'>{data?.currentPrice}₴</p>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <p className='default-text text-lg font-oswald line-clamp-2'>Власник</p>
            <Link to={`/user/${data?.user.id}`}> 
              <div className='flex flex-row gap-2 items-center'>
                <div className='h-10 w-10 bg-light-500 dark:bg-dark-200 rounded flex items-center justify-center overflow-hidden'>
                  <img src={`${import.meta.env.VITE_SERVER_URL}/../${data?.user.image}`} alt={data?.name} className='max-w-full max-h-full object-contain'/>
                </div>
                <p className='default-text text-base font-openSans'>{data?.user.firstName} {data?.user.lastName}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </PageLoading>
  )
}
