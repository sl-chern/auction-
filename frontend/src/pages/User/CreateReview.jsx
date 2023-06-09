import React, { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { lotApi } from '../../services/lotService'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useForm, useFormState } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormTextArea from '../../components/FormTextArea/FormTextArea'
import FormSelect from '../../components/FormSelect/FormSelect'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { userApi } from '../../services/userService'
import { useDispatch } from 'react-redux'

const options = [
  { value: true, label: "Рекомедую" },
  { value: false, label: "Не рекомедую" },
]

export default function CreateReview({visibility, setVisibility}) {
  const { id } = useParams()
  const { data: lots } = lotApi.useGetLotsToReviewQuery(id)

  const dispatch = useDispatch()

  const [lot, setLot] = useState(null)

  const [createReview, { isLoading }] = userApi.useCreateReviewMutation()

  const schema = yup.object().shape({
    text: yup.string("Інформація про себе повинна бути строкою").required('Введіть текст відгуку'),
    recomendation: yup.object().required("Оберіть чи рекомендуєте ви продавця")
  })

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })

  const { errors } = useFormState({control})

  const onSubmit = async (data) => {
    try {
      if(lot === null) {
        toast.error('Оберіть лот до якого буде прикріплений відгук')
        return
      }

      const body = {
        id: +id,
        text: data.text,
        recomendation: data.recomendation.value,
        lotId: lot
      }
  
      await createReview(body).unwrap()
      toast.success('Відгук був створений')
      dispatch(lotApi.util.invalidateTags(['LotsToReview']))
      setValue('text', "")
      setValue('recomendation', null)
      setLot(null)
    }
    catch {
      toast.error('Відгук не був створений')
    }
  }

  return (
    <Modal visibility={visibility} setVisibility={setVisibility} label={"Відгук"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4 p-4'>
          <div className='w-auto flex flex-col gap-2'>
            {
              lots instanceof Array 
                ? lots?.map((item, index) => 
                    <div 
                      className={classNames(`flex flex-row p-2 gap-2 items-center w-full rounded border-[1px] border-solid border-dark-200 dark:dark:border-light-300 cursor-pointer`, item.id === lot ? 'bg-dark-400 dark:bg-light-400' : null)} 
                      key={`lottoreview${index}`}
                      onClick={() => setLot(item.id)}
                    >
                      <div className='h-10 w-10 bg-light-500 dark:bg-dark-200 rounded flex items-center justify-center overflow-hidden'>
                        <img src={`${import.meta.env.VITE_SERVER_URL}/../${item.images[0]?.path}`} alt="lot image" className='max-w-full max-h-full object-contain'/>
                      </div>
                      <p className={classNames('text-base font-openSans grow line-clamp-1', item.id === lot ? 'text-light-300 dark:text-dark-200' : 'default-text')}>{item.name}</p>
                      <p className={classNames('font-oswald text-xl', item.id === lot ? 'text-light-300 dark:text-dark-200' : 'default-text')}>{item.currentPrice}₴</p>
                    </div>
                  )
                : null
            }
          </div>
          <div className='flex flex-col gap-2 modal-review'>
            <FormTextArea 
              control={control}
              name="text"
              label="Текст відгуку"
              helperText={errors.text?.message}
            />
            <div className='flex flex-row items-center justify-between'>
              <FormSelect 
                control={control}
                name='recomendation'
                helperText={errors.recomendation?.message}
                options={options}
                placeholder='Рекомендація'
                className={classNames('w-[320px]')}
              />
              <Button type='submit' outline={true} loading={isLoading}>Створити</Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
