import React, { memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere, Graticule,
} from 'react-simple-maps'
import { TConflictInfo } from './OngoingConflictView'
import geography from '../data/geography.json'
import ongoingArmedConflicts from '../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../data/geographyCountryNameMap'

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


type TMapChartProps = {
  setConflictInfo: (value: TConflictInfo | undefined) => void,
}

const OngoingConflictMap = ({setConflictInfo}: TMapChartProps) => {
  return (
    <>
      <ComposableMap projectionConfig={{rotate: [-10, 0, 0], scale: 147}} width={800} height={400}>
        <Sphere id="rsm-sphere" stroke="#F0F3FA" strokeWidth={0.5} fill="transparent"/>
        <Graticule stroke="#F0F3FA" strokeWidth={0.5}/>
        <Geographies geography={geography}>
          {({geographies}) =>
            geographies.map(geo => {
              const {NAME} = geo.properties
              const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
              const conflicts = [NAME, ...spareCoutries].map(key => ongoingArmedConflictMap[key]).filter(e => e).flat()
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
                    stroke: conflicts.length ? '#FFCCC7' : '#DADFE8',
                    fill: conflicts.length ? '#FFF1F0' : '#FFFFFF',
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
      </ComposableMap>
    </>
  )
}

export default memo(OngoingConflictMap)
