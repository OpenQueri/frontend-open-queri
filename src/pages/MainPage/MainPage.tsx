import { useState } from 'react'
import './../../App.css'

import {HeaderActions} from "./../../widgets/Header-Actions/HeaderActions";
import {SearchBar} from "../../components/SearchBar/SearchBar";
import { PromoImage } from "../../components/PromoImage/PromoImage";
import { Logo } from "../../components/Logo/Logo";
import { ConfigProvider, theme, Space } from 'antd';

import { MainBackground } from '../../components/Background/MainBackground/MainBackground'; 
import { Name3d } from '../../components/Name3d/Name3d';

export const MainPage = () => {
  const [dark, setDark] = useState(true);

  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: -1, 
        pointerEvents: 'none' 
      }}>
        <MainBackground />
      </div>

      <HeaderActions dark={dark} setDark={setDark}/>
      <Logo/>

      <div className='flex justify-center items-center h-screen w-screen'>
        <SearchBar/>
      </div>
      
    </ConfigProvider>
  )
}

