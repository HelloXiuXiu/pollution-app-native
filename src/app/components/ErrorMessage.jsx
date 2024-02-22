import React from 'react'
import './ErrorMessage.css'

export default function ErrorMessage ({ message }) {
  return (
    <p className="error">Error: {message}.</p>
  )
}
