import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Slider } from 'antd'
import ArmedConflictMap, { TArmedConflicts } from './ArmedConflictsMap'
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

const Right = styled.div`
  width: 120px;
  height: 400px;
  font-size: 16px;
`

const SliderMark = styled.span`
  font-size: 16px;
`

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
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const [year, setYear] = useState<TYear>('2020')

  useEffect(() => {
    setConflictInfo(undefined)
    setTooltipProps(undefined)
  }, [year, setTooltipProps])

  return (
    <Wrapper
      onClick={() => {
        setTooltipProps(undefined)
      }}
    >
      <MapWrapper>
        <ArmedConflictMap
          tooltipProps={tooltipProps}
          conflictInfo={conflictInfo}
          setConflictInfo={setConflictInfo}
          setTooltipProps={setTooltipProps}
          year={year}
        />
      </MapWrapper>
      <Right>
        <Slider
          vertical
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
