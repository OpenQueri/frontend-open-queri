
import { Setting } from "./../../shared/ui/Setting/setting";
import { Info } from "./../../shared/ui/Info/Info";
import { Space } from 'antd';
import './Header-actions.css'

type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
};

export const HeaderActions = ({ dark, setDark }: Props) => {
    return (
        <>
            <div className="header-actions">
                <Space align='center' style={{margin: 10}}>
                    <Setting dark={dark} setDark={setDark}/>
                    <Info/>
                </Space>
            </div> 
        </>
    )
}