import React, { useEffect, useState } from 'react'
import { Slider } from 'antd'
import Wars, { TWar, getTooltipContent } from './WarsMap'
import { TTooltipProps } from '../../component/Tooltip'
import { TPosition } from '../../type'
import DetailDialog from '../../component/DetailDialog'
import { useWindowDimensions } from '../..//util'
import { Wrapper, MapWrapperWithSlide, Right, SliderHeader, SliderMark } from '../../component/common'

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
  const dimension = useWindowDimensions()

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
      <MapWrapperWithSlide>
        <Wars
          tooltipProps={tooltipProps}
          info={info}
          setInfo={setInfo}
          setTooltipProps={setTooltipProps}
          setDetailInfo={setDetailInfo}
          yearRange={yearRange}
        />
      </MapWrapperWithSlide>
      <Right>
        <SliderHeader>Period</SliderHeader>
        <Slider
          vertical={dimension.width > 900}
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
