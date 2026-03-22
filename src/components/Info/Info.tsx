import React, { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Drawer, Space } from 'antd';



export const Info = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
        <InfoCircleOutlined style={{fontSize: 25}} onClick={showDrawer}/>
        <Drawer
            title="Info"
            closable={{ placement: 'end' }}
            onClose={onClose}
            open={open}
        >

        <Space>
            
        </Space>

        </Drawer>
        </>
    );
}