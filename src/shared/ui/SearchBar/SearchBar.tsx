import React, { useState } from 'react';
import { Input } from 'antd';
const { Search } = Input;

export const SearchBar = () => {
  return (
    <Search
      placeholder="Search OpenQwery"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={(value) => console.log(value)}
      style={{ width: 500 }}
    />
  );
};