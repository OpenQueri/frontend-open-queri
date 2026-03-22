
import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';
import {SearchBar} from "../../components/SearchBar/SearchBar"
import {HeaderActions} from "./../../widgets/Header-Actions/HeaderActions";
import { Logo } from "../../components/Logo/Logo";

import { ConfigProvider,theme, Space, Divider, Typography  } from 'antd';
import { Float } from '@react-three/drei';

export const SearchPage = () =>{
  const location = useLocation();
  const receivedData = location.state?.data;


  if (!receivedData) {
    return <div>No search data. Please come back and try again.</div>;
  }

  const [dark, setDark] = useState(true);
  
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: dark
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
        }}>
      <HeaderActions dark={dark} setDark={setDark}/>

      <Logo/>

      <Space direction="vertical" className='mx-auto left-1'>

        <SearchBar/>

        <Space separator={<Divider vertical />}>
          <Typography.Link>AI</Typography.Link>
          <Typography.Link>All</Typography.Link>
          <Typography.Link>Image</Typography.Link>
        </Space>


      <h2>Результати пошуку</h2>
      <p>Успішно?: {String(receivedData.success)}</p>
      <p>Мова: {receivedData.language}</p>
      <p>Запит: {receivedData.query}</p>
      <p>Довжина: {receivedData.length}</p>
      <p>Відповідь: {JSON.stringify(receivedData.results)}</p>
      <p>Швидкість пошуку: {receivedData.duration_ms} сек</p>
      <p>Час: {new Date(receivedData.timestamp).toLocaleString()}</p>

        </Space>
      </ConfigProvider>
    </>
  );
}
