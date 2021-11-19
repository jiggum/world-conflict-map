import React, { memo } from 'react'
import { TTerritorialDisputeInfo } from './TerritorialDisputesView'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import territorialDisputes from '../../data/territorialDisputes.json'
import ConflictMap from '../../component/ConflictMap'
import { groupBy } from '../../util'

export type TTerritorialDispute = { TERRITORY: string; COUNTRY: string; DESCRIPTION: string; }

const territorialDisputeMapByCountry = groupBy(territorialDisputes, (e) => e.COUNTRY)
// export const territorialDisputeMapByTerritory = groupBy(territorialDisputes, (e) => e.TERRITORY)

const max = 15

type TMapChartProps = {
  selectedItem: string | undefined,
  setInfo: (value: TTerritorialDisputeInfo | undefined) => void,
  fixed: boolean,
  setFixed: (value: boolean) => void,
}

const TerritorialDisputesMap = ({
  selectedItem,
  setInfo,
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
        const spares: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        return [NAME, ...spares].findIndex(key => territorialDisputeMapByCountry[key]) >= 0
      }}
      getColorPoint={(geo) => {
        const {NAME} = geo.properties
        const spares: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        const num = [NAME, ...spares].map(e => territorialDisputeMapByCountry[e]?.length ?? 0).reduce((a, b) => a + b, 0)
        return (-1.4 / 6) + ((1.4 + 6) / 6 * (num - 1) / max)
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
          const disputes = [NAME, ...spareCoutries].map(key => territorialDisputeMapByCountry[key]).filter(e => e).flat()
          setInfo({
            country: NAME,
            disputes,
            position: value.position,
          })
        }
      }}
      fixed={fixed}
      setFixed={setFixed}
    />
  )
}

export default memo(TerritorialDisputesMap)
