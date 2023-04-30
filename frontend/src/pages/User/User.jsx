import React, { useEffect, useState } from 'react'
import './User.css'
import { useParams } from 'react-router-dom'
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
import { MdEmail } from 'react-icons/md'
import { AiFillPhone } from 'react-icons/ai'
import FormTextArea from '../../components/FormTextArea/FormTextArea'

export default function User() {
  const { id } = useParams()

  const { data: user, isLoading } = userApi.useFetchUserQuery(id)
  const userId = useSelector(selectUserId)

  const [isEdit, setIsEdit] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const [updateUser, { data, isLoading: updateLoading }] = userApi.useUpdateUserMutation()
  
  const schema = yup.object().shape({
    firstName: yup.string("Ім'я повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Ім'я містить некоректні символи"),
    lastName: yup.string("Прізвище повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/, "Прізвище містить некоректні символи"),
    about: yup.string("Інформація про себе повинна бути строкою"),
    login: yup.string("Логін повинен бути строкою").min(2, "Ім'я повинно бути довше 2 букв"),
    email: yup.string("Email повинен бути строкою").email("Поле не є email-ом"),
    phone: yup.string("Телефон повинен бути строкою").min(13, "Телефон повинен бути 13 символів у довжину").max(13, "Телефон повинен бути 13 символів у довжину"),
    image: yup.object().test("is-file", "Картинка має бути файлом", value => value instanceof File).notRequired()
  })

  const { register, control, handleSubmit, reset, setValue, getValues } = useForm({
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
  }

  useEffect(() => {
    console.log(user)
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
    updateUser({id: user.id, body: getValues()})
    setIsEdit(!isEdit)
  }

  const { errors } = useFormState({control})

  return (
    <PageLoading loading={isLoading}>
      <section className='user-page'>
        <div className='user-page__information-block'>
          <div className='user-page__photo'>
            <img 
              src={user?.image || userPlaceholderPicture}
              alt=""
            />
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
              <div></div>
              {
                userId === user?.id
                  ? isEdit 
                    ? <div className='flex flex-row gap-2'>
                        <Button type="button" onClick={() => handleCancel()}>Відмінити</Button>
                        <Button outline={true} onClick={handleUpdate}>Змінити</Button>
                      </div>
                    : <Button type="button" onClick={() => onClick()}>Редагувати</Button>
                  : null
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
                    {
                      isEdit 
                        ? <div className="flex flex-row w-[300px] mt-4">
                            <FormField
                              control={control}
                              name="email"
                              label="Email"
                              helperText={errors.email?.message}
                            />
                          </div>
                        : <p className='default-text font-roboto text-xl'>{user?.email}</p>
                    }
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
              <p>ne panel</p>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </PageLoading>
  )
}
