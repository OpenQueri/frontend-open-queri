
import { Setting } from "../../components/Setting/Setting";
import { Info } from "../../components/Info/Info";
import { Space } from 'antd';


type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
};

export const HeaderActions = ({ dark, setDark }: Props) => {
    return (
        <>
            <div className="absolute top-[10px] right-[10px] flex items-center">
                <Space align='center' style={{margin: 10}}>
                    <Setting dark={dark} setDark={setDark}/>
                    <Info/>
                </Space>
            </div> 
        </>
    )
}