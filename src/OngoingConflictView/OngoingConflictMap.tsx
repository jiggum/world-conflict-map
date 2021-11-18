import React, { memo } from 'react'
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Sphere, Graticule,
} from 'react-simple-maps'

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

type TMapChartProps = {
  setTooltipContent: (value: string) => void,
}

const OngoingConflictMap = ({setTooltipContent}: TMapChartProps) => {
  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{rotate: [-10, 0, 0], scale: 147}} width={800} height={400}>
        <ZoomableGroup maxZoom={4} translateExtent={[[0, 0], [800, 400]]}>
          <Sphere id="rsm-sphere" stroke="#F0F3FA" strokeWidth={0.5} fill="transparent"/>
          <Graticule stroke="#F0F3FA" strokeWidth={0.5}/>
          <Geographies geography={geoUrl}>
            {({geographies}) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const {NAME} = geo.properties
                    setTooltipContent(NAME)
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('')
                  }}
                  style={{
                    default: {
                      stroke: '#DADFE8',
                      fill: '#FFFFFF'
                    },
                    hover: {
                      fill: '#F53',
                      outline: 'none'
                    },
                    pressed: {
                      fill: '#E42',
                      outline: 'none'
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  )
}

export default memo(OngoingConflictMap)
