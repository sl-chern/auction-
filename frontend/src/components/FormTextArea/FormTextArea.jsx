import React from 'react'
import { Controller } from 'react-hook-form'
import TextArea from '../TextArea/TextArea'

export default function FormTextArea({control, name, label, helperText, ...props}) {
  return (
    <Controller 
      control={control}
      name={name}
      render={({ field }) => 
        <TextArea
          label={label}
          value={field.value}
          onChange={e => field.onChange(e)}
          onBlur={e => field.onBlur(e)}
          errorText={helperText}
          {...props}
        />
      }
    />
  )
}