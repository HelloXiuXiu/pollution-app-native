import React from 'react'
import { useState, useRef, useLayoutEffect, useCallback, memo } from 'react'
import { useWindowSize } from '../hooks/useWindowSize.js'
import { useAnimateList } from '../hooks/useAnimateList.js'
import PopUp from './PopUp.jsx'
import './HourlyData.css'

const polutants = [
  {
    title: 'Particulate Matter PM/2.5',
    arrName: 'pm2_5',
    max: 75
  },
  {
    title: 'Particulate Matter PM/10',
    arrName: 'pm10',
    max: 150
  },
  {
    title: 'Nitrogen Dioxide NO/2',
    arrName: 'no2',
    max: 340
  },
  {
    title: 'Ozone O/3',
    arrName: 'o3',
    max: 380
  },
  {
    title: 'Sulphur Dioxide SO/2',
    arrName: 'so2',
    max: 750
  },
  {
    title: 'Carbon Monoxide CO',
    arrName: 'co',
    max: 30000
  }
]

const HourlyData = memo(function HourlyData ({ data }) {
  const [infoOpen, setInfoOpen] = useState(false)
  const [k, setK] = useState('')
  const hourlyWrapper = useRef(null)

  const [activeObj, setActiveObj] = useState({
    pm2_5: 'true',
    pm10: 'true',
    no2: 'true',
    o3: 'false',
    so2: 'false',
    co: 'false'
  })

  useLayoutEffect(() => {
    setK(Math.random().toString(10).slice(2))
  }, [data])

  function handleButton (e) {
    const targ = e.target.closest('[data-event]')
    if (!targ) return

    const polutant = targ.dataset.event
    targ.classList.toggle('active') // to chage buttons state immidetely and not wait for unload animation to play
    hourlyWrapper.current.classList.add('unload-hourly')

    setTimeout(() => {
      setActiveObj(obj => ({
        ...obj,
        [polutant]: obj[polutant] === 'true' ? 'false' : 'true'
      }))
      setK(Math.random().toString(10).slice(2))
      hourlyWrapper.current.classList.remove('unload-hourly')
    }, 400)
  }

  return (
    <div className="hourly-data">
      <div className="hourly-controls">
        <button className="hourly-info" onClick={() => setInfoOpen(state => !state)} aria-label="info">i</button>
        { infoOpen &&
          <PopUp wrapperClass="info-popup" setIsOpen={setInfoOpen}>
            <p className="info-subtext">Hourly data shows a list of variables for each pollutant over the last 16 hours. The more the square is filled, the more polluted the air.
            <br /><br />A square filled to 100% means that the air is unhealthy and the level of pollution exceeds:</p>
            <ul className="max-rates">
              { polutants.map((el) => (
                <li
                  className="rate"
                  key={el.arrName}>
                  <p>{ el.title.split(' ').slice(-1)[0].split('/').map((el, ind) => ind === 0 ? el : <sub key={ind}>{el}</sub>) }</p>
                  <p>≥ {el.max} μg/m³</p>
                </li>
              ))}
            </ul>
          </PopUp>
        }
        { polutants.map((el, ind) => (
          <button
            key={el.title}
            className={activeObj[el.arrName] === 'true' ? 'active switch-button' : 'switch-button'}
            data-event={el.arrName}
            onClick={(e) => handleButton(e)}
            aria-label={el.title}>
            { el.title.split(' ').slice(-1)[0].split('/').join('') }
          </button>
        ))}
      </div>
      <div ref={hourlyWrapper}>
        <HourlyList
          key={k}
          data={data}
          activeObj={activeObj} />
      </div>
    </div>
  )
})

const HourlyList = memo(function HourlyList ({ data, activeObj }) {
  const columns = 16 // total number of hours shown

  const pollutantArrays = {}
  let currentHour = 0
  let dataArray = []

  useAnimateList('.load-hourly')

  function calculatePercentage (val, max) {
    return 100 - (val * 100 / max)
  }

  function generateColumns (polutant) {
    getHourlyArrays()

    const data = pollutantArrays[polutant]
    const arr = []

    const p = polutants.find(el => el.arrName === polutant)

    for (let i = 0; i < columns; i++) {
      let hour = i - columns + currentHour + 1
      hour = hour < 0 ? 24 + hour : hour > 24 ? hour - 24 : hour

      const isNull = data[i] === null

      arr.push(
        <li className="hourly-list-item" key={i}>
          <span className="hour">{ hour + ':00'}</span>
          { isNull && <div className="no-data">no data</div> }
          <Canvas
            percentage={calculatePercentage(data[i], p.max)}
            columns={columns}/>
          <span className="polutant-value">{ data[i] ? data[i] : 'no data' }</span>
        </li>
      )
    }
    return [...arr]
  }

  function getHourlyArrays () {
    const date = new Date()

    currentHour = date.getHours()
    const currentTimeInd = currentHour + 23

    // calculate start and end of array
    const start = currentTimeInd - columns + 1
    const finish = currentTimeInd + 1

    // get data for this time period
    pollutantArrays.pm2_5 = data.pm2_5.slice(start, finish)
    pollutantArrays.pm10 = data.pm10.slice(start, finish)
    pollutantArrays.no2 = data.nitrogen_dioxide.slice(start, finish)
    pollutantArrays.o3 = data.ozone.slice(start, finish)
    pollutantArrays.so2 = data.sulphur_dioxide.slice(start, finish)
    pollutantArrays.co = data.carbon_monoxide.slice(start, finish)

    pollutantArrays.european_aqi = data.european_aqi.slice(start, finish)
    pollutantArrays.us_aqi = data.us_aqi.slice(start, finish)
  }

  return (
    <ul className="hourly-wrap load-hourly load-list">
      { polutants.map((el, ind) => (
        activeObj[el.arrName] === 'true' &&
          <li
            className="hourly-row"
            key={el.arrName}>
            <h2>{el.title.split('/').map((el, ind) => ind === 0 ? el : <sub key={ind}>{el}</sub>)}</h2>
            <ul className="hourly-list">{generateColumns(el.arrName)}</ul>
          </li>
      ))}
    </ul>
  )
})

const Canvas = memo(function Canvas ({ percentage, columns }) {
  const windowWidth = useWindowSize()

  let paddings
  let containerWidth

  // number of columns changes depanding on a screen size
  // whereas the number of hours (total filled columns) stays the same
  // and comes from HourlyList component. all values should also be in sync with css
  const responsiveColumns = windowWidth > 1200 ? columns
    : windowWidth > 700 ? Math.ceil(columns / 2)
      : windowWidth > 420 ? Math.ceil(columns / 3)
        : Math.ceil(columns / 4)

  useLayoutEffect(() => {
    paddings = getComputedStyle(document.querySelector('main')).padding.split('px').join('') * 2
    containerWidth = (document.body.offsetWidth - paddings - 10 * (responsiveColumns - 1)) / responsiveColumns // 10px gap
  }, [])

  const canvasRef = useRef(null)
  const resolution = 3
  const circleSize = 2.5
  const minGap = 1

  let circleGap
  let rows

  useLayoutEffect(() => {
    paddings = getComputedStyle(document.querySelector('main')).padding.split('px').join('') * 2
    containerWidth = ((windowWidth - paddings - 10 * (responsiveColumns - 1)) / responsiveColumns)// 10px gap

    const circlesNum = Math.floor((containerWidth + minGap) / (circleSize + minGap))
    rows = circlesNum
    circleGap = (containerWidth - circleSize * circlesNum) / (circlesNum - 1)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function getRandomNumber (min, max) {
      return Math.random() * (max - min) + min
    }

    function drawCircles (canvas, transparentPercentage) {
      const size = circleSize * resolution
      const distance = circleGap * resolution
      const canvasSize = containerWidth * resolution

      for (let x = 0; x < canvasSize; x += size + distance) {
        for (let y = 0; y < canvasSize; y += size + distance) {
          const isBlue = getRandomNumber(0, 100) < transparentPercentage
          const color = isBlue ? 'transparent' : 'gray'

          ctx.beginPath()
          ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
          ctx.closePath()
        }
      }
    }

    canvas.width = containerWidth * resolution
    canvas.height = containerWidth * resolution

    drawCircles(canvas, percentage)
  }, [windowWidth, percentage])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${(rows * circleSize + (rows - 1) * circleGap)}` }} />
  )
})

export default HourlyData
