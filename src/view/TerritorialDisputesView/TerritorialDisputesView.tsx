import React, { useState } from 'react'
import styled from 'styled-components'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import OngoingConflictMap, { TTerritorialDispute } from './TerritorialDisputesMap'
import Tooltip, {TooltipRow, TooltipTitle } from '../../component/Tooltip'
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

const getTooltipContent = (key: string, disputes: TTerritorialDispute[]) => {
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {disputes.sort().map(getToolTipRow)}
    </div>
  )
}

const getToolTipRow = (dispute: TTerritorialDispute, index: number) => (
  <TooltipRow key={index}>
    <div dangerouslySetInnerHTML={{__html: parseDescription(dispute.TERRITORY).toString()}}/>
    :&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(dispute.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

export type TTerritorialDisputeInfo = { country: string, disputes: TTerritorialDispute[], position: TPosition }

function TerritorialDisputesView() {
  const [info, setInfo] = useState<TTerritorialDisputeInfo | undefined>()
  const [fixed, setFixed] = useState<boolean>(false)
  const infoGroups = info ?
    Object.entries(groupBy(info?.disputes, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined

  return (
    <Wrapper
      onClick={() => {
        setFixed(false)
        setInfo(undefined)
      }}
    >
      <MapWrapper>
        <OngoingConflictMap
          selectedItem={info?.country}
          setInfo={setInfo}
          fixed={fixed}
          setFixed={setFixed}
        />
        {
          infoGroups && (
            <Tooltip
              position={info!.position}
              fixed={fixed}
              onClose={() => {
                setInfo(undefined)
                setFixed(false)
              }}
            >
              {infoGroups.map((e) => getTooltipContent(...e))}
            </Tooltip>
          )
        }
      </MapWrapper>
    </Wrapper>
  )
}

export default TerritorialDisputesView
