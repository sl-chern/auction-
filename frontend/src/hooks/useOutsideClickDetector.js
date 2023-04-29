import { useEffect } from "react";

const useOutsideClickDetector = (ref, outsideRef, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log(ref.current);
      console.log(!ref.current.contains(event.target), !outsideRef.current.contains(event.target))

      if (ref.current && !ref.current.contains(event.target) && !outsideRef.current.contains(event.target))
        callback()
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref, outsideRef, callback])
}

export default useOutsideClickDetector