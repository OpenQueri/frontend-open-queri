import React, { useState } from 'react';
import { Input } from 'antd';
const { Search } = Input;

import { AudioOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { SearchComponent } from "../../search/search"

const suffix = <AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />;

export const SearchBar = () => {
  const navigate = useNavigate();
  return (
    <Search
      placeholder="Search OpenQwery"
      allowClear
      enterButton="Search"
      
      size="large"
      suffix={suffix}
      onSearch={(value) => SearchComponent(value,navigate)}
      style={{ width: 500 }}
    />
  );
};