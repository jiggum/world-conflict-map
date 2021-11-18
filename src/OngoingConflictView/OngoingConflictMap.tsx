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
import { TConflictInfo, TPosition, TYear } from './OngoingConflictView'
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

const colorScale = scaleLinear([-1.4 / 6, 0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1, 7 / 6], ['#FFF1F0', '#FFA39E', '#FF7875', '#FF4D4F', '#F5222D', '#CF1322', '#A8071A', '#820014', '#5C0011'])

type TMapChartProps = {
  conflictInfo: TConflictInfo | undefined,
  setConflictInfo: (value: TConflictInfo | undefined) => void,
  year: TYear,
  fixed: TPosition | undefined,
  setFixed: (value: TPosition | undefined) => void,
}

const OngoingConflictMap = ({
  conflictInfo,
  setConflictInfo,
  year,
  fixed,
  setFixed,
}: TMapChartProps) => {
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
                const onConflict = conflicts.length > 0
                const deaths = ongoingArmedConflictsDeaths[year].filter(e => [NAME, ...spareCoutries].includes(e.COUNTRY)).map((e => e.DEATHS)).reduce((acc, val) => acc + val, 0)
                const colorPoint = deaths > 0 ? deaths / maxDeaths : -1 / 6
                const fixedItem = fixed && [NAME, ...spareCoutries].includes(conflictInfo?.name)
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={(e) => {
                    if (!fixed) {
                      setFixed({left: e.clientX, top: e.clientY})
                      setConflictInfo(onConflict ? {name: NAME, conflicts} : undefined)
                      e.stopPropagation()
                    }
                  }}
                  onMouseEnter={() => {
                    if (fixed) return
                    setConflictInfo(onConflict ? {name: NAME, conflicts} : undefined)
                  }}
                  onMouseMove={() => {
                    if (!fixed) {
                      setConflictInfo({name: NAME, conflicts})
                    }
                  }}
                  onMouseLeave={() => {
                    if (fixed) return
                    setConflictInfo(undefined)
                  }}
                  style={{
                    default: {
                      stroke: onConflict ? '#FFFFFF' : '#DADFE8',
                      fill: onConflict ? colorScale(fixedItem ? 7 / 6 : colorPoint) : '#FFFFFF',
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: onConflict ? colorScale(fixedItem ? 7 / 6 : fixed ? colorPoint : colorPoint + 2 / 6) : '#FFFFFF',
                      stroke: onConflict ? '#FFFFFF' : '#DADFE8',
                      strokeWidth: 0.5,
                      cursor: onConflict && !fixed ? 'pointer' : 'default',
                    },
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
