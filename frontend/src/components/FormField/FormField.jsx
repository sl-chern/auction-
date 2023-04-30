import React from 'react'
import { Controller } from 'react-hook-form'
import TextInput from '../TextInput/TextInput'

export default function FormField({control, name, label, helperText, type = "text", ...props}) {
  return (
    <Controller 
      control={control}
      name={name}
      render={({ field }) => 
        <TextInput
          name={name}
          type={type}
          value={field.value}
          setValue={e => field.onChange(e)}
          onBlur={e => field.onBlur(e)}
          errorText={helperText}
          {...props}
        >
          {label}
        </TextInput>
      }
    />
  )
}