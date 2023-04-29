import React, { useEffect, useState } from 'react'
import './Button.css'

export default function Button({outline, onClick, children, loading}) {
  const [butStyle, setButStyle] = useState()
  const [textStyle, setTextStyle] = useState()

  useEffect(() => {
    if(!outline) {
      setTextStyle("text")
      setButStyle("button group")
    }
    else {
      setTextStyle("text-outline")
      setButStyle("button-outline group")
    }
  }, [outline])

  if(!loading)
    return (
      <button type="submit" className={butStyle} onClick={onClick}>
        <p className={textStyle}>
          {children}
        </p>
      </button>
    )
  else 
    return <div className="loaderBlock">
      <div className="lds-dual-ring"></div>
    </div>
}
