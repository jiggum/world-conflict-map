import React, { memo } from 'react'
import { TWarInfo, TYearRange } from './WarsView'
import wars from '../../data/wars.json'
import ConflictMap from '../../component/ConflictMap'
import { getCountriesFormName, parseRemark } from '../../util'
import { TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
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
    <b>{war.START}-{war.FINISHED ?? 'Ongoing'}&nbsp;</b>
    <div>
      {
        war.CONFLICTS.map((e, i) =>
          <div key={i} dangerouslySetInnerHTML={{__html: `- ${parseRemark(e)}`}}/>
        )
      }
    </div>
  </ConflictWrapper>
)

const StyledTitle = styled(TooltipTitle)<{detail: boolean}>`
  ${props => props.detail && `
    font-size: 18px;
  `}
`

export const getTooltipContent = (key: string, wars: TWar[], showCount: number, detail = false) => {
  const _wars = wars.sort((a, b) => b.START - a.START)
  const remainNum = Math.max(wars.length - showCount, 0)
  return (
    <div key={key}>
      <StyledTitle detail={detail}>{key}</StyledTitle>
      {_wars.slice(0, showCount).map(getToolTipRow)}
      { remainNum > 0 ? <div>({remainNum} more wars)</div> : null}
    </div>
  )
}

const max = 5

export type TWar = {
  COUNTRIES: string[];
  START: number;
  FINISHED?: number;
  CONFLICTS: string[];
}

type TMapChartProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
  info?: TWarInfo,
  setInfo: (value?: TWarInfo) => void,
  setDetailInfo: (value?: TWarInfo) => void,
  yearRange: TYearRange,
}

const WarsMap = ({
  tooltipProps,
  setTooltipProps,
  yearRange,
  info,
  setDetailInfo,
  setInfo,
}: TMapChartProps) => {
  const getYearFilteredWars = (key: string) =>
    warsMap[key]
      ?.filter(e => e.START <= yearRange[1] && yearRange[0] <= (e.FINISHED ?? 2021))
    ?? []
  return (
    <ConflictMap
      isSelectedItem={geo => info ? getCountriesFormName(geo.properties.NAME).includes(info.name) : false}
      isActive={geo => getCountriesFormName(geo.properties.NAME).findIndex(key => getYearFilteredWars(key).length) >= 0}
      getColorPoint={(geo) => {
        const countries = getCountriesFormName(geo.properties.NAME)
        const num = countries.map(e => getYearFilteredWars(e)?.length ?? 0).reduce((acc, val) => acc + val, 0)
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
              const _wars = getYearFilteredWars(val)
              if (_wars.length > 0) {
                acc[val] = _wars
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
            children: (
              <>
                {
                  Object.entries(wars).map((e) => getTooltipContent(...e, e.length > 1 ? 1 : 3))
                }
              </>
            ),
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
        const wars = countries
          .reduce((acc, val) => {
            const _wars = getYearFilteredWars(val)
            if (_wars.length > 0) {
              acc[val] = _wars
            }
            return acc
          }, {} as {[key: string]: TWar[]})
        const info = {
          name: name as string,
          wars,
        }
        setDetailInfo(info)
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
