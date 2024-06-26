import axios from "axios";
import api from '@/config/api/apiConfig.js';
import { verifyJWT } from '@/config/tool/jwtTool';
import router from '@/config/router/routerConfig';
import i18n from '@/config/i18nConfig.js'

let axiosInstance = null;

export default function instance(){
    if (!axiosInstance) {
        axiosInstance = axios.create({
            baseURL: '',
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
            router: router,
        });
    }
    return axiosInstance;
}

function findRoute(path) {
    for (const router in api.api) {
        const apiRouter = api.api[router];
        for (const r in apiRouter) {
            if (apiRouter[r].path === path) {
                return apiRouter[r];
            }
        }
    }
}

function setUserLang(config){
    const locale = localStorage.getItem("lang") ?? "zh_TW";
    config.headers['User-Lang'] = locale;
}

instance().interceptors.request.use(
    (config) => {
        //標頭帶上語系
        setUserLang(config);

        const matchedRoute = findRoute(config.url);
        //如果是要驗證的api再放token
        if (matchedRoute.requiresAuth) {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            //accessToken和refreshToken都未通過token驗證，才會轉跳登入頁
            if (!verifyJWT(token) && (!refreshToken || !verifyJWT(refreshToken))) {
                instance.defaults.router.push({ name: 'login' });
                return Promise.reject({type: 'RequestRejectedError', message: i18n.global.t('axios.reLogin')});
            }
            config.headers['Authorization'] = `Bearer ${token}`;
            if (refreshToken) {
                config.headers['X-Refresh-Token'] = refreshToken;
            }
        }
        return config;
    }
)

instance().interceptors.response.use(
    (response) => {
        const token = response.headers['authorization'];
        if (token) {
            localStorage.setItem('token', token.replace('Bearer ', ''))
        }
        const refreshToken = response.headers['x-refresh-token'];
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }
        return response;
    }
);