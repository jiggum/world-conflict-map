import React, { memo, useState } from 'react'
import { TWarInfo, TYear } from './WarsView'
import wars from '../../data/wars.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName, groupBy, parseRemark } from '../../util'
import { TooltipDeaths, TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import styled from 'styled-components'

const countries = Array.from(new Set(wars.map(e => e.COUNTRIES).flat()))
const warsMap: { [key: string]: TWar[] } = countries.reduce((acc: any, val) => {
  acc[val] = wars.filter(e => e.COUNTRIES.includes(val))
  return acc
}, {})

const ConflictWrapper = styled(TooltipRow)`
  flex-direction: column;
`

const getToolTipRow = (war: TWar, index: number) => (
  <ConflictWrapper key={index}>
    {war.START}-{war.FINISHED ?? 'Ongoing'}&nbsp;
    <ul>
      {
        war.CONFLICTS.map((e, i) =>
          <div key={i} dangerouslySetInnerHTML={{__html: `- ${parseRemark(e)}`}}/>
        )
      }
    </ul>
  </ConflictWrapper>
)

const getTooltipContent = (year: TYear, key: string, wars: TWar[]) => {
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {wars.sort((a, b) => b.START - a.START).map(getToolTipRow)}
    </div>
  )
}

const max = 10

export type TWar = {
  COUNTRIES: string[];
  START: number;
  FINISHED?: number;
  CONFLICTS: string[];
}

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  year: TYear,
  info?: TWarInfo,
  setInfo: (value?: TWarInfo) => void,
}

const WarsMap = ({
  tooltipProps,
  setTooltipProps,
  year,
  info,
  setInfo,
}: TMapChartProps) => {
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => warsMap[key]) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const num = countries.map(e => warsMap[e]?.length ?? 0).reduce((acc, val) => acc + val, 0)
        return Math.min((-1.4 / 6) + ((1.4 + 6) / 6 * (num - 1) / max), 1)
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const {NAME} = value.geo.properties
          const countries = getCountriesFormName(NAME)
          const wars = countries
            .reduce((acc, val) => {
              if (warsMap[val]) {
                acc[val] = warsMap[val]
              }
              return acc
            }, {} as {[key: string]: TWar[]})
          const info = {
            name: NAME as string,
            wars,
            position: value.position,
          }
          setInfo(info)
          setTooltipProps({
            position: value.position,
            children: Object.entries(wars).map((e) => getTooltipContent(year, ...e)),
            fixed: tooltipProps?.fixed ?? false,
            onClose: () => {
              setInfo(undefined)
              setTooltipProps(undefined)
            },
          })
        }
      }}
      fixed={tooltipProps?.fixed ?? false}
      setFixed={(fixed) => setTooltipProps({
        ...tooltipProps!,
        fixed,
      })}
    />
  )
}

export default memo(WarsMap)
