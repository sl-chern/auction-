import React, { useEffect, useState } from 'react'
import './User.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { userApi } from '../../services/userService'
import PageLoading from '../../components/PageLoading/PageLoading'
import userPlaceholderPicture from '../../assets/user-placeholder.png'
import Button from '../../components/Button/Button'
import { useSelector } from 'react-redux'
import { selectUserId } from '../../store/slices/userSlice'
import { useForm, useFormState } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormField from '../../components/FormField/FormField'
import { HiUser } from 'react-icons/hi'
import { MdEmail, MdRecommend, MdSell } from 'react-icons/md'
import { AiFillPhone } from 'react-icons/ai'
import FormTextArea from '../../components/FormTextArea/FormTextArea'
import { GoPencil } from 'react-icons/go'
import LotContent from './LotContent'
import { lotApi } from '../../services/lotService'
import { changeAllCurrentLots, changeAllCurrentLotsSkip, selectAllCurrentLots, selectAllCurrentLotsSkip } from '../../store/slices/userLotsSlice'
import LotList from '../../components/LotList/LotList'
import OrderContent from './OrderContent'
import CreateReview from './CreateReview'
import ReviewContent from './ReviewContent'

export default function User() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { data: user, isLoading } = userApi.useFetchUserQuery(id)
  const userId = useSelector(selectUserId)

  const [isEdit, setIsEdit] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const [updateUser] = userApi.useUpdateUserMutation()

  const [image, setImage] = useState()
  
  const schema = yup.object().shape({
    firstName: yup.string("Ім'я повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Ім'я містить некоректні символи"),
    lastName: yup.string("Прізвище повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Прізвище містить некоректні символи"),
    about: yup.string("Інформація про себе повинна бути строкою"),
    login: yup.string("Логін повинен бути строкою").min(2, "Ім'я повинно бути довше 2 букв"),
    email: yup.string("Email повинен бути строкою").email("Поле не є email-ом"),
    phone: yup.string("Телефон повинен бути строкою").min(13, "Телефон повинен бути 13 символів у довжину").max(13, "Телефон повинен бути 13 символів у довжину"),
    image: yup.object().test("is-file", "Картинка має бути файлом", value => value instanceof File).notRequired()
  })

  const { register, control, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })

  const setValues = () => {
    setValue("firstName", user.firstName)
    setValue("lastName", user.lastName)
    setValue("about", user.about)
    setValue("email", user.email)
    setValue("phone", user.phone)
    setValue("login", user.login)
    setImage(null)
  }

  useEffect(() => {
    if(user?.id) {
      setValues()
    }
  }, [user?.id])


  const onClick = () => {
    setIsEdit(!isEdit)
  }


  const handleCancel = () => {
    setIsEdit(!isEdit)
    setValues()
  }

  const handleUpdate = () => {
    let body = new FormData()

    const data = getValues()

    body.append('firstName', data.firstName)
    body.append('lastName', data.lastName)
    body.append('phone', data.phone)
    body.append('email', data.email)
    body.append('login', data.login)
    body.append('about', data.about)
    body.append('image', image)
    
    updateUser({id: user.id, body})
    setIsEdit(!isEdit)
  }

  const { errors } = useFormState({control})

  const { data: amount, isLoading: amountsLoading } = lotApi.useGetUsersAllCurrentLotsAmountQuery()

  const [ lotsTrigger, { isLoading: lotsLoading }] = lotApi.useLazyGetUsersAllCurrentLotsQuery()
  const lots = useSelector(selectAllCurrentLots)
  const lotsSkip = useSelector(selectAllCurrentLotsSkip)

  const [visibility, setVisibility] = useState(false)

  return (
    <PageLoading loading={isLoading}>
      <section className='user-page'>
        <div className='user-page__information-block'>
          <div className='relative h-full'>
            <div className='user-page__photo'>
              <img 
                src={image ? URL.createObjectURL(image) : user?.image || userPlaceholderPicture}
                alt=""
              />
            </div>
            {isEdit 
              ? <div 
                  className='absolute rounded-full top-0 right-0 z-10 bg-dark-200 dark:bg-light-300 p-[6px] translate-x-[20%] translate-y-[-20%] hover:cursor-pointer border-[1px] border-solid border-light-300 dark:border-dark-200'
                  onClick={() => document.querySelector('[name=image]').click()}
                >
                  <GoPencil className='text-light-300 dark:text-dark-200' size={16}/>
                </div>
              : null
            }
            <input type="file" hidden {...register("image", {
              onChange: e => setImage(e.nativeEvent.target.files[0])
            })}/>
          </div>
          <div className='user-page__user-data'>
            {
              isEdit 
                ? <div className="flex flex-row gap-2 w-[600px]">
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
                  </div>
                : <p className='default-text user-page__user-full-name'>{user?.firstName} {user?.lastName}</p>
            }
            <div className='user-page__stats'>
              <div className='flex flex-row gap-12 items-center'>
                <div className='flex flex-row items-center gap-1 h-min'>
                  <MdSell className='default-icon' size={22}/>
                  <p className='default-text text-lg font-roboto'>{user?.amountOrders} лотів продано</p>
                </div>
                <div className='flex flex-row items-center gap-1 h-min'>
                  { 
                    user?.reviewsAmount > 0
                      ? <>
                          <MdRecommend className='default-icon' size={22}/>
                          <p className='default-text text-lg font-roboto'>{`${(user?.positiveReviewAmount/user?.reviewsAmount).toFixed(2) * 100}% позитивних відгуків`}</p>
                        </>
                      : <p className='default-text text-lg font-roboto'>Відгуків немає</p>
                  }
                </div>
              </div>
              {
                userId === user?.id
                  ? isEdit 
                    ? <div className='flex flex-row gap-2'>
                        <Button type="button" onClick={() => handleCancel()}>Відмінити</Button>
                        <Button outline={true} onClick={handleUpdate}>Змінити</Button>
                      </div>
                    : <div className='flex flex-row gap-2'>
                        <div className='create-button'>
                          <Button type="button" onClick={() => navigate('/create')}>Створити лот</Button>
                        </div>
                        <Button type="button" onClick={() => onClick()}>Редагувати</Button>
                      </div>
                  : <div className='create-button'>
                      <Button type="button" onClick={() => setVisibility(true)}>Зробити відгук</Button>
                    </div>
              }
            </div>
          </div>
        </div>
        <div className='user-page__tabs'>
          <Tabs className='flex flex-col w-full' selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList className='flex flex-row gap-12'>
              <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                <p>Особиста інформація</p>
                <div/>
              </Tab>
              <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                <p>Лоти</p>
                <div/>
              </Tab>
              {
                userId === +id
                  ? <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                      <p>Замовлення</p>
                      <div/>
                    </Tab>
                  : null
              }
              <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                <p>Відгуки</p>
                <div/>
              </Tab>
            </TabList>

            <TabPanel className='user-page__tab-panel'>
              <div className='user-page__about'>
                <h2 className='user-page__about-header default-text'>Про себе</h2>
                {
                  isEdit 
                    ? <FormTextArea 
                        control={control}
                        name="about"
                        label="Про себе"
                        helperText={errors.login?.about}
                      />
                    : <p className='default-text user-page__about-text'>{user?.about.replace('\\n','\n')}</p>
                }
                <div className='user-page__contact-info'>
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-[3px]'>
                      <HiUser className='default-icon' size={18}/>
                      <p className='text-lg font-oswald text-dark-400 dark:text-light-400'>Логін</p>
                    </div>
                    {
                      isEdit 
                        ? <div className="flex flex-row w-[300px] mt-4">
                            <FormField
                              control={control}
                              name="login"
                              label="Логін"
                              helperText={errors.login?.message}
                            />
                          </div>
                        : <p className='default-text font-roboto text-xl'>{user?.login}</p>
                    }
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-[3px]'>
                      <MdEmail className='default-icon' size={18}/>
                      <p className='text-lg font-oswald text-dark-400 dark:text-light-400'>Email</p>
                    </div>
                    <p className='default-text font-roboto text-xl'>{user?.email}</p>
                  </div>
                  
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-[3px]'>
                      <AiFillPhone className='default-icon' size={18}/>
                      <p className='text-lg font-oswald text-dark-400 dark:text-light-400'>Номер телефону</p>
                    </div>
                    {
                      isEdit 
                        ? <div className="flex flex-row w-[300px] mt-4">
                            <FormField
                              control={control}
                              name="phone"
                              label="Номер телефону"
                              helperText={errors.phone?.message}
                            />
                          </div>
                        : <p className='default-text font-roboto text-xl'>{user?.phone}</p>
                    }
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel className='user-page__tab-panel'>
              {
                userId === +id 
                  ? <LotContent />
                  : <PageLoading loading={amountsLoading}>
                      <LotList 
                        lots={lots}
                        skip={lotsSkip}
                        setLots={changeAllCurrentLots}
                        setSkip={changeAllCurrentLotsSkip}
                        isLoading={lotsLoading}
                        trigger={(body) => lotsTrigger({id, body})}
                        count={amount?.amount}
                        label={'Усі лоти'}
                      />
                    </PageLoading>
              }
            </TabPanel>
            {
              userId === +id
              ? <TabPanel className='user-page__tab-panel'>
                  <OrderContent />
                </TabPanel>
              : null
            }
            <TabPanel className='user-page__tab-panel'>
              <ReviewContent />
            </TabPanel>
          </Tabs>
        </div>
      </section>
      <CreateReview visibility={visibility} setVisibility={setVisibility}/>
    </PageLoading>
  )
}
