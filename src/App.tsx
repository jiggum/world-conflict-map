import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import ArmedConflictsView from './view/ArmedConflictsView'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<ArmedConflictsView/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
