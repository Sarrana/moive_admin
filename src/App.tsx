import { ConfigProvider, Layout, Spin } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.min.css';
import { HeadBar } from './components/layout/HeadBar';
import { SiderMenu } from './components/layout/SiderMenu';
import { Container } from './components/layout/Container';
import { Route, Routes } from 'react-router';
import { Login } from './pages/login/Login';
import { FileUploadPop } from './components/upload';

moment.locale('zh-cn');
moment.updateLocale('zh-cn', {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"],
    weekdaysMin: ["日", "一", "二", "三", "四", "五", "六"]
    // weekdaysMin: ["7", "1", "2", "3", "4", "5", "6"]
});

function App() {
    const token = localStorage.getItem('token')
    if (token) {
        return (
            <ConfigProvider locale={zhCN}>
                <Layout className="layout_base">
                    <HeadBar />
                    <Layout>
                        <SiderMenu />
                        <Container />
                    </Layout>
                </Layout>
                <FileUploadPop />
            </ConfigProvider>
        );
    }
    return (
        <Layout style={{ height: '100%' }}>
            <Routes>
                <Route key="Login" path="*" element={<Login />} />
            </Routes>
        </Layout>
    )
}

export default App;
