import { useEffect, useState } from 'react'

// API
// 1.Selector ('.example') is a class or an id of ul element that holds all children that will
// be animated; Callback is a function that will be called for each animated line (optional); step is a delay
// between each pair of lines (optional, default 0.2s)
//
// 2.The Component that returns the animated list should get an unique key each time the reload is triggered.
//
// 3.Animation CSS should be set for each selector using @keyframes. Example:
// .selector > li {
//   opacity: 0;
//   animation-name: load;
//   animation-iteration-count: 1;
//   animation-fill-mode: forwards;
//   animation-duration: 1s;
// }
//  @keyframes load {
//    from {opacity: 0; transform:translateY(-20px);}
//    to {opacity: 1; transform:translateY(0px);}
//  }

export function useAnimateList (selector, callback, step = 0.2) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true) // little trick to avoid seeing stale children
  }, [])

  useEffect(() => {
    const listWrapper = document.querySelector(selector)
    animateList(listWrapper.children)
  }, [animated])

  function animateList (list) {
    const listElems = [...list]
    let delay = 0

    listElems.forEach(el => {
      if (callback) callback(el)
      if (el.tagName !== 'BR') {
        el.style.animationDelay = delay + 's'
        el.style.WebkitAnimationDelay = delay + 's'
        delay += step
      }
    })
  }
}
