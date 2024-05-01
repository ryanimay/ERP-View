import msg from '@/config/alterConfig.js'
import instance from '@/config/axios.js';
import path from '@/config/api/apiConfig.js';

//封裝所有網絡請求
export default {
    opValid: request(path.api.client.opValid),
    register: request(path.api.client.register),
    login: request(path.api.client.login),
    resetPassword: request(path.api.client.resetPassword),
    update: request(path.api.client.update),
    updatePassword: request(path.api.client.updatePassword),
    allMenu: request(path.api.menu.all),
    pMenu: request(path.api.menu.pMenu),
}

const axios = instance();

function request(api){
    return function passData(data){
        return call(api, data);
    }
}

async function call(api, data){
    let response;
    try{
        if (api.method === 'get' || api.method === 'delete') {
            response = await axios({
                url: api.path,
                method: api.method,
                params: data
            });
        } else {
            response = await axios({
                url: api.path,
                method: api.method,
                data: data
            });
        }
    }catch(error){
        handleError(error);
    }
    return response;
}

function handleError(error){
    if(error.type === 'RequestRejectedError'){
        msg.error(error.message);
    }else{
        throw error;
    }
}