import React from 'react'
import styled from 'styled-components'
import { Button, ButtonProps } from 'antd'


const Wrapper = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`

function IButton(props: ButtonProps) {
  return <Button type="link" size="large" {...props} />
}

function Header() {
  return (
    <Wrapper>
      <IButton>
        Ongoing Armed Conflict
      </IButton>
      <IButton>
        Text(disabled)
      </IButton>
      <IButton>
        Text(disabled)
      </IButton>
    </Wrapper>
  )
}

export default Header
