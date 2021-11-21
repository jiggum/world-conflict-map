import React, { memo } from 'react'
import { TConflictInfo, TYear } from './ArmedConflictsView'
import armedConflicts from '../../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import armedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName, groupBy, parseRemark } from '../../util'
import { TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import styled from 'styled-components'

const SpanDescription = styled.span`
  font-size: 14px;
  font-weight: normal;
  white-space: nowrap;
`

const DivDescription = styled.div`
  white-space: nowrap;
`

const BDescription = styled.b`
  white-space: nowrap;
`

const getToolTipRow = (conflict: TArmedConflicts, index: number) => (
  <TooltipRow key={index}>
    {conflict.YEAR}:&nbsp;
    <div>
      <BDescription dangerouslySetInnerHTML={{__html: parseRemark(conflict.NAME)}}/>
      {
        conflict.CONFLICTS.map((e, i) =>
          <DivDescription key={i} dangerouslySetInnerHTML={{__html: `- ${parseRemark(e)}`}}/>
        )
      }
    </div>
  </TooltipRow>
)

const getTooltipContent = (year: TYear, key: string, conflicts: TArmedConflicts[]) => {
  const deaths = armedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>
        {key}
        {deaths !== undefined && <SpanDescription>&nbsp;(<b>{deaths}</b> deaths in 2020)</SpanDescription>}
      </TooltipTitle>
      <DivDescription>{conflicts.length} ongoing conflicts</DivDescription>
      {conflicts.sort((a, b) => b.YEAR - a.YEAR).map(getToolTipRow)}
    </div>
  )
}

export type TArmedConflicts = {
  COUNTRY: string;
  YEAR: number;
  NAME: string;
  CONFLICTS: string[];
}

const armedConflictMap = groupBy(armedConflicts, (e) => e.COUNTRY)

const maxDeaths = Object.values(armedConflictsDeaths)
  .map(arr => {
    const map = groupBy(arr, e => e.COUNTRY)
    return Object.keys(map).map(key =>
      getCountriesFormName(key)
        .map(e => map[e]?.map(e => e.DEATHS).flat() ?? [])
        .flat()
        .reduce((acc, val) => acc + val, 0)
    )
  })
  .flat()
  .reduce((acc, val) => acc > val ? acc : val, 0)

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  year: TYear,
  info?: TConflictInfo,
  setInfo: (value?: TConflictInfo) => void,
}

const ArmedConflictsMap = ({
  tooltipProps,
  setTooltipProps,
  year,
  info,
  setInfo,
}: TMapChartProps) => {
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => armedConflictMap[key]) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const deaths = armedConflictsDeaths[year].filter(e => countries.includes(e.COUNTRY)).map((e => e.DEATHS)).reduce((acc, val) => acc + val, 0)
        return deaths > 0 ? deaths / maxDeaths : -1 / 6
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries = geographyCountryNameMap[NAME] ?? []
          const conflicts = [NAME, ...spareCoutries].map(key => armedConflictMap[key]).filter(e => e).flat()
          const conflictInfo = {
            name: NAME,
            conflicts,
            position: value.position,
          }
          const conflictGroups = Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b < a ? 1 : -1)

          setInfo(conflictInfo)
          setTooltipProps({
            position: value.position,
            children: conflictGroups?.map((e) => getTooltipContent(year, ...e)),
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

export default memo(ArmedConflictsMap)
