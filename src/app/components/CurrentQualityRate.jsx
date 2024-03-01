import React, { memo } from 'react'
import './CurrentQualityRate.css'

const CurrentQualityRate = memo(function CurrentQualityRate ({ airQuality }) {
  return (
    <h2 className="current-air-quality">
      {airQuality}
      <span className="small">current air pollution index</span>
    </h2>
  )
})

export default CurrentQualityRate
