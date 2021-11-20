import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { CloseButton } from './Tooltip'

const Drawer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`

const DetailWrapper = styled.div`
  background-color: #222426;
  opacity: 0.95;
  border-radius: 4px;
  color: #FFFFFF;
  max-height: calc(100% - 128px);
  max-width: calc(100% - 128px);
  position: relative;
  display: flex;
  padding: 40px 24px 24px 24px;
`

const DetailContent = styled.div`
  overflow: auto;
  padding-right: 4px;
`

const StyledCloseButton = styled(CloseButton)`
  top: 12px;
  right: 20px;
`

type TDetailDialogProps = {
  children: ReactNode,
  hide: () => void,
}

function DetailDialog({
  children,
  hide,
}: TDetailDialogProps) {
  return (
    <Drawer onClick={hide}>
      <DetailWrapper onClick={e => e.stopPropagation()}>
        <DetailContent>
          {children}
        </DetailContent>
        <StyledCloseButton onClick={hide}>
          <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <polygon
              fill="#FFFFFF"
              points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"
            />
          </svg>
        </StyledCloseButton>
      </DetailWrapper>
    </Drawer>
  )
}

export default DetailDialog
