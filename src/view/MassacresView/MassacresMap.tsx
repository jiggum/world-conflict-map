import React, { memo } from 'react'
import { TMassacresInfo, TYearRange } from './MassacresView'
import massacres from '../../data/massacres.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName } from '../../util'
import { TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import styled from 'styled-components'

export type TMassacre = {
  DATE: string,
  START_YEAR: number,
  FINISHED_YEAR: number,
  LOCATION: string,
  COUNTRIES: string[],
  NAME: string,
  FATALITIES: string,
  DEATHS: number,
  DESCRIPTION: string,
}

const countries = Array.from(new Set(massacres.map(e => e.COUNTRIES).flat()))
const massacresMap: { [key: string]: TMassacre[] } = countries.reduce((acc: any, val) => {
  acc[val] = massacres.filter(e => e.COUNTRIES.includes(val))
  return acc
}, {})

export const Description = styled.div`
  white-space: nowrap;
`

const getTooltipContent = (key: string, massacres: TMassacre[], yearRange: TYearRange) => {
  const deaths = massacres.map(e => e.DEATHS ?? 0).reduce((a, b) => a + b, 0)
  const deathsEl = deaths > 0 ? <>and <b>~{deaths}</b> deaths </> : null
  const description =
    yearRange[1] < 2021 ?
      <Description><b>{massacres.length}</b> massacres {deathsEl}between {yearRange[0]}-{yearRange[1]}</Description> :
      <Description><b>{massacres.length}</b> conflicts {deathsEl}after {yearRange[0]}</Description>
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {description}
    </div>
  )
}

type TMapChartProps = {
  info?: TMassacresInfo,
  setInfo: (value?: TMassacresInfo) => void,
  setDetailInfo: (value?: TMassacresInfo) => void,
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  yearRange: TYearRange,
}

const MassacresMap = ({
  info,
  setInfo,
  tooltipProps,
  setTooltipProps,
  setDetailInfo,
  yearRange,
}: TMapChartProps) => {
  const getYearFilteredMassacres = (key: string) =>
    massacresMap[key]
      ?.filter(e => e.START_YEAR <= yearRange[1] && yearRange[0] <= (e.FINISHED_YEAR ?? 2021))
    ?? []
  const filteredMassacres = Object.keys(massacresMap)
    .map(getYearFilteredMassacres)
    .filter(e => e.length > 0)
  const maxDeaths = filteredMassacres
    .map(e =>
      e.reduce((acc, val) => acc + (val.DEATHS ?? 0), 0)
    )
    .reduce((acc, val) => acc > val ? acc : val, 1)
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => getYearFilteredMassacres(key).length > 0) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const deaths = countries
          .map(e =>
            getYearFilteredMassacres(e)
              .map(e => e.DEATHS ?? 0)
          )
          .flat(2)
          .reduce((acc, val) => acc + val, 0)
        const correction = Math.min(1, filteredMassacres.length / 10)
        return Math.min((-1.4 / 6) + ((1.4 + 6) / 6 * (deaths / Math.min(maxDeaths, 200000) * correction) ** (1 / 2)), 1)
      }}
      select={(value) => {
        if (!value) {
          setInfo(undefined)
          setTooltipProps(undefined)
        } else {
          const name = value.geo.properties.NAME
          const countries = getCountriesFormName(name)
          const map = Object.keys(massacresMap)
            .filter(key => countries.includes(key))
            .reduce((acc, val) => {
              const value = getYearFilteredMassacres(val)
              if (value.length > 0) {
                acc[val] = value
              }
              return acc
            }, {} as { [key: string]: TMassacre[] })
          const info = {
            name,
            map,
            position: value.position,
          }

          setInfo(info)
          setTooltipProps({
            position: value.position,
            children: Object.entries(map)
              .sort(([a], [b]) => b < a ? 1 : -1)
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
        const map = Object.keys(massacresMap)
          .filter(key => countries.includes(key))
          .reduce((acc, val) => {
            const value = getYearFilteredMassacres(val)
            if (value.length > 0) {
              acc[val] = value
            }
            return acc
          }, {} as { [key: string]: TMassacre[] })
        const info = {
          name,
          map,
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
