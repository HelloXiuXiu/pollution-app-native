import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import './Input.css'

const Input = memo(function Input ({ location, onSetLocation, onGetAirData }) {
  const [userInput, setUserInput] = useState(location)
  const [cities, setCities] = useState([])
  const [isInputActive, setIsInputActive] = useState(false)
  const input = useRef(null)

  const controller = new AbortController()

  useEffect(() => {
    async function getLocation (inp) {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${inp}`,
          { signal: controller.signal }
        )
        const geoData = await geoRes.json()
        if (!geoData.results) throw new Error('Location not found')

        const arr = []
        geoData.results.forEach(el => {
          arr.push({
            name: el.name + '/' + el.country,
            latitude: el.latitude,
            longitude: el.longitude
          })
        })

        setCities(arr)
      } catch (error) {
        console.log('Error ' + error.message)
      }
    }

    isInputActive && getLocation(userInput)

    return () => controller.abort()
  }, [userInput])

  function handleInput (e) {
    setIsInputActive(true)
    setUserInput(e.target.value)
  }

  function handleClick () {
    setIsInputActive(false)
    setUserInput('')
    setCities([])
    window.addEventListener('click', resetValue, true)
  }

  const resetValue = useCallback((e) => {
    setIsInputActive(false)
    if (e.target.closest('.cities')) return

    window.removeEventListener('click', resetValue, true)
    setCities([])
    setUserInput(location)
  }, [location])

  function updateLocation (e) {
    const trig = e.target.closest('[data-index]')
    if (!trig) return

    // why the line below doesn't run?
    window.removeEventListener('click', resetValue, true)

    const selectedCity = cities[trig.dataset.index]
    onGetAirData(selectedCity.latitude, selectedCity.longitude)

    const newLocation = selectedCity.latitude.toFixed(2) + '°, ' + selectedCity.longitude.toFixed(2) + '° ' + selectedCity.name
    onSetLocation(newLocation)
    setUserInput(newLocation)
    setCities([])
  }

  return (
  <div className="input-wrapper">
    { cities.length > 0 &&
      <ul className="cities">
        { cities.map((el, ind) => (
            <li key={ind} data-index={ind} onClick={updateLocation}>{el.name}</li>
        ))}
      </ul>
    }
    <input
      ref={input}
      type="text"
      value={userInput}
      size={userInput.length + 1}
      onChange={handleInput}
      onClick={handleClick}/>
  </div>
  )
})

export default Input
