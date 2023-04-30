import React from 'react'
import './TextArea.css'

export default function TextArea({label, value, onChange, onBlur, errorText = null}) {
  return (
    <div className="textarea">
      <div className="textarea__input-block">
        <div className="form-group">
          <textarea 
            maxLength={1500}
            autoComplete="off" 
            className="form-group__form-input textarea__input"
            placeholder=" "
            value={value}
            onBlur={e => onBlur(e)}
            onChange={e => onChange(e)}
          />
          <label className="form-group__form-label bg-light-300">{errorText || label}</label>
        </div>
      </div>
      
      <div className="textarea__count-info">
        <p className="textarea__count-text">{value.length}/2000 символов</p>
      </div>
    </div>
  )
}
