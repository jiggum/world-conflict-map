import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import ArmedConflictsView from './view/ArmedConflictsView'
import TerritorialDisputesView from './view/TerritorialDisputesView'
import BorderConflictsView from './view/BorderConflictsView'
import Tooltip, { TTooltipProps } from './component/Tooltip'
import WarsView from './view/WarsView/WarsView'

function App() {
  const [tooltipProps, setTooltipProps] = useState<TTooltipProps | undefined>(undefined)
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ArmedConflictsView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}/>
        <Route
          path="/territorial-disputes"
          element={<TerritorialDisputesView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
        />
        <Route
          path="/border-conflicts"
          element={<BorderConflictsView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
        />
        <Route
          path="/wars"
          element={<WarsView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
        />
        <Route
          path="/massacres"
          element={<TerritorialDisputesView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
        />
        <Route
          path="/terrors"
          element={<TerritorialDisputesView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
        />
      </Routes>
      <Header/>
      {
        tooltipProps && tooltipProps.children && (
          <Tooltip {...tooltipProps} />
        )
      }
    </BrowserRouter>
  )
}

export default App
