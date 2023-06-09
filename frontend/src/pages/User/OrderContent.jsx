import React from 'react'
import PageLoading from '../../components/PageLoading/PageLoading'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { orderApi } from '../../services/orderService'
import { useSelector } from 'react-redux'
import { changeSold, changeSoldSkip, selectBought, selectBoughtSkip, selectSold, selectSoldSkip, changeBought, changeBoughtSkip } from '../../store/slices/userOrderSlice'
import OrderList from '../../components/OrderList/OrderList'

export default function OrderContent() {
  const { data: amounts, isLoading: amountsLoading } = orderApi.useGetOrdersAmountQuery()

  const [ boughtTrigger, { isLoading: boughtLoading }] = orderApi.useLazyGetBoughtQuery()
  const bought = useSelector(selectBought)
  const boughtSkip = useSelector(selectBoughtSkip)

  const [ soldTrigger, { isLoading: soldLoading }] = orderApi.useLazyGetSoldQuery()
  const sold = useSelector(selectSold)
  const soldSkip = useSelector(selectSoldSkip)

  return (
    <PageLoading loading={amountsLoading}>
      <Tabs className='lot-content flex flex-row mt-4'>
        <TabList className={`flex flex-col w-[250px] gap-2 mr-6`}>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Ваші замовлення</p>
            <p className='default-text font-roboto text-lg'>{amounts?.soldAmount}</p>
          </Tab>
          <Tab className='flex flex-row justify-between items-center p-2 hover:cursor-pointer rounded  bg-light-400 dark:bg-dark-400'>
            <p className='default-text font-roboto text-lg'>Оформленні зaмовлення</p>
            <p className='default-text font-roboto text-lg'>{amounts?.boughtAmount}</p>
          </Tab>
        </TabList>
        
        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <OrderList 
            isLoading={soldLoading}
            trigger={soldTrigger}
            count={amounts?.soldAmount}
            orders={sold}
            skip={soldSkip}
            setOrders={changeSold}
            setSkip={changeSoldSkip}
          />
        </TabPanel>

        <TabPanel selectedClassName={classNames('flex w-[calc(100%-274px)]')}>
          <OrderList 
            isLoading={boughtLoading}
            trigger={boughtTrigger}
            count={amounts?.boughtAmount}
            orders={bought}
            skip={boughtSkip}
            setOrders={changeBought}
            setSkip={changeBoughtSkip}
          />
        </TabPanel>
      </Tabs>
    </PageLoading>
  )
}
