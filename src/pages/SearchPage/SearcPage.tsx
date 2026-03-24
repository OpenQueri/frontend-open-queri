import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchBar } from "../../components/SearchBar/SearchBar"
import { Logo } from "../../components/Logo/Logo";
import { ConfigProvider, theme, Space, Divider, Typography } from 'antd';
import { CardFoundComponent } from "../../components/Card/CardFound/CardSearch";
interface SearchResult {
  id: number;
  name: string;
  url: string;
  description?: string;
}
export const SearchPage = () => {
  const location = useLocation();
  const receivedData = location.state?.data;
  const [dark, setDark] = useState(true);

  if (!receivedData) {
    return <div className="p-4">No search data. Please come back and try again.</div>;
  }

  // ТОЛЬКО ЭТУ СТРОКУ ДОБАВИЛ
  const sortedResults = [...receivedData.results].sort((a, b) => b.frequency - a.frequency);

  return (
    <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <HeaderActions dark={dark} setDark={setDark} receivedData={receivedData}/>

      <div className='flex flex-col md:flex-row items-center md:items-start mt-2'>
        <Logo />
        <div className='w-full max-w-3xl md:mt-5 m-5'>
          <SearchBar />
          <div className='flex items-center gap-4 flex-wrap mt-1'>
            <Typography.Link>AI</Typography.Link>
            <Divider type="vertical" />
            <Typography.Link>All</Typography.Link>
            <Divider type="vertical" />
            <Typography.Link>Image</Typography.Link>
          </div>
          <div className="flex flex-col gap-1 opacity-80 text-sm mt-1">
            <p>Знайдено {receivedData.results.length} сторінок за {receivedData.duration_ms} сек</p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className="overflow-hidden ml-2 mt-1">
          <div className="mt-4 flex flex-col gap-4">
            {/* ЗАМЕНИЛ results НА sortedResults */}
            {sortedResults.map((item) => (
              <CardFoundComponent 
                key={item.link} 
                name={item.title} 
                url={item.link} 
              />
            ))}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

import { Setting } from "../../components/Setting/Setting";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
};
export const HeaderActions = ({ dark, setDark , receivedData}: Props) => {

      const [open, setOpen] = useState(false);
  
      const showDrawer = () => {
          setOpen(true);
      };
  
      const onClose = () => {
          setOpen(false);
      };
    return (
        <>
            <div className="absolute top-[10px] right-[10px] flex items-center">
                <Space align='center' style={{margin: 10}}>
                    <Setting dark={dark} setDark={setDark}/>
                    <div>
                      <InfoCircleOutlined style={{fontSize: 25}} onClick={showDrawer}/>
                      <Drawer
                          title="Info"
                          closable={{ placement: 'end' }}
                          onClose={onClose}
                          open={open}
                      >

                      <Space vertical>
                        <h2>Результати пошуку</h2>
                        <div className="flex flex-col gap-1 opacity-80 text-sm">
                          <p>Успішно?: {String(receivedData.success)}</p>
                          <p>Мова: {receivedData.language}</p>
                          <p>Запит: {receivedData.query}</p>
                          <p>Довжина: {receivedData.length}</p>
                          <p className="break-all">Відповідь: {JSON.stringify(receivedData.results)}</p>
                          <p>Швидкість пошуку: {receivedData.duration_ms} сек</p>
                          <p>Час: {new Date(receivedData.timestamp).toLocaleString()}</p>
                        </div>
                          
                      </Space>

                      </Drawer>
                    </div>
                </Space>
            </div> 
        </>
    )
}