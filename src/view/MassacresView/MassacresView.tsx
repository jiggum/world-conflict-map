import React, { useEffect, useMemo, useState, memo } from 'react'
import styled from 'styled-components'
import TerritorialDisputesMap, { TMassacre } from './MassacresMap'
import { TTooltipProps, TooltipTitle, TooltipRow } from '../../component/Tooltip'
import territorialDisputes from '../../data/territorialDisputes.json'
import { TPosition } from '../../type'
import { groupBy, parseRemark, useWindowDimensions } from '../../util'
import DetailDialog from '../../component/DetailDialog'
import { Wrapper, MapWrapper, MapWrapperWithSlide, Right, SliderHeader, SliderMark } from '../../component/common'
import { Slider } from 'antd'

export const territorialDisputeMapByTerritory = groupBy(territorialDisputes, (e) => e.TERRITORY)

const StyledTooltipTitle = styled(TooltipTitle)`
  font-size: 24px;
`

const DescriptionWrapper = styled(TooltipRow)`
  margin-top: 6px;
  flex-direction: column;
`

const MassacreDescription = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const TooltipGroup = styled.div`
  &:not(:first-child) {
    margin-top: 24px;
  }
`

const Row = styled.div`
  display: flex;
`

export type TMassacresInfo = {
  name: string,
  map: { [key: string]: TMassacre[] },
  position?: TPosition,
}

const getTooltipContent = (key: string, massacres: TMassacre[]) => {
  return (
    <TooltipGroup key={key}>
      <StyledTooltipTitle>{key}</StyledTooltipTitle>
      {massacres.sort((a, b) => b.START_YEAR - a.START_YEAR).map(getToolTipRow)}
    </TooltipGroup>
  )
}

const getToolTipRow = (dispute: TMassacre, index: number) => {
  // const claimants = territorialDisputeMapByTerritory[dispute.TERRITORY]?.map(e => e.COUNTRY).filter(e => e !== dispute.COUNTRY) ?? []
  return (
    <DescriptionWrapper key={index}>
      <MassacreDescription dangerouslySetInnerHTML={{__html: parseRemark(dispute.NAME).toString()}}/>
      <div>
        <Row>Date:&nbsp;{dispute.DATE}</Row>
        <Row>Location:&nbsp;<div dangerouslySetInnerHTML={{__html: parseRemark(dispute.LOCATION).toString()}} /></Row>
        {dispute.FATALITIES && <Row>Fatalities:&nbsp;<b>{dispute.FATALITIES}</b></Row>}
        <div dangerouslySetInnerHTML={{__html: parseRemark(dispute.DESCRIPTION).toString().trim() || 'No description'}} />
      </div>
    </DescriptionWrapper>
  )
}

type TDetailViewProps = {
  info: TMassacresInfo,
  hide: () => void,
}

function DetailView({
  info,
  hide,
}: TDetailViewProps) {
  const infoGroups = useMemo(
    () => Object.entries(info.map).sort(([a], [b]) => b < a ? 1 : -1),
    [info],
  )

  return (
    <DetailDialog hide={hide}>
      {infoGroups.map((e) => getTooltipContent(...e))}
    </DetailDialog>
  )
}

export type TYearRange = [number, number]

type TTerritorialDisputesViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function MassacresView({
  tooltipProps,
  setTooltipProps,
}: TTerritorialDisputesViewProps) {
  const [info, setInfo] = useState<TMassacresInfo | undefined>()
  const [detailInfo, setDetailInfo] = useState<TMassacresInfo | undefined>()
  const [yearRange, setYearRange] = useState<TYearRange>([2000, 2021])
  const dimension = useWindowDimensions()

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
          yearRange={yearRange}
        />
      </MapWrapper>
      <Right>
        <SliderHeader>Period</SliderHeader>
        <Slider
          vertical={dimension.width > 900}
          defaultValue={yearRange}
          step={1}
          max={2021}
          min={1000}
          onChange={(value) => setYearRange(typeof value === 'number' ? [value, value] : value)}
          range
          marks={{
            2021: <SliderMark>2021</SliderMark>,
            1000: <SliderMark>1000</SliderMark>,
          }}
        />
      </Right>
      {detailInfo && <DetailView info={detailInfo} hide={() => setDetailInfo(undefined)}/>}
    </Wrapper>
  )
}

export default memo(MassacresView)
