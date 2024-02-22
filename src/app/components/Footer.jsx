import React from 'react'
import { memo } from 'react'
import Input from './Input.jsx'
import './Footer.css'

const Footer = memo(function Footer ({ location, onSetLocation, onGetAirData }) {
  return (
    <footer>
        <div className="location">
          <Input location={location} onSetLocation={onSetLocation} onGetAirData={onGetAirData}/>
          <br />
          <span className="small">location</span>
        </div>
    </footer>
  )
})

export default Footer
