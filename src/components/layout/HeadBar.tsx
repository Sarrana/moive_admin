import { Avatar, Breadcrumb, Button, Image, message, Upload } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import logo from '../../assets/favicon.svg';
import { LoadingOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RouteConfig, RouteType } from '../../router';
import { event, uploadUrlFormatter } from '@/utils';
import { useEffect, useState } from 'react';
import { logoutApi } from '@/request';

let breadcrumbNameMap = null;

const getBreadcrumbNameMap = (base, config: RouteType[]) => {
    config.forEach((v) => {
        let newBase = `${base}/${v.path}`;
        if (v.path && v.label && v.path != "/") {
            let obj = { label: v.label, to: '', enable: !!v.element }
            if (v.redirect) {
                obj.to = v.redirect;
            } else {
                obj.to = newBase;
            }
            breadcrumbNameMap[newBase] = obj;
            if (v.children) {
                getBreadcrumbNameMap(newBase, v.children);
            }
        }
    });
}

export const HeadBar = () => {
    if (!breadcrumbNameMap) {
        breadcrumbNameMap = {};
        getBreadcrumbNameMap('', RouteConfig);
        // console.log("HeadBar 000", breadcrumbNameMap);
    }

    const getStyle = (p) => ({ position: "absolute", display: "inline-block", verticalAlign: "middle", lineHeight: "unset", ...p })

    const location = useLocation();
    const navigate = useNavigate();
    const pathSnippets = location.pathname.split('/').filter((v) => v);
    const extraBreadcrumbItems = pathSnippets.map((v, i) => {
        const url = `/${pathSnippets.slice(0, i + 1).join('/')}`;
        const el = breadcrumbNameMap[url];
        const renderItem = () => {
            if (el.to) {
                if (el.enable && el.to != location.pathname) {
                    return <Link to={el.to}>{el.label}</Link>
                }
                return el.label
            }
            return null
        }
        return (
            <Breadcrumb.Item key={url}>{renderItem()}</Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [
        <Breadcrumb.Item key="home"><Link to="/">首页</Link></Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);
    const [uploading, setUploading] = useState(false);

    const onPop = () => {
        event.emit("showUploadPop", { show: true });
    }

    const refreshUpIcon = (e) => {
        console.log('refreshUpIcon', e);
        setUploading(e);
    }

    const onLogout = () => {
        logoutApi().then((r) => {
            console.log('logout', r)
            if (r && r.code == 200) {
                message.success('退出登录成功');
                localStorage.removeItem('token');
                // navigate('/Login', { replace: false });
                navigate('/', { replace: false });
                window.location.reload()
            } else {
                // message.error('登录失败，请重试');
            }
        }).catch((e) => {
            // message.error('登录失败，请重试');
        });
    }

    useEffect(() => {
        event.addListener("refreshUpIcon", refreshUpIcon);
        return () => {
            event.removeListener("refreshUpIcon", refreshUpIcon);
        }
    }, [])

    return (
        <Header style={{ backgroundColor: "#fff", padding: 0, position: "relative" }}>
            <Image src={logo} style={{ height: 64 }} preview={false} />
            <div style={{ position: "absolute", left: 100, display: "inline-block", verticalAlign: "middle" }}>站群管理系统</div>
            <Breadcrumb style={{ position: "absolute", left: 200, display: "inline-block", verticalAlign: "middle", lineHeight: "unset" }}>
                {breadcrumbItems}
            </Breadcrumb>
            {uploading
                ? <LoadingOutlined style={getStyle({ right: 170, fontSize: 20, cursor: "pointer" })} onClick={onPop} />
                : <UploadOutlined style={getStyle({ right: 170, fontSize: 20, cursor: "pointer" })} onClick={onPop} />}
            <div style={getStyle({ right: 100 })}>
                <Avatar size={50} icon={<UserOutlined />} />
            </div>
            <div style={getStyle({ right: 20, cursor: "pointer" })} onClick={onLogout} onKeyDown={onLogout}>退出登录</div>
        </Header>
    )
}
