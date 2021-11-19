import React, { memo } from 'react'
import { TConflictInfo, TYear } from './ArmedConflictsView'
import armedConflicts from '../../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import armedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import ConflictMap from '../../component/ConflictMap'
import { groupBy } from '../../util'
import { TooltipDeaths, TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify)

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value.toString()
    .replaceAll('<a href', '<a target="_blank" href')


const getToolTipRow = (conflict: TArmedConflicts, index: number) => (
  <TooltipRow key={index}>{conflict.YEAR}:&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(conflict.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

const getTooltipContent = (year: TYear, key: string, conflicts: TArmedConflicts[]) => {
  const deaths = armedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths !== undefined && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort().map(getToolTipRow)}
    </div>
  )
}

export type TArmedConflicts = { COUNTRY: string; YEAR: number; DESCRIPTION: string; }

const armedConflictMap = groupBy(armedConflicts, (e) => e.COUNTRY)

const maxDeaths = Object.values(armedConflictsDeaths).flat().map(e => e.DEATHS).reduce((acc, val) => acc > val ? acc : val, 0)

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  year: TYear,
  conflictInfo?: TConflictInfo,
  setConflictInfo: (value?: TConflictInfo) => void,
}

const ArmedConflictsMap = ({
  tooltipProps,
  setTooltipProps,
  year,
  conflictInfo,
  setConflictInfo,
}: TMapChartProps) => {
  return (
    <ConflictMap
      isSelectedItem={geo => {
        const {NAME} = geo.properties
        const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
        return [NAME, ...spareCoutries].includes(conflictInfo?.name)
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
          setTooltipProps(undefined)
        } else {
          const {NAME} = value.geo.properties
          const spareCoutries: string[] = (geographyCountryNameMap as any)[NAME] ?? []
          const conflicts = [NAME, ...spareCoutries].map(key => armedConflictMap[key]).filter(e => e).flat()
          const conflictInfo = {
            name: NAME,
            conflicts,
            position: value.position,
          }
          const conflictGroups = Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1)

          setConflictInfo(conflictInfo)
          setTooltipProps({
            position: value.position,
            children: conflictGroups?.map((e) => getTooltipContent(year, ...e)),
            fixed: tooltipProps?.fixed ?? false,
            onClose: () => {
              setConflictInfo(undefined)
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
