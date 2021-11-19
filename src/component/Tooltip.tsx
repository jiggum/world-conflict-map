import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { TPosition } from '../type'

const Wrapper = styled.div<{ position: TPosition, fixed: boolean }>`
  position: absolute;
  top: ${props => props.position.top - 20}px;
  left: ${props => props.position.left}px;
  transform: translate(-50%, -100%);
  background-color: #222426;
  opacity: 0.9;
  padding: 12px 16px 12px 16px;
  color: #FFFFFF;
  border-radius: 4px;
  ${props => !props.fixed && 'pointer-events: none;'}
`

export const TooltipTitle = styled.b`
  font-size: 16px;
  padding-right: 24px;
`

export const TooltipDeaths = styled.div`
  font-size: 14px;
`

export const TooltipRow = styled.div`
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

export const CloseButton = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  color: red;
  top: 8px;
  right: 8px;
  cursor: pointer;
`

export type TTooltipProps = {
  children: ReactNode,
  position: TPosition,
  fixed: boolean,
  onClose: () => void,
}

function Tooltip({
  children,
  position,
  fixed,
  onClose,
}: TTooltipProps) {
  return (
    <Wrapper position={position} fixed={fixed} onClick={e => e.stopPropagation()}>
      <CloseButton
        onClick={onClose}
      >
        <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <polygon
            fill="#FFFFFF"
            points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"
          />
        </svg>
      </CloseButton>
      {children}
    </Wrapper>
  )
}

export default Tooltip
