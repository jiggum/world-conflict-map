import React, { memo } from 'react'
import { TTerritorialDisputeInfo } from './TerritorialDisputesView'
import territorialDisputes from '../../data/territorialDisputes.json'
import ConflictMap from '../../component/ConflictMap'
import { groupBy, getCountriesFormName } from '../../util'
import { TooltipTitle, TTooltipProps } from '../../component/Tooltip'
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

const TerritorialDisputesMap = ({
  info,
  setInfo,
  tooltipProps,
  setTooltipProps,
  setDetailInfo,
}: TMapChartProps) => {

  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.country) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => territorialDisputeMapByCountry[key]) >= 0}
      getColorPoint={(geo) => {
        const num = getCountriesFormName(geo.properties.NAME).map(e => territorialDisputeMapByCountry[e]?.length ?? 0).reduce((a, b) => a + b, 0)
        return Math.min((-1.4 / 6) + ((1.4 + 6) / 6 * (num - 1) / max), 1)
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const {NAME} = value.geo.properties
          const disputes = getCountriesFormName(NAME).map(key => territorialDisputeMapByCountry[key]).filter(e => e).flat()
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
        const disputes = getCountriesFormName(NAME).map(key => territorialDisputeMapByCountry[key]).filter(e => e).flat()
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

export default memo(TerritorialDisputesMap)
