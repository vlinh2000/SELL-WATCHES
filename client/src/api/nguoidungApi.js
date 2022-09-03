import axios from "axios"
import axiosClient from "./axiosClient"

export const nguoidungApi = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const url = `/nguoidungs`
            setTimeout(async () => {
                try {
                    const response = await axiosClient.get(url);;
                    resolve(response);
                } catch (error) {
                    reject(error)
                }
            }, 2000)
        })

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
}