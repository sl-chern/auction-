import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectUserId } from '../../store/slices/userSlice'
import { useForm, useFormState } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormField from '../../components/FormField/FormField'
import FormTextArea from '../../components/FormTextArea/FormTextArea'
import FormSelect from '../../components/FormSelect/FormSelect'
import Button from '../../components/Button/Button'
import Image from '../CreateLot/Image'
import { conditionOptions } from '../../data/catalogOptions'
import { lotApi } from '../../services/lotService'
import { transliterate } from 'transliteration'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { selectTheme } from '../../store/slices/themeSlice'
import { lengthOptions, weightOptions } from '../../data/unitsOptions'
import ToogleSwitch from '../../components/ToogleSwitch/ToogleSwitch'
import classNames from 'classnames'
import Checkbox from '../../components/Checkbox/Checkbox'
import FormDateField from '../../components/FormDateField/FormDateField'
import { shippingPaymentOptions } from '../../data/lotOptions'
import { getSchema } from '../CreateLot/schema'
import PageLoading from '../../components/PageLoading/PageLoading'
import { parseDateTime } from '@internationalized/date'

export default function UpdateLot() {
  const navigate = useNavigate()
  const { id: lotId } = useParams()
  const userId = useSelector(selectUserId)

  useEffect(() => {
    if(!userId)
      navigate('/')
  }, [])  
  
  const [drag, setDrag] = useState(false)
  const [lotImages, setLotImages] = useState([]) 
  const [imageError, setImageError] = useState(true)
  const [firstSubmited, setFirstSubmited] = useState(false)

  const [categoryFirstLoaded, setCategoryFirstLoaded] = useState(false)
  const [subcategoryFirstLoaded, setSubcategoryFirstLoaded] = useState(false)
  const [featuresFirstLoaded, setFeaturesFirstLoaded] = useState(false)
  
  useEffect(() => {
    if(lotImages.length > 0)
      setImageError(false)
    else
      setImageError(true)
  }, [lotImages])

  const validationSchema = getSchema()

  const [schema, setSchema] = useState(yup.object().shape(validationSchema))

  const { register, control, handleSubmit, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })

  const theme = useSelector(selectTheme)
  const selectStyles = useSelectTheme(theme, "100%")

  const [unit, setUnit] = useState({})

  const [allowOffers, setAllowOffers] = useState(false)
  const [betHistory, setbetHistory] = useState(null)
  const [reList, setReList] = useState(false)

  const { data: lot, isLoading: lotLoading } = lotApi.useFetchLotQuery(lotId)
  const { data: filters } = lotApi.useFetchDefaultFiltersQuery()
  const { data: categories } = lotApi.useFetchCategoriesQuery()
  const [ categoryTrigger, { data: subcategories, isLoading: subcategoriesLoading }] = lotApi.useLazyFetchSubcategoriesQuery()
  const [ subcategoryTrigger, { data: features, isLoading: featuresLoading }] = lotApi.useLazyFetchFiltersQuery()
  const [ createLot, { isLoading: creatingLotLoading, error: creatingLotError } ] = lotApi.useCreateLotMutation()

  useEffect(() => {
    if(!!lot) {
      setValue('name', lot?.name)
      setValue('description', lot?.description)
      setValue('condition', conditionOptions.find(item => item.value === lot?.condition))
      setValue('startDate', parseDateTime(lot?.startDate.slice(0, -1)))
      setValue('endDate', parseDateTime(new Date(lot?.endDate).toISOString().slice(0, -1)))
      setValue('startPrice', lot?.startPrice)
      setValue('buyNowPrice', lot?.buyNowPrice || undefined)
      setValue('betStep', lot?.betStep || undefined)
      setbetHistory(!lot?.betHistory ? true : null)
      setAllowOffers(lot?.allowOffers)
      setReList(lot?.relist)
      setValue('minOfferPrice', lot?.minOfferPrice || undefined)
      setValue('autoConfirmOfferPrice', lot?.autoConfirmOfferPrice || undefined)
      setValue('reservePrice', lot?.reservePrice || undefined)
      setValue('shippingPayment', shippingPaymentOptions.find(item => item.value === lot?.shippingPayment))
      setValue('location', lot?.location)
    }
  }, [lot])
  
  const handleChangeCategory = () => {
    if(getValues().category) {
      categoryTrigger({ id: +getValues().category?.value })
    }
    else {
      setValue('subcategory', null)
    }
  }

  const handleChangeSubcategory = () => {
    if(getValues().subcategory) {
      subcategoryTrigger({id: +getValues().subcategory?.value})
    }
  }

  useEffect(() => {
    if(!!filters) {
      const findedDealTypes = filters?.dealTypes.filter(item => !!lot?.dealTypeList.find(lotItem => lotItem.dealType.name === item.name))
      setValue('dealTypes', findedDealTypes.map(item => ({ value: item.id, label: item.name })))

      const findedDeliveryTypes = filters?.deliveryTypes.filter(item => !!lot?.deliveryTypeList.find(lotItem => lotItem.deliveryType.name === item.name))
      setValue('deliveryTypes', findedDeliveryTypes.map(item => ({ value: item.id, label: item.name })))

      const findedPaymentTypes = filters?.paymentTypes.filter(item => !!lot?.paymentTypeList.find(lotItem => lotItem.paymentType.name === item.name))
      setValue('paymentTypes', findedPaymentTypes.map(item => ({ value: item.id, label: item.name })))
    }
  }, [filters])

  useEffect(() => {
    if(!!categories && !!lot && !categoryFirstLoaded) {
      const selectedCategory = categories?.find(item => item.name === lot?.category.category.name)
      setValue('category', { value: selectedCategory.id, label: selectedCategory.name })
      categoryTrigger({ id: selectedCategory.id })
      setCategoryFirstLoaded(true)
    }
  }, [categories, lot])

  useEffect(() => {
    if(!!subcategories && !!lot && !subcategoryFirstLoaded) {
      const selectedSubategory = subcategories?.find(item => item.name === lot?.category.name)
      setValue('subcategory', { value: selectedSubategory.id, label: selectedSubategory.name })
      subcategoryTrigger({ id: selectedSubategory.id })
      setSubcategoryFirstLoaded(true)
    }
  }, [subcategories, lot])
  
  useEffect(() => {
    if(!!features && !!lot && !featuresFirstLoaded) {
      lot?.featureValue.forEach(item => {
        if(item.feature.isOptions) {
          const feature = features.features.find(featureItem => item.feature.name === featureItem.name)
          const featureOption = feature.featureOptions.find(featureOptionItem => featureOptionItem.value === item.featureOption.value)
          setValue(`features.${transliterate(item.feature.name)}`, { value: featureOption.id, label: featureOption.value })
        }
        else {
          setValue(`features.${transliterate(item.feature.name)}`, item.value)
        }
      })
      setFeaturesFirstLoaded(true)
    }
  }, [features, lot])

  useEffect(() => {
    const featuresSchema = {}

    if(!!features) {
      for(const feature of features.features) {
        if(feature.isOptions) {
          featuresSchema[transliterate(feature.name)] = yup.object("").required("Обов'язкове поле")
        }
        else {
          featuresSchema[transliterate(feature.name)] = yup.number().typeError("Поле повинно містити числове значення").required("Обов'язкове поле").moreThan(0, "Поле повинно містити значення більше нуля")
          if(feature.unit === 'г' || feature.unit === 'мм')
            setUnit({
              ...unit,
              [transliterate(feature.name)]: { value: feature.unit, label: feature.unit }
            })
        }
      }
      setSchema(yup.object().shape({
        ...validationSchema, 
        features: yup.object().shape({ ...featuresSchema })
      }))
    }
  }, [features])

  const { errors } = useFormState({control})

  const handleCreateLot = async (data) => {
    setFirstSubmited(true)

    if(imageError)
      return

    const copyData = { ...data }

    const body = new FormData()

    for(const key in copyData) {
      if(key === 'features') {
        for(const featureKey in copyData[key]) {
          features.features.forEach(item => {
            if(transliterate(item.name) === featureKey) {
              if(copyData[key][featureKey] instanceof Object) {
                body.append(`feature${item.id}`, copyData[key][featureKey].value)
              }
              else {
                body.append(`feature${item.id}`, copyData[key][featureKey])
              }
            }
          })
        }
      }
      else if(key === 'image') {
        for (let index = 0; index < lotImages.length; index++) {
          body.append(`image`, lotImages[index].getAll('image')[0])
        }
      }
      else if(key === 'startDate' || key === 'endDate') {
        body.append(key, copyData[key].toDate())
      }
      else {
        if(copyData[key] instanceof Array) {
          const arrayValue = copyData[key].map(item => item.value)
          body.append(key, JSON.stringify(arrayValue))
        }
        else if(copyData[key] instanceof Object) {
          body.append(key, copyData[key].value)
        }
        else {
          body.append(key, copyData[key])
        }
      }
    }

    body.append('allowOffers', allowOffers)
    body.append('betHistory', betHistory)
    body.append('reList', reList)

    await createLot(body)

    if(!creatingLotError) {
      //navigate('/') 
    }
  }

  const handleStartDrag = e => {
    e.preventDefault()
    setDrag(true)
  }

  const handleLeaveDrag = e => {
    e.preventDefault()
    setDrag(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    getImageFromFile(file)
  }

  const getImageFromFile = file => {
    let uploadedImage = new FormData()
    uploadedImage.append('image', file)
    setLotImages([...lotImages, uploadedImage])
    setDrag(false)
  }

  const deleteImage = (index) => {
    const newArray = [...lotImages]
    newArray.splice(index, 1)
    setLotImages(newArray)
  }

  const handleToogleOffer = () => {
    if(allowOffers) {
      setValue('autoConfirmOfferPrice', '')
      setValue('minOfferPrice', '')
    }
    setAllowOffers(!allowOffers)
  }

  const handleToogleReList = () => {
    if(reList) {
      setValue('reservePrice', '')
    }
    setReList(!reList)
  }

  return (
    <PageLoading loading={lotLoading}>
      <section className='w-3/5 mx-auto mt-2'>
        <form 
          onSubmit={handleSubmit(handleCreateLot, () => setFirstSubmited(true))} 
          className='flex flex-col gap-4 w-full'
        >
          <h2 className='default-text font-openSans text-4xl font-semibold'>Редагування лоту</h2>

          <FormField 
            control={control}
            name="name"
            label="Назва"
            helperText={errors.name?.message}
          />

          <div className='flex flex-col gap-2'>
            <div className={classNames("w-full mx-auto rounded border-2 border-dashed h-[100px]", firstSubmited && imageError ? "border-red-600" : "border-dark-200 dark:border-light-300")}>
              <label 
                className={classNames("w-full h-full flex items-center text-center justify-center p-1 hover:cursor-pointer", firstSubmited && imageError ? "text-red-600" : "default-text")}
                onDragStart={e => handleStartDrag(e)}
                onDragOver={e => handleStartDrag(e)}
                onDragLeave={e => handleLeaveDrag(e)}
                onDrop={e => handleDrop(e)}
              >
                {firstSubmited && imageError ? "Необхідно додати хоча б одне зображення" : drag ? "Відпустіть файл" : "Перетягніть сюди фото лоту"}
                <input hidden type='file' {...register("image", {
                  onChange: e => getImageFromFile(e.nativeEvent.target.files[0])
                })}/>
              </label>
            </div>
            <div className='w-full flex flex-row flex-wrap gap-2 h-min'>
              {
                lotImages.map((item, index) => 
                  <Image 
                    key={`lotimag${index}`}
                    index={index}
                    image={URL.createObjectURL(item.get('image'))}
                    callback={deleteImage}
                  />
                )
              }
            </div>
          </div>

          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.condition?.message ? 'error-text' : ''}`}>Стан лоту</p>
            <FormSelect 
              control={control}
              name='condition'
              helperText={errors.condition?.message}
              options={conditionOptions}
              placeholder='Обрати'
              className='mt-1'
            />
          </div>

          <FormTextArea 
            control={control}
            name="description"
            label="Опис лоту"
            helperText={errors.description?.message}
          />
          
          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.category?.message ? 'error-text' : ''}`}>Категорія</p>
            <FormSelect 
              control={control}
              name='category'
              helperText={errors.category?.message}
              options={categories?.map(item => ({value: item.id, label: item.name}))}
              placeholder='Обрати'
              className='mt-1'
              callback={() => handleChangeCategory()}
            />
          </div>

          {
            !!subcategories
              ? <div className='flex flex-col'>
                  <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.subcategory?.message ? 'error-text' : ''}`}>Підкатегорія</p>
                  <FormSelect 
                    control={control}
                    name='subcategory'
                    helperText={errors.subcategory?.message}
                    options={subcategories?.map(item => ({value: item.id, label: item.name}))}
                    placeholder='Обрати'
                    className='mt-1'
                    callback={() => handleChangeSubcategory()}
                  />
                </div>
              : null
          }

          {
            !!subcategories && !!features
              ? <p className={`default-text font-oswald text-xl`}>Характеристики</p>
              : null
          }
          
          {
            !!subcategories && !!features
              ? features.features.map((item, index) => {
                  const featureName = transliterate(item.name)
                  
                  if(item.isOptions) {
                    return (
                      <div className='flex flex-col' key={`feature${index}`}>
                        <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.features?.[featureName]?.message ? 'error-text' : ''}`}>{item.name}</p>
                        <FormSelect 
                          control={control}
                          name={`features.${[featureName]}`}
                          helperText={errors.features?.[featureName]?.message}
                          options={item.featureOptions?.map(fetureOption => ({value: fetureOption.id, label: fetureOption.value}))}
                          placeholder='Обрати'
                          className='mt-1'
                          callback={() => handleChangeSubcategory()}
                        />
                      </div>
                    )
                  }
                  else {
                    let options
                    
                    if(item.unit === 'г')
                      options = weightOptions
                    if(item.unit === 'мм') 
                      options = lengthOptions

                    return(
                      <div className='flex flex-row gap-2 h-10' key={`feature${index}`}>
                        <div className='flex grow'>
                          <FormField 
                            control={control}
                            name={`features.${[featureName]}`}
                            label={item.name}
                            helperText={errors.features?.[featureName]?.message}
                          />
                        </div>
                        {
                          item.unit === 'г' || item.unit === 'мм' 
                            ? <div className='w-[80px]'>
                                <Select 
                                  styles={selectStyles}
                                  value={unit[featureName]}
                                  onChange={value => {
                                    setUnit({
                                      ...unit,
                                      [featureName]: value
                                    })
                                  }}
                                  options={options}
                                />
                              </div>
                            : <div className='h-full aspect-square flex items-center justify-center border-[1px] border-solid border-dark-200 dark:border-light-300 rounded'>
                                <p className='default-text font-roboto text-xl'>{item.unit.replace("\\", "")}</p>
                              </div>
                        }
                      </div>
                    )
                  }
                })
              : null
          }

          <div className='divider bg-dark-400 dark:bg-light-400 my-2'/>

          <h2 className='default-text font-openSans text-2xl font-semibold'>Налаштування торгів</h2>

          <FormField 
            control={control}
            name="startPrice"
            label="Початкова ціна"
            helperText={errors.startPrice?.message}
          />

          <FormField 
            control={control}
            name="buyNowPrice"
            label="Ціна купити зараз (опціональний параметр)"
            helperText={errors.buyNowPrice?.message}
          />

          <FormField 
            control={control}
            name="betStep"
            label="Шаг ставки (опціональний параметр)"
            helperText={errors.betStep?.message}
          />

          <Checkbox 
            label="Заблокувати доступ до перегляду історії ставок"
            onClick={setbetHistory}
            value={betHistory}
          />

          <FormDateField 
            control={control}
            name="startDate"
            label="Дата початку торгів"
            helperText={errors.startDate?.message}
          />

          <FormDateField 
            control={control}
            name="endDate"
            label="Дата кінця торгів"
            helperText={errors.endDate?.message}
          />

          <div className={classNames('p-4 flex flex-col gap-4 rounded border-[1px] border-solid border-dark-200 dark:border-light-300 overflow-hidden transition-all duration-150', allowOffers ? 'h-max' : 'h-20')}>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col'>
                <p className='default-text text-xl font-openSans'>Пропозиції</p>
                <p className='default-text text-sm font-openSans'>Дозволити створення пропозицій на покупку даного лоту</p>
              </div>
              <ToogleSwitch toogled={allowOffers} onClick={() => handleToogleOffer()}/>
            </div>

            <FormField 
              control={control}
              name="minOfferPrice"
              label="Мінімальна ціна пропозиції (опціональний параметр)"
              helperText={errors.minOfferPrice?.message}
            />

            <FormField 
              control={control}
              name="autoConfirmOfferPrice"
              label="Ціна автопідтвердження пропозиції (опціональний параметр)"
              helperText={errors.autoConfirmOfferPrice?.message}
            />
          </div>

          <div className={classNames('p-4 flex flex-col gap-4 rounded border-[1px] border-solid border-dark-200 dark:border-light-300 overflow-hidden transition-all duration-150', reList ? 'h-max' : 'h-[100px]')}>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col grow w-2/3'>
                <p className='default-text text-xl font-openSans'>Перевиставлення лоту</p>
                <p className='default-text text-sm font-openSans'>Якщо під час аукціону лот не набрав однієї ставки або величина максимальної ставки менша за вказану резервну ціну лот буде заново перевиставлений на торги</p>
              </div>
              <ToogleSwitch toogled={reList} onClick={() => handleToogleReList()}/>
            </div>

            <FormField 
              control={control}
              name="reservePrice"
              label="Резервна ціна (опціональний параметр)"
              helperText={errors.reservePrice?.message}
            />
          </div>

          <div className='divider bg-dark-400 dark:bg-light-400 my-2'/>

          <h2 className='default-text font-openSans text-2xl font-semibold'>Доставка і оплата</h2>

          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.shippingPayment?.message ? 'error-text' : ''}`}>За доставку сплачує</p>
            <FormSelect 
              control={control}
              name='shippingPayment'
              helperText={errors.shippingPayment?.message}
              options={shippingPaymentOptions}
              placeholder='Обрати'
              className='mt-1'
            />
          </div>

          <div className='checkout-form'>
            <FormTextArea 
              control={control}
              name="location"
              label="Місцезнаходження лоту"
              helperText={errors.location?.message}
            />
          </div>

          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.deliveryTypes?.message ? 'error-text' : ''}`}>Можливі типи доставки</p>
            <FormSelect 
              control={control}
              name='deliveryTypes'
              helperText={errors.deliveryTypes?.message}
              options={filters?.deliveryTypes?.map(item => ({ value: item.id, label: item.name }))}
              placeholder='Обрати'
              className='mt-1'
              isMulti={true}
            />
          </div>

          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.dealTypes?.message ? 'error-text' : ''}`}>Можливі типи угоди</p>
            <FormSelect 
              control={control}
              name='dealTypes'
              helperText={errors.dealTypes?.message}
              options={filters?.dealTypes?.map(item => ({ value: item.id, label: item.name }))}
              placeholder='Обрати'
              className='mt-1'
              isMulti={true}
            />
          </div>

          <div className='flex flex-col'>
            <p className={`default-text font-oswald text-lg leading-[1.1rem] ${!!errors.paymentTypes?.message ? 'error-text' : ''}`}>Можливі типи оплати</p>
            <FormSelect 
              control={control}
              name='paymentTypes'
              helperText={errors.paymentTypes?.message}
              options={filters?.paymentTypes?.map(item => ({ value: item.id, label: item.name }))}
              placeholder='Обрати'
              className='mt-1'
              isMulti={true}
            />
          </div>

          <div className='w-[200px] mx-auto'>
            <Button type='submit' outline={true} loading={creatingLotLoading}>Редагувати</Button>
          </div>
        </form>
      </section>
    </PageLoading>
  )
}