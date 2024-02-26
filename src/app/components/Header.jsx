import React from 'react'
import { memo, useState, useRef, useLayoutEffect } from 'react'
import PopUp from './PopUp.jsx'
import './Header.css'

const Header = memo(function Header ({ index, image }) {
  const [contributionOpen, setContributionOpen] = useState(false)
  const [prevImage, setPrevImage] = useState('')

  const imageWrapper = useRef(null)
  
  useLayoutEffect(() => {
    if (!prevImage) setPrevImage(image)

    if (image !== prevImage && prevImage) {
      imageWrapper.current.style.opacity = '0'
      imageWrapper.current.addEventListener('transitionend', () => {
        setPrevImage(image)
        imageWrapper.current.style.opacity = '1'
      })
    } 
  }, [image])

  return (
    <header className={'header ' + image}>
      <div ref={imageWrapper} className={'header-image ' + prevImage}></div>
      <h1 className="index">{index}</h1>
      <button className="contribution-button" onClick={() => setContributionOpen(state => !state)} aria-label="contribution"></button>
      { contributionOpen &&
        <PopUp wrapperClass="contribution-popup" setIsOpen={setContributionOpen}>
          <p>
            The Application shows the current air quality index along with
            <br />hourly rates for each pollutant.
            <br /><br />
            The Native App is built with <a href="https://github.com/socketsupply/socket" target="_blank" rel="nooper nofollow noreferrer">Socket Runtime</a> -
            one of a kind technology for mobile and desktop that runs on any OS (no Electron, React Native or anything else under the hood(!), it’s a pure React app). The runtime also provides a solution that helps to omit the Cloud storage for any kind of apps (even chats and social networks).
          </p>
          <br /><br />
          <p>Source code: <a href="https://github.com/HelloXiuXiu/pollution-app-native" target="_blank" rel="nooper nofollow">GitHub</a></p>
          <p>Web version: <a href="https://github.com/HelloXiuXiu/pollution-app" target="_blank" rel="nooper nofollow">GitHub</a></p>
          <p className="contribution">contribution</p>
          <h2 className="subheading">data:</h2>
          <p className="contribution-subtext">The data comes from <a href="https://open-meteo.com/" target="_blank" rel="nooper nofollow noreferrer">Open-Meteo</a>&nbsp;
            (non-commercial licence). It is important to note that there is no absolute assurance of the data&apos;s accuracy and completeness. The data is provided without any warranty, whether statutory or otherwise.
            <br /><br />Therefore, to get the most reliable information, it is advisable to check multiple sources.
          </p>
          <h2 className="subheading">image sources:</h2>
          <p className="contribution-subtext"><a href="https://unsplash.com/" target="_blank" rel="nooper nofollow noreferrer">Unsplash</a> (open licence): <br />
            <a href="https://unsplash.com/@mirrorlessless" target="_blank" rel="nooper nofollow noreferrer">Justin Bautista</a> (red city),&nbsp;
            <a href="https://unsplash.com/@sanleesnaps" target="_blank" rel="nooper nofollow noreferrer">David Lee</a> (smokey street),&nbsp;
            <a href="https://unsplash.com/@freddydo" target="_blank" rel="nooper nofollow noreferrer">Freddy Do</a> (green city),&nbsp;
            <a href="https://unsplash.com/@v2osk" target="_blank" rel="nooper nofollow noreferrer">v2osk</a> (mountains),&nbsp;
            <a href="https://unsplash.com/@timschmidbauer" target="_blank" rel="nooper nofollow noreferrer">Tim Schmidbauer</a> (lake).
          </p>
          <h2 className="subheading">authorship:</h2>
          <p className="contribution-subtext">Designed and developed by <a href="https://xiuxiuxiuxiuxiu.com/" target="_blank" rel="nooper nofollow noreferrer">Xiu Xiu.</a></p>
        </PopUp>
      }
    </header>
  )
})

export default Header
