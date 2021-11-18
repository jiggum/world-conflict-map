import React, { useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import OngoingConflictMap from './OngoingConflictMap'

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  padding: 0 64px 64px 64px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`

function OngoingConflictView() {
  const [content, setContent] = useState('')
  return (
    <Wrapper>
      <MapWrapper>
        <OngoingConflictMap setTooltipContent={setContent}/>
        <ReactTooltip>{content}</ReactTooltip>
      </MapWrapper>
    </Wrapper>
  )
}

export default OngoingConflictView
