import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { selectTheme } from '../../store/slices/themeSlice'
import useSelectTheme from '../../hooks/useSelecteTheme'
import Select from 'react-select'
import { VscTriangleUp } from 'react-icons/vsc'
import './Catalog.css'
import { lotApi } from '../../services/lotService'
import Checkbox from '../../components/Checkbox/Checkbox'
import getConvertedValue from '../../utils/getConvertedValue'
import TextInput from '../../components/TextInput/TextInput'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import { newLotOptions, endingLotOptions, sortOptions, offersOptions, conditionOptions } from '../../data/catalogOptions'
import Button from '../../components/Button/Button'
import ShortLot from '../../components/ShortLot/ShortLot'
import PageLoading from '../../components/PageLoading/PageLoading'
import useDarkMode from '../../hooks/useDarkMode'
import { Oval } from 'react-loader-spinner'

const limit = 12

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [lotsArray, setLotsArray] = useState([])

  const lotsRef = useRef()

  const [darkMode, setDarkMode] = useDarkMode()

  const theme = useSelector(selectTheme)

  const selectStyles = useSelectTheme(theme, "100%")

  const [wrapperClassNames, setWrapperClassNames] = useState('')
  const [iconClassNames, setIconClassNames] = useState('')
  
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [selectedFeatures, setSelectedFeatures] = useState({})

  const [name, setName] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [newFor, setNewFor] = useState()
  const [endingIn, setEndingIn] = useState()
  const [dealTypes, setDealTypes] = useState()
  const [deliveryTypes, setDeliveryTypes] = useState()
  const [paymentTypes, setPaymentTypes] = useState()
  const [condition, setCondition] = useState()

  const [offers, setOffers] = useState(null)
  const [sort, setSort] = useState()
  const [desc, setDesc] = useState(true)

  const skip = useRef(0)

  const [typeFiltresLoaded, setTypeFiltresLoaded] = useState(false)
  const [filtresLoaded, setFiltresLoaded] = useState(false)
  const [categoryFiltresLoaded, setCategoryFiltresLoaded] = useState(false)
  const [subcategoryFiltresLoaded, setSubcategoryFiltresLoaded] = useState(false)
  const [featuresFiltresLoaded, setFeaturesFiltresLoaded] = useState(false)

  const [paginationLoading, setPaginationLoading] = useState(false)
  const [firstLotLoading, setFirstLotLoading] = useState(true)

  const handleHide = () => {
    if(wrapperClassNames.length > 0) {
      setIconClassNames('')
      setWrapperClassNames('')
    }
    else {
      setWrapperClassNames('features-hidden')
      setIconClassNames('icon-hidden')
    }
  }

  const { data: filters } = lotApi.useFetchDefaultFiltersQuery()
  const { data: categories } = lotApi.useFetchCategoriesQuery()
  const [ categoryTrigger, { data: subcategories, isLoading: subcategoriesLoading }] = lotApi.useLazyFetchSubcategoriesQuery()
  const [ subcategoryTrigger, { data: features, isLoading: featuresLoading }] = lotApi.useLazyFetchFiltersQuery()
  const [ lotsTrigger, { data: lots, isLoading: lotsLoading }] = lotApi.useLazyFetchLotsQuery()
  
  useEffect(() => {
    if(selectedCategory) {
      categoryTrigger({ id: +selectedCategory?.value })
    }
    else {
      setSelectedSubCategory(null)
    }
  }, [selectedCategory])

  useEffect(() => {
    if(selectedSubCategory) {
      subcategoryTrigger({id: +selectedSubCategory?.value})
    }
  }, [selectedSubCategory])

  const setPriceByType = (value, priceType) => {
    if((!isNaN(value) && value > 0) || value === "") {
      if(priceType === "min")
        setMinPrice(value)
      if(priceType === "max")
        setMaxPrice(value)
    }
  }

  const resetFilters = () => {
    setSelectedFeatures({})
    setSelectedSubCategory(null)
    setSelectedCategory(null)

    setName('')
    setMinPrice('')
    setMaxPrice('')

    setNewFor(null)
    setEndingIn(null)
    setDealTypes(null)
    setDeliveryTypes(null)
    setPaymentTypes(null)
    setOffers(null)
    setSort(null)
    setDesc(true)
    setCondition(null)
  }

  useEffect(() => {
    let timer

    if(typeFiltresLoaded && filtresLoaded && categoryFiltresLoaded && subcategoryFiltresLoaded && featuresFiltresLoaded) {
      const newSearchParams = {}

      if(!!selectedCategory) {
        newSearchParams.category = selectedCategory.value
      }
      if(!!selectedSubCategory) {
        newSearchParams.subcategory = selectedSubCategory.value
      }
      if(!!selectedFeatures) {
        for(const innerKey in selectedFeatures) {
          if(selectedFeatures[innerKey] instanceof Array) 
            newSearchParams[`feature_${innerKey}`] = selectedFeatures[innerKey].map(item => item.value)
          else if(selectedFeatures[innerKey] instanceof Object) {
            const valueArray = Object.keys(selectedFeatures[innerKey]).filter(item => selectedFeatures[innerKey][item])
            newSearchParams[`feature_${innerKey}`] = valueArray
          }
        }
      }
      if(name.length > 0) {
        newSearchParams.name = name
      }
      if(minPrice.length > 0) {
        newSearchParams.minprice = minPrice
      }
      if(maxPrice.length > 0) {
        newSearchParams.maxprice = maxPrice
      }
      if(!!newFor) {
        newSearchParams.newfor = newFor.value
      }
      if(!!endingIn) {
        newSearchParams.endingin = endingIn.value
      }
      if(!!offers) {
        newSearchParams.offers = offers.value
      }
      if(!!sort) {
        newSearchParams.sort = sort.value
      }
      if(!!dealTypes) {
        newSearchParams.dealtypes = dealTypes.map(item => item.value)
      }
      if(!!deliveryTypes) {
        newSearchParams.deliverytypes = deliveryTypes.map(item => item.value)
      }
      if(!!paymentTypes) {
        newSearchParams.paymenttypes = paymentTypes.map(item => item.value)
      }
      if(!!condition) {
        newSearchParams.condition = condition.map(item => item.value)
      }
      newSearchParams.desc = desc

      setSearchParams(newSearchParams)

      timer = setTimeout(() => {
        skip.current = 0
        setLotsArray([])
        fetchLots()
      }, 1500)
    }

    return () => clearTimeout(timer)
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedFeatures,
    name,
    minPrice,
    maxPrice,
    newFor,
    endingIn,
    dealTypes,
    deliveryTypes,
    paymentTypes,
    offers,
    sort,
    desc,
    condition
  ])

  const fetchLots = async () => {
    let body = {
      category: selectedCategory,
      subcategory: selectedSubCategory,
      features: selectedFeatures,
      name,
      condition,
      minPrice,
      maxPrice,
      newFor,
      endingIn,
      dealTypes,
      deliveryTypes,
      paymentTypes,
      offers,
      sort,
      desc,
      skip: skip.current,
      limit
    }

    for(const bodyKey in body) {
      if(bodyKey === 'features') {
        for(const featureKey in body[bodyKey]) {
          if(body[bodyKey][featureKey] instanceof Array) {
            if(body[bodyKey][featureKey].length === 0)
              delete body[bodyKey][featureKey]
          }
          else if(body[bodyKey][featureKey] instanceof Object) {
            for(const checkboxKey in body[bodyKey][featureKey]) {
              if(!body[bodyKey][featureKey][checkboxKey])
                delete body[bodyKey][featureKey][checkboxKey]
            }
            
            if(Object.keys(body[bodyKey][featureKey])?.length === 0)
              delete body[bodyKey][featureKey]
          }
        }
      }
      else if(
        body[bodyKey] === null || 
        body[bodyKey] === '' || 
        body[bodyKey]?.length === 0 || 
        (body[bodyKey] instanceof Object && !(body[bodyKey] instanceof Array) && Object.keys(body[bodyKey])?.length === 0) || 
        (body[bodyKey] instanceof Array && body[bodyKey].length === 0)
      ) {
        delete body[bodyKey]
      }
    }

    await lotsTrigger(body)
    setPaginationLoading(false)
  }

  useEffect(() => {
    if(typeFiltresLoaded && filtresLoaded && categoryFiltresLoaded && subcategoryFiltresLoaded && featuresFiltresLoaded) {
      fetchLots().then(() => setFirstLotLoading(false))
    }
  }, [typeFiltresLoaded, filtresLoaded, categoryFiltresLoaded, subcategoryFiltresLoaded, featuresFiltresLoaded])

  useEffect(() => {
    if(!filtresLoaded) {
      let newConditions = []

      for (const [key, value] of searchParams.entries()) {
        if(key === 'minprice') {
          setMinPrice(value)
        }
        else if(key === 'maxprice') {
          setMaxPrice(value)
        }
        else if(key === 'name') {
          setName(value)
        }
        else if(key === 'offers') {
          if(value === 'true')
            setOffers({ value: true, label: "Дозволені" })
          else
            setOffers({ value: false, label: "Заборонені" })
        }
        else if(key === 'newfor') {
          setNewFor(newLotOptions.find(item => item.value === +value))
        }
        else if(key === 'endingin') {
          setEndingIn(endingLotOptions.find(item => item.value === +value))
        }
        else if(key === 'sort') {
          setSort(sortOptions.find(item => item.value === value))
        }
        else if(key === 'condition') {
          const conditionValue = conditionOptions.find(item => item.value === value)
          newConditions.push(conditionValue)
        }
      }

      if(newConditions.length > 0)
        setCondition(newConditions)

      setFiltresLoaded(true)
    }
  }, [])

  useEffect(() => {
    const categoryId = searchParams.getAll('category')[0]

    if(!!categories && !!categoryId && !categoryFiltresLoaded) {
      const categoryInSearchParams = categories.filter(item => +item.id === +categoryId)[0]
      setSelectedCategory({value: categoryInSearchParams.id, label: categoryInSearchParams.name})

      setCategoryFiltresLoaded(true)
    }

    if(!categoryId && !categoryFiltresLoaded) {
      setCategoryFiltresLoaded(true)
      setSubcategoryFiltresLoaded(true)
      setFeaturesFiltresLoaded(true)
    }
  }, [categories])

  useEffect(() => {
    const subcategoryId = searchParams.getAll('subcategory')[0]

    if(!!subcategories && !!subcategoryId && !subcategoryFiltresLoaded) {
      const subcategoryInSearchParams = subcategories.filter(item => +item.id === +subcategoryId)[0]
      setSelectedSubCategory({value: subcategoryInSearchParams.id, label: subcategoryInSearchParams.name})

      setSubcategoryFiltresLoaded(true)
    }

    if(!subcategoryId && !subcategoryFiltresLoaded) {
      setSubcategoryFiltresLoaded(true)
      setFeaturesFiltresLoaded(true)
    }
  }, [subcategories])

  useEffect(() => {
    if(!!filters && !typeFiltresLoaded) {
      let newDealTypes = []
      let newDeliveryTypes = []
      let newPaymentTypes = []

      for (const [key, value] of searchParams.entries()) {
        if(key === 'dealtypes') {
          const dealType = filters.dealTypes.find(item => item.id === +value)
          newDealTypes.push({value: dealType.id, label: dealType.name})
        }
        else if(key === 'deliverytypes') {
          const deliveryType = filters.deliveryTypes.find(item => item.id === +value)
          newDeliveryTypes.push({value: deliveryType.id, label: deliveryType.name})
        }
        else if(key === 'paymenttypes') {
          const paymentType = filters.paymentTypes.find(item => item.id === +value)
          newPaymentTypes.push({value: paymentType.id, label: paymentType.name})
        }
      }

      if(newDealTypes.length > 0)
        setDealTypes(newDealTypes)

      if(newDeliveryTypes.length > 0)
        setDeliveryTypes(newDeliveryTypes)

      if(newPaymentTypes.length > 0)
        setPaymentTypes(newPaymentTypes)

        setTypeFiltresLoaded(true)
    }
  }, [filters])

  const handleScroll = async () => {
    const scrollBottom = lotsRef.current.getBoundingClientRect().bottom <= window.innerHeight

    if (scrollBottom && skip.current + limit < lots.count) {
      console.log(skip.current + limit)
      skip.current += limit
      setPaginationLoading(true)
      window.removeEventListener('scroll',  handleScroll)
      await fetchLots()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lotsArray])

  useEffect(() => {
    if(lots?.lots instanceof Array) {
      setLotsArray([...lotsArray, ...lots.lots])
    }
  }, [lots])

  useEffect(() => {
    if(!!features && !featuresFiltresLoaded) {
      const featuresFromSearchParams = {}

      for (const [key, value] of searchParams.entries()) {
        if(key.search('feature') >= 0) {
          const featureId = key.slice(8)

          const feature = features.features.filter(item => item.id === +featureId)[0]

          if(feature.isOptions) {
            const featureValue = feature.featureOptions.map(item => ({value: item.id, label: item.value})).find(item => item.value === +value)
            if(!featuresFromSearchParams[featureId])
              featuresFromSearchParams[featureId] = []
            featuresFromSearchParams[featureId] = [...featuresFromSearchParams[featureId], featureValue]
          }
          else {
            if(!featuresFromSearchParams[featureId])
              featuresFromSearchParams[featureId] = {}
            const featureValue = feature.featureRanges.find(item => item.id === +value)
            if(!!featureValue)
              featuresFromSearchParams[featureId][featureValue.id] = true
          }
        }
      }

      setSelectedFeatures(featuresFromSearchParams)

      setFeaturesFiltresLoaded(true)
    }
  }, [features])

  return (
    <section className='grid grid-cols-[minmax(0,1fr)_300px] w-full mt-4 gap-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-between items-center'>
          <div className='w-3/5'>
            <TextInput
              value={name}
              setValue={e => setName(e.target.value)}
              onBlur={() => {}}
            >
              Назва 
            </TextInput>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Select 
              styles={useSelectTheme(theme, "250px")}
              placeholder='Сортувати за'
              value={sort}
              onChange={value => setSort(value)}
              options={sortOptions}
              isClearable
            />
            <div className="h-10 rounded w-10 ml-2 border-[1px] border-solid border-dark-200 dark:border-light-300 flex justify-center items-center hover:cursor-pointer select-none hover:bg-light-400 dark:hover:bg-dark-400" onClick={() => setDesc(!desc)}>
              {desc ? 
                <FaSortAmountDown size="30px" className="default-icon"/> : 
                <FaSortAmountUpAlt size="30px" className="default-icon"/>
              }
            </div>
          </div>
        </div>
        <PageLoading loading={firstLotLoading}>
          {
            lotsArray instanceof Array ?
              lotsArray.length > 0 ?
                <section className='grid gap-4 grid-cols-4' ref={lotsRef}>
                  {
                    lotsArray.map((item, index) => 
                      <ShortLot 
                        key={`shortlot${index}`}
                        id={item.id}
                        name={item.name}
                        image={`${import.meta.env.VITE_SERVER_URL}/../${item.images[0]?.path}`}
                        price={item.currentPrice}
                        count={item._count.bets}
                        endDate={item.endDate}
                      />
                    )
                  }
                </section>
                : <div className="w-full flex py-12 justify-center">
                    <p className='default-text text-xj font-openSans'>За даними критеріями лотів не знайдено</p>
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
        </PageLoading>
        
      </div>
      <div className='filters-wrapper flex flex-col w-[300px] bg-light-300 dark:bg-dark-200 p-4 rounded h-min'>
        <p className='default-text font-oswald text-xl'>Категорія</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Категорія'
          isSearchable
          value={selectedCategory}
          onChange={value => setSelectedCategory(value)}
          options={categories?.map(item => ({value: item.id, label: item.name}))}
          isClearable
        />
        {
          !subcategoriesLoading && !!selectedCategory
            ? <>
                <p className='default-text font-oswald text-xl mt-2'>Підкатегорія</p>
                <Select 
                  styles={selectStyles}
                  className='mt-1'
                  placeholder='Підкатегорія'
                  isSearchable
                  value={selectedSubCategory}
                  onChange={value => setSelectedSubCategory(value)}
                  options={subcategories?.map(item => ({value: item.id, label: item.name}))}
                  isClearable
                />
              </>
            : null
        }
        <p className='default-text font-oswald text-xl mt-2'>Ціна(грн)</p>
        <div className='flex flex-row gap-3 mt-4'>
          <TextInput
            value={minPrice}
            setValue={e => setPriceByType(e.target.value, "min")}
            onBlur={() => {}}
          >
            Від
          </TextInput>
          <TextInput
            value={maxPrice}
            setValue={e => setPriceByType(e.target.value, "max")}
            onBlur={() => {}}
          >
            До
          </TextInput>
        </div>
        {
          !!selectedSubCategory && !featuresLoading
            ? <div className={`flex flex-col w-full mt-4 transition-all duration-150 gap-2 ${wrapperClassNames}`}>
                <div className='flex flex-row justify-between items-center'>
                  <p className='default-text font-oswald text-xl'>Характеристики</p>
                  <VscTriangleUp 
                    className={`default-icon hover:cursor-pointer hover:text-dark-400 hover:dark:text-light-400 transition-all duration-150 ${iconClassNames}`} 
                    size={24}
                    onClick={() => handleHide()}
                  />
                </div>
                {
                  features?.features?.map((item, index) => {
                    if(item.isOptions) {
                      const options = item.featureOptions.map(item => ({value: item.id, label: item.value}))
                      return (
                        <React.Fragment key={`filter${index}`}>
                          <p className='default-text font-oswald text-lg'>{item.name}</p>
                          <Select 
                            styles={selectStyles}
                            className='mt-1'
                            placeholder={item.name}
                            options={options}
                            isMulti
                            value={selectedFeatures[item.id]}
                            onChange={value => setSelectedFeatures({...selectedFeatures, [item.id]: value})}
                            isClearable
                          />
                        </React.Fragment>
                      )
                    }
                    else {
                      return (
                        <React.Fragment key={`filter${index}`}>
                          <p className='default-text font-oswald text-lg'>{item.name}</p>
                          {
                            item.featureRanges.map((checkboxItem, checkboxIndex) => {
                              let label = ''
                              if(checkboxItem.min)
                                label += `від ${getConvertedValue(checkboxItem.min, item.unit)} `
                              if (checkboxItem.max)
                                label += `до ${getConvertedValue(checkboxItem.max, item.unit)} `

                              return (
                                <Checkbox 
                                  key={`checkbox${index}${checkboxIndex}`}
                                  label={label}
                                  value={selectedFeatures[item.id]?.[checkboxItem.id] || null}
                                  onClick={value => setSelectedFeatures({ 
                                    ...selectedFeatures, 
                                    [item.id]: {
                                      ...selectedFeatures[item.id], 
                                      [checkboxItem.id]: value
                                    }
                                  })}
                                />
                              )
                            })
                          }
                        </React.Fragment>
                      )
                    }
                  })
                }
              </div>
            : null
        }
        <p className='default-text font-oswald text-xl mt-2'>Стан</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          options={conditionOptions}
          value={condition}
          onChange={value => setCondition(value)}
          isClearable
          isMulti
        />
        <p className='default-text font-oswald text-xl mt-2'>Типи угоди</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          value={dealTypes}
          onChange={value => setDealTypes(value)}
          options={filters?.dealTypes?.map(item => ({ value: item.id, label: item.name }))}
          isClearable
          isMulti
        />
        <p className='default-text font-oswald text-xl mt-2'>Типи доставки</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          value={deliveryTypes}
          onChange={value => setDeliveryTypes(value)}
          options={filters?.deliveryTypes?.map(item => ({ value: item.id, label: item.name }))}
          isClearable
          isMulti
        />
        <p className='default-text font-oswald text-xl mt-2'>Типи оплати</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          value={paymentTypes}
          onChange={value => setPaymentTypes(value)}
          options={filters?.paymentTypes?.map(item => ({ value: item.id, label: item.name }))}
          isClearable
          isMulti
        />
        <p className='default-text font-oswald text-xl mt-2'>Нові лоти за</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          value={newFor}
          onChange={value => setNewFor(value)}
          options={newLotOptions}
          isClearable
        />
        <p className='default-text font-oswald text-xl mt-2'>Що завершаться протягом</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          value={endingIn}
          onChange={value => setEndingIn(value)}
          options={endingLotOptions}
          isClearable
        />
        <p className='default-text font-oswald text-xl mt-2'>Пропозиції</p>
        <Select 
          styles={selectStyles}
          className='mt-1'
          placeholder='Обрати'
          options={offersOptions}
          value={offers}
          onChange={value => setOffers(value)}
          isClearable
        />
        <div className='mt-4 w-auto'>
          <Button
            outline={true} 
            onClick={() => resetFilters()}
          >
            Скинути фільтри
          </Button>
        </div>
      </div>
    </section>
  )
}
