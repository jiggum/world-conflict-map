import React, { useEffect, useState } from 'react'
import { Slider } from 'antd'
import ArmedConflictMap, { TArmedConflicts } from './ArmedConflictsMap'
import { TTooltipProps } from '../../component/Tooltip'
import { TPosition } from '../../type'
import { useWindowDimensions } from '../../util'
import { Wrapper, MapWrapperWithSlide, Right, SliderHeader, SliderMark } from '../../component/common'

export type TYear = '2020' | '2019' | '2018' | '2017' | '2016' | '2015'

export type TConflictInfo = { name: string, conflicts: TArmedConflicts[], position: TPosition }

type TArmedConflictsViewProps = {
  tooltipProps?: TTooltipProps,
  setTooltipProps: (props?: TTooltipProps) => void,
}

function ArmedConflictsView({
  tooltipProps,
  setTooltipProps,
}: TArmedConflictsViewProps) {
  const [info, setInfo] = useState<TConflictInfo | undefined>()
  const [year, setYear] = useState<TYear>('2020')
  const dimension = useWindowDimensions()

  useEffect(() => {
    setInfo(undefined)
    setTooltipProps(undefined)
  }, [year, setTooltipProps])

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
        <ArmedConflictMap
          tooltipProps={tooltipProps}
          info={info}
          setInfo={setInfo}
          setTooltipProps={setTooltipProps}
          year={year}
        />
      </MapWrapperWithSlide>
      <Right>
        <SliderHeader>Deaths by Year</SliderHeader>
        <Slider
          vertical={dimension.width > 900}
          defaultValue={parseInt(year)}
          included={false}
          step={null}
          tooltipVisible={false}
          max={2020}
          min={2015}
          onChange={(value) => setYear(value.toString() as TYear)}
          marks={{
            2020: <SliderMark>2020</SliderMark>,
            2019: <SliderMark>2019</SliderMark>,
            2018: <SliderMark>2018</SliderMark>,
            2017: <SliderMark>2017</SliderMark>,
            2016: <SliderMark>2016</SliderMark>,
            2015: <SliderMark>2015</SliderMark>,
          }}
        />
      </Right>
    </Wrapper>
  )
}

export default ArmedConflictsView
