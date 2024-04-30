import { defineStore } from 'pinia';
import request from '@/api/request.js';

const userStore = defineStore(
    'user',
    {
        state: () => ({
            id: '',
            username: '',
            roleId: '',
            email: '',
            lastLoginTime: '',
            createTime: '',
            createBy: '',
            mustUpdatePassword: '',
            attendStatus: '',
            departmentId: '',
            departmentName: '',
            active: '',
            lock: '',
        }),
        actions: {
            async login(data){
                const response = await request.login(data);
                if (response && response.data.code == 200) {
                    let user = response.data.data;
                    this.id = user.id;
                    this.username = user.username;
                    this.roleId = user.roleId;
                    this.email = user.email;
                    this.lastLoginTime = user.lastLoginTime;
                    this.createTime = user.createTime;
                    this.createBy = user.createBy;
                    this.mustUpdatePassword = user.mustUpdatePassword;
                    this.attendStatus = user.attendStatus;
                    this.departmentId = user.departmentId;
                    this.departmentName = user.departmentName;
                    this.active = user.active;
                    this.lock = user.lock;
                } 
                return response;
            }
        }
    }
)

export default userStore;