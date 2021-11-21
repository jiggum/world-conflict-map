import styled from 'styled-components'

export const Wrapper = styled.div`
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
  
  @media (max-width: 900px) {
    flex-direction: column;
  }
`

export const MapWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 64px;

  @media (max-width: 900px) {
    padding: 0 32px;
  }
`

export const MapWrapperWithSlide = styled(MapWrapper)`
  width: 100%;
  max-width: 1600px;
  padding-right: 0px;

  @media (max-width: 900px) {
    padding: 0 32px;
  }
`

export const Right = styled.div`
  font-size: 16px;
  padding-left: 32px;
  padding-right: 64px;
  height: 400px;
  position: relative;

  @media (max-width: 900px) {
    width: 100%;
    padding: 48px 32px 0 32px;
    height: auto;
    font-size: 16px;
  }
`

export const SliderHeader = styled.div`
  position: absolute;
  top: -48px;
  left: 48px;
  transform: translateX(-50%);
  font-weight: bold;
  white-space: nowrap;

  @media (max-width: 900px) {
    top: 16px;
    transform: none;
    left: 32px;
  }
`

export const SliderMark = styled.span`
  font-size: 16px;
`
