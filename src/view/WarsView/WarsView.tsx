import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Slider } from 'antd'
import Wars, { TWar } from './WarsMap'
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
`

const SliderMark = styled.span`
  font-size: 16px;
`

export type TYear = '2020' | '2019' | '2018' | '2017' | '2016' | '2015'

export type TWarInfo = {
  name: string,
  wars: {[key: string]: TWar[]},
  position: TPosition,
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
  const [year, setYear] = useState<TYear>('2020')

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
      <MapWrapper>
        <Wars
          tooltipProps={tooltipProps}
          info={info}
          setInfo={setInfo}
          setTooltipProps={setTooltipProps}
          year={year}
        />
      </MapWrapper>
      <Right>
        <SliderHeader>Deaths by Year</SliderHeader>
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

export default WarsView