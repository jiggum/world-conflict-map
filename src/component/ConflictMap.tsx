import React, { memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import geography from '../data/geography.json'
import { TPosition } from '../type'

const colorScale = scaleLinear([-1.4 / 6, 0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1, 7 / 6], ['#FFF1F0', '#FFA39E', '#FF7875', '#FF4D4F', '#F5222D', '#CF1322', '#A8071A', '#820014', '#5C0011'])

type TMapChartProps = {
  isSelectedItem: (geo: any) => boolean,
  isActive: (geo: any) => boolean,
  getColorPoint: (geo: any) => number,
  select: (value: undefined | { geo: any, position: TPosition}) => void,
  fixed: boolean,
  setFixed: (value: boolean) => void,
  onClick?: (geo: any) => void,
}

function ConflictMap({
  isSelectedItem,
  isActive,
  getColorPoint,
  select,
  fixed,
  setFixed,
  onClick,
}: TMapChartProps) {
  return (
    <>
      <ComposableMap projectionConfig={{rotate: [-10, 0, 0], scale: 147}} width={800} height={400}>
        <ZoomableGroup maxZoom={5} translateExtent={[[0, 0], [800, 400]]}>
          <Sphere id="rsm-sphere" stroke="#F0F3FA" strokeWidth={0.5} fill="transparent"/>
          <Graticule stroke="#F0F3FA" strokeWidth={0.5}/>
          <Geographies geography={geography}>
            {({geographies}) =>
              geographies.map(geo => {
                const active = isActive(geo)
                const colorPoint = getColorPoint(geo)
                const isSelected = isSelectedItem(geo)
                const isFixedItem = fixed && isSelected
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={(e) => {
                    if (!fixed) {
                      setFixed(true)
                    } else if (isSelected) {
                      select(undefined)
                    }
                    if (!isSelected) {
                      select(active ? {
                        geo,
                        position: {left: e.clientX, top: e.clientY}
                      } : undefined)
                    }
                    onClick && onClick(geo)
                    e.stopPropagation()
                  }}
                  onMouseEnter={(e) => {
                    if (fixed) return
                    select(active ? {
                      geo,
                      position: {left: e.clientX, top: e.clientY}
                    } : undefined)
                  }}
                  onMouseLeave={() => {
                    if (fixed) return
                    select(undefined)
                  }}
                  style={{
                    default: {
                      stroke: active ? '#FFFFFF' : '#DADFE8',
                      fill: active ? colorScale(isFixedItem ? 7 / 6 : colorPoint) : '#FFFFFF',
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: active ? colorScale(isFixedItem ? 7 / 6 : colorPoint + 2 / 6) : '#FFFFFF',
                      stroke: active ? '#FFFFFF' : '#DADFE8',
                      strokeWidth: 0.5,
                      cursor: active ? 'pointer' : 'default',
                    },
                  }}
                />
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  )
}

export default memo(ConflictMap)
