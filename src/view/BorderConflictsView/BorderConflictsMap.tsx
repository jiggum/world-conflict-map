import React, { memo } from 'react'
import { TConflictInfo, TYearRange } from './BorderConflictsView'
import borderConflicts from '../../data/borderConflicts.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName } from '../../util'
import { TooltipTitle, TTooltipProps } from '../../component/Tooltip'

const countries = Array.from(new Set(borderConflicts.map(e => e.COMBATANTS.flat(2)).flat()))
const borderConflictsMap: { [key: string]: TBorderConflict[] } = countries.reduce((acc: any, val) => {
  acc[val] = borderConflicts.filter(e => e.COMBATANTS.flat().includes(val))
  return acc
}, {})

const getTooltipContent = (key: string, conflicts: TBorderConflict[], yearRage: TYearRange) => {
  const deaths = conflicts.map(e => e.DEATHS ?? 0).reduce((a, b) => a + b, 0)
  const deathsEl = deaths > 0 ? <>and <b>{deaths}</b> deaths </> : null
  const description =
    yearRage[1] < 2021 ?
      <div><b>{conflicts.length}</b> conflicts {deathsEl}between {yearRage[0]}-{yearRage[1]}</div> :
      <div><b>{conflicts.length}</b> conflicts {deathsEl}after {yearRage[0]}</div>
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {description}
    </div>
  )
}

export type TBorderConflict = {
  START: number;
  FINISH?: number;
  CONFLICT: string;
  DISPUTED_TERRITORIES: string;
  FATALITIES: string;
  DEATHS?: number;
  COMBATANTS: string[][];
}

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  info?: TConflictInfo,
  setInfo: (value?: TConflictInfo) => void,
  setDetailInfo: (value?: TConflictInfo) => void,
  yearRange: TYearRange,
}

const BorderConflictsMap = ({
  tooltipProps,
  setTooltipProps,
  info,
  setInfo,
  setDetailInfo,
  yearRange
}: TMapChartProps) => {
  const getYearFilteredConflicts = (key: string) =>
    borderConflictsMap[key]
      ?.filter(e => e.START <= yearRange[1] && yearRange[0] <= (e.FINISH ?? 2021))
    ?? []
  const filteredConflicts = Object.keys(borderConflictsMap)
    .map(getYearFilteredConflicts)
    .filter(e => e.length > 0)
  const maxDeaths = filteredConflicts
    .map(e =>
      e.reduce((acc, val) => acc + (val.DEATHS ?? 0), 0)
    )
    .reduce((acc, val) => acc > val ? acc : val, 1)
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => getYearFilteredConflicts(key).length > 0) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const deaths = countries
          .map(e =>
            getYearFilteredConflicts(e)
              .map(e => e.DEATHS ?? 0)
          )
          .flat(2)
          .reduce((acc, val) => acc + val, 0)
        const correction = Math.min(1, filteredConflicts.length / 10)
        return deaths > 0 ? Math.min(maxDeaths, deaths / maxDeaths) * correction : -1 / 6
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
            .reduce((acc, val) => {
              const value = getYearFilteredConflicts(val)
              if (value.length > 0) {
                acc[val] = value
              }
              return acc
            }, {} as { [key: string]: TBorderConflict[] })
          const info = {
            name,
            conflictsMap,
            position: value.position,
          }

          setInfo(info)
          setTooltipProps({
            position: value.position,
            children: Object
              .entries(conflictsMap)
              .sort(([a], [b]) => a > b ? 1 : -1)
              .map((e) => getTooltipContent(...e, yearRange)),
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
        const name = geo.properties.NAME
        const countries = getCountriesFormName(name)
        const conflictsMap = Object.keys(borderConflictsMap)
          .filter(key => countries.includes(key))
          .reduce((acc, val) => {
            const value = getYearFilteredConflicts(val)
            if (value.length > 0) {
              acc[val] = value
            }
            return acc
          }, {} as { [key: string]: TBorderConflict[] })
        const info = {
          name,
          conflictsMap,
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

export default memo(BorderConflictsMap)
