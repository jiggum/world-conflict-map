import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OngoingConflictMap, { TTerritorialDispute } from './TerritorialDisputesMap'
import { TTooltipProps } from '../../component/Tooltip'
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

export type TTerritorialDisputeInfo = { country: string, disputes: TTerritorialDispute[], position: TPosition }


type TTerritorialDisputesViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function TerritorialDisputesView({
  tooltipProps,
  setTooltipProps,
}: TTerritorialDisputesViewProps) {
  const [info, setInfo] = useState<TTerritorialDisputeInfo | undefined>()

  useEffect(() => () => {
    setTooltipProps(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper
      onClick={() => {
        setTooltipProps(undefined)
      }}
    >
      <MapWrapper>
        <OngoingConflictMap
          tooltipProps={tooltipProps}
          setTooltipProps={setTooltipProps}
          info={info}
          setInfo={setInfo}
        />
      </MapWrapper>
    </Wrapper>
  )
}

export default TerritorialDisputesView
