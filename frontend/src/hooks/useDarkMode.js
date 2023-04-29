import { useEffect } from "react"
import useLocalStorage from "./useLocalStorage"
import { useDispatch } from "react-redux"
import { changeTheme } from "../store/slices/themeSlice"

const useDarkMode = () => {
  const [mode, setMode] = useLocalStorage('mode')
  const dispatch = useDispatch()

  useEffect(() => {
    const className = 'dark'
    const bodyClass = window.document.body.classList

    mode ? bodyClass.add(className) : bodyClass.remove(className)
    
    dispatch(changeTheme(mode))
  }, [mode])

  return [mode, setMode]
}

export default useDarkMode;