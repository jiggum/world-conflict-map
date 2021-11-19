import React, { memo } from 'react'
import { TConflictInfo, TYear } from './ArmedConflictsView'
import armedConflicts from '../../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import armedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import ConflictMap from '../../component/ConflictMap'

export type ArmedConflicts = { COUNTRY: string; YEAR: number; DESCRIPTION: string; }

const armedConflictMap: { [key: string]: ArmedConflicts[] } = {}

armedConflicts.forEach((e) => {
  const key = e.COUNTRY
  if (!armedConflictMap[key]) {
    armedConflictMap[key] = [e]
  } else {
    armedConflictMap[key].push(e)
  }
})

const maxDeaths = Object.values(armedConflictsDeaths).flat().map(e => e.DEATHS).reduce((acc, val) => acc > val ? acc : val, 0)

type TMapChartProps = {
  selectedItem: string | undefined,
  setConflictInfo: (value: TConflictInfo | undefined) => void,
  year: TYear,
  fixed: boolean,
  setFixed: (value: boolean) => void,
}

const ArmedConflictsMap = ({
  selectedItem,
  setConflictInfo,
  year,
  fixed,
  setFixed,
}: TMapChartProps) => {

  return (
    <ConflictMap
      isSelectedItem={geo => {
        const {NAME} = geo.properties
        const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        return [NAME, ...spareCoutries].includes(selectedItem)
      }}
      isActive={geo => {
        const {NAME} = geo.properties
        const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        return [NAME, ...spareCoutries].findIndex(key => armedConflictMap[key]) >= 0
      }}
      getColorPoint={(geo) => {
        const {NAME} = geo.properties
        const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        const deaths = armedConflictsDeaths[year].filter(e => [NAME, ...spareCoutries].includes(e.COUNTRY)).map((e => e.DEATHS)).reduce((acc, val) => acc + val, 0)
        return deaths > 0 ? deaths / maxDeaths : -1 / 6
      }}
      select={(value) => {
        if (!value) {
          setConflictInfo(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
          const conflicts = [NAME, ...spareCoutries].map(key => armedConflictMap[key]).filter(e => e).flat()
          setConflictInfo({
            name: NAME,
            conflicts,
            position: value.position,
          })
        }
      }}
      fixed={fixed}
      setFixed={setFixed}
    />
  )
}

export default memo(ArmedConflictsMap)
