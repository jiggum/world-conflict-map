import React from 'react'
import styled from 'styled-components'
import { Button, ButtonProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'


const Wrapper = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #CAD0DB;
`

const StyledButton = styled(
  ({active, ...props}) => (<Button {...props} />)
)<{ active: boolean }>`
  color: ${props => props.active ? '#1890ff' : '#303238'};
    
  &:hover {
    color: ${props => props.active ? '#1890ff' : '#303238'};
  }
`

function IButton(props: ButtonProps & { active: boolean }) {
  return <StyledButton type="text" size="large" {...props} />
}

function Header() {
  const location = useLocation()
  return (
    <Wrapper>
      <IButton active={location.pathname === '/'}>
        <Link to="/">
          Armed Conflicts
        </Link>
      </IButton>
      /
      <IButton active={location.pathname === '/territorial-disputes'}>
        <Link to="/territorial-disputes">
          Territorial Disputes
        </Link>
      </IButton>
    </Wrapper>
  )
}

export default Header
