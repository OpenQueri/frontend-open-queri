
import { Setting } from "../../components/Setting/Setting";
import { Info } from "../../components/Info/Info";
import { Space } from 'antd';
import './HeaderActions.css'

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