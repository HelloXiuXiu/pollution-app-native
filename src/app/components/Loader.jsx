import React from 'react'
import './Loader.css'

export default function Loader ({ loadStatus }) {
  return (
    <p className="loader">
      { loadStatus }
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </p>
  )
}
