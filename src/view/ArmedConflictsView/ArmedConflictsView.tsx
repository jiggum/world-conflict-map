import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { Slider } from 'antd'
import ArmedConflictMap, { TArmedConflicts } from './ArmedConflictsMap'
import armedConflictsDeaths from '../../data/ongoingArmedConflictsDeaths.json'
import Tooltip, {TooltipDeaths, TooltipRow, TooltipTitle } from '../../component/Tooltip'
import { groupBy } from '../../util'
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

const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify) //.use(remarkStringify, {handlers: {link}, bullet: '-'})

const parseDescription = (description: string) =>
  remarkProcessor.processSync(description.replaceAll('\n\n', '\n')).value.toString()
    .replaceAll('<a href', '<a target="_blank" href')

const getTooltipContent = (year: TYear, key: string, conflicts: TArmedConflicts[]) => {
  const deaths = armedConflictsDeaths[year].find(e => e.COUNTRY === key)?.DEATHS
  return (
    <div key={key}>
      <TooltipTitle>{key}</TooltipTitle>
      {deaths && <TooltipDeaths><b>{deaths}</b> deaths in 2020</TooltipDeaths>}
      {conflicts.sort().map(getToolTipRow)}
    </div>
  )
}

const getToolTipRow = (conflict: TArmedConflicts, index: number) => (
  <TooltipRow key={index}>{conflict.YEAR}:&nbsp;
    <div dangerouslySetInnerHTML={{__html: parseDescription(conflict.DESCRIPTION).toString()}}/>
  </TooltipRow>
)

export type TConflictInfo = { name: string, conflicts: TArmedConflicts[], position: TPosition }

function ArmedConflictsView() {
  const [conflictInfo, setConflictInfo] = useState<TConflictInfo | undefined>()
  const [fixed, setFixed] = useState<boolean>(false)
  const [year, setYear] = useState<TYear>('2020')
  const conflictGroups = conflictInfo ?
    Object.entries(groupBy(conflictInfo?.conflicts, (e) => e.COUNTRY)).sort(([a], [b]) => b > a ? 1 : -1) :
    undefined

  useEffect(() => {
    setFixed(false)
    setConflictInfo(undefined)
  }, [year])

  return (
    <Wrapper
      onClick={() => {
        setFixed(false)
        setConflictInfo(undefined)
      }}
    >
      <MapWrapper>
        <ArmedConflictMap
          selectedItem={conflictInfo?.name}
          setConflictInfo={setConflictInfo}
          fixed={fixed}
          setFixed={setFixed}
          year={year}
        />
        {
          conflictGroups && (
            <Tooltip
              position={conflictInfo!.position}
              fixed={fixed}
              onClose={() => {
                setConflictInfo(undefined)
                setFixed(false)
              }}
            >
              {conflictGroups.map((e) => getTooltipContent(year, ...e))}
            </Tooltip>
          )
        }
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
