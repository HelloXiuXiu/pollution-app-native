import React, { useState, memo } from 'react'
import './Main.css'

import Navigation from './Navigation.jsx'
import CurrentQualityRate from './CurrentQualityRate.jsx'
import RatesInfo from './RatesInfo.jsx'
import HourlyData from './HourlyData.jsx'

const Main = memo(function Main ({ continent, onSetContinent, airQuality, data, key }) {
  const [isHourlyOpen, setIsHourlyOpen] = useState(false)
  const [isRatesOpen, setIsRatesOpen] = useState(false)

  return (
    <main>
      <Navigation
        isRatesOpen={isRatesOpen}
        onSetIsRatesOpen={setIsRatesOpen}
        isHourlyOpen={isHourlyOpen}
        onSetIsHourlyOpen={setIsHourlyOpen} />
      <CurrentQualityRate airQuality={airQuality} />
      { isRatesOpen &&
        <RatesInfo continent={continent} onSetContinent={onSetContinent} />
      }
      { isHourlyOpen &&
        <HourlyData data={data} key={key} />
      }
    </main>
  )
})

export default Main
