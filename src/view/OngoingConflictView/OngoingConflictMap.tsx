import React, { memo } from 'react'
import { TConflictInfo, TYear } from './OngoingConflictView'
import ongoingArmedConflicts from '../../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import ongoingArmedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import ConflictMap from '../../component/ConflictMap'

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

type TMapChartProps = {
  selectedItem: string | undefined,
  setConflictInfo: (value: TConflictInfo | undefined) => void,
  year: TYear,
  fixed: boolean,
  setFixed: (value: boolean) => void,
}

const OngoingConflictMap = ({
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
        return [NAME, ...spareCoutries].findIndex(key => ongoingArmedConflictMap[key]) >= 0
      }}
      getColorPoint={(geo) => {
        const {NAME} = geo.properties
        const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        const deaths = ongoingArmedConflictsDeaths[year].filter(e => [NAME, ...spareCoutries].includes(e.COUNTRY)).map((e => e.DEATHS)).reduce((acc, val) => acc + val, 0)
        return deaths > 0 ? deaths / maxDeaths : -1 / 6
      }}
      select={(value) => {
        if (!value) {
          setConflictInfo(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
          const conflicts = [NAME, ...spareCoutries].map(key => ongoingArmedConflictMap[key]).filter(e => e).flat()
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

export default memo(OngoingConflictMap)
