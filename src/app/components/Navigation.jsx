import React from 'react'
import { memo } from 'react'
import './Navigation.css'

const Navigation = memo(function Navigation ({ isRatesOpen, onSetIsRatesOpen, isHourlyOpen, onSetIsHourlyOpen }) {
  function hourlyClick () {
    onSetIsHourlyOpen((isHourlyOpen) => !isHourlyOpen)
    onSetIsRatesOpen(false)
  }

  function ratesClick () {
    onSetIsRatesOpen((isRatesOpen) => !isRatesOpen)
    onSetIsHourlyOpen(false)
  }

  return (
    <nav>
      <p
        className={`nav-item hourly${isHourlyOpen ? ' active' : isRatesOpen ? ' wait' : ''}`}
        onClick={hourlyClick}>
        hourly data
      </p>
      <p
        className={`nav-item rates${isRatesOpen ? ' active' : isHourlyOpen ? ' wait' : ''}`}
        onClick={ratesClick}>
        pollution rates
      </p>
    </nav>
  )
})

export default Navigation
