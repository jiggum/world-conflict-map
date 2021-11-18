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

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  padding: 0 64px 64px 64px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
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

const remarkProcessor = unified().use(remarkParse).use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.stringify(remarkProcessor.parse(description)).replaceAll('\n\n', '\n')

const getTooltipContent = (key: string, conflicts: TOngoingArmedConflict[]) => {
  const deaths = ongoingArmedConflictsDeaths['2020'].find(e => e.COUNTRY === key)?.DEATHS
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
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined
  return (
    <Wrapper>
      <MapWrapper data-tip="">
        <OngoingConflictMap setConflictInfo={setConflictInfo}/>
        <ReactTooltip>
          {
            conflictGroups ?
              conflictGroups.map((e) => getTooltipContent(...e))
              : undefined
          }
        </ReactTooltip>
      </MapWrapper>
    </Wrapper>
  )
}

export default OngoingConflictView
