import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Slider } from 'antd'
import ArmedConflictMap, { TBorderConflict } from './BorderConflictsMap'
import { TooltipRow, TooltipTitle, TTooltipProps } from '../../component/Tooltip'
import { TPosition } from '../../type'
import DetailDialog from '../../component/DetailDialog'
import { parseRemark } from '../../util'

const getToolTipRow = (conflict: TBorderConflict, index: number) => {
  const combatants = conflict.COMBATANTS
    .map(e =>
        e
        .map(e => <b>{e}</b>)
        .reduce((acc: ReactNode[], val) => acc.length ? [...acc, <>, </>, val] : [val], [])
    )
    .reduce((acc: ReactNode[], val) => acc.length ? [...acc, <>&nbsp;vs&nbsp;</>, val] : [val], [])
  return (
    <ConflictWrapper key={index}>
      <Title dangerouslySetInnerHTML={{__html: parseRemark(conflict.CONFLICT).toString()}}/>
      <div>
        <Row>Period:&nbsp;{conflict.START}-{conflict.FINISH ?? 'Ongoing'}</Row>
        <Row>Combatants:&nbsp;{combatants}</Row>
        <Row>Disputed Territory:&nbsp;{<div dangerouslySetInnerHTML={{__html: parseRemark(conflict.DISPUTED_TERRITORIES).toString().trim()}}/>}</Row>
        {conflict.FATALITIES && <Row>Fatalities:&nbsp;{conflict.FATALITIES}</Row>}
      </div>
    </ConflictWrapper>
  )
}

const StyledTooltipTitle = styled(TooltipTitle)`
  font-size: 24px;
`

const ConflictWrapper = styled(TooltipRow)`
  margin-top: 6px;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const Row = styled.div`
  display: flex;
`

const TooltipGroup = styled.div`
  &:not(:first-child) {
    margin-top: 24px;
  }
`

const getTooltipContent = (key: string, disputes: TBorderConflict[]) => {
  return (
    <TooltipGroup key={key}>
      <StyledTooltipTitle>{key}</StyledTooltipTitle>
      {disputes.sort((a, b) => b.START - a.START).map(getToolTipRow)}
    </TooltipGroup>
  )
}

type TDetailViewProps = {
  info: TConflictInfo,
  hide: () => void,
}

function DetailView({
  info,
  hide,
}: TDetailViewProps) {
  const infoGroups = useMemo(
    () => Object.entries(info.conflictsMap).sort(([a], [b]) => b < a ? 1 : -1),
    [info],
  )

  return (
    <DetailDialog hide={hide}>
      {infoGroups.map((e) => getTooltipContent(...e))}
    </DetailDialog>
  )
}

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
  padding-left: 64px;
`

const Right = styled.div`
  font-size: 16px;
  margin-left: 32px;
  margin-right: 64px;
  height: 400px;
  position: relative;
`

const SliderHeader = styled.div`
  position: absolute;
  top: -48px;
  left: 12px;
  transform: translateX(-50%);
  font-weight: bold;
  white-space: nowrap;
  font-size: 18px;
`

const SliderMark = styled.span`
  font-size: 16px;
`

export type TYearRange = [number, number]

export type TConflictInfo = {
  name: string,
  conflictsMap: { [key: string]: TBorderConflict[] },
  position: TPosition,
}

type TArmedConflictsViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function BorderConflictsView({
  tooltipProps,
  setTooltipProps,
}: TArmedConflictsViewProps) {
  const [info, setInfo] = useState<TConflictInfo | undefined>()
  const [detailInfo, setDetailInfo] = useState<TConflictInfo | undefined>()
  const [yearRange, setYearRange] = useState<TYearRange>([2001, 2021])

  useEffect(() => {
    setInfo(undefined)
    setTooltipProps(undefined)
  }, [yearRange, setTooltipProps])

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
        <ArmedConflictMap
          tooltipProps={tooltipProps}
          info={info}
          setInfo={setInfo}
          setTooltipProps={setTooltipProps}
          yearRange={yearRange}
          setDetailInfo={setDetailInfo}
        />
      </MapWrapper>
      <Right>
        <SliderHeader>Period</SliderHeader>
        <Slider
          vertical
          defaultValue={yearRange}
          step={1}
          max={2021}
          min={1840}
          onChange={(value) => setYearRange(typeof value === 'number' ? [value, value] : value)}
          range
          marks={{
            2021: <SliderMark>2021</SliderMark>,
            1840: <SliderMark>1840</SliderMark>,
          }}
        />
      </Right>
      {detailInfo && <DetailView info={detailInfo} hide={() => setDetailInfo(undefined)}/>}
    </Wrapper>
  )
}

export default BorderConflictsView
