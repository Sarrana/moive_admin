import { loginApi } from '@/request';
import { Button, Card, Form, Input, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const login = () => {
        const formData = new FormData()
        formData.append('email', username)
        formData.append('password', password)
        loginApi(formData).then((r) => {
            console.log(1111111, r)
            if (r && r.code == 200 && r.data) {
                message.success('登录成功');
                localStorage.setItem('token', `${r.data.access_token}`);
                navigate('/', { replace: false });
                window.location.reload();
            } else {
                // message.error('登录失败，请重试');
            }
        }).catch((e) => {
            // message.error('登录失败，请重试');
        });
    }

    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ width: 360, height: 200, textAlign: 'center', margin: '0px 10px' }}>
                <Form>
                    <Form.Item label="账号">
                        <Input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            allowClear />
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            allowClear />
                    </Form.Item>
                    <Button type="primary" onClick={login}>登录</Button>
                </Form>
            </Card>
        </div>
    )
}
