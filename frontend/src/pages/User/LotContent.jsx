import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { lotApi } from '../../services/lotService'
import PageLoading from '../../components/PageLoading/PageLoading'
import LotList from '../../components/LotList/LotList'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { changeAllLots, changeAllLotsSkip, selectActiveLots, selectActiveLotsSkip, selectAllLots, selectAllLotsSkip, selectFutureLots, selectFutureLotsSkip, selectOrderedLots, selectOrderedLotsSkip, selectSoldLots, selectSoldLotsSkip, changeActiveLots, changeActiveLotsSkip, changeFutureLots, changeFutureLotsSkip, changeOrderedLots, changeOrderedLotsSkip, changeSoldLots, changeSoldLotsSkip, selectActiveAuctions, selectActiveAuctionsSkip, selectOrdered, selectOrderedSkip, selectBuyed, selectBuyedSkip, changeActiveAuctions, changeActiveAuctionsSkip, changeBuyed, changeBuyedSkip, changeOrdered, changeOrderedSkip } from '../../store/slices/userLotsSlice'

export default function LotContent() {
  const [tabIndex, setTabIndex] = useState(0)

  const { data: amounts, isLoading: amountsLoading } = lotApi.useGetAllAmountsQuery()

  const [ allLotsTrigger, { isLoading: allLotsLoading }] = lotApi.useLazyGetUsersAllLotsQuery()
  const allLots = useSelector(selectAllLots)
  const allLotsSkip = useSelector(selectAllLotsSkip)

  const [ futureLotsTrigger, { isLoading: futureLotsLoading }] = lotApi.useLazyGetUsersFutureLotsQuery()
  const futureLots = useSelector(selectFutureLots)
  const futureLotsSkip = useSelector(selectFutureLotsSkip)

  const [ activeLotsTrigger, { isLoading: activeLotsLoading }] = lotApi.useLazyGetUsersActiveLotsQuery()
  const activeLots = useSelector(selectActiveLots)
  const activeLotsSkip = useSelector(selectActiveLotsSkip)

  const [ soldLotsTrigger, { isLoading: soldLotsLoading }] = lotApi.useLazyGetUsersSoldLotsQuery()
  const soldLots = useSelector(selectSoldLots)
  const soldLotsSkip = useSelector(selectSoldLotsSkip)

  const [ orderedLotsTrigger, { isLoading: orderedLotsLoading }] = lotApi.useLazyGetUsersOrderedLotsQuery()
  const orderedLots = useSelector(selectOrderedLots)
  const orderedLotsSkip = useSelector(selectOrderedLotsSkip)

  const [ activeAuctionsTrigger, { isLoading: activeAuctionsLoading }] = lotApi.useLazyGetUsersActiveAuctionsQuery()
  const activeAuctions = useSelector(selectActiveAuctions)
  const activeAuctionsSkip = useSelector(selectActiveAuctionsSkip)

  const [ orderedTrigger, { isLoading: orderedLoading }] = lotApi.useLazyGetUsersOrderedQuery()
  const ordered = useSelector(selectOrdered)
  const orderedSkip = useSelector(selectOrderedSkip)

  const [ buyedTrigger, { isLoading: buyedLoading }] = lotApi.useLazyGetUsersBuyedQuery()
  const buyed = useSelector(selectBuyed)
  const buyedSkip = useSelector(selectBuyedSkip)

  return (
    <PageLoading loading={amountsLoading}>
      <Tabs className='lot-content flex flex-row mt-4' tabIndex={tabIndex} onChange={(index) => setTabIndex(index)}>
        <TabList className={`flex flex-col w-[250px] gap-2 mr-6`}>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Ваші лоти</p>
            <p className='default-text font-roboto text-lg'>{amounts?.allAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Майбутні лоти</p>
            <p className='default-text font-roboto text-lg'>{amounts?.futureAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Активні лоти</p>
            <p className='default-text font-roboto text-lg'>{amounts?.activeAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Торги завершені</p>
            <p className='default-text font-roboto text-lg'>{amounts?.soldAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Оформлені лоти</p>
            <p className='default-text font-roboto text-lg'>{amounts?.orderedAmount}</p>
          </Tab>
          <div className='my-2'/>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Активні торги</p>
            <p className='default-text font-roboto text-lg'>{amounts?.activeAuctionsAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Очікують оформлення</p>
            <p className='default-text font-roboto text-lg'>{amounts?.buyedAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Куплені лоти</p>
            <p className='default-text font-roboto text-lg'>{amounts?.orderedAmount}</p>
          </Tab>
        </TabList>
        
        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={allLots}
            skip={allLotsSkip}
            setLots={changeAllLots}
            setSkip={changeAllLotsSkip}
            isLoading={allLotsLoading}
            trigger={allLotsTrigger}
            count={amounts?.allAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={futureLots}
            skip={futureLotsSkip}
            setLots={changeFutureLots}
            setSkip={changeFutureLotsSkip}
            isLoading={futureLotsLoading}
            trigger={futureLotsTrigger}
            count={amounts?.futureAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={activeLots}
            skip={activeLotsSkip}
            setLots={changeActiveLots}
            setSkip={changeActiveLotsSkip}
            isLoading={activeLotsLoading}
            trigger={activeLotsTrigger}
            count={amounts?.activeAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={soldLots}
            skip={soldLotsSkip}
            setLots={changeSoldLots}
            setSkip={changeSoldLotsSkip}
            isLoading={soldLotsLoading}
            trigger={soldLotsTrigger}ordered
            count={amounts?.soldAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={orderedLots}
            skip={orderedLotsSkip}
            setLots={changeOrderedLots}
            setSkip={changeOrderedLotsSkip}
            isLoading={orderedLotsLoading}
            trigger={orderedLotsTrigger}
            count={amounts?.orderedLotsAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={activeAuctions}
            skip={activeAuctionsSkip}
            setLots={changeActiveAuctions}
            setSkip={changeActiveAuctionsSkip}
            isLoading={activeAuctionsLoading}
            trigger={activeAuctionsTrigger}
            count={amounts?.activeAuctionsAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={buyed}
            skip={buyedSkip}
            setLots={changeBuyed}
            setSkip={changeBuyedSkip}
            isLoading={buyedLoading}
            trigger={buyedTrigger}
            count={amounts?.buyedAmount}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <LotList 
            lots={ordered}
            skip={orderedSkip}
            setLots={changeOrdered}
            setSkip={changeOrderedSkip}
            isLoading={orderedLoading}
            trigger={orderedTrigger}
            count={amounts?.orderedAmount}
          />
        </TabPanel>
      </Tabs>
    </PageLoading>
  )
}
