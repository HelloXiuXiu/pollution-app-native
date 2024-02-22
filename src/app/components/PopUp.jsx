import React from 'react'
import { useAnimateList } from '../hooks/useAnimateList.js'
import { useEffect, useRef } from 'react'
import './PopUp.css'

export default function PopUp ({ children, wrapperClass, setIsOpen }) {
  const wrapper = useRef(null)

  useEffect(() => {
    document.addEventListener('click', handleClose, true)
    wrapper.current.addEventListener('animationend', animateContent, { once: true })

    return () => {
      document.removeEventListener('click', handleClose, true)
    }
  }, [])

  useAnimateList('.popup')

  function handleClose (e, closeIcon = false) {
    if (e.target.closest('.' + wrapperClass) && !closeIcon) return

    wrapper.current.classList.add('unload-popup')
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  function animateContent () {
    wrapper.current.classList.add('animate-content')
  }

  return (
    <div ref={wrapper} className={`popup ${wrapperClass && wrapperClass}`}>
      {children}
      <div className="popup-close" onClick={(e) => handleClose(e, true)}>
        <svg className="popup-close-svg" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L12 12" stroke="currentColor"/>
          <path d="M12 1L1 12" stroke="currentColor"/>
        </svg>
      </div>
    </div>
  )
}
