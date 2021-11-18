import React, { useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { link } from '../remarkHandler'
import OngoingConflictMap, { TOngoingArmedConflict } from './OngoingConflictMap'
import { groupBy } from '../util'

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

const Row = styled.div`
  display: flex;
  line-break: auto;
  white-space: pre-line;
`

const remarkProcessor = unified().use(remarkParse).use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.stringify(remarkProcessor.parse(description)).replaceAll('\n\n', '\n')

const getToolTipRow = (conflict: TOngoingArmedConflict, index: number) => (
  <Row key={index}>{conflict.YEAR}:&nbsp;
    <div>{parseDescription(conflict.DESCRIPTION)}</div>
  </Row>
)

export type TConflictInfo = { name: string, conflicts: TOngoingArmedConflict[] }

function OngoingConflictView() {
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined
  return (
    <Wrapper>
      <MapWrapper data-tip="" >
        <OngoingConflictMap setConflictInfo={setConflictInfo}/>
        <ReactTooltip>
          {
            conflictGroups ?
              conflictGroups.map(([key, conflicts]) => (
                <div key={key}>
                  <b>{key}</b>
                  {conflicts.sort().map(getToolTipRow)}
                </div>
              ))
              : undefined
          }
        </ReactTooltip>
      </MapWrapper>
    </Wrapper>
  )
}

export default OngoingConflictView
