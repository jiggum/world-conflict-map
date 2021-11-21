import React, { memo } from 'react'
import { TTerritorialDisputeInfo } from './MassacresView'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import territorialDisputes from '../../data/territorialDisputes.json'
import ConflictMap from '../../component/ConflictMap'
import { groupBy } from '../../util'
import { TooltipTitle, TooltipRow, TTooltipProps } from '../../component/Tooltip'
import styled from 'styled-components'

export type TTerritorialDispute = { TERRITORY: string; COUNTRY: string; DESCRIPTION: string; }

const territorialDisputeMapByCountry = groupBy(territorialDisputes, (e) => e.COUNTRY)

const max = 15

export const Description = styled.div`
  white-space: nowrap;
`

const getTooltipContent = (key: string, disputes: TTerritorialDispute[]) => {
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      <Description><b>{disputes.length}</b>&nbsp;ongoing disputes</Description>
    </div>
  )
}

type TMapChartProps = {
  info?: TTerritorialDisputeInfo,
  setInfo: (value?: TTerritorialDisputeInfo) => void,
  setDetailInfo: (value?: TTerritorialDisputeInfo) => void,
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

const MassacresMap = ({
  info,
  setInfo,
  tooltipProps,
  setTooltipProps,
  setDetailInfo,
}: TMapChartProps) => {

  return (
    <ConflictMap
      isSelectedItem={geo => {
        const {NAME} = geo.properties
        const spareCoutries = geographyCountryNameMap[NAME] ?? []
        return [NAME, ...spareCoutries].includes(info?.country)
      }}
      isActive={geo => {
        const {NAME} = geo.properties
        const spares: string[] = geographyCountryNameMap[NAME] ?? []
        return [NAME, ...spares].findIndex(key => territorialDisputeMapByCountry[key]) >= 0
      }}
      getColorPoint={(geo) => {
        const {NAME} = geo.properties
        const spares: string[] = geographyCountryNameMap[NAME] ?? []
        const num = [NAME, ...spares].map(e => territorialDisputeMapByCountry[e]?.length ?? 0).reduce((a, b) => a + b, 0)
        return Math.min((-1.4 / 6) + ((1.4 + 6) / 6 * (num - 1) / max), 1)
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries = geographyCountryNameMap[NAME] ?? []
          const disputes = [NAME, ...spareCoutries].map(key => territorialDisputeMapByCountry[key]).filter(e => e).flat()
          const info = {
            country: NAME,
            disputes,
            position: value.position,
          }
          const infoGroups = Object.entries(groupBy(info.disputes, (e) => e.COUNTRY)).sort(([a], [b]) => b < a ? 1 : -1)
          setInfo(info)
          setTooltipProps({
            position: value.position,
            children: infoGroups.map((e) => getTooltipContent(...e)),
            fixed: tooltipProps?.fixed ?? false,
            pinLabel: '(Click to see details)',
            onClose: () => {
              setInfo(undefined)
              setTooltipProps(undefined)
            },
          })
        }
      }}
      onClick={(geo) => {
        setInfo(undefined)
        setTooltipProps(undefined)
        const {NAME} = geo.properties
        const spareCoutries = geographyCountryNameMap[NAME] ?? []
        const disputes = [NAME, ...spareCoutries].map(key => territorialDisputeMapByCountry[key]).filter(e => e).flat()
        if (!disputes.length) return
        const info = {
          country: NAME,
          disputes,
        }
        setDetailInfo(info)
      }}
      fixed={false}
      setFixed={(fixed) => setTooltipProps({
        ...tooltipProps!,
        fixed,
      })}
    />
  )
}

export default memo(MassacresMap)
