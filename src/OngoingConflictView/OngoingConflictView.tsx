import React, { useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { link } from '../remarkHandler'
import OngoingConflictMap, { TOngoingArmedConflict } from './OngoingConflictMap'
import { groupBy } from '../util'
import ongoingArmedConflictsDeaths from '../data/ongoingArmedConflictsDeaths.json'
import { Slider } from 'antd'

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  padding-bottom: 64px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 64px;
`

const TooltipTitle = styled.b`
  font-size: 16px;
`

const TooltipDeaths = styled.div`
  font-size: 14px;
`

const TooltipRow = styled.div`
  display: flex;
  line-break: auto;
  white-space: pre-line;
  font-size: 14px;
`

const Right = styled.div`
  width: 120px;
  height: 400px;
  font-size: 16px;
`

const SliderMark = styled.span`
  font-size: 16px;
`

export type TYear = '2020' | '2019' | '2018' | '2017' | '2016' | '2015'

const remarkProcessor = unified().use(remarkParse).use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.stringify(remarkProcessor.parse(description)).replaceAll('\n\n', '\n')

const getTooltipContent = (year: TYear, key: string, conflicts: TOngoingArmedConflict[]) => {
  const deaths = ongoingArmedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort().map(getToolTipRow)}
    </div>
  )
}

const getToolTipRow = (conflict: TOngoingArmedConflict, index: number) => (
  <TooltipRow key={index}>{conflict.YEAR}:&nbsp;
    <div>{parseDescription(conflict.DESCRIPTION)}</div>
  </TooltipRow>
)

export type TConflictInfo = { name: string, conflicts: TOngoingArmedConflict[] }

function OngoingConflictView() {
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const [year, setYear] = useState<TYear>('2020')
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined
  return (
    <Wrapper>
      <MapWrapper data-tip="">
        <OngoingConflictMap setConflictInfo={setConflictInfo} year={year}/>
        <ReactTooltip>
          {
            conflictGroups ?
              conflictGroups.map((e) => getTooltipContent(year, ...e))
              : undefined
          }
        </ReactTooltip>
      </MapWrapper>
      <Right>
        <Slider
          vertical
          defaultValue={parseInt(year)}
          included={false}
          step={null}
          tooltipVisible={false}
          max={2020}
          min={2015}
          onChange={(value) => setYear(value.toString() as TYear)}
          marks={{
            2020: <SliderMark>2020</SliderMark>,
            2019: <SliderMark>2019</SliderMark>,
            2018: <SliderMark>2018</SliderMark>,
            2017: <SliderMark>2017</SliderMark>,
            2016: <SliderMark>2016</SliderMark>,
            2015: <SliderMark>2015</SliderMark>,
          }}
        />
      </Right>
    </Wrapper>
  )
}

export default OngoingConflictView
