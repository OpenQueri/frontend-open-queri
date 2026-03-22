import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Space, Switch } from 'antd';


type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
};

export const SwitcherTheme = ({ dark, setDark }: Props) => {
    
    return(
        <Space align='center'>
            <span>Theme Switcher: </span>
            <Switch onClick={() => setDark(!dark)}
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            />
        </Space>
    )
}