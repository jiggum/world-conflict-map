import React, { memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { TConflictInfo } from './OngoingConflictView'
import geography from '../data/geography.json'
import ongoingArmedConflicts from '../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../data/geographyCountryNameMap'
import ongoingArmedConflictsDeaths from '../data/ongoingArmedConflictsDeaths.json'

export type TOngoingArmedConflict = { COUNTRY: string; YEAR: number; DESCRIPTION: string; }

const ongoingArmedConflictMap: { [key: string]: TOngoingArmedConflict[] } = {}

ongoingArmedConflicts.forEach((e) => {
  const key = e.COUNTRY
  if (!ongoingArmedConflictMap[key]) {
    ongoingArmedConflictMap[key] = [e]
  } else {
    ongoingArmedConflictMap[key].push(e)
  }
})

const maxDeaths = Object.values(ongoingArmedConflictsDeaths).flat().map(e => e.DEATHS).reduce((acc, val) => acc > val ? acc : val, 0)

const colorScale = scaleLinear([-1, 0, 1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 1], ['#FFF1F0', '#FFA39E', '#FF7875', '#FF4D4F', '#F5222D', '#CF1322', '#A8071A', '#820014', '#5C0011'])

type TMapChartProps = {
  setConflictInfo: (value: TConflictInfo | undefined) => void,
}

const OngoingConflictMap = ({setConflictInfo}: TMapChartProps) => {
  return (
    <>
      <ComposableMap projectionConfig={{rotate: [-10, 0, 0], scale: 147}} width={800} height={400}>
        <ZoomableGroup maxZoom={5} translateExtent={[[0, 0], [800, 400]]}>
          <Sphere id="rsm-sphere" stroke="#F0F3FA" strokeWidth={0.5} fill="transparent"/>
          <Graticule stroke="#F0F3FA" strokeWidth={0.5}/>
          <Geographies geography={geography}>
            {({geographies}) =>
              geographies.map(geo => {
                const {NAME} = geo.properties
                const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
                const conflicts = [NAME, ...spareCoutries].map(key => ongoingArmedConflictMap[key]).filter(e => e).flat()
                const deaths = ongoingArmedConflictsDeaths['2020'].filter(e => [NAME, ...spareCoutries].includes(e.COUNTRY)).map((e => e.DEATHS))
                const deathsSum = deaths.reduce((acc, val) => acc + val, 0)
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setConflictInfo(conflicts.length ? {name: NAME, conflicts} : undefined)
                  }}
                  onMouseLeave={() => {
                    setConflictInfo(undefined)
                  }}
                  style={{
                    default: {
                      stroke: conflicts.length ? '#FFFFFF' : '#DADFE8',
                      fill: conflicts.length ? colorScale(deathsSum > 0 ? deathsSum / maxDeaths : -0.6) : '#FFFFFF',
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: '#F53',
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#E42',
                      outline: 'none',
                    }
                  }}
                />
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  )
}

export default memo(OngoingConflictMap)
