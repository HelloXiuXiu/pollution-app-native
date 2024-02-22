import React, { useState, useRef, useEffect, memo } from 'react'
import { useAnimateList } from '../hooks/useAnimateList.js'
import './RatesInfo.css'

const EuropeAQI = {
  title: 'Europe AQI',
  good: '0-20',
  fair: '20-40',
  moderate: '40-60',
  poor: '60-80',
  very_poor: '80-100',
  extremely_poor: '>100',
  units: '—'
}

const EuropeRates = [
  {
    title: 'Particulate Matter PM/2.5',
    good: '0-10',
    fair: '10-20',
    moderate: '20-25',
    poor: '25-50',
    very_poor: '50-75',
    extremely_poor: '75-800',
    units: 'μg/m³'
  },
  {
    title: 'Particulate Matter PM/10',
    good: '0-20',
    fair: '20-40',
    moderate: '40-50',
    poor: '50-100',
    very_poor: '100-150',
    extremely_poor: '150-1200',
    units: 'μg/m³'
  },
  {
    title: 'Nitrogen Dioxide NO/2',
    good: '0-40',
    fair: '40-90',
    moderate: '90-120',
    poor: '120-230',
    very_poor: '230-340',
    extremely_poor: '340-1000',
    units: 'μg/m³'
  },
  {
    title: 'Ozone O/3',
    good: '0-50',
    fair: '50-100',
    moderate: '100-130',
    poor: '130-240',
    very_poor: '240-380',
    extremely_poor: '380-800',
    units: 'μg/m³'
  },
  {
    title: 'Sulphur Dioxide SO/2',
    good: '0-100',
    fair: '100-200',
    moderate: '200-350',
    poor: '350-500',
    very_poor: '500-750',
    extremely_poor: '750-1250',
    units: 'μg/m³'
  }
]

const UnitedStatesAQI = {
  title: 'United States AQI',
  good: '0-50',
  moderate: '51-100',
  unhealthy_for_sensitive_groups: '101-150',
  unhealthy: '151-200',
  very_unhealthy: '201-300',
  hazardous: '301-500',
  units: '—'
}

const UnitedStatesRates = [
  {
    title: 'Particulate Matter PM/2.5',
    good: '0-12',
    moderate: '12-35.5',
    unhealthy_for_sensitive_groups: '35.5-55.5',
    unhealthy: '55.5-150.5',
    very_unhealthy: '150.5-250.5',
    hazardous: '250.5-500.5',
    units: 'μg/m³'
  },
  {
    title: 'Particulate Matter PM/10',
    good: '0-55',
    moderate: '55-155',
    unhealthy_for_sensitive_groups: '155-255',
    unhealthy: '255-355',
    very_unhealthy: '355-425',
    hazardous: '425-605',
    units: 'μg/m³'
  },
  {
    title: 'Nitrogen Dioxide NO/2',
    good: '0-54',
    moderate: '54-100',
    unhealthy_for_sensitive_groups: '101-360',
    unhealthy: '360-650',
    very_unhealthy: '650-1250',
    hazardous: '1250-2050',
    units: 'ppb'
  },
  {
    title: 'Ozone O/3',
    good: '0-55',
    moderate: '55-70',
    unhealthy_for_sensitive_groups: '70-85',
    unhealthy: '85-105',
    very_unhealthy: '105-200',
    hazardous: '200-605',
    units: 'ppb'
  },
  {
    title: 'Sulphur Dioxide SO/2',
    good: '0-35',
    moderate: '35-75',
    unhealthy_for_sensitive_groups: '75-185',
    unhealthy: '185-305',
    very_unhealthy: '305-605',
    hazardous: '605-1005',
    units: 'ppb'
  },
  {
    title: 'Carbon Monoxide CO',
    good: '0-4.5',
    moderate: '4.5-9.5',
    unhealthy_for_sensitive_groups: '9.5-12.5',
    unhealthy: '12.5-15.5',
    very_unhealthy: '15.5-30.5',
    hazardous: '30.5-50.5',
    units: 'ppm'
  }
]

const RatesInfo = memo(function RatesInfo ({ continent, onSetContinent }) {
  const [rates, setRates] = useState(EuropeRates)
  const [aqi, setAqi] = useState(EuropeAQI)

  const [k, setK] = useState('')
  const listWrapper = useRef(null)

  useEffect(() => {
    setRates(continent === 'Europe' ? EuropeRates : UnitedStatesRates)
    setAqi(continent === 'Europe' ? EuropeAQI : UnitedStatesAQI)
  }, [continent])

  function handleButtonClick (e) {
    const targ = e.target.closest('[data-event]')
    if (!targ) return

    const currentContinent = targ.dataset.event

    const parrent = targ.parentElement
    const buttons = Array.from(parrent.children)
    buttons.forEach(el => el.classList.remove('active'))
    targ.classList.add('active') // to chage buttons state immidetely and not wait for unload animation to play

    listWrapper.current.classList.add('unload-rates')

    setTimeout(() => {
      onSetContinent(currentContinent)
      setK(Math.random().toString(10).slice(2))
      listWrapper.current.classList.remove('unload-rates')
    }, 400)
  }

  return (
    <div className="rates-info">
      <div className="rate-controls">
        <button className={continent === 'Europe' ? 'active switch-button' : 'switch-button'} data-event="Europe" onClick={handleButtonClick} aria-label="continent-switch-europe">Europe</button>
        <button className={continent === 'America' ? 'active switch-button' : 'switch-button'} data-event="America" onClick={handleButtonClick} aria-label="continent-switch-america">America</button>
      </div>
      <div ref={listWrapper}>
        <RatesList
          key={k}
          continent={continent}
          rates={rates}
          aqi={aqi} />
      </div>
    </div>
  )
})

const RatesList = memo(function RatesList ({ continent, rates, aqi }) {
  useAnimateList('.load-rates', disableHover)

  function disableHover (el) {
    el.classList.add('no-hover')
    el.addEventListener('animationend', () => { el.classList.remove('no-hover') })
  }

  return (
    <ul className="list-data load-rates">
      { rates.map((el, ind) => (
        <li className="rates-grid" key={ind}>
          { Object.entries(el).map(entry => (
            <p key={el.title + entry[0]}>
              { entry[0] === 'title'
                ? entry[1].split('/').map((el, ind) => ind === 0 ? el : <sub key={el + ind}>{el}</sub>)
                : entry[1] }
              <span className='mobile'>{entry[0].split('_').join(' ')}</span>
            </p>
          ))}
        </li>
      ))}
      <li className="rates-grid header">
        { Object.entries(rates[0]).map(entry => (
          <p key={rates[0].title + entry[0] + 'head'} className={entry[0]}>{entry[0].split('_').join(' ')}</p>
        ))}
      </li>
      <li className="rates-grid">
        { Object.entries(aqi).map(entry => (
          <p key={entry[0] + entry[1]}>
            {entry[1]}
            <span className='mobile'>{entry[0].split('_').join(' ')}</span>
          </p>
        ))}
      </li>
      <li className="links">
        <p>Pollutant thresholds in μg/m³ and ppb from the &nbsp;
          { continent === 'Europe'
            ? <a href="https://www.eea.europa.eu/themes/air/air-quality-index" rel="nooper nofollow noreferrer" target="_blank">
                European Environment Agency (EAA)
              </a>
            : <a href="https://en.wikipedia.org/wiki/Air_quality_index#United_States" rel="nooper nofollow noreferrer" target="_blank">
                United States Environmental Protection Agency (EPA)
              </a>
          }
        </p>
      </li>
    </ul>
  )
})

export default RatesInfo
