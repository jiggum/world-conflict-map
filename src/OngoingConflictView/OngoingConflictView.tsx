import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import OngoingConflictMap, { TOngoingArmedConflict } from './OngoingConflictMap'
import { groupBy } from '../util'
import ongoingArmedConflictsDeaths from '../data/ongoingArmedConflictsDeaths.json'
import { Slider } from 'antd'

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 64px;
`

const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 64px;
`

const TooltipTitle = styled.b`
  font-size: 16px;
`

const TooltipDeaths = styled.div`
  font-size: 14px;
`

const TooltipRow = styled.div`
  display: flex;
  line-break: auto;
  white-space: pre-line;
  font-size: 14px;
  
  a {
    color: #66b5ff;
  }
  
  p {
    display: inline-block;
  }
  
  ul {
    font-size: 0;
    list-style-position: inside;
  }
  
  li {
    font-size: 14px;
  }
`

const Right = styled.div`
  width: 120px;
  height: 400px;
  font-size: 16px;
`

const SliderMark = styled.span`
  font-size: 16px;
`

const CloseButton = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  color: red;
  top: 8px;
  right: 8px;
  cursor: pointer;
`

export type TYear = '2020' | '2019' | '2018' | '2017' | '2016' | '2015'
export type TPosition = { left: number, top: number }

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify) //.use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value

const getTooltipContent = (year: TYear, key: string, conflicts: TOngoingArmedConflict[]) => {
  const deaths = ongoingArmedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort().map(getToolTipRow)}
    </div>
  )
}

const getToolTipRow = (conflict: TOngoingArmedConflict, index: number) => (
  <TooltipRow key={index}>{conflict.YEAR}:&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(conflict.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

export type TConflictInfo = { name: string, conflicts: TOngoingArmedConflict[] }

function OngoingConflictView() {
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const [fixed, setFixed] = useState<TPosition | undefined>(undefined)
  const prevTooltipPosition = useRef<TPosition | undefined>(undefined)
  const [year, setYear] = useState<TYear>('2020')
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined

  useEffect(() => {
    setFixed(undefined)
    setConflictInfo(undefined)
  }, [year])

  return (
    <Wrapper data-tip="">
      <MapWrapper>
        <OngoingConflictMap
          conflictInfo={conflictInfo}
          setConflictInfo={setConflictInfo}
          fixed={fixed}
          setFixed={setFixed}
          year={year}
        />
        <ReactTooltip
          place="top"
          overridePosition={(position) => {
            if (!fixed) {
              prevTooltipPosition.current = position
            }
            return fixed ? prevTooltipPosition.current ?? position : position
          }}
          delayUpdate={200}
          arrowColor="transparent"
        >
          {
            conflictGroups && (
              <>
                <CloseButton
                  onClick={() => {
                    setConflictInfo(undefined)
                    setFixed(undefined)
                  }}
                >
                  <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <polygon
                      fill="#FFFFFF"
                      points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"
                    />
                  </svg>
                </CloseButton>
                {conflictGroups.map((e) => getTooltipContent(year, ...e))}
              </>
            )
          }
        </ReactTooltip>
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

export default OngoingConflictView
