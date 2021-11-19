import React, { useState } from 'react'
import styled from 'styled-components'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import OngoingConflictMap, { ArmedConflicts } from './TerritorialDisputesMap'
import Tooltip, {TooltipDeaths, TooltipRow, TooltipTitle } from '../../component/Tooltip'
import { groupBy } from '../../util'
import { TPosition } from '../../type'

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 64px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 64px;
`

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify) //.use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value.toString()
    .replaceAll('<a href', '<a target="_blank" href')

const getTooltipContent = (key: string, conflicts: ArmedConflicts[]) => {
  const deaths = 0 // ongoingArmedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort().map(getToolTipRow)}
    </div>
  )
}

const getToolTipRow = (conflict: ArmedConflicts, index: number) => (
  <TooltipRow key={index}>{conflict.YEAR}:&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(conflict.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

export type TConflictInfo = { name: string, conflicts: ArmedConflicts[], position: TPosition }

function TerritorialDisputesView() {
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const [fixed, setFixed] = useState<boolean>(false)
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined

  return (
    <Wrapper
      onClick={() => {
        setFixed(false)
        setConflictInfo(undefined)
      }}
    >
      <MapWrapper>
        <OngoingConflictMap
          selectedItem={conflictInfo?.name}
          setConflictInfo={setConflictInfo}
          fixed={fixed}
          setFixed={setFixed}
        />
        {
          conflictGroups && (
            <Tooltip
              position={conflictInfo!.position}
              fixed={fixed}
              onClose={() => {
                setConflictInfo(undefined)
                setFixed(false)
              }}
            >
              {conflictGroups.map((e) => getTooltipContent(...e))}
            </Tooltip>
          )
        }
      </MapWrapper>
    </Wrapper>
  )
}

export default TerritorialDisputesView
