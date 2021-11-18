import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'


const Wrapper = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`

function Header() {
  return (
    <Wrapper>
      <Button type="text">
        Ongoing Armed Conflict
      </Button>
      <Button type="text">
        Text(disabled)
      </Button>
      <Button type="text">
        Text(disabled)
      </Button>
    </Wrapper>
  )
}

export default Header
