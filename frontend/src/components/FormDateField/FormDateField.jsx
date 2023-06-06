import React from 'react'
import { Controller } from 'react-hook-form'
import { DateField } from '../DateField/DateField'
import { now, getLocalTimeZone } from '@internationalized/date'

export default function FormDateField({control, name, label, helperText}) {
  return (
    <Controller 
      control={control}
      name={name}
      render={({ field }) => 
        <DateField
          label={label}
          placeholderValue={now(getLocalTimeZone())}
          onBlur={e => field.onBlur(e)}
          onChange={e => field.onChange(e)}
          value={field.value}
          errorMessage={helperText}
        />
      }
    />
  )
}