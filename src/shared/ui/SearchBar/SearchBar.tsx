import React, { useState } from 'react';
import { Input } from 'antd';
const { Search } = Input;
import { AudioOutlined } from '@ant-design/icons';

const suffix = <AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />;

export const SearchBar = () => {
  return (
    <Search
      placeholder="Search OpenQwery"
      allowClear
      enterButton="Search"
      
      size="large"
      suffix={suffix}
      onSearch={(value) => console.log(value)}
      style={{ width: 500 }}
    />
  );
};