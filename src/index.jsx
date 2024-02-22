import process from 'socket:process'
import os from 'socket:os'

import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './app/App.jsx'

if (process.env.DEBUG) {
  console.log('started in debug mode')
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
