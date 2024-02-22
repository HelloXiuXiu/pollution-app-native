import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import './styles.css'

import Loader from './components/Loader.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'
import Footer from './components/Footer.jsx'

function App () {
  // global
  const [isLoading, setIsLoading] = useState(true)
  const [loadStatus, setLoadStatus] = useState('')
  const [error, setError] = useState('')

  // air quality indexes
  const [indexEurope, setIndexEurope] = useState(0)
  const [indexAmerica, setIndexAmerica] = useState(0)
  const [airQualityEurope, setAirQualityEurope] = useState('')
  const [airQualityAmerica, setAirQualityAmerica] = useState('')

  // hourly arrays
  const [hourly, setHourly] = useState([])

  // geolocation
  const [location, setLocation] = useState('')
  const [continent, setContinent] = useState('')

  useEffect(() => {
    setLoadStatus('Looking for the nearest location')
    if (!navigator.geolocation) {
      return setError('Your browser does not support geolocation.')
    }

    navigator.geolocation.getCurrentPosition(pos => {
      // getAirData(pos.coords.latitude, pos.coords.longitude)
    })
    getAirData(44.85, 20.45)
  }, [])

  // get pollution data
  const getAirData = useCallback(async function (latitude, longitude) {
    setLoadStatus('Loading data')
    try {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=european_aqi,us_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&past_days=1&forecast_days=1`
      )
      if (!response.ok) throw new Error('Loading data failed. Try again.')

      const data = await response.json()
      console.log(data)

      setHourly(data.hourly)
      getCurrentIndex(data)

      !location && setLocation(data.latitude.toFixed(2) + '°, ' + data.longitude.toFixed(2) + '° ' + data.timezone.split('_').join(' '))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [location])

  function getCurrentIndex (data) {
    if (/^America+/.test(data.timezone)) {
      setContinent('America')
    } else {
      setContinent('Europe') // Africa, Asia, Europe and the rest
    }

    const indAmerica = data.current.us_aqi
    const qualityAmerica = (indAmerica <= 50) ? 'good'
      : (indAmerica >= 51 && indAmerica <= 100) ? 'moderate'
        : (indAmerica >= 101 && indAmerica <= 150) ? 'unhealthy for sensitive groups'
          : (indAmerica >= 151 && indAmerica <= 200) ? 'unhealthy'
            : (indAmerica >= 201 && indAmerica <= 300) ? 'very unhealthy'
              : 'hazardous'
    setIndexAmerica(indAmerica)
    setAirQualityAmerica(qualityAmerica)

    const indEurope = data.current.european_aqi
    const qualityEurope = (indEurope <= 20) ? 'good'
      : (indEurope >= 21 && indEurope <= 40) ? 'fair'
        : (indEurope >= 41 && indEurope <= 60) ? 'moderate'
          : (indEurope >= 61 && indEurope <= 80) ? 'poor'
            : (indEurope >= 81 && indEurope <= 100) ? 'very poor'
              : 'extremely poor'
    setIndexEurope(indEurope)
    setAirQualityEurope(qualityEurope)
  }

  function getHeaderClass () {
    if (continent === 'Europe') {
      return airQualityEurope ? airQualityEurope.split(' ').join('-') : ''
    } else if (continent === 'America') {
      switch (airQualityAmerica) {
        case 'good':
          return 'good'
          break
        case 'moderate':
          return 'fair'
          break
        case 'unhealthy for sensitive groups':
          return 'moderate'
          break
        case 'unhealthy':
          return 'poor'
          break
        case 'very unhealthy':
          return 'very-poor'
          break
        case 'hazardous':
          return 'extremely-poor'
          break
        default:
          return ''
      }
    }
    return ''
  }

  const headerImage = useCallback(getHeaderClass(), [continent, location, hourly])

  return (
    <>
      { isLoading ? <Loader loadStatus={loadStatus} />
        : error ? <ErrorMessage message={error} />
          : <div className="content">
            <Header
              index={continent === 'Europe' ? indexEurope : indexAmerica}
              image={headerImage} />
            <Main
              continent={continent}
              onSetContinent={setContinent}
              data={hourly}
              airQuality={continent === 'Europe' ? airQualityEurope : airQualityAmerica} />
            <Footer
              location={location}
              onSetLocation={setLocation}
              onGetAirData={getAirData}/>
          </div>
      }
    </>
  )
}

export default App
