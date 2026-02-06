import { useState } from 'react'
import './App.css'

import {HeaderActions} from "./widgets/Header-Actions/HeaderActions";
import {SearchBar} from "./shared/ui/SearchBar/SearchBar"

import { ConfigProvider, Button, theme, Switch, Space, Row } from 'antd';





function App() {
  const [dark, setDark] = useState(true);

  return (
    <>
    
    <ConfigProvider
      theme={{
        algorithm: dark
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
      }}
    >
      
      <HeaderActions dark={dark} setDark={setDark}/>
      <SearchBar/>
    
    </ConfigProvider>
    </>
  )
}

export default App
