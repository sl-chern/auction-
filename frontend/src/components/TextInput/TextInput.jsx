import React from 'react'
import './TextInput.css'

export default function TextInput({children, name, type = "text", value, setValue, onBlur, errorText = null, ...props}) {
  let className = "form-group__form-input"

  if(errorText !== null)
    className += " form-input_invalid"

  return (
    <div className="form-group">
      <input 
        name={name}
        type={type} 
        autoComplete="off" 
        className={className}
        placeholder=" " 
        value={value}
        onBlur={e => onBlur(e)}
        onChange={e => setValue(e)}
        {...props}
      />
      <label className="form-group__form-label">{errorText || children}</label>
    </div>
  )
}
