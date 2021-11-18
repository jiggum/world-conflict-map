import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import OngoingConflictView from './OngoingConflictView'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<OngoingConflictView/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
