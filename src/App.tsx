import { useState } from 'react'
import './App.css'

import {HeaderActions} from "./widgets/Header-Actions/HeaderActions";
import {SearchBar} from "./shared/ui/SearchBar/SearchBar";
import { PromoImage } from "./shared/ui/PromoImage/PromoImage";
import { Logo } from "./shared/ui/Logo/Logo";

import { ConfigProvider,theme, Space } from 'antd';





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

      <Logo/>
      
      <Space direction="vertical">
        <PromoImage/>
        <SearchBar/>
      </Space>
    
    </ConfigProvider>
    </>
  )
}

export default App
