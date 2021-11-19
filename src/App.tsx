import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import ArmedConflictsView from './view/ArmedConflictsView'
import TerritorialDisputesView from './view/TerritorialDisputesView'
import Tooltip, { TTooltipProps } from './component/Tooltip'

function App() {
  const [tooltipProps, setTooltipProps] = useState<TTooltipProps | undefined>(undefined)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArmedConflictsView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}/>
        <Route path="/territorial-disputes" element={<TerritorialDisputesView/>}/>
      </Routes>
      <Header/>
      {
        tooltipProps && tooltipProps.children && (
          <Tooltip
            position={tooltipProps!.position}
            fixed={tooltipProps.fixed}
            onClose={tooltipProps.onClose}
          >
            {tooltipProps.children}
          </Tooltip>
        )
      }
    </BrowserRouter>
  )
}

export default App
