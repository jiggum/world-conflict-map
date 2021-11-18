import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './App'
import GlobalStyle from './style'

ReactDOM.render(
  <>
    <GlobalStyle/>
    <App/>
  </>
  ,
  document.getElementById('root')
)
