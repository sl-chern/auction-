import React from 'react'
import './TextArea.css'

export default function TextArea({label, value, onChange, onBlur, errorText = null}) {
  let className = "form-group__form-input textarea__input"

  if(!!errorText)
    className += ' form-input_invalid'

  return (
    <div className="textarea">
      <div className="textarea__input-block">
        <div className="form-group">
          <textarea 
            maxLength={1500}
            autoComplete="off" 
            className={className}
            placeholder=" "
            value={value?.replace('\\n', '\n')}
            onBlur={e => onBlur(e)}
            onChange={e => onChange(e)}
          />
          <label className="form-group__form-label bg-light-300">{errorText || label}</label>
        </div>
      </div>
      
      <div className="textarea__count-info">
        <p className="textarea__count-text">{value?.length || 0}/2000 символов</p>
      </div>
    </div>
  )
}
