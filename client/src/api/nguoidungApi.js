import axios from "axios"
import axiosClient from "./axiosClient"

export const nguoidungApi = {
    getAll: (params) => {
        return new Promise((resolve, reject) => {
            const url = `/nguoidungs`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url, { params });
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 200)
        })

    },
    saveUserSocialMedia: (data) => {
        const url = `/nguoidungs/save_user_social_media`
        return axiosClient.post(url, data);
    },
    update: (params, data) => {
        const url = `/nguoidungs/${params}`
        return axiosClient.patch(url, data);
    },
    delete: (params, data) => {
        const url = `/nguoidungs/${params}`
        return axiosClient.delete(url, data);
    },
    login: (data) => {
        const url = `/nguoidungs/login`
        return axiosClient.post(url, data);
    },
    register: (data) => {
        return new Promise((resolve, reject) => {
            const url = '/nguoidungs'
            setTimeout(async () => {
                try {
                    const response = await axiosClient.post(url, data);
                    resolve(response);

                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })
    },
    getMe: () => {
        return new Promise((resolve, reject) => {
            const url = `/nguoidungs/getme`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url);
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })
    },
    getNewToken: (refreshToken) => {
        const url = `/nguoidungs/get_new_token`
        return axios.get(url, {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                "content-type": 'application/json',
                authorization: `Bearer ${refreshToken}`
            }
        });
    },
    forgetPassword: (data) => {
        const url = `/nguoidungs/forget_password`;
        return axiosClient.post(url, data);
    }
}