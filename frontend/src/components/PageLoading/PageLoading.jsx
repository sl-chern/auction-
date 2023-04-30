import React from 'react'
import { Oval } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../store/slices/themeSlice'
import './PageLoading.css'

export default function PageLoading({loading, children}) {
  const theme = useSelector(selectTheme)

  if(loading) 
    return (
      <div className="spinner-block">
        <Oval color={theme ? "white" : "black"} secondaryColor={theme ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
  else 
    return children
}
