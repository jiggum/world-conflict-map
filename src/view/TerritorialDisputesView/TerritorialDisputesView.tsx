import React, { useEffect, useMemo, useState, memo } from 'react'
import styled from 'styled-components'
import TerritorialDisputesMap, { TTerritorialDispute } from './TerritorialDisputesMap'
import { TTooltipProps, TooltipTitle, TooltipRow } from '../../component/Tooltip'
import territorialDisputes from '../../data/territorialDisputes.json'
import { TPosition } from '../../type'
import { groupBy, parseRemark } from '../../util'
import DetailDialog from '../../component/DetailDialog'

export const territorialDisputeMapByTerritory = groupBy(territorialDisputes, (e) => e.TERRITORY)

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

const StyledTooltipTitle = styled(TooltipTitle)`
  font-size: 24px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 64px;
`

const DescriptionWrapper = styled(TooltipRow)`
  margin-top: 6px;
  flex-direction: column;
`

const TeritoryDescription = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const TooltipGroup = styled.div`
  &:not(:first-child) {
    margin-top: 24px;
  }
`

export type TTerritorialDisputeInfo = { country: string, disputes: TTerritorialDispute[], position: TPosition }

const getTooltipContent = (key: string, disputes: TTerritorialDispute[]) => {
  return (
    <TooltipGroup key={key}>
      <StyledTooltipTitle>{key}</StyledTooltipTitle>
      {disputes.map(getToolTipRow)}
    </TooltipGroup>
  )
}

const getToolTipRow = (dispute: TTerritorialDispute, index: number) => {
  const claimants = territorialDisputeMapByTerritory[dispute.TERRITORY]?.map(e => e.COUNTRY).filter(e => e !== dispute.COUNTRY) ?? []
  return (
    <DescriptionWrapper key={index}>
      <TeritoryDescription dangerouslySetInnerHTML={{__html: parseRemark(dispute.TERRITORY).toString()}}/>
      {
        claimants.length && (
          <b>Claimants: {claimants.join(', ')}</b>
        )
      }
      <div
        dangerouslySetInnerHTML={{__html: parseRemark(dispute.DESCRIPTION).toString().trim() || 'No description'}}
      />
    </DescriptionWrapper>
  )
}

type TDetailViewProps = {
  info: TTerritorialDisputeInfo,
  hide: () => void,
}

function DetailView({
  info,
  hide,
}: TDetailViewProps) {
  const infoGroups = useMemo(
    () => Object.entries(groupBy(info?.disputes, (e) => e.COUNTRY)).sort(([a], [b]) => b < a ? 1 : -1),
    [info],
  )

  return (
    <DetailDialog hide={hide}>
      {infoGroups.map((e) => getTooltipContent(...e))}
    </DetailDialog>
  )
}

type TTerritorialDisputesViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function TerritorialDisputesView({
  tooltipProps,
  setTooltipProps,
}: TTerritorialDisputesViewProps) {
  const [info, setInfo] = useState<TTerritorialDisputeInfo | undefined>()
  const [detailInfo, setDetailInfo] = useState<TTerritorialDisputeInfo | undefined>()

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
        <TerritorialDisputesMap
          tooltipProps={tooltipProps}
          setTooltipProps={setTooltipProps}
          info={info}
          setInfo={setInfo}
          setDetailInfo={setDetailInfo}
        />
      </MapWrapper>
      {detailInfo && <DetailView info={detailInfo} hide={() => setDetailInfo(undefined)}/>}
    </Wrapper>
  )
}

export default memo(TerritorialDisputesView)
