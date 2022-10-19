import axios from '../axios'

// export let loginInfo;

export const loginApi = (params) => new Promise<any>((resolve, reject) => {
    axios.post('/api/admin_login', params)
        .then((r) => {
            // loginInfo = r.data;
            // console.log('loginInfo ', loginInfo);
            resolve(r);
        })
        .catch((e) => { reject(e) })
})

export const logoutApi = () => new Promise<any>((resolve, reject) => {
    axios.post('/api/admin_logout')
        .then((r) => {
            // loginInfo = r.data;
            // console.log('loginInfo ', loginInfo);
            resolve(r);
        })
        .catch((e) => { reject(e) })
})
