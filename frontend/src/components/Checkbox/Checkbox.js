import React, { useState, useEffect } from 'react'
import './Checkbox.css'
import { BsCheckLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

export default function Checkbox({label, onClick, value, multiple}) {

  const [checkBox, setCheckBox] = useState(null)

  useEffect(() => {
    if(value === null)
      setCheckBox(
        <div className="checkBox">
        </div>
      )
    if(value)
      setCheckBox(
        <div className="checkBox checked">
          <BsCheckLg size="10px"/>
        </div>
      )
    if(value === false)
      setCheckBox(
        <div className="checkBox checked">
          <IoClose size="17px"/>
        </div>
      )
  }, [value])

  return (
    <div className="checkboxBlock">
      <label className="checkBoxTitle">
        {label}
        <input className="checkboxHidden" type='checkbox' onChange={() => {
          let newValue
          if(multiple) {
            newValue = value ? false : value === null ? true : null
            onClick(newValue)
          }
          else {
            newValue = value ? null : true
            onClick(newValue)
          }
        }}/>
        {checkBox}
      </label>
    </div>
  )
}
