import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Drawer, Space } from 'antd';
import { SwitcherTheme } from "./../Theme_switcher/Switcher";

type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
};

export const Setting = ({ dark, setDark }: Props) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
        <SettingOutlined style={{fontSize: 25}} onClick={showDrawer}/>
        <Drawer
            title="Setting"
            closable={{ placement: 'end' }}
            onClose={onClose}
            open={open}
        >

        <Space>
            <SwitcherTheme dark={dark} setDark={setDark} />
        </Space>

        </Drawer>
        </>
    );
}