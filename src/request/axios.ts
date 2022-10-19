import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd'
import { useNavigate } from 'react-router-dom';

const processEnv = import.meta.env
// console.log("processEnv >>> ", processEnv);
let relogin = false

axios.defaults.baseURL = String(processEnv.VITE_APP_PROXY_URL)
// axios.defaults.timeout = 3000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 8000;

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
            // config.headers.token = 'Bearer ' + token;
            // @ts-ignore
            config.headers.common.Authorization = `Bearer ${token}`;
        }
        // console.log("request >>> ", config);
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
)

axios.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log("response >>> ", response?.config?.url, response);
        if (!response || response.status != 200 || !response.data) {
            return Promise.reject(response);
        }
        switch (Number(response.data.code)) {
            case 401:
                // const navigate = useNavigate();
                message.error('请重新登录').then(() => {
                    localStorage.removeItem('token')
                    // navigate('/', { replace: false });
                    window.location.reload()
                    // navigate('/Login', { replace: false });
                })
                break
            case 400:
            case 422:
                console.warn(response.data.message)
                response.data.message && message.error(response.data.message);
                return Promise.reject(response.data);
            default:
            /**
             * TODO
             */
        }
        return Promise.resolve(response.data);
    },
    (error) => {
        const _error = { ...error }
        console.warn('_error', relogin, _error);
        if (relogin) return Promise.reject(error)
        if (_error.response && _error.response.status && _error.response.status == 401) {
            relogin = true
            message.error('请重新登录').then(() => {
                // const navigate = useNavigate();
                localStorage.removeItem('token')
                // navigate('/', { replace: false });
                relogin = false
                window.location.reload()
                // navigate('/Login', { replace: false });
            })
            return Promise.reject(error);
        }
        if (_error.response && _error.response.requestType && _error.response.requestType == "uploadVideo") {
            return Promise.reject(error);
        }
        if (_error.code == 'ECONNABORTED') {
            message.error('请求超时')
            return Promise.reject(error)
        }
        // 用于解决弹出多个取消上传提示
        if (_error.message != 'cancelUpload') message.error('网络错误')
        // message.error(_error.message ? _error.message : '网络错误')
        return Promise.reject(error)
    }
)

export default axios
