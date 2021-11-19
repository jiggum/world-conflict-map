import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import ArmedConflictsView from './view/ArmedConflictsView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArmedConflictsView/>}/>
        <Route path="/territorial-disputes" element={<ArmedConflictsView/>}/>
      </Routes>
      <Header/>
    </BrowserRouter>
  )
}

export default App
