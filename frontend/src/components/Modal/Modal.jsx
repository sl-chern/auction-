import React from 'react'
import { RiCloseLine } from 'react-icons/ri'

export default function Modal({visibility, setVisibility, children, label}) {
  const closeModal = () => {
    setVisibility(false)
  }

  if(visibility)
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center">
        <div className="w-[100%] h-[100%] bg-dark-300 absolute top-0 left-0 opacity-30 z-20" onClick={() => closeModal()}></div>
        <div className="flex flex-col w-1/2 h-auto pb-10 bg-light-200 dark:bg-dark-200 absolute rounded z-20">
          <div className="w-[100%] flex flex-row-reverse h-auto">
            <div className="m-2 w-7 h-7 rounded border-2 border-dark-300 dark:border-light-300 flex justify-center items-center hover:cursor-pointer dark:hover:bg-dark-100 hover:bg-light-100" onClick={() => closeModal()}>
              <RiCloseLine className="default-icon" size={20}/>
            </div>
          </div>
          <div className="flex justify-center">
            <h2 className="font-bold font-openSans text-3xl text-dark-300 dark:text-light-300">{label}</h2>
          </div>
          {children}
        </div>
      </div>
    )
}
