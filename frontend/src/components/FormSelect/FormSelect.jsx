import React from 'react'
import { Controller } from 'react-hook-form'
import useSelectTheme from '../../hooks/useSelecteTheme'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../store/slices/themeSlice'
import Select from 'react-select'

export default function FormSelect({control, name, helperText, options, placeholder, className = '', callback = () => {}, ...props}) {
  const theme = useSelector(selectTheme)
  const selectStyles = useSelectTheme(theme, "100%", 'auto', !!helperText)

  return (
    <Controller 
      control={control}
      name={name}
      render={({ field }) => 
        <Select 
          styles={selectStyles}
          className={className}
          placeholder={helperText || placeholder}
          isSearchable
          value={field.value}
          onChange={e => {
            field.onChange(e)
            callback()
          }}
          onBlur={e => field.onBlur(e)}
          options={options}
          {...props}
        />
      }
    />
  )
}