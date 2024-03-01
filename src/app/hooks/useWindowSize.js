import { useLayoutEffect, useState } from 'react'

export function useWindowSize () {
  const [size, setSize] = useState(0)

  useLayoutEffect(() => {
    function updateSize () {
      setSize(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}
