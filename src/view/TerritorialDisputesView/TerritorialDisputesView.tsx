import React, { useEffect, useMemo, useState, memo } from 'react'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import styled from 'styled-components'
import TerritorialDisputesMap, { TTerritorialDispute } from './TerritorialDisputesMap'
import { TTooltipProps, CloseButton, TooltipTitle, TooltipRow } from '../../component/Tooltip'
import territorialDisputes from '../../data/territorialDisputes.json'
import { TPosition } from '../../type'
import { groupBy } from '../../util'

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

const DetailWrapper = styled.div`
  background-color: #222426;
  opacity: 0.95;
  border-radius: 4px;
  color: #FFFFFF;
  max-height: calc(100% - 128px);
  max-width: calc(100% - 128px);
  position: relative;
  display: flex;
`

const DetailContent = styled.div`
  overflow: auto;
  padding: 0 24px 16px 24px;
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
  margin-top: 24px;
`

const DetailDrawer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`

const StyledCloseButton = styled(CloseButton)`
  top: 12px;
  right: 16px;
`

export type TTerritorialDisputeInfo = { country: string, disputes: TTerritorialDispute[], position: TPosition }

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify) //.use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value.toString()
    .replaceAll('<a href', '<a target="_blank" href')

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
      <TeritoryDescription dangerouslySetInnerHTML={{__html: parseDescription(dispute.TERRITORY).toString()}}/>
      {
        claimants.length && (
          <b>Claimants: {claimants.join(', ')}</b>
        )
      }
      <div
        dangerouslySetInnerHTML={{__html: parseDescription(dispute.DESCRIPTION).toString().trim() || 'No description'}}
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
    <DetailDrawer onClick={hide}>
      <DetailWrapper onClick={e => e.stopPropagation()}>
        <DetailContent>
          {infoGroups.map((e) => getTooltipContent(...e))}
        </DetailContent>
        <StyledCloseButton onClick={hide}>
          <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <polygon
              fill="#FFFFFF"
              points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"
            />
          </svg>
        </StyledCloseButton>
      </DetailWrapper>
    </DetailDrawer>
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
