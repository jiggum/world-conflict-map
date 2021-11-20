import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Slider } from 'antd'
import ArmedConflictMap, { TBorderConflict } from './BorderConflictsMap'
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
  const [yearRange, setYearRange] = useState<TYearRange>([2021, 2021])

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
        />
      </MapWrapper>
      <Right>
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
    </Wrapper>
  )
}

export default BorderConflictsView
