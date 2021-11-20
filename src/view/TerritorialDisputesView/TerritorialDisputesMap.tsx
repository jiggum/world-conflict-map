import React, { memo } from 'react'
import styled from 'styled-components'
import { TTerritorialDisputeInfo } from './TerritorialDisputesView'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import territorialDisputes from '../../data/territorialDisputes.json'
import ConflictMap from '../../component/ConflictMap'
import { groupBy } from '../../util'
import { TooltipTitle, TTooltipProps } from '../../component/Tooltip'

export type TTerritorialDispute = { TERRITORY: string; COUNTRY: string; DESCRIPTION: string; }

const territorialDisputeMapByCountry = groupBy(territorialDisputes, (e) => e.COUNTRY)

const max = 15

const getTooltipContent = (key: string, disputes: TTerritorialDispute[]) => {
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      <div><b>{disputes.length}</b> ongoing disputes</div>
    </div>
  )
}

const TooltipFooter = styled.div`
  text-align: center;
`

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
            children: (
              <>
                {infoGroups.map((e) => getTooltipContent(...e))}
                <TooltipFooter>(Click to see details)</TooltipFooter>
              </>
            ),
            fixed: tooltipProps?.fixed ?? false,
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
          position: geo.position,
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
