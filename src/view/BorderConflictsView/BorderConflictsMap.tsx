import React, { memo } from 'react'
import { TConflictInfo, TYear } from './BorderConflictsView'
import armedConflicts from '../../data/ongoingArmedConflicts.json'
import geographyCountryNameMap from '../../data/geographyCountryNameMap'
import armedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import borderConflicts from '../../data/borderConflicts.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName, groupBy } from '../../util'
import { TooltipDeaths, TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const countries = Array.from(new Set(borderConflicts.map(e => e.COMBATANTS.flat(2)).flat()))
const borderConflictsMap: { [key: string]: TBorderConflict[] } = countries.reduce((acc: any, val) => {
  acc[val] = borderConflicts.filter(e => e.COMBATANTS.flat().includes(val))
  return acc
}, {})

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify)

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value.toString()
    .replaceAll('<a href', '<a target="_blank" href')


const getToolTipRow = (conflict: TArmedConflicts, index: number) => (
  <TooltipRow key={index}>??:&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(conflict.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

const getTooltipContent = (year: TYear, key: string, conflicts: TArmedConflicts[]) => {
  const deaths = armedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths !== undefined && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort((a, b) => b.YEAR - a.YEAR).map(getToolTipRow)}
    </div>
  )
}

export type TArmedConflicts = { COUNTRY: string; YEAR: number; DESCRIPTION: string; }

export type TBorderConflict = {
  START: number;
  FINISH?: number;
  CONFLICT: string;
  DISPUTED_TERRITORIES: string;
  FATALITIES: string;
  DEATHS?: number;
  COMBATANTS: string[][];
}

// const armedConflictMap = groupBy(armedConflicts, (e) => e.COUNTRY)

const maxDeaths = Object.values(armedConflictsDeaths).flat().map(e => e.DEATHS).reduce((acc, val) => acc > val ? acc : val, 0)

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  info?: TConflictInfo,
  setInfo: (value?: TConflictInfo) => void,
}

const BorderConflictsMap = ({
  tooltipProps,
  setTooltipProps,
  info,
  setInfo,
}: TMapChartProps) => {
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => borderConflictsMap[key]) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const deaths = countries.map(e => borderConflictsMap[e]?.map(e => e.DEATHS ?? 0)).flat(2).reduce((acc, val) => acc + val, 0)
        return deaths > 0 ? deaths / maxDeaths : -1 / 6
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const name = value.geo.properties.NAME
          const countries = getCountriesFormName(name)
          const conflictsMap = Object.keys(borderConflictsMap)
            .filter(key => countries.includes(key))
            .reduce((acc: any, val) => {
              acc[val] = borderConflictsMap[val]
              return acc
            }, {})
          const info = {
            name,
            conflictsMap,
            position: value.position,
          }

          setInfo(info)
          setTooltipProps({
            position: value.position,
            children: 'todo',
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

export default memo(BorderConflictsMap)
