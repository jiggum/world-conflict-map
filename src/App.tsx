import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './Header'
import ArmedConflictsView from './view/ArmedConflictsView'
import TerritorialDisputesView from './view/TerritorialDisputesView'
import BorderConflictsView from './view/BorderConflictsView'
import MassacresView from './view/MassacresView'
import Tooltip, { TTooltipProps } from './component/Tooltip'
import WarsView from './view/WarsView/WarsView'
// import massacres from './data/massacres.json'
// import geography from './data/geography.json'
// import geographyCountryNameMap from './data/geographyCountryNameMap'

// const a = massacres.map(e => e.COUNTRIES).flat()
// const b = geography.objects.ne_110m_admin_0_countries.geometries.map(e => e.properties.NAME)
// const c = Object.values(geographyCountryNameMap).flat()
// const d = [...b, ...c]
// console.log(a.filter(e => !d.includes(e)))

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
          element={<MassacresView setTooltipProps={setTooltipProps} tooltipProps={tooltipProps}/>}
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
