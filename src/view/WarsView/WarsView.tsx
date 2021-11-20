import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Slider } from 'antd'
import Wars, { TWar, getTooltipContent } from './WarsMap'
import { TTooltipProps } from '../../component/Tooltip'
import { TPosition } from '../../type'
import DetailDialog from '../../component/DetailDialog'

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

export type TWarInfo = {
  name: string,
  wars: {[key: string]: TWar[]},
  position?: TPosition,
}

type TDetailViewProps = {
  info: TWarInfo,
  hide: () => void,
}

function DetailView({
  info,
  hide,
}: TDetailViewProps) {
  return (
    <DetailDialog hide={hide}>
      {Object.entries(info.wars).map((e) => getTooltipContent(...e, e[1].length, true))}
    </DetailDialog>
  )
}

type TWarsConflictsViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function WarsView({
  tooltipProps,
  setTooltipProps,
}: TWarsConflictsViewProps) {
  const [info, setInfo] = useState<TWarInfo | undefined>()
  const [detailInfo, setDetailInfo] = useState<TWarInfo | undefined>()
  const [yearRange, setYearRange] = useState<TYearRange>([2020, 2021])

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
        <Wars
          tooltipProps={tooltipProps}
          info={info}
          setInfo={setInfo}
          setTooltipProps={setTooltipProps}
          setDetailInfo={setDetailInfo}
          yearRange={yearRange}
        />
      </MapWrapper>
      <Right>
        <SliderHeader>Period</SliderHeader>
        <Slider
          vertical
          defaultValue={yearRange}
          step={1}
          max={2021}
          min={2003}
          onChange={(value) => setYearRange(typeof value === 'number' ? [value, value] : value)}
          range
          marks={{
            2021: <SliderMark>2021</SliderMark>,
            2003: <SliderMark>2003</SliderMark>,
          }}
        />
      </Right>
      {detailInfo && <DetailView info={detailInfo} hide={() => setDetailInfo(undefined)}/>}
    </Wrapper>
  )
}

export default WarsView
