import React, { useEffect, useState } from 'react'
import { lotApi } from '../../services/lotService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageLoading from '../../components/PageLoading/PageLoading'
import Carousel from '../../components/Carousel/Carousel'
import getStringDate from '../../utils/getRemainingTime'
import userPlaceholderPicture from '../../assets/user-placeholder.png'
import Button from '../../components/Button/Button'
import { useForm, useFormState } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormField from '../../components/FormField/FormField'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccessToken } from '../../store/slices/authenticationSlice'
import useSocket from '../../hooks/useSocket'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import getFormatedDate from '../../utils/getFormatedDate'
import { selectUserId } from '../../store/slices/userSlice'
import OfferSeller from './OfferSeller'
import OfferBidder from './OfferBidder'
import getConvertedValue from '../../utils/getConvertedValue'

export default function Lot() {
  const { id } = useParams()

  const navigate = useNavigate()

  const socket = useSocket()

  const dispatch = useDispatch()

  const [tabIndex, setTabIndex] = useState(0)

  const userId = useSelector(selectUserId)

  const {data: lot, isLoading: lotLoading} = lotApi.useFetchLotQuery(id)
  const {data: bets, isLoading: betsLoading} = lotApi.useGetBetsQuery(id)
  const {data: offers, isLoading: offersLoading} = lotApi.useGetOffersQuery(id)

  useEffect(() => {
    socket.emit("joinRoom", id)

    socket.on("newBet", async data => {
      dispatch(lotApi.util.invalidateTags(["Bets", "Lot"]))
      betReset({
        price: ""
      }, {
        keepErrors: false, 
        keepDirty: false,
      })
    })

    socket.on("newOffer", async data => {
      dispatch(lotApi.util.invalidateTags(["Lot", "Offers"]))
      offerReset({
        price: ""
      }, {
        keepErrors: false, 
        keepDirty: false,
      })
    })

    socket.on("changedOfferStatus", async data => {
      dispatch(lotApi.util.invalidateTags(["Offers"]))
    })
  }, [id])

  const accessToken = useSelector(selectAccessToken)

  const betSchema = yup.object().shape({
    price: yup
      .string()
      .test(
        'is-decimal', 
        'Ціна не є числом', 
        value => {
          if(/^\d*\.{0,1}\d{0,2}$/.test(value) === true || value === '' || value === undefined)
            return true
          return false
        }
      )
      .test(
        'is-bet', 
        'Некоректна ціна', 
        value => {
          if(value === '' || value === undefined)
            return true
          if(lot?.betStep) {
            if(+value <= +lot?.currentPrice + +lot?.betStep)
              return false
          }
          if(+value <= +lot?.currentPrice)
            return false
          return true
        }
      ),
  })

  const offerSchema = yup.object().shape({
    price: yup
      .string()
      .test(
        'is-decimal', 
        'Ціна не є числом', 
        value => {
          if(/^\d*\.{0,1}\d{0,2}$/.test(value) === true || value === '' || value === undefined)
            return true
          return false
        }
      )
      .test(
        'is-bet', 
        'Некоректна ціна', 
        value => {
          if(value === '' || value === undefined)
            return true
          if(lot?.minOfferPrice) {
            if(+value <= +lot?.minOfferPrice)
              return false
          }
          return true
        }
      ),
  })

  const { control: betControl, handleSubmit: betHandleSubmit, reset: betReset } = useForm({
    resolver: yupResolver(betSchema),
    mode: "onTouched"
  })

  const { control: offerControl, handleSubmit: offerHandleSubmit, reset: offerReset } = useForm({
    resolver: yupResolver(offerSchema),
    mode: "onTouched"
  })

  const { errors: betErrors } = useFormState({control: betControl})
  const { errors: offerErrors } = useFormState({control: offerControl})

  const handleCreateBet = (data) => {
    const bet = {
      lotId: id,
      accessToken,
      price: data.price
    }

    socket.emit("createBet", bet)
  }

  const handleCreateOffer = (data) => {
    const offer = {
      lotId: id,
      accessToken,
      price: data.price
    }

    socket.emit("createOffer", offer)
  }

  const changeOfferStatus = async (id, status) => {
    const body = {
      status,
      id,
      accessToken
    }

    socket.emit('changeOfferStatus', body)
  }

  return (
    <PageLoading loading={lotLoading}>
      <section className='flex mt-2 flex-col w-full min-h-full'>
        <div className='flex flex-row gap-5 w-full h-auto'>
          <Carousel images={lot?.images.map(item => item.path)} height={"502px"}/>
          <div className='flex flex-col gap-2 grow'>
            <div className='flex flex-row justify-between'>
              <p className='default-text font-oswald text-3xl'>{lot?.name}</p>
              {
                +userId === lot?.user.id
                  ? <Button outline={true} onClick={() => navigate(`/lot/${lot?.id}/edit`)}>Редагувати</Button>
                  : null
              }
            </div>
            <div className='divider'></div>
            <div className='flex flex-row ml-10 gap-1'>
              <div className='flex flex-col items-end'>
                <p className='default-text font-roboto text-lg'>Стан:</p>
                <p className='default-text font-roboto text-lg'>До кінця:</p>
              </div>
              <div className='flex flex-col'>
                <p className='default-text font-roboto text-lg'>{lot?.condition}</p>
                <p className='default-text font-roboto text-lg'>{getStringDate(lot?.endDate)}</p>
              </div>
              <Link to={`/user/${lot?.user?.id}`} className='ml-auto mr-0'>
                <div className='flex flex-row items-center gap-2 p-2 dark:bg-dark-200 bg-light-300 rounded hover:cursor-pointer'>
                  <img 
                    alt="seller" 
                    src={lot?.user?.image ? `${import.meta.env.VITE_SERVER_URL}/../${lot?.user?.image}` : userPlaceholderPicture}
                    className='rounded h-10 overflow-hidden'
                  />
                  <p className='default-text font-roboto text-lg'>{lot?.user.firstName} {lot?.user.lastName}</p>
                </div>
              </Link>
            </div>
            <div className='divider'></div>
            <div className='flex flex-row my-4 justify-between'>
              <div className='flex flex-col ml-8 gap-3'>
                <div className='flex flex-row gap-2'>
                  <p className='default-text font-oswald text-xl'>{lot?.currentPrice ? 'Поточна ставка' : 'Початкова ставка'}:</p>
                  <p className='default-text font-oswald text-3xl'>{lot?.currentPrice || lot?.startPrice}₴</p>
                </div>
                {
                  lot?.betStep
                    ? <p className='default-text font-oswald text-base'>Шаг ставки: {lot?.betStep}₴</p>
                    : null
                }
              </div>
              <div className='flex flex-col'>
                <p className='default-text font-oswald text-base'>Кількість ставок: {bets?.amount}</p>
                <form className='flex flex-row gap-2 mt-3' onSubmit={betHandleSubmit(handleCreateBet)}>
                  <div className='w-40'>
                    <FormField 
                      control={betControl}
                      name="price"
                      label="Ставка"
                      helperText={betErrors?.price?.message}
                    />
                  </div>
                  <Button outline={true}>Зробити ставку</Button>
                </form>
              </div>
            </div>
            {
              lot?.allowOffers
                ? <>
                    <div className='divider'></div>
                    <div className='flex flex-row justify-between my-4'>
                      <div className='flex flex-col ml-8'>
                        <p className='default-text font-oswald text-sm'>Пропозиції дозволені</p>
                        {
                          lot?.minOfferPrice
                            ? <p className='default-text font-oswald text-sm'>Мінімальна пропозиція: {lot?.minOfferPrice}₴</p>
                            : null
                        }
                        {
                          lot?.offers[0] 
                            ? <p className='default-text font-oswald text-lg mt-2'>Найкраща пропозиція: {lot?.offers[0].price}₴</p>
                            : null
                        }
                      </div>
                      <div className='flex flex-col'>
                        <form className='flex flex-row gap-2 mt-3' onSubmit={offerHandleSubmit(handleCreateOffer)}>
                          <div className='w-40'>
                            <FormField 
                              control={offerControl}
                              name="price"
                              label="Пропозиція"
                              helperText={offerErrors?.price?.message}
                            />
                          </div>
                          <Button outline={true}>Зробити пропозицію</Button>
                        </form>
                      </div>
                    </div>
                  </>
                : null
            }
            <div className='divider'></div>
            <div className='flex flex-row gap-2 ml-4 mt-2'>
              <div className='flex flex-col items-end gap-2'>
                <p className='default-text font-roboto text-base'>Доступні типи угоди:</p>
                <p className='default-text font-roboto text-base'>Доступні типи оплати:</p>
                <p className='default-text font-roboto text-base'>Доступні типи доставки:</p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='default-text font-roboto text-base'>{lot?.dealTypeList.map(item => item.dealType.name).join(", ")}</p>
                <p className='default-text font-roboto text-base'>{lot?.paymentTypeList.map(item => item.paymentType.name).join(", ")}</p>
                <p className='default-text font-roboto text-base'>{lot?.deliveryTypeList.map(item => item.deliveryType.name).join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
        <Tabs className='flex flex-col w-full mt-4' selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList className='flex flex-row gap-12'>
            <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
              <p>Про лот</p>
              <div/>
            </Tab>
            <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
              <p>Ставки</p>
              <div/>
            </Tab>
            {
              !!userId && lot?.allowOffers && userId === lot?.user.id
                ? <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                    <p>Пропозиції</p>
                    <div/>
                  </Tab>
                : null
            }
            {
              !!userId && lot?.allowOffers && userId !== lot?.user.id
                ?
                  <Tab className='default-text user-page__tab' selectedClassName='user-page__tab_selected'>
                    <p>Пропозиції</p>
                    <div/>
                  </Tab>
                : null
            }
          </TabList>

          <TabPanel className='user-page__tab-panel'>
            <p className='default-text mt-3 font-roboto text-base w-full whitespace-pre-wrap'>{lot?.description.replace('\\n','\n')}</p>
            <p className='default-text mt-3 font-oswald text-2xl w-full whitespace-pre-wrap'>Характеристики</p>
            <div className='flex flex-col w-full mt-3 gap-1'>
              {
                lot?.featureValue.map((item, index) => {
                  let value
                  
                  if(!item.feature.isOptions)
                    value = getConvertedValue(item.value, item.feature.unit)
                  else
                    value = item.featureOption.value
                  
                  return (
                    <div key={`featureValue${index}`} className='flex flex-row'>
                      <div className='flex w-[200px]'>
                        <p className='default-text font-openSans text-base'>{item.feature.name}</p>
                      </div>
                      <p className='default-text font-openSans text-base block'>{value}</p>
                    </div>
                  )
                })
              }
            </div>
          </TabPanel>
          <TabPanel className='user-page__tab-panel'>
            {
              lot?.betHistory
                ? <div className='grid grid-cols-[400px_200px_200px] gap-2 mt-3'>
                    <p className='default-text font-openSans text-lg'>Повне імя</p>
                    <p className='default-text font-openSans text-lg'>Ставка</p>
                    <p className='default-text font-openSans text-lg'>Дата</p>
                    {
                      bets?.bets.map((item, index) => 
                        <React.Fragment key={`bet${index}`}>
                          <Link to={`/user/${item.user.id}`} className='hover:cursor-pointer'>
                            <p className='default-text font-openSans text-lg'>{item.user.firstName} {item.user.lastName}</p>
                          </Link>
                          <p className='default-text font-openSans text-lg'>{item.price}₴</p>
                          <p className='default-text font-openSans text-lg'>{getFormatedDate(item.date)}</p>
                        </React.Fragment>
                      )
                    }
                  </div>
                : <p className='default-text font-openSans text-lg self-center'>Історія ставок недоступна</p>
            }
          </TabPanel>
            {
              !!userId && lot?.allowOffers && userId === lot?.user.id
                ? <TabPanel className='mt-1 flex flex-col gap-2'>
                    {
                      offers?.length === 0 
                        ? <p className='default-text font-openSans text-lg self-center'>Ви ще не маєте жодної пропозиції</p>
                        : offers?.map((item, index) => 
                            <OfferSeller
                              key={`offerSeller${index}`}
                              image={item.user.image}
                              userId={item.user.id}
                              firstName={item.user.firstName}
                              lastName={item.user.lastName}
                              price={item.price}
                              status={item.status}
                              date={item.date}
                              id={item.id}
                              socket={socket}
                              changeOfferStatus={changeOfferStatus}
                            />
                          )
                    }
                  </TabPanel>
                : null
            }
            {
              !!userId && lot?.allowOffers && userId !== lot?.user.id
                ?
                  <TabPanel className='mt-1 flex flex-col gap-2'>
                    {
                      offers?.length === 0 
                        ? <p className='default-text font-openSans text-lg'>Ви ще не зробили жодної пропозиції</p>
                        : offers?.map((item, index) =>
                            <OfferBidder 
                              key={`offerBidder${index}`}
                              price={item.price}
                              status={item.status}
                              date={item.date}
                            />
                          )
                    }
                  </TabPanel>
                : null
            }
        </Tabs>
      </section>
    </PageLoading>
  )
}
